import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { simpleGit } from 'simple-git';
import { parseControllers } from './parser.js';
import type { IndexData, ChunkEntry } from './parser.js';
import { computeFingerprint } from './utils/fingerprint.js';
import { generateDoc } from './utils/llm.js';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '../../../');
const API_SRC = resolve(REPO_ROOT, 'apps/api/src');
const DOCS_DIR = resolve(REPO_ROOT, '.docs');
const CHUNKS_DIR = resolve(DOCS_DIR, 'chunks');
const INDEX_FILE = resolve(DOCS_DIR, 'index.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toRepoRelative(absPath: string): string {
  return relative(REPO_ROOT, absPath).replace(/\\/g, '/');
}

function loadIndex(): IndexData {
  const raw = readFileSync(INDEX_FILE, 'utf-8');
  return JSON.parse(raw) as IndexData;
}

function buildPrompt(meta: ReturnType<typeof parseControllers>[number]): string {
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

  return `You are a technical writer. Write a concise feature doc for this REST API endpoint.

Endpoint metadata:
${JSON.stringify(meta, null, 2)}

Output ONLY this markdown, no preamble:

## ${meta.method} ${meta.path}
**Module:** ${meta.module}

### What it does
[1-2 sentence plain English description of what this endpoint does]

### Request
| Param | Type | Source |
|-------|------|--------|
${paramsTable}

### Response
\`${meta.returnType}\` — [one sentence description of what is returned]

### Business Logic
[2-4 sentences describing the database operations, business rules, and error handling based on the service methods below. Be specific about what Prisma operations occur and what errors can be thrown.]

Service methods called:
${serviceMethodsSection}

### Notes
[Auth requirements, edge cases, or notable behaviors inferred from the code. If none, write "None."]`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const index = loadIndex();

  // 1. Discover which files changed in the last commit
  const git = simpleGit(REPO_ROOT);
  const diffOutput = await git.diff(['HEAD~1', 'HEAD', '--name-only']);
  const changedFiles = diffOutput
    .split('\n')
    .map((f: string) => f.trim())
    .filter(Boolean);

  console.log(`Changed files (${changedFiles.length}):`, changedFiles);

  // 2. Find chunk IDs affected by changed files
  const affectedChunkIds = new Set<string>();
  for (const changedFile of changedFiles) {
    const chunkIds = index.fileMap[changedFile];
    if (chunkIds) {
      for (const id of chunkIds) affectedChunkIds.add(id);
    }
  }

  if (affectedChunkIds.size === 0) {
    console.log('No indexed files changed — nothing to update.');
    return;
  }

  console.log(`Affected chunks: ${[...affectedChunkIds].join(', ')}`);

  // 3. Re-parse to get fresh metadata for affected modules
  const freshEndpoints = parseControllers(API_SRC);
  const endpointMap = new Map(freshEndpoints.map((e) => [e.chunkId, e]));

  let updatedCount = 0;

  for (const chunkId of affectedChunkIds) {
    const fresh = endpointMap.get(chunkId);
    if (!fresh) {
      console.log(`  ${chunkId}: endpoint no longer exists — skipping`);
      continue;
    }

    const existing = index.chunks[chunkId];
    if (existing && existing.fingerprint === fresh.fingerprint) {
      console.log(`  ${chunkId}: fingerprint unchanged — skipping`);
      continue;
    }

    console.log(`  ${chunkId}: fingerprint changed — regenerating…`);

    const prompt = buildPrompt(fresh);
    const doc = await generateDoc(prompt, fresh);

    const chunkPath = resolve(CHUNKS_DIR, `${chunkId}.md`);
    writeFileSync(chunkPath, doc, 'utf-8');

    const entry: ChunkEntry = {
      chunkId: fresh.chunkId,
      module: fresh.module,
      method: fresh.method,
      path: fresh.path,
      fingerprint: fresh.fingerprint,
      sourceFiles: fresh.sourceFiles.map(toRepoRelative),
      docFile: `.docs/chunks/${chunkId}.md`,
      lastUpdated: new Date().toISOString(),
      guards: fresh.guards,
      roles: fresh.roles,
      relatedChunks: [], // recomputed below after all chunks are updated
    };

    index.chunks[chunkId] = entry;
    updatedCount++;
  }

  // Fix 4: Remove stale chunks for endpoints that no longer exist in the codebase
  const freshIds = new Set(freshEndpoints.map((e) => e.chunkId));
  for (const existingId of Object.keys(index.chunks)) {
    if (!freshIds.has(existingId)) {
      const stalePath = resolve(CHUNKS_DIR, `${existingId}.md`);
      if (existsSync(stalePath)) rmSync(stalePath);
      delete index.chunks[existingId];
      console.log(`  Removed stale chunk: ${existingId}`);
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    index.lastIndexed = new Date().toISOString();

    // Rebuild fileMap from current chunks
    const fileMap: Record<string, string[]> = {};
    for (const entry of Object.values(index.chunks)) {
      for (const srcFile of entry.sourceFiles) {
        if (!fileMap[srcFile]) fileMap[srcFile] = [];
        if (!fileMap[srcFile].includes(entry.chunkId)) {
          fileMap[srcFile].push(entry.chunkId);
        }
      }
    }
    index.fileMap = fileMap;

    // Recompute relatedChunks for all chunks from updated fileMap
    for (const entry of Object.values(index.chunks)) {
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

    writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
    console.log(`\nUpdated ${updatedCount} chunk(s). Index saved.`);
  } else {
    console.log('\nAll fingerprints matched — no LLM calls made.');
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
