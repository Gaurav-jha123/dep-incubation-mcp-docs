import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { IndexData } from '../types.js';

export function getDocJson(docsDir: string, chunkId: string): string {
  const raw = readFileSync(resolve(docsDir, 'index.json'), 'utf-8');
  const index = JSON.parse(raw) as IndexData;

  const entry = index.chunks[chunkId];
  if (!entry) {
    throw new Error(`Chunk not found: ${chunkId}`);
  }

  // Read JSON chunk
  const jsonPath = resolve(docsDir, 'chunks', `${chunkId}.json`);
  const jsonData = readFileSync(jsonPath, 'utf-8');
  return jsonData;
}
