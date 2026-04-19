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
};

export type ApiResponseMeta = {
  status: number;
  description: string;
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
};

export type IndexData = {
  lastIndexed: string;
  chunks: Record<string, ChunkEntry>;
  fileMap: Record<string, string[]>;
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

        methodMap.set(methodName, { methodName, prismaCalls, throws });
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

          results.push({
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
          });

          break; // only one HTTP decorator per method
        }
      }
    }
  }

  return results;
}
