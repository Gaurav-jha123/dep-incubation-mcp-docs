import { Project } from 'ts-morph';
import type { ClassDeclaration, Decorator, MethodDeclaration, SourceFile } from 'ts-morph';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { computeFingerprint } from './utils/fingerprint.js';

// ---------------------------------------------------------------------------
// Shared types (re-exported for indexer / updater)
// ---------------------------------------------------------------------------

export type ServiceMethodMeta = {
  methodName: string;
  prismaCalls: string[]; // e.g. ["project.findMany", "topic.findMany"]
  throws: string[];     // e.g. ["NotFoundException", "ConflictException"]
  hasTransaction: boolean; // true if service method body calls this.prisma.$transaction
};

export type ApiResponseMeta = {
  status: number;
  description: string;
};

export type DtoFieldMeta = {
  name: string;
  type: string;
  optional: boolean;
  validators: string[];  // e.g. ["IsString", "MinLength(1)"]
  example: string | null;
};

export type EndpointMeta = {
  chunkId: string;
  module: string;
  method: string;
  path: string;
  handlerName: string;
  jsdoc: string | null;
  params: { name: string; type: string; source: 'body' | 'param' | 'query' }[];
  returnType: string;
  sourceFiles: string[];
  fingerprint: string;
  serviceMethods: ServiceMethodMeta[];
  guards: string[];  // e.g. ["JwtAuthGuard", "RolesGuard"]
  roles: string[];   // e.g. ["ADMIN", "MANAGER"]
  apiSummary: string | null;    // from @ApiOperation({ summary })
  apiResponses: ApiResponseMeta[];  // from @ApiResponse decorators
  handlerLine: number;             // line number of the handler in the controller file
  dtoFields: Record<string, DtoFieldMeta[]>; // keyed by DTO class name
  operationType: 'read' | 'write' | 'mixed' | 'unknown';
  confidenceScore: number;         // 0–100, deterministic (not LLM-judged)
  executionFlow: string;           // pre-rendered call chain: handler → service → prisma
  consistencyRisk: 'none' | 'low' | 'high'; // non-atomic write detection
};

export type ChunkEntry = {
  chunkId: string;
  module: string;
  method: string;
  path: string;
  fingerprint: string;
  sourceFiles: string[];
  docFile: string;
  lastUpdated: string;
  guards: string[];
  roles: string[];
  relatedChunks: string[];
  handlerLine: number;
  commitSha: string;
};

