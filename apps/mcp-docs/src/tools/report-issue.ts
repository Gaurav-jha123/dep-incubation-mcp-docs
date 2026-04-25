import { appendFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

/**
 * Append a user-reported issue to .docs/feedback.jsonl.
 *
 * Each line in the JSONL file is a self-contained JSON record:
 * { "chunkId": "...", "issue": "...", "reportedAt": "ISO" }
 *
 * Returns a human-readable confirmation string.
 */
export function reportIssue(
  docsDir: string,
  chunkId: string,
  issue: string,
): string {
  if (!chunkId || !chunkId.trim()) {
    return 'Error: chunkId is required. Use list_modules or search_docs to find the right chunk.';
  }
  if (!issue || !issue.trim()) {
    return 'Error: issue description is required.';
  }

  // Sanitise inputs — no control characters
  const safeChunkId = chunkId.trim().replace(/[\r\n\t]/g, ' ').slice(0, 200);
  const safeIssue = issue.trim().replace(/[\r\n\t]/g, ' ').slice(0, 1000);

  const record = JSON.stringify({
    chunkId: safeChunkId,
    issue: safeIssue,
    reportedAt: new Date().toISOString(),
  });

  const feedbackPath = resolve(docsDir, 'feedback.jsonl');
  mkdirSync(dirname(feedbackPath), { recursive: true });
  appendFileSync(feedbackPath, record + '\n', 'utf-8');

  return `Issue recorded for \`${safeChunkId}\`. Thank you — feedback is stored in \`.docs/feedback.jsonl\`.`;
}
