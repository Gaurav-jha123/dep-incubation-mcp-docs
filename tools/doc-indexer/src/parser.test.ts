/**
 * Parser snapshot tests — use Node.js built-in test runner (no external deps).
 * Run: pnpm --filter doc-indexer test
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseControllers } from './parser.js';

const CONTROLLERS_PATH = '../../apps/api/src';

describe('parseControllers', () => {
  // Parse once; all tests share the same result
  const endpoints = parseControllers(CONTROLLERS_PATH);

  it('returns 29 endpoints', () => {
    assert.equal(endpoints.length, 29);
  });

  it('every endpoint has required scalar fields', () => {
    for (const ep of endpoints) {
      assert.ok(ep.chunkId, `missing chunkId on ${ep.method} ${ep.path}`);
      assert.ok(ep.module, `missing module on ${ep.chunkId}`);
      assert.ok(ep.method, `missing method on ${ep.chunkId}`);
      assert.ok(ep.path, `missing path on ${ep.chunkId}`);
      assert.ok(ep.handlerName, `missing handlerName on ${ep.chunkId}`);
      assert.ok(ep.fingerprint, `missing fingerprint on ${ep.chunkId}`);
      assert.ok(ep.sourceFiles.length > 0, `empty sourceFiles on ${ep.chunkId}`);
    }
  });

  it('confidence scores are in 0–100 range', () => {
    for (const ep of endpoints) {
      assert.ok(
        ep.confidenceScore >= 0 && ep.confidenceScore <= 100,
        `confidenceScore ${ep.confidenceScore} out of range on ${ep.chunkId}`,
      );
    }
  });

  it('operationType is one of the allowed values', () => {
    const allowed = new Set(['read', 'write', 'mixed', 'unknown']);
    for (const ep of endpoints) {
      assert.ok(
        allowed.has(ep.operationType),
        `unexpected operationType "${ep.operationType}" on ${ep.chunkId}`,
      );
    }
  });

  describe('POST /projects', () => {
    const ep = endpoints.find(e => e.chunkId === 'projects__root__POST')!;

    it('is found', () => assert.ok(ep));
    it('operationType is mixed (create + findMany)', () => assert.equal(ep.operationType, 'mixed'));
    it('confidenceScore is 100 (all 6 criteria met)', () => assert.equal(ep.confidenceScore, 100));
    it('dtoFields has CreateProjectDto', () => {
      assert.ok(Object.keys(ep.dtoFields).includes('CreateProjectDto'));
    });
    it('CreateProjectDto has "code" field', () => {
      const fields = ep.dtoFields['CreateProjectDto'] ?? [];
      const code = fields.find(f => f.name === 'code');
      assert.ok(code, 'field "code" not found');
      assert.equal(code.type, 'string');
      assert.equal(code.optional, false);
    });
  });

  describe('GET /projects', () => {
    const ep = endpoints.find(e => e.chunkId === 'projects__root__GET')!;

    it('is found', () => assert.ok(ep));
    it('operationType is read', () => assert.equal(ep.operationType, 'read'));
    it('dtoFields is empty (no body param)', () => {
      assert.equal(Object.keys(ep.dtoFields).length, 0);
    });
  });

  describe('POST /auth/login', () => {
    const ep = endpoints.find(e => e.chunkId === 'auth__login__POST')!;

    it('is found', () => assert.ok(ep));
    it('operationType is read (findUnique)', () => assert.equal(ep.operationType, 'read'));
    it('has no guards (public endpoint)', () => assert.equal(ep.guards.length, 0));
  });

  describe('guards & roles extraction', () => {
    it('protected endpoints carry JwtAuthGuard', () => {
      const protectedEps = endpoints.filter(ep => ep.guards.includes('JwtAuthGuard'));
      assert.ok(protectedEps.length > 0, 'expected at least one guarded endpoint');
    });
  });

  describe('Swagger metadata', () => {
    it('apiSummary is non-null on endpoints that have @ApiOperation', () => {
      const withSummary = endpoints.filter(ep => ep.apiSummary !== null);
      assert.ok(withSummary.length > 0, 'expected at least one endpoint with apiSummary');
    });
  });
});