export type IndexData = {
  lastIndexed: string;
  chunks: Record<string, ChunkEntry>;
  fileMap: Record<string, string[]>;
  modelMap: Record<string, string[]>; // Prisma model name → chunkIds that access it
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const HTTP_DECORATORS = ['Get', 'Post', 'Put', 'Delete', 'Patch'] as const;

function stripQuotes(s: string): string {
  return s.replace(/^['"`]|['"`]$/g, '');
}

function getDecoratorStringArg(decorator: Decorator, index = 0): string | null {
  const args = decorator.getArguments();
  if (!args[index]) return null;
  return stripQuotes(args[index].getText());
}

function buildFullPath(basePath: string, methodPath: string | null): string {
  const base = basePath ? `/${basePath}` : '';
  const sub = methodPath ? `/${methodPath}` : '';
  return (base + sub).replace(/\/+/g, '/') || '/';
}

function buildChunkId(moduleName: string, fullPath: string, httpMethod: string): string {
  // Strip the module-base prefix, then normalise remaining segments.
  // /projects/:id/assignments → id_assignments
  const afterBase = fullPath
    .replace(new RegExp(`^/${moduleName}`), '')
    .replace(/^\//, '');

  const parts = afterBase
    .split('/')
    .filter(Boolean)
    .map((s) => s.replace(/^:/, '')); // :id → id

  const middle = parts.join('_') || 'root';
  return `${moduleName}__${middle}__${httpMethod.toUpperCase()}`;
}

function extractParams(
  method: MethodDeclaration,
): EndpointMeta['params'] {
  const params: EndpointMeta['params'] = [];

  for (const param of method.getParameters()) {
    const bodyDec = param.getDecorator('Body');
    const paramDec = param.getDecorator('Param');
    const queryDec = param.getDecorator('Query');

    if (bodyDec) {
      params.push({
        name: param.getName(),
        type: param.getTypeNode()?.getText() ?? 'unknown',
        source: 'body',
      });
    } else if (paramDec) {
      params.push({
        name: getDecoratorStringArg(paramDec) ?? param.getName(),
        type: param.getTypeNode()?.getText() ?? 'string',
        source: 'param',
      });
    } else if (queryDec) {
      params.push({
        name: param.getName(),
        type: param.getTypeNode()?.getText() ?? 'unknown',
        source: 'query',
      });
    }
  }

  return params;
}

function resolveDtoImports(sourceFile: SourceFile, paramTypes: string[]): string[] {
  if (paramTypes.length === 0) return [];

  const resolved: string[] = [];

  for (const importDecl of sourceFile.getImportDeclarations()) {
    const namedImports = importDecl.getNamedImports().map((n) => n.getName());
    const hasMatch = paramTypes.some((t) => namedImports.includes(t));

    if (hasMatch) {
      const resolvedSF = importDecl.getModuleSpecifierSourceFile();
      if (resolvedSF && !resolvedSF.getFilePath().includes('node_modules')) {
        resolved.push(resolvedSF.getFilePath());
      }
    }
  }

  return [...new Set(resolved)];
}

/**
 * Extract guard class names from @UseGuards(...) decorators.
 * Merges class-level and method-level decorators (method overrides nothing, just adds).
 */
function extractGuards(
  classDecl: ClassDeclaration,
  methodDecl: MethodDeclaration,
): string[] {
  const guards: string[] = [];

  const collectFromDecorator = (dec: Decorator) => {
    for (const arg of dec.getArguments()) {
      // Each arg is e.g. JwtAuthGuard or RolesGuard
      const name = arg.getText().trim();
      if (name && !guards.includes(name)) guards.push(name);
    }
  };

  // Class-level @UseGuards
  const classGuardDec = classDecl.getDecorator('UseGuards');
  if (classGuardDec) collectFromDecorator(classGuardDec);

  // Method-level @UseGuards
  const methodGuardDec = methodDecl.getDecorator('UseGuards');
  if (methodGuardDec) collectFromDecorator(methodGuardDec);

  return guards;
}

/**
 * Extract role strings from @Roles(...) method decorator.
 * Strips the `Role.` prefix: Role.ADMIN → "ADMIN"
 */
function extractRoles(methodDecl: MethodDeclaration): string[] {
  const rolesDec = methodDecl.getDecorator('Roles');
  if (!rolesDec) return [];

  return rolesDec
    .getArguments()
    .map((a) => a.getText().replace(/^Role\./, '').trim())
    .filter(Boolean);
}

/**
 * Resolve non-Prisma service file paths imported by a controller source file.
 * These are included in the fingerprint so service changes trigger re-indexing.
 */
function resolveServiceImports(sourceFile: SourceFile): string[] {
  const resolved: string[] = [];

  for (const importDecl of sourceFile.getImportDeclarations()) {
    const namedImports = importDecl.getNamedImports().map((n) => n.getName());
    const hasService = namedImports.some(
      (n) => n.endsWith('Service') && n !== 'PrismaService',
    );

    if (hasService) {
      const resolvedSF = importDecl.getModuleSpecifierSourceFile();
      if (resolvedSF && !resolvedSF.getFilePath().includes('node_modules')) {
        resolved.push(resolvedSF.getFilePath());
      }
    }
  }

  return [...new Set(resolved)];
}

/**
 * Extract @ApiOperation summary and @ApiResponse entries from a method.
 */
function extractSwaggerMeta(
  methodDecl: MethodDeclaration,
): { apiSummary: string | null; apiResponses: ApiResponseMeta[] } {
  // @ApiOperation({ summary: '...' })
  let apiSummary: string | null = null;
  const opDec = methodDecl.getDecorator('ApiOperation');
  if (opDec) {
    const args = opDec.getArguments();
    if (args[0]) {
      const text = args[0].getText();
      const m = text.match(/summary\s*:\s*['"](.*?)['"]/s);
      if (m) apiSummary = m[1].trim();
    }
  }

  // @ApiResponse({ status: NNN, description: '...' })
  const apiResponses: ApiResponseMeta[] = [];
  for (const dec of methodDecl.getDecorators()) {
    if (dec.getName() !== 'ApiResponse') continue;
    const args = dec.getArguments();
    if (!args[0]) continue;
    const text = args[0].getText();
    const statusM = text.match(/status\s*:\s*(\d+)/);
    const descM = text.match(/description\s*:\s*['"](.*?)['"]/s);
    if (statusM) {
      apiResponses.push({
        status: parseInt(statusM[1], 10),
        description: descM ? descM[1].trim() : '',
      });
    }
  }

  return { apiSummary, apiResponses };
}

/**
 * Collect Prisma calls from a body text, then follow this.privateMethod() calls
 * one level deep into the same class to pick up indirect DB access.
 */
function collectPrismaCalls(
  bodyText: string,
  allMethodsInClass: Map<string, string>,
  visited = new Set<string>(),
): string[] {
  const prismaCalls: string[] = [];
  const prismaRegex = /this\.prisma\.(\w+)\.(\w+)\(/g;
  let match: RegExpExecArray | null;

  while ((match = prismaRegex.exec(bodyText)) !== null) {
    const call = `${match[1]}.${match[2]}`;
    if (!prismaCalls.includes(call)) prismaCalls.push(call);
  }

  // Follow this.privateMethod() one level deep
  const privateCallRegex = /this\.(\w+)\(/g;
  while ((match = privateCallRegex.exec(bodyText)) !== null) {
    const calledName = match[1];
    if (visited.has(calledName)) continue;
    const calledBody = allMethodsInClass.get(calledName);
    if (!calledBody) continue;
    visited.add(calledName);
    const nested = collectPrismaCalls(calledBody, allMethodsInClass, visited);
    for (const c of nested) {
      if (!prismaCalls.includes(c)) prismaCalls.push(c);
    }
  }

  return prismaCalls;
}

/**
 * Parse all *.service.ts files in the project and build a map:
 *   serviceClassName → Map<methodName, ServiceMethodMeta>
 */
function buildServiceMethodMap(
  project: Project,
): Map<string, Map<string, ServiceMethodMeta>> {
  const result = new Map<string, Map<string, ServiceMethodMeta>>();

  for (const sourceFile of project.getSourceFiles()) {
    if (!sourceFile.getFilePath().endsWith('.service.ts')) continue;

    for (const classDecl of sourceFile.getClasses()) {
      if (!classDecl.getDecorator('Injectable')) continue;

      const className = classDecl.getName();
      if (!className) continue;

      // Build a name→bodyText map for all methods (public + private)
      // so collectPrismaCalls can follow private method calls.
      const allMethodBodies = new Map<string, string>();
      for (const m of classDecl.getMethods()) {
        allMethodBodies.set(m.getName(), m.getBody()?.getText() ?? '');
      }

      const methodMap = new Map<string, ServiceMethodMeta>();

      for (const methodDecl of classDecl.getMethods()) {
        const isPrivate = methodDecl
          .getModifiers()
          .some((m) => m.getText() === 'private');
        if (isPrivate) continue; // don't expose private as top-level, but still trace into them

        const methodName = methodDecl.getName();
        const bodyText = methodDecl.getBody()?.getText() ?? '';

        // Fix 3: deep Prisma tracing through private methods
        const prismaCalls = collectPrismaCalls(bodyText, allMethodBodies, new Set([methodName]));

        // Extract thrown exceptions from this method only
        const throws: string[] = [];
        const throwRegex = /throw new (\w+(?:Exception|Error))\(/g;
        let match: RegExpExecArray | null;
        while ((match = throwRegex.exec(bodyText)) !== null) {
          if (!throws.includes(match[1])) throws.push(match[1]);
        }

        const hasTransaction = bodyText.includes('this.prisma.$transaction');
        methodMap.set(methodName, { methodName, prismaCalls, throws, hasTransaction });
      }

      result.set(className, methodMap);
    }
  }

  return result;
}

/**
 * Given a controller class declaration, return the ServiceMethodMeta entries
 * called by the specified handler method.
 */
function traceHandlerServiceCalls(
  controllerClass: ClassDeclaration,
  handlerName: string,
  serviceMap: Map<string, Map<string, ServiceMethodMeta>>,
): ServiceMethodMeta[] {
  // Map property name → service class name from constructor params
  const serviceProps = new Map<string, string>(); // propName → ClassName
  const ctors = controllerClass.getConstructors();
  if (ctors.length > 0) {
    for (const param of ctors[0].getParameters()) {
      const typeName = param.getTypeNode()?.getText() ?? '';
      if (serviceMap.has(typeName)) {
        serviceProps.set(param.getName(), typeName);
      }
    }
  }

  if (serviceProps.size === 0) return [];

  const methodDecl = controllerClass.getMethod(handlerName);
  if (!methodDecl) return [];

  const bodyText = methodDecl.getBody()?.getText() ?? '';
  const called: ServiceMethodMeta[] = [];

  for (const [propName, className] of serviceProps) {
    const methodMap = serviceMap.get(className);
    if (!methodMap) continue;

    const callRegex = new RegExp(`this\\.${propName}\\.(\\w+)\\(`, 'g');
    let match: RegExpExecArray | null;
    while ((match = callRegex.exec(bodyText)) !== null) {
      const calledMethod = match[1];
      const meta = methodMap.get(calledMethod);
      if (meta && !called.find((m) => m.methodName === calledMethod)) {
        called.push(meta);
      }
    }
  }

  return called;
}

/**
 * Classify whether the endpoint performs read, write, or mixed DB operations
 * based on Prisma call names across all traced service methods.
 *
 * Read operations:  findMany, findFirst, findUnique, findUniqueOrThrow, count, aggregate, groupBy
 * Write operations: create, createMany, update, updateMany, upsert, delete, deleteMany
 */
export function classifyOperationType(
  serviceMethods: ServiceMethodMeta[],
): EndpointMeta['operationType'] {
  const READ_OPS = new Set([
    'findMany', 'findFirst', 'findUnique', 'findUniqueOrThrow',
    'findFirstOrThrow', 'count', 'aggregate', 'groupBy',
  ]);
  const WRITE_OPS = new Set([
    'create', 'createMany', 'update', 'updateMany', 'upsert',
    'delete', 'deleteMany',
  ]);

  let hasRead = false;
  let hasWrite = false;

  for (const sm of serviceMethods) {
    for (const call of sm.prismaCalls) {
      const op = call.split('.')[1]; // e.g. "project.findMany" → "findMany"
      if (op && READ_OPS.has(op)) hasRead = true;
      if (op && WRITE_OPS.has(op)) hasWrite = true;
    }
  }

  if (hasRead && hasWrite) return 'mixed';
  if (hasRead) return 'read';
  if (hasWrite) return 'write';
  return 'unknown';
}

/**
 * Compute a deterministic confidence score 0–100 based on metadata completeness.
 * Higher score = more metadata available = more trustworthy doc.
 *
 * Scoring rubric:
 *  +20  has apiSummary (from @ApiOperation)
 *  +20  has ≥1 apiResponse
 *  +20  has ≥1 serviceMethod with Prisma calls
 *  +20  has params (body/param/query declared)
 *  +10  guards are declared (auth is explicit)
 *  +10  dtoFields has ≥1 entry (body shape is known)
 */
export type ConfidenceInput = Pick<
  EndpointMeta,
  'apiSummary' | 'apiResponses' | 'serviceMethods' | 'params' | 'guards' | 'dtoFields'
>;

export function computeConfidenceScore(meta: ConfidenceInput): number {
  let score = 0;
  if (meta.apiSummary) score += 20;
  if (meta.apiResponses.length > 0) score += 20;
  if (meta.serviceMethods.some((sm) => sm.prismaCalls.length > 0)) score += 20;
  if (meta.params.length > 0) score += 20;
  if (meta.guards.length > 0) score += 10;
  if (Object.keys(meta.dtoFields).length > 0) score += 10;
  return score;
}

/**
 * Detect non-atomic write risk across service methods.
 *
 * 'none'  — 0 or 1 write op total, or all multi-write methods use $transaction
 * 'low'   — multiple writes in a single service method without $transaction
 * 'high'  — writes spread across multiple service method calls without $transaction
 */
const WRITE_OPS_SET = new Set([
  'create', 'createMany', 'update', 'updateMany', 'upsert', 'delete', 'deleteMany',
]);

export function computeConsistencyRisk(
  serviceMethods: ServiceMethodMeta[],
): 'none' | 'low' | 'high' {
  const writingMethods = serviceMethods.filter((sm) =>
    sm.prismaCalls.some((c) => WRITE_OPS_SET.has(c.split('.')[1] ?? '')),
  );

  const totalWrites = writingMethods.reduce(
    (sum, sm) => sum + sm.prismaCalls.filter((c) => WRITE_OPS_SET.has(c.split('.')[1] ?? '')).length,
    0,
  );

  if (totalWrites <= 1) return 'none';

  // All writing methods are wrapped in $transaction → safe
  if (writingMethods.every((sm) => sm.hasTransaction)) return 'none';

  // Writes spread across multiple controller-level service method calls → high risk
  if (writingMethods.length > 1) return 'high';

  // Multiple writes in a single service method without $transaction → low risk
  return 'low';
}

/**
 * Build a text execution-flow string from handler → service method(s) → Prisma calls.
 * Used to render `### Execution Flow` in doc chunks.
 */
export function buildExecutionFlow(
  handlerName: string,
  serviceMethods: ServiceMethodMeta[],
): string {
  if (serviceMethods.length === 0) return `\`${handlerName}()\` → (no service calls traced)`;

  return serviceMethods
    .map((sm) => {
      const dbPart =
        sm.prismaCalls.length > 0
          ? ` → ${sm.prismaCalls.map((c) => `\`${c}\``).join(', ')}`
          : '';
      const txBadge = sm.hasTransaction ? ' 🔒' : '';
      return `\`${handlerName}()\` → \`${sm.methodName}()\`${txBadge}${dbPart}`;
    })
    .join('\n');
}

/**
 * Render a `### Execution Flow` markdown section from EndpointMeta.
 * Exported for use in all doc templates.
 */
export function renderExecutionFlow(meta: EndpointMeta): string {
  if (!meta.executionFlow || meta.executionFlow.includes('no service calls traced')) return '';
  return `\n### Execution Flow\n${meta.executionFlow}\n`;
}

/**
 * Render a `### Error Conditions` markdown section from EndpointMeta.
 * Collects all unique thrown exceptions across all service methods.
 */
export function renderErrorConditions(meta: EndpointMeta): string {
  const allThrows = meta.serviceMethods.flatMap((sm) => sm.throws);
  const unique = [...new Set(allThrows)];
  if (unique.length === 0) return '';
  const rows = unique.map((e) => `| \`${e}\` |`).join('\n');
  return `\n### Error Conditions\n| Exception |\n|-----------|\n${rows}\n`;
}

/**
 * Extract all public properties from DTO classes in the given source files.
 * Returns a map of DTO class name → field metadata.
 */
function extractDtoFields(
  project: Project,
  dtoFiles: string[],
): Record<string, DtoFieldMeta[]> {
  const result: Record<string, DtoFieldMeta[]> = {};

  for (const filePath of dtoFiles) {
    const sourceFile = project.getSourceFile(filePath);
    if (!sourceFile) continue;

    for (const classDecl of sourceFile.getClasses()) {
      const className = classDecl.getName();
      if (!className) continue;

      const fields: DtoFieldMeta[] = [];

      for (const prop of classDecl.getProperties()) {
        const mods = prop.getModifiers().map((m) => m.getText());
        if (mods.includes('private') || mods.includes('protected')) continue;

        const name = prop.getName();
        const type = prop.getTypeNode()?.getText() ?? 'unknown';
        let optional = prop.hasQuestionToken();
        const validators: string[] = [];
        let example: string | null = null;

        for (const dec of prop.getDecorators()) {
          const decName = dec.getName();
          if (decName === 'ApiProperty' || decName === 'ApiPropertyOptional') {
            const args = dec.getArguments();
            if (args[0]) {
              const text = args[0].getText();
              const m = text.match(/example\s*:\s*(?:'([^']*)'|"([^"]*)"|`([^`]*)`|([\w.]+))/);
              if (m) example = m[1] ?? m[2] ?? m[3] ?? m[4] ?? null;
            }
          } else if (decName === 'IsOptional') {
            optional = true;
          } else {
            const args = dec.getArguments();
            const argsStr = args.length > 0 ? `(${args.map((a) => a.getText()).join(', ')})` : '';
            validators.push(`${decName}${argsStr}`);
          }
        }

        fields.push({ name, type, optional, validators, example });
      }

      if (fields.length > 0) result[className] = fields;
    }
  }

  return result;
}

/**
 * Render a `### Request Body Fields` markdown section from EndpointMeta.
 * Exported so indexer, updater, and template functions can use it uniformly.
 */
export function renderDtoFieldsSection(meta: EndpointMeta): string {
  const bodyParams = meta.params.filter((p) => p.source === 'body');
  const sections: string[] = [];

  for (const bp of bodyParams) {
    const fields = meta.dtoFields[bp.type];
    if (!fields || fields.length === 0) continue;

    const rows = fields
      .map(
        (f) =>
          `| \`${f.name}\` | \`${f.type}\` | ${f.optional ? 'No' : 'Yes'} | ${f.example ?? '—'} |`,
      )
      .join('\n');

    sections.push(
      `**${bp.type}**\n| Field | Type | Required | Example |\n|-------|------|----------|---------|\n${rows}`,
    );
  }

  return sections.length > 0 ? `\n### Request Body Fields\n${sections.join('\n\n')}\n` : '';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Parse all *.controller.ts files under `apiSrcDir` and return one
 * EndpointMeta entry per HTTP handler method found.
 */
export function parseControllers(apiSrcDir: string): EndpointMeta[] {
  const tsConfigPath = resolve(apiSrcDir, '../tsconfig.json');

  const project = new Project({
    tsConfigFilePath: tsConfigPath,
    skipFileDependencyResolution: false,
  });

  // Load controllers, DTOs, and services
  project.addSourceFilesAtPaths(`${apiSrcDir}/**/*.controller.ts`);
  project.addSourceFilesAtPaths(`${apiSrcDir}/**/*.dto.ts`);
  project.addSourceFilesAtPaths(`${apiSrcDir}/**/*.service.ts`);

  const serviceMap = buildServiceMethodMap(project);

  const results: EndpointMeta[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    if (!sourceFile.getFilePath().endsWith('.controller.ts')) continue;

    for (const classDecl of sourceFile.getClasses()) {
      const controllerDec = classDecl.getDecorator('Controller');
      if (!controllerDec) continue;

      const basePath = getDecoratorStringArg(controllerDec) ?? '';
      const moduleName =
        basePath ||
        sourceFile
          .getBaseNameWithoutExtension()
          .replace('.controller', '');

      for (const methodDecl of classDecl.getMethods()) {
        for (const httpDec of HTTP_DECORATORS) {
          const httpDecorator = methodDecl.getDecorator(httpDec);
          if (!httpDecorator) continue;

          const methodPath = getDecoratorStringArg(httpDecorator);
          const fullPath = buildFullPath(basePath, methodPath);
          const httpMethod = httpDec.toUpperCase();
          const chunkId = buildChunkId(moduleName, fullPath, httpMethod);

          const jsdoc =
            methodDecl.getJsDocs()[0]?.getDescription().trim() ?? null;

          const params = extractParams(methodDecl);
          const paramTypes = params
            .filter((p) => p.source === 'body' || p.source === 'query')
            .map((p) => p.type);

          const returnType =
            methodDecl.getReturnTypeNode()?.getText() ?? 'unknown';

          const dtoFiles = resolveDtoImports(sourceFile, paramTypes);
          const dtoFields = extractDtoFields(project, dtoFiles);
          const serviceFiles = resolveServiceImports(sourceFile);
          const controllerPath = sourceFile.getFilePath();
          const sourceFiles = [controllerPath, ...dtoFiles, ...serviceFiles];

          const serviceMethods = traceHandlerServiceCalls(
            classDecl,
            methodDecl.getName(),
            serviceMap,
          );

          // Fix 5: fingerprint based on controller+DTOs+the specific service
          // method bodies rather than entire service files. This prevents
          // unrelated service method changes from invalidating sibling chunks.
          const serviceMethodTexts = serviceMethods
            .map((sm) => sm.methodName + sm.prismaCalls.join('') + sm.throws.join(''))
            .join('');
          const methodFingerprint = createHash('sha256')
            .update(computeFingerprint(sourceFiles))
            .update(serviceMethodTexts)
            .digest('hex');

          const guards = extractGuards(classDecl, methodDecl);
          const roles = extractRoles(methodDecl);
          const { apiSummary, apiResponses } = extractSwaggerMeta(methodDecl);

          const partialMeta = {
            chunkId,
            module: moduleName,
            method: httpMethod,
            path: fullPath,
            handlerName: methodDecl.getName(),
            jsdoc,
            params,
            returnType,
            sourceFiles,
            fingerprint: methodFingerprint,
            serviceMethods,
            guards,
            roles,
            apiSummary,
            apiResponses,
            handlerLine: methodDecl.getStartLineNumber(),
            dtoFields,
          };

          const operationType = classifyOperationType(serviceMethods);
          const consistencyRisk = computeConsistencyRisk(serviceMethods);
          const executionFlow = buildExecutionFlow(partialMeta.handlerName, serviceMethods);

          results.push({
            ...partialMeta,
            operationType,
            confidenceScore: computeConfidenceScore(partialMeta),
            executionFlow,
            consistencyRisk,
          });

          break; // only one HTTP decorator per method
        }
      }
    }
  }

  return results;
}
