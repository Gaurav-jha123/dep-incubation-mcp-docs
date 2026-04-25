import { mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { simpleGit } from 'simple-git';
import { parseControllers, renderDtoFieldsSection, renderExecutionFlow, renderErrorConditions } from './parser.js';
import type { EndpointMeta, IndexData, ChunkEntry } from './parser.js';
import { parseSchema, renderModelDoc, renderEnumDoc } from './schema-parser.js';
import { generateDoc } from './utils/llm.js';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// tools/doc-indexer/src/ → ../../.. → repo root
const REPO_ROOT = resolve(__dirname, '../../../');
const API_SRC = resolve(REPO_ROOT, 'apps/api/src');
const SCHEMA_FILE = resolve(REPO_ROOT, 'apps/api/prisma/schema.prisma');
const DOCS_DIR = resolve(REPO_ROOT, '.docs');
const CHUNKS_DIR = resolve(DOCS_DIR, 'chunks');
const SCHEMA_DIR = resolve(DOCS_DIR, 'schema');
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

  const notesContext = meta.guards.length > 0
    ? `Requires ${meta.guards.join(' + ')}.${meta.roles.length > 0 ? ` Required roles: ${meta.roles.join(', ')}.` : ''} Note any additional edge cases.`
    : 'No authentication required (public endpoint). Note any edge cases.';

  const dtoFieldsSection = renderDtoFieldsSection(meta);
  const executionFlowSection = renderExecutionFlow(meta);
  const errorConditionsSection = renderErrorConditions(meta);

  const opEmoji = { read: '📖', write: '✏️', mixed: '🔀', unknown: '❓' }[meta.operationType];
  const confBar = '█'.repeat(Math.round(meta.confidenceScore / 10)) + '░'.repeat(10 - Math.round(meta.confidenceScore / 10));

  return `You are a technical writer. Write a concise feature doc for this REST API endpoint.

Endpoint metadata:
${JSON.stringify(meta, null, 2)}

Output ONLY this markdown, no preamble:

## ${meta.method} ${meta.path}
**Module:** ${meta.module} | **Operation:** ${opEmoji} ${meta.operationType} | **Confidence:** ${confBar} ${meta.confidenceScore}/100

### What it does
${whatItDoes}

### Request
| Param | Type | Source |
|-------|------|--------|
${paramsTable}
${dtoFieldsSection}
### Response
${responseDesc}
${executionFlowSection}${errorConditionsSection}### Business Logic
[2-4 sentences describing the database operations, business rules, and error handling based on the service methods below. Be specific about what Prisma operations occur and what errors can be thrown.]

Service methods called:
${serviceMethodsSection}
${errorsTable ? `\n### Errors\n| Status | Description |\n|--------|-------------|\n${errorsTable}` : ''}
### Notes
${notesContext}`;
}

// ---------------------------------------------------------------------------
// Index helpers
// ---------------------------------------------------------------------------

function toRepoRelative(absPath: string): string {
  return relative(REPO_ROOT, absPath).replace(/\\/g, '/');
}

function buildChunkEntry(meta: EndpointMeta, commitSha: string): ChunkEntry {
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
    handlerLine: meta.handlerLine,
    commitSha,
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
  const git = simpleGit(REPO_ROOT);
  const commitSha = (await git.revparse(['HEAD'])).trim();

  console.log('Parsing controllers in', API_SRC);
  const endpoints = parseControllers(API_SRC);
  console.log(`Found ${endpoints.length} endpoints`);

  mkdirSync(CHUNKS_DIR, { recursive: true });

  const chunks: Record<string, ChunkEntry> = {};
  const fileMap: Record<string, string[]> = {};
  const modelMap: Record<string, string[]> = {};

  for (const meta of endpoints) {
    console.log(`  Generating doc for ${meta.chunkId}…`);

    const prompt = buildPrompt(meta);
    let doc = await generateDoc(prompt, meta);

    // Append deterministic source link only if template didn't already include it
    if (!doc.includes('### Source')) {
      const normalizedController = (meta.sourceFiles[0] ?? '').replace(/\\/g, '/');
      const appsIdx = normalizedController.indexOf('apps/api/src');
      if (appsIdx >= 0) {
        const relPath = normalizedController.slice(appsIdx);
        doc += `\n### Source\n[${relPath}](${relPath}#L${meta.handlerLine})\n`;
      }
    }

    // Respect free-tier rate limit (~4 req/min → 1 req per 15s); skip in template mode
    if (process.env.USE_TEMPLATE_FALLBACK !== 'true') {
      await new Promise((r) => setTimeout(r, 15_000));
    }

    const chunkPath = resolve(CHUNKS_DIR, `${meta.chunkId}.md`);
    writeFileSync(chunkPath, doc, 'utf-8');

    chunks[meta.chunkId] = buildChunkEntry(meta, commitSha);

    // Populate fileMap
    for (const srcFile of meta.sourceFiles) {
      const key = toRepoRelative(srcFile);
      if (!fileMap[key]) fileMap[key] = [];
      if (!fileMap[key].includes(meta.chunkId)) {
        fileMap[key].push(meta.chunkId);
      }
    }

    // Populate modelMap from Prisma calls
    for (const sm of meta.serviceMethods) {
      for (const call of sm.prismaCalls) {
        const raw = call.split('.')[0] ?? '';
        const model = raw.charAt(0).toUpperCase() + raw.slice(1);
        if (!model) continue;
        if (!modelMap[model]) modelMap[model] = [];
        if (!modelMap[model].includes(meta.chunkId)) modelMap[model].push(meta.chunkId);
      }
    }
  }

  const indexData: IndexData = {
    lastIndexed: new Date().toISOString(),
    chunks,
    fileMap,
    modelMap,
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

  // ---------------------------------------------------------------------------
  // Schema chunks — write once per run (fast, no LLM needed)
  // ---------------------------------------------------------------------------
  console.log('\nIndexing Prisma schema...');
  mkdirSync(SCHEMA_DIR, { recursive: true });
  const schema = parseSchema(SCHEMA_FILE);

  for (const model of schema.models) {
    const doc = renderModelDoc(model);
    writeFileSync(resolve(SCHEMA_DIR, `${model.name}.md`), doc, 'utf-8');
  }
  for (const en of schema.enums) {
    const doc = renderEnumDoc(en);
    writeFileSync(resolve(SCHEMA_DIR, `${en.name}.md`), doc, 'utf-8');
  }
  console.log(
    `Schema chunks written: ${schema.models.length} models, ${schema.enums.length} enums → ${SCHEMA_DIR}/`,
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
