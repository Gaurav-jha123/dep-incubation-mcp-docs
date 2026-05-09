import { appendFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

export type FeedbackEntry = {
  timestamp: string;
  chunkId: string;
  issue: string;
  fieldName?: string;
  suggestedValue?: string;
  observedConfidence?: number;
};

export function reportIssue(
  docsDir: string,
  chunkId: string,
  issue: string,
  fieldName?: string,
  suggestedValue?: string,
  observedConfidence?: number,
): string {
  if (!chunkId || !chunkId.trim()) {
    return 'Error: chunkId is required. Use list_modules or search_docs to find the right chunk.';
  }
  if (!issue || !issue.trim()) {
    return 'Error: issue description is required.';
  }

  const safeChunkId = chunkId.trim().replace(/[\r\n\t]/g, ' ').slice(0, 200);
  const safeIssue = issue.trim().replace(/[\r\n\t]/g, ' ').slice(0, 1000);

  const entry: FeedbackEntry = {
    timestamp: new Date().toISOString(),
    chunkId: safeChunkId,
    issue: safeIssue,
  };

  if (fieldName) entry.fieldName = fieldName.trim().slice(0, 100);
  if (suggestedValue) entry.suggestedValue = suggestedValue.trim().slice(0, 2000);
  if (typeof observedConfidence === 'number') entry.observedConfidence = observedConfidence;

  const feedbackPath = resolve(docsDir, 'feedback.jsonl');
  mkdirSync(dirname(feedbackPath), { recursive: true });
  appendFileSync(feedbackPath, JSON.stringify(entry) + '\n', 'utf-8');

  return `Feedback recorded for \`${safeChunkId}\`${fieldName ? ` (field: \`${fieldName}\`)` : ''}. Stored in \`.docs/feedback.jsonl\`.`;
}
