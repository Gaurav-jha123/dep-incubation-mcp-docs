import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { IndexData } from '../types.js';

function getSingleDoc(docsDir: string, chunkId: string, index: IndexData): string {
  const entry = index.chunks[chunkId];
  if (!entry) {
    throw new Error(`Chunk not found: ${chunkId}`);
  }

  let doc = readFileSync(resolve(docsDir, 'chunks', `${chunkId}.md`), 'utf-8');

  // Append auth context
  const authLines: string[] = [];
  if (entry.guards.length > 0) {
    authLines.push(`**Guards:** ${entry.guards.join(', ')}`);
  }
  if (entry.roles.length > 0) {
    authLines.push(`**Required roles:** ${entry.roles.join(', ')}`);
  }
  if (authLines.length > 0 && !doc.includes('### Auth')) {
    doc = doc.trimEnd() + `\n\n### Auth\n${authLines.join('\n')}\n`;
  }

  // Append related endpoints
  if (entry.relatedChunks.length > 0) {
    const relatedLines = entry.relatedChunks.map((id) => {
      const rel = index.chunks[id];
      if (!rel) return `- \`${id}\``;
      return `- \`${rel.method} ${rel.path}\` (\`${id}\`)`;
    });
    doc =
      doc.trimEnd() +
      `\n\n### Related Endpoints\n${relatedLines.join('\n')}\n`;
  }

  return doc;
}

export function getDoc(docsDir: string, chunkId: string): string {
  const raw = readFileSync(resolve(docsDir, 'index.json'), 'utf-8');
  const index = JSON.parse(raw) as IndexData;

  // Module-level summary: chunkId is a plain module name (no __ separator)
  const isModuleName = !chunkId.includes('__');
  if (isModuleName) {
    const moduleChunks = Object.values(index.chunks).filter(
      (c) => c.module === chunkId,
    );
    if (moduleChunks.length === 0) {
      throw new Error(`Module not found: ${chunkId}`);
    }
    const docs = moduleChunks.map((c) => getSingleDoc(docsDir, c.chunkId, index));
    return `# Module: ${chunkId}\n\n` + docs.join('\n\n---\n\n');
  }

  return getSingleDoc(docsDir, chunkId, index);
}
