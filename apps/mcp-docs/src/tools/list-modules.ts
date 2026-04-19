import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { IndexData } from '../types.js';

export function listModules(
  docsDir: string,
): { module: string; chunkIds: string[] }[] {
  const raw = readFileSync(resolve(docsDir, 'index.json'), 'utf-8');
  const index = JSON.parse(raw) as IndexData;

  const grouped: Record<string, string[]> = {};
  for (const entry of Object.values(index.chunks)) {
    if (!grouped[entry.module]) grouped[entry.module] = [];
    grouped[entry.module].push(entry.chunkId);
  }

  return Object.entries(grouped).map(([module, chunkIds]) => ({
    module,
    chunkIds,
  }));
}
