import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Return the markdown doc for a Prisma model or enum by name,
 * or list all available schema chunks if no name is given.
 */
export function getSchema(docsDir: string, name?: string): string {
  const schemaDir = resolve(docsDir, 'schema');

  if (!existsSync(schemaDir)) {
    return 'Schema chunks not found. Run `pnpm --filter doc-indexer index` to generate them.';
  }

  // No name → list all available models + enums
  if (!name) {
    const files = readdirSync(schemaDir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace('.md', ''))
      .sort();

    if (files.length === 0) {
      return 'No schema chunks available.';
    }

    return `# Available Schema Chunks\n\n${files.map((f) => `- \`${f}\``).join('\n')}\n`;
  }

  const filePath = resolve(schemaDir, `${name}.md`);
  if (!existsSync(filePath)) {
    // Try case-insensitive fallback
    const files = readdirSync(schemaDir);
    const match = files.find((f) => f.toLowerCase() === `${name.toLowerCase()}.md`);
    if (match) {
      return readFileSync(resolve(schemaDir, match), 'utf-8');
    }
    throw new Error(
      `Schema chunk not found: "${name}". Available: ${
        files.map((f) => f.replace('.md', '')).join(', ')
      }`,
    );
  }

  return readFileSync(filePath, 'utf-8');
}
