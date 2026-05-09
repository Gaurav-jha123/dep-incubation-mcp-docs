import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Relationship = {
  from: string;
  to: string;
  type: 'mutates' | 'reads' | 'guards' | 'co-located';
  targetKind: 'chunk' | 'model' | 'guard';
};

export function getImpact(docsDir: string, modelName?: string): string {
  const indexPath = resolve(docsDir, 'index.json');
  if (!existsSync(indexPath)) {
    return 'Index not found. Run `pnpm --filter doc-indexer index` first.';
  }

  const index = JSON.parse(readFileSync(indexPath, 'utf-8')) as {
    modelMap?: Record<string, string[]>;
    chunks?: Record<string, { method: string; path: string }>;
    relationships?: Relationship[];
  };

  const modelMap = index.modelMap ?? {};
  const chunks = index.chunks ?? {};
  const relationships = index.relationships ?? [];

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

  const key = Object.keys(modelMap).find(
    (k) => k.toLowerCase() === modelName.toLowerCase(),
  );

  if (!key) {
    const available = Object.keys(modelMap).sort().join(', ');
    return `No endpoints found for model "${modelName}".\n\nAvailable models: ${available || '(none — run indexer first)'}`;
  }

  const chunkIds: string[] = modelMap[key];

  // Build reads/mutates breakdown from relationships graph
  const mutators = new Set(
    relationships
      .filter((r) => r.type === 'mutates' && r.to === key)
      .map((r) => r.from),
  );

  const rows = chunkIds
    .map((id) => {
      const c = chunks[id];
      const access = mutators.has(id) ? '✏️ mutates' : '📖 reads';
      if (!c) return `| \`${id}\` | — | — | ${access} |`;
      return `| \`${id}\` | \`${c.method}\` | \`${c.path}\` | ${access} |`;
    })
    .join('\n');

  return `# Impact: \`${key}\`\n\nEndpoints that access the \`${key}\` Prisma model (${chunkIds.length} total):\n\n| Chunk ID | Method | Path | Access |\n|----------|--------|------|--------|\n${rows}\n`;
}
