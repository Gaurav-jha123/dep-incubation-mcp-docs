/**
 * Preview doc changes locally without calling the LLM.
 *
 * Usage: pnpm --filter doc-indexer preview
 *
 * Behaviour:
 *  1. Parses all controllers (and services) to get fresh EndpointMeta.
 *  2. Loads existing index.json (if present).
 *  3. Compares fingerprints — prints a diff summary table.
 *  4. For changed/new chunks: renders a static template doc (no API call)
 *     and prints it to stdout so developers can review before merging.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseControllers } from './parser.js';
import type { IndexData } from './parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '../../../');
const API_SRC = resolve(REPO_ROOT, 'apps/api/src');
const DOCS_DIR = resolve(REPO_ROOT, '.docs');
const INDEX_FILE = resolve(DOCS_DIR, 'index.json');

function toRepoRelative(absPath: string): string {
  return relative(REPO_ROOT, absPath).replace(/\\/g, '/');
}

function templateDoc(meta: ReturnType<typeof parseControllers>[number]): string {
  const paramsTable =
    meta.params.length > 0
      ? meta.params
          .map((p) => `| \`${p.name}\` | \`${p.type}\` | ${p.source} |`)
          .join('\n')
      : '| — | — | — |';

  const businessLogic =
    meta.serviceMethods.length > 0
      ? meta.serviceMethods
          .map((sm) => {
            const db =
              sm.prismaCalls.length > 0
                ? `Calls \`${sm.prismaCalls.join('`, `')}\``
                : 'No direct DB calls';
            const throws =
              sm.throws.length > 0
                ? ` May throw: ${sm.throws.join(', ')}.`
                : '';
            return `\`${sm.methodName}()\` — ${db}.${throws}`;
          })
          .join(' ')
      : 'No service methods inferred.';

  const authLines: string[] = [];
  if (meta.guards.length > 0) authLines.push(`**Guards:** ${meta.guards.join(', ')}`);
  if (meta.roles.length > 0) authLines.push(`**Required roles:** ${meta.roles.join(', ')}`);
  const authSection = authLines.length > 0 ? `\n### Auth\n${authLines.join('\n')}\n` : '';

  const errorsSection =
    meta.apiResponses.filter((r) => r.status >= 400).length > 0
      ? `\n### Errors\n| Status | Description |\n|--------|-------------|\n` +
        meta.apiResponses
          .filter((r) => r.status >= 400)
          .map((r) => `| ${r.status} | ${r.description} |`)
          .join('\n') + '\n'
      : '';

  const whatItDoes = meta.apiSummary
    ?? `Handles \`${meta.method} ${meta.path}\` requests via \`${meta.handlerName}\`.${meta.jsdoc ? ' ' + meta.jsdoc : ''}`;

  const successResponse = meta.apiResponses.find((r) => r.status < 400);
  const responseDesc = successResponse ? successResponse.description : `\`${meta.returnType}\``;

  return `## ${meta.method} ${meta.path}
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
${businessLogic}
${authSection}${errorsSection}### Notes
[Run \`pnpm --filter doc-indexer index\` to regenerate with LLM content]
`;
}

function main(): void {
  console.log('Parsing controllers in', API_SRC);
  const endpoints = parseControllers(API_SRC);
  console.log(`Found ${endpoints.length} endpoints\n`);

  // Load existing index (may not exist on first run)
  let existingIndex: IndexData | null = null;
  if (existsSync(INDEX_FILE)) {
    existingIndex = JSON.parse(readFileSync(INDEX_FILE, 'utf-8')) as IndexData;
  }

  const NEW_TAG = '🆕 new';
  const CHANGED_TAG = '♻️  changed';
  const UNCHANGED_TAG = '✅ unchanged';

  type RowStatus = typeof NEW_TAG | typeof CHANGED_TAG | typeof UNCHANGED_TAG;

  const rows: { status: RowStatus; chunkId: string; path: string; method: string }[] = [];

  for (const meta of endpoints) {
    const existing = existingIndex?.chunks[meta.chunkId];
    let status: RowStatus;

    if (!existing) {
      status = NEW_TAG;
    } else if (existing.fingerprint !== meta.fingerprint) {
      status = CHANGED_TAG;
    } else {
      status = UNCHANGED_TAG;
    }

    rows.push({ status, chunkId: meta.chunkId, path: meta.path, method: meta.method });
  }

  // Print summary table
  const colW = Math.max(...rows.map((r) => r.chunkId.length), 10);
  console.log('─'.repeat(colW + 50));
  console.log(`${'STATUS'.padEnd(16)} ${'METHOD'.padEnd(8)} ${'PATH'}`);
  console.log('─'.repeat(colW + 50));
  for (const row of rows) {
    console.log(`${row.status.padEnd(16)} ${row.method.padEnd(8)} ${row.path}`);
  }
  console.log('─'.repeat(colW + 50));

  const newCount = rows.filter((r) => r.status === NEW_TAG).length;
  const changedCount = rows.filter((r) => r.status === CHANGED_TAG).length;
  const unchangedCount = rows.filter((r) => r.status === UNCHANGED_TAG).length;
  console.log(
    `\nSummary: ${newCount} new, ${changedCount} changed, ${unchangedCount} unchanged`,
  );

  // Print rendered previews for new + changed chunks
  const toPreview = endpoints.filter((meta) => {
    const existing = existingIndex?.chunks[meta.chunkId];
    return !existing || existing.fingerprint !== meta.fingerprint;
  });

  if (toPreview.length === 0) {
    console.log('\nNo doc changes detected — nothing to preview.');
    return;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('PREVIEW (template-rendered, no LLM):');
  console.log('='.repeat(60));

  for (const meta of toPreview) {
    console.log(`\n--- ${meta.chunkId} ---\n`);
    console.log(templateDoc(meta));
  }
}

main();
