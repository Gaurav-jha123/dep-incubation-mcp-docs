import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Given a Prisma model name (e.g. "Project"), return all endpoint chunk IDs
 * that access that model, formatted as a markdown table.
 *
 * The modelMap is built by the indexer from service-method Prisma call tracing.
 * Pass no name (or empty string) to list all models in the map.
 */
export function getImpact(docsDir: string, modelName?: string): string {
  const indexPath = resolve(docsDir, 'index.json');
  if (!existsSync(indexPath)) {
    return 'Index not found. Run `pnpm --filter doc-indexer index` first.';
  }

  const index = JSON.parse(readFileSync(indexPath, 'utf-8')) as {
    modelMap?: Record<string, string[]>;
    chunks?: Record<string, { method: string; path: string }>;
  };

  const modelMap = index.modelMap ?? {};
  const chunks = index.chunks ?? {};

  // No model specified — list all models and their chunk counts
  if (!modelName || modelName.trim() === '') {
    const entries = Object.entries(modelMap);
    if (entries.length === 0) {
      return 'No model map found. Re-run `pnpm --filter doc-indexer index` to populate it.';
    }
    const rows = entries
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([model, ids]) => `| \`${model}\` | ${ids.length} |`)
      .join('\n');
    return `# Available Models\n\n| Model | Endpoint Count |\n|-------|----------------|\n${rows}\n\nUse \`get_impact\` with a model name to see the full endpoint list.`;
  }

  // Case-insensitive lookup
  const key = Object.keys(modelMap).find(
    (k) => k.toLowerCase() === modelName.toLowerCase(),
  );

  if (!key) {
    const available = Object.keys(modelMap).sort().join(', ');
    return `No endpoints found for model "${modelName}".\n\nAvailable models: ${available || '(none — run indexer first)'}`;
  }

  const chunkIds: string[] = modelMap[key];

  const rows = chunkIds
    .map((id) => {
      const c = chunks[id];
      if (!c) return `| \`${id}\` | — | — |`;
      return `| \`${id}\` | \`${c.method}\` | \`${c.path}\` |`;
    })
    .join('\n');

  return `# Impact: \`${key}\`\n\nEndpoints that access the \`${key}\` Prisma model (${chunkIds.length} total):\n\n| Chunk ID | Method | Path |\n|----------|--------|------|\n${rows}\n`;
}
