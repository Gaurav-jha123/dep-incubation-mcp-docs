import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { IndexData } from '../types.js';

const CONFIDENCE_FALLBACK_THRESHOLD = 0.65;

export function shouldFallback(confidence: number): boolean {
  return confidence < CONFIDENCE_FALLBACK_THRESHOLD;
}

function extractMethodBody(source: string, methodName: string): string | null {
  // Find the method declaration by name
  const methodRegex = new RegExp(
    `(?:async\\s+)?${methodName}\\s*\\([^)]*\\)[^{]*\\{`,
    'm',
  );
  const match = methodRegex.exec(source);
  if (!match) return null;

  const start = match.index;
  let depth = 0;
  let i = source.indexOf('{', start);
  if (i === -1) return null;

  const bodyStart = i;
  while (i < source.length) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') {
      depth--;
      if (depth === 0) {
        return source.slice(bodyStart, i + 1);
      }
    }
    i++;
  }
  return null;
}

type ChunkJson = {
  semantic?: { summary?: { confidence?: number } };
  derived?: { serviceMethods?: { value?: Array<{ methodName: string }> } };
};

export function getDocSource(docsDir: string, repoRoot: string, chunkId: string): string {
  const raw = readFileSync(resolve(docsDir, 'index.json'), 'utf-8');
  const index = JSON.parse(raw) as IndexData;

  const entry = index.chunks[chunkId];
  if (!entry) {
    throw new Error(`Chunk not found: ${chunkId}`);
  }

  let confidence: number | undefined;
  let serviceMethodNames: string[] = [];
  try {
    const jsonData = readFileSync(resolve(docsDir, 'chunks', `${chunkId}.json`), 'utf-8');
    const parsed = JSON.parse(jsonData) as ChunkJson;
    confidence = parsed.semantic?.summary?.confidence;
    serviceMethodNames = (parsed.derived?.serviceMethods?.value ?? []).map((m) => m.methodName);
  } catch {
    // no JSON chunk — proceed with source extraction anyway
  }

  const sections: string[] = [];

  if (confidence !== undefined) {
    const threshold = CONFIDENCE_FALLBACK_THRESHOLD;
    sections.push(
      `> **Fallback-to-source**: confidence ${confidence} is ${confidence < threshold ? 'below' : 'above'} threshold ${threshold}\n`,
    );
  }

  for (const relPath of entry.sourceFiles) {
    const absPath = resolve(repoRoot, relPath);
    let fileSource: string;
    try {
      fileSource = readFileSync(absPath, 'utf-8');
    } catch {
      sections.push(`// Could not read: ${relPath}\n`);
      continue;
    }

    const isController = relPath.includes('.controller.');
    if (isController && entry.handlerLine > 0) {
      const lines = fileSource.split('\n');
      let decoratorStart = entry.handlerLine - 1;
      while (decoratorStart > 0 && lines[decoratorStart - 1]?.trimStart().startsWith('@')) {
        decoratorStart--;
      }
      const snippet = lines
        .slice(decoratorStart, Math.min(decoratorStart + 50, lines.length))
        .join('\n');
      sections.push(`### Handler: ${relPath}#L${entry.handlerLine}\n\`\`\`typescript\n${snippet}\n\`\`\``);
    } else {
      // Extract only the service methods referenced by this endpoint
      const extracted = serviceMethodNames
        .map((name) => extractMethodBody(fileSource, name))
        .filter((body): body is string => body !== null);

      if (extracted.length > 0) {
        const snippet = extracted.join('\n\n');
        sections.push(`### Service: ${relPath}\n\`\`\`typescript\n${snippet}\n\`\`\``);
      } else {
        // fallback: full file if no method names matched
        sections.push(`### Service: ${relPath}\n\`\`\`typescript\n${fileSource}\n\`\`\``);
      }
    }
  }

  return sections.join('\n\n');
}
