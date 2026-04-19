import { mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseControllers } from './parser.js';
import type { EndpointMeta, IndexData, ChunkEntry } from './parser.js';
import { generateDoc } from './utils/llm.js';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// tools/doc-indexer/src/ → ../../.. → repo root
const REPO_ROOT = resolve(__dirname, '../../../');
const API_SRC = resolve(REPO_ROOT, 'apps/api/src');
const DOCS_DIR = resolve(REPO_ROOT, '.docs');
const CHUNKS_DIR = resolve(DOCS_DIR, 'chunks');
const INDEX_FILE = resolve(DOCS_DIR, 'index.json');

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

function buildPrompt(meta: EndpointMeta): string {
  const paramsTable =
    meta.params.length > 0
      ? meta.params
          .map((p) => `| ${p.name} | \`${p.type}\` | ${p.source} |`)
          .join('\n')
      : '| — | — | — |';

  const serviceMethodsSection =
    meta.serviceMethods.length > 0
      ? meta.serviceMethods
          .map((sm) => {
            const db =
              sm.prismaCalls.length > 0
                ? `DB: \`${sm.prismaCalls.join('`, `')}\``
                : 'No direct DB calls';
            const throws =
              sm.throws.length > 0
                ? `  Throws: ${sm.throws.join(', ')}`
                : '';
            return `- \`${sm.methodName}()\`: ${db}${throws}`;
          })
          .join('\n')
      : 'None inferred.';

  const errorsTable =
    meta.apiResponses.filter((r) => r.status >= 400).length > 0
      ? meta.apiResponses
          .filter((r) => r.status >= 400)
          .map((r) => `| ${r.status} | ${r.description} |`)
          .join('\n')
      : null;

  const whatItDoes = meta.apiSummary
    ? meta.apiSummary
    : `[1-2 sentence plain English description of what this endpoint does]`;

  const successResponse = meta.apiResponses.find((r) => r.status < 400);
  const responseDesc = successResponse
    ? `${successResponse.description}`
    : `[one sentence description of what is returned]`;

  return `You are a technical writer. Write a concise feature doc for this REST API endpoint.

Endpoint metadata:
${JSON.stringify(meta, null, 2)}

Output ONLY this markdown, no preamble:

## ${meta.method} ${meta.path}
**Module:** ${meta.module}

### What it does
${whatItDoes}

### Request
| Param | Type | Source |
|-------|------|--------|
${paramsTable}

### Response
${responseDesc}

### Business Logic
[2-4 sentences describing the database operations, business rules, and error handling based on the service methods below. Be specific about what Prisma operations occur and what errors can be thrown.]

Service methods called:
${serviceMethodsSection}
${errorsTable ? `\n### Errors\n| Status | Description |\n|--------|-------------|\n${errorsTable}` : ''}
### Notes
[Auth requirements, edge cases, or notable behaviors inferred from the code. If none, write "None."]`;
}

// ---------------------------------------------------------------------------
// Index helpers
// ---------------------------------------------------------------------------

function toRepoRelative(absPath: string): string {
  return relative(REPO_ROOT, absPath).replace(/\\/g, '/');
}

function buildChunkEntry(meta: EndpointMeta): ChunkEntry {
  return {
    chunkId: meta.chunkId,
    module: meta.module,
    method: meta.method,
    path: meta.path,
    fingerprint: meta.fingerprint,
    sourceFiles: meta.sourceFiles.map(toRepoRelative),
    docFile: `.docs/chunks/${meta.chunkId}.md`,
    lastUpdated: new Date().toISOString(),
    guards: meta.guards,
    roles: meta.roles,
    relatedChunks: [], // populated after all chunks are built
  };
}

/**
 * For each chunk, find other chunks that share at least one sourceFile.
 * Mutual relationships — if A relates to B then B relates to A.
 */
function computeRelatedChunks(
  chunks: Record<string, ChunkEntry>,
  fileMap: Record<string, string[]>,
): void {
  for (const entry of Object.values(chunks)) {
    const related = new Set<string>();

    for (const srcFile of entry.sourceFiles) {
      const siblings = fileMap[srcFile];
      if (!siblings) continue;
      for (const sibling of siblings) {
        if (sibling !== entry.chunkId) related.add(sibling);
      }
    }

    entry.relatedChunks = [...related].sort();
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('Parsing controllers in', API_SRC);
  const endpoints = parseControllers(API_SRC);
  console.log(`Found ${endpoints.length} endpoints`);

  mkdirSync(CHUNKS_DIR, { recursive: true });

  const chunks: Record<string, ChunkEntry> = {};
  const fileMap: Record<string, string[]> = {};

  for (const meta of endpoints) {
    console.log(`  Generating doc for ${meta.chunkId}…`);

    const prompt = buildPrompt(meta);
    const doc = await generateDoc(prompt, meta);

    // Respect free-tier rate limit (~4 req/min → 1 req per 15s)
    await new Promise((resolve) => setTimeout(resolve, 15_000));

    const chunkPath = resolve(CHUNKS_DIR, `${meta.chunkId}.md`);
    writeFileSync(chunkPath, doc, 'utf-8');

    chunks[meta.chunkId] = buildChunkEntry(meta);

    // Populate fileMap
    for (const srcFile of meta.sourceFiles) {
      const key = toRepoRelative(srcFile);
      if (!fileMap[key]) fileMap[key] = [];
      if (!fileMap[key].includes(meta.chunkId)) {
        fileMap[key].push(meta.chunkId);
      }
    }
  }

  const indexData: IndexData = {
    lastIndexed: new Date().toISOString(),
    chunks,
    fileMap,
  };

  // Post-process: compute related chunks from fileMap
  computeRelatedChunks(chunks, fileMap);

  // Fix 4: Remove stale chunks — delete .md files for endpoints that no longer exist
  if (existsSync(INDEX_FILE)) {
    const oldIndex = JSON.parse(readFileSync(INDEX_FILE, 'utf-8')) as IndexData;
    const freshIds = new Set(Object.keys(chunks));
    for (const oldId of Object.keys(oldIndex.chunks)) {
      if (!freshIds.has(oldId)) {
        const stalePath = resolve(CHUNKS_DIR, `${oldId}.md`);
        if (existsSync(stalePath)) {
          rmSync(stalePath);
          console.log(`  Removed stale chunk: ${oldId}`);
        }
      }
    }
  }

  writeFileSync(INDEX_FILE, JSON.stringify(indexData, null, 2), 'utf-8');
  console.log(`\nIndex written to ${INDEX_FILE}`);
  console.log(`Docs written to   ${CHUNKS_DIR}/`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
