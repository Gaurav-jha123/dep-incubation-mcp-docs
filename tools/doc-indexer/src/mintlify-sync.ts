/**
 * mintlify-sync.ts
 * Converts .docs/chunks/*.json → apps/docs/api-reference/{module}/{chunkId}.mdx
 * Reads structured JSON (phase 2) with structural/semantic/derived fields.
 * Run with: pnpm --filter doc-indexer mintlify-sync
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REPO_ROOT = resolve(__dirname, '../../../');
const DOCS_DIR = resolve(REPO_ROOT, '.docs');
const MINTLIFY_DIR = resolve(REPO_ROOT, 'apps/docs');

interface ConfidenceField<T> {
  value: T;
  confidence: number;
  provenance: string;
}

interface DtoField {
  name: string;
  type: string;
  optional: boolean;
  validators?: string[];
  example?: string;
}

interface ServiceMethod {
  methodName: string;
  prismaCalls: string[];
  throws: string[];
  hasTransaction: boolean;
}

interface ChunkJson {
  chunkId: string;
  module: string;
  structural: {
    route: ConfidenceField<string>;
    method: ConfidenceField<string>;
    guards: ConfidenceField<string[]>;
    roles: ConfidenceField<string[]>;
    params: ConfidenceField<Array<{ name: string; type: string; source: string }>>;
    returnType: ConfidenceField<string>;
    dtoFields: ConfidenceField<Record<string, DtoField[]>>;
    apiResponses: ConfidenceField<Array<{ status: number; description: string }>>;
  };
  semantic: {
    summary: ConfidenceField<string | null>;
    businessLogic: ConfidenceField<string | null>;
  };
  derived: {
    executionFlow: ConfidenceField<string>;
    operationType: ConfidenceField<string>;
    serviceMethods: ConfidenceField<ServiceMethod[]>;
  };
}

interface IndexChunkMeta {
  chunkId: string;
  module: string;
  method: string;
  path: string;
}

interface DocsIndex {
  chunks: Record<string, IndexChunkMeta>;
}

function confidenceBadge(confidence: number): string {
  if (confidence >= 0.9) return '🟢';
  if (confidence >= 0.7) return '🟡';
  return '🔴';
}

function escapeMdx(text: string): string {
  return text.replace(/\{/g, '\\{').replace(/\}/g, '\\}');
}

function generateMdx(chunk: ChunkJson, meta: IndexChunkMeta): string {
  const { structural, semantic, derived } = chunk;
  const summary = semantic.summary.value ?? 'No summary available';
  const title = `${meta.method} ${meta.path}`;
  const safeDescription = summary.replace(/"/g, "'");

  const lines: string[] = [];

  // Frontmatter
  lines.push(`---`);
  lines.push(`title: "${title}"`);
  lines.push(`description: "${safeDescription}"`);
  lines.push(`---`);
  lines.push('');

  // Header
  lines.push(`## ${title}`);
  lines.push(`**Module:** \`${meta.module}\``);
  lines.push('');

  // Auth / guards
  const guards = structural.guards.value;
  const roles = structural.roles.value;
  if (guards.length > 0 || roles.length > 0) {
    lines.push('### Authentication');
    if (guards.length > 0) lines.push(`- **Guards:** ${guards.map(g => `\`${g}\``).join(', ')}`);
    if (roles.length > 0) lines.push(`- **Roles:** ${roles.map(r => `\`${r}\``).join(', ')}`);
    lines.push('');
  }

  // What it does
  lines.push('### What it does');
  lines.push(`${confidenceBadge(semantic.summary.confidence)} ${summary}`);
  lines.push('');

  // Business logic
  if (semantic.businessLogic.value) {
    lines.push('### Business Logic');
    lines.push(`${confidenceBadge(semantic.businessLogic.confidence)} ${semantic.businessLogic.value}`);
    lines.push('');
  }

  // Request params
  const params = structural.params.value;
  if (params.length > 0) {
    lines.push('### Request');
    lines.push('| Param | Type | Source |');
    lines.push('|-------|------|--------|');
    for (const p of params) {
      lines.push(`| \`${p.name}\` | \`${p.type}\` | ${p.source} |`);
    }
    lines.push('');
  }

  // DTO fields
  const dtoEntries = Object.entries(structural.dtoFields.value ?? {});
  if (dtoEntries.length > 0) {
    lines.push('### DTO Fields');
    for (const [dtoName, fields] of dtoEntries) {
      lines.push(`**\`${dtoName}\`**`);
      lines.push('');
      lines.push('| Field | Type | Required | Validators | Example |');
      lines.push('|-------|------|----------|------------|---------|');
      for (const f of fields) {
        const validators = escapeMdx((f.validators ?? []).join(', ') || '—');
        const example = escapeMdx(f.example ?? '—');
        lines.push(`| \`${f.name}\` | \`${f.type}\` | ${f.optional ? 'No' : 'Yes'} | ${validators} | ${example} |`);
      }
      lines.push('');
    }
  }

  // Responses
  const responses = structural.apiResponses.value;
  if (responses.length > 0) {
    lines.push('### Responses');
    lines.push('| Status | Description |');
    lines.push('|--------|-------------|');
    for (const r of responses) {
      lines.push(`| ${r.status} | ${r.description} |`);
    }
    lines.push('');
  }

  // Execution flow
  if (derived.executionFlow.value) {
    lines.push('### Execution Flow');
    lines.push(`${derived.executionFlow.value}`);
    lines.push('');
  }

  // Service methods — Prisma calls and throws
  const serviceMethods = derived.serviceMethods.value ?? [];
  if (serviceMethods.length > 0) {
    lines.push('### Service Details');
    for (const sm of serviceMethods) {
      lines.push(`**\`${sm.methodName}()\`**`);
      if (sm.prismaCalls.length > 0) lines.push(`- Prisma: ${sm.prismaCalls.map(c => `\`${c}\``).join(', ')}`);
      if (sm.throws.length > 0) lines.push(`- Throws: ${sm.throws.map(t => `\`${t}\``).join(', ')}`);
      if (sm.hasTransaction) lines.push(`- Uses transaction`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  const indexRaw = readFileSync(resolve(DOCS_DIR, 'index.json'), 'utf-8');
  const index: DocsIndex = JSON.parse(indexRaw);
  const chunks = Object.values(index.chunks);

  let generated = 0;
  const byModule: Record<string, number> = {};

  for (const meta of chunks) {
    const jsonPath = resolve(DOCS_DIR, 'chunks', `${meta.chunkId}.json`);
    if (!existsSync(jsonPath)) {
      console.warn(`  SKIP: no JSON chunk for ${meta.chunkId}`);
      continue;
    }

    const chunk: ChunkJson = JSON.parse(readFileSync(jsonPath, 'utf-8'));
    const mdx = generateMdx(chunk, meta);

    const moduleDir = resolve(MINTLIFY_DIR, 'api-reference', meta.module);
    if (!existsSync(moduleDir)) mkdirSync(moduleDir, { recursive: true });

    writeFileSync(resolve(moduleDir, `${meta.chunkId}.mdx`), mdx);
    console.log(`  ✓ api-reference/${meta.module}/${meta.chunkId}.mdx`);

    byModule[meta.module] = (byModule[meta.module] ?? 0) + 1;
    generated++;
  }

  console.log(`\nGenerated ${generated} MDX files in apps/docs/api-reference/`);
  for (const [mod, count] of Object.entries(byModule)) {
    console.log(`  ${mod}: ${count} endpoints`);
  }
}

main();
