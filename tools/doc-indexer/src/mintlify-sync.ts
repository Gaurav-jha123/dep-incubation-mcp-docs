/**
 * mintlify-sync.ts
 * Converts .docs/chunks/*.md → apps/docs/api-reference/{module}/{chunkId}.mdx
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

interface ChunkMeta {
  chunkId: string;
  module: string;
  method: string;
  path: string;
  docFile: string;
}

interface DocsIndex {
  chunks: Record<string, ChunkMeta>;
}

function extractDescription(content: string): string {
  const match = content.match(/### What it does\s*\n([^\n]+)/);
  return match ? match[1].trim().replace(/"/g, "'") : '';
}

function main() {
  const indexRaw = readFileSync(resolve(DOCS_DIR, 'index.json'), 'utf-8');
  const index: DocsIndex = JSON.parse(indexRaw);

  const chunks = Object.values(index.chunks);

  // Group by module for summary
  const byModule: Record<string, ChunkMeta[]> = {};
  for (const chunk of chunks) {
    if (!byModule[chunk.module]) byModule[chunk.module] = [];
    byModule[chunk.module].push(chunk);
  }

  // Generate MDX files
  for (const [module, moduleChunks] of Object.entries(byModule)) {
    const moduleDir = resolve(MINTLIFY_DIR, 'api-reference', module);
    if (!existsSync(moduleDir)) mkdirSync(moduleDir, { recursive: true });

    for (const chunk of moduleChunks) {
      const docContent = readFileSync(resolve(REPO_ROOT, chunk.docFile), 'utf-8');
      const description = extractDescription(docContent);
      const title = `${chunk.method} ${chunk.path}`;

      const mdx = `---\ntitle: "${title}"\ndescription: "${description}"\n---\n\n${docContent}`;

      writeFileSync(resolve(moduleDir, `${chunk.chunkId}.mdx`), mdx);
      console.log(`  ✓ api-reference/${module}/${chunk.chunkId}.mdx`);
    }
  }

  console.log(`\nGenerated ${chunks.length} MDX files in apps/docs/api-reference/`);
  console.log('\nModule breakdown:');
  for (const [mod, modChunks] of Object.entries(byModule)) {
    console.log(`  ${mod}: ${modChunks.length} endpoints`);
  }
}

main();
