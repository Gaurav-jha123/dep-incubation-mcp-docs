import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/**
 * Compute a sha256 fingerprint from the contents of one or more source files.
 * Files that cannot be read are silently skipped.
 */
export function computeFingerprint(sourceFiles: string[]): string {
  const hash = createHash('sha256');
  for (const file of sourceFiles) {
    try {
      hash.update(readFileSync(file, 'utf-8'));
    } catch {
      // file not readable — skip
    }
  }
  return hash.digest('hex');
}
