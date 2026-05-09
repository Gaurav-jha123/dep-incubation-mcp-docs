import type { ChunkData } from './parser.js';

export type ValidationResult = {
  valid: boolean;
  warnings: string[];
};

const PLACEHOLDER_PATTERNS = [
  /\[1-2 sentence/i,
  /\[one sentence/i,
  /\[2-4 sentence/i,
  /TODO/,
  /\[placeholder\]/i,
];

function hasPlaceholder(text: string): boolean {
  return PLACEHOLDER_PATTERNS.some((p) => p.test(text));
}

export function validateChunkData(chunk: ChunkData): ValidationResult {
  const warnings: string[] = [];

  const { summary, businessLogic } = chunk.semantic;

  if (summary.value === null) {
    warnings.push('summary.value is null');
  } else {
    const len = summary.value.length;
    if (len < 20) warnings.push(`summary too short (${len} chars, min 20)`);
    if (len > 500) warnings.push(`summary too long (${len} chars, max 500)`);
    if (hasPlaceholder(summary.value)) warnings.push('summary contains placeholder text');
  }

  if (businessLogic.value === null) {
    warnings.push('businessLogic.value is null');
  } else {
    const len = businessLogic.value.length;
    if (len < 50) warnings.push(`businessLogic too short (${len} chars, min 50)`);
    if (len > 1000) warnings.push(`businessLogic too long (${len} chars, max 1000)`);
    if (hasPlaceholder(businessLogic.value)) warnings.push('businessLogic contains placeholder text');
  }

  if (typeof summary.confidence !== 'number' || summary.confidence < 0 || summary.confidence > 1) {
    warnings.push(`summary.confidence out of range: ${summary.confidence}`);
  }

  return { valid: warnings.length === 0, warnings };
}

export function applyValidationFallback(chunk: ChunkData, result: ValidationResult): ChunkData {
  if (result.valid) return chunk;

  const patched = { ...chunk, semantic: { ...chunk.semantic } };

  if (chunk.semantic.summary.value !== null && result.warnings.some((w) => w.startsWith('summary'))) {
    patched.semantic = {
      ...patched.semantic,
      summary: { ...chunk.semantic.summary, value: null, confidence: 0 },
    };
  }

  if (chunk.semantic.businessLogic.value !== null && result.warnings.some((w) => w.startsWith('businessLogic'))) {
    patched.semantic = {
      ...patched.semantic,
      businessLogic: { ...chunk.semantic.businessLogic, value: null, confidence: 0 },
    };
  }

  return patched;
}
