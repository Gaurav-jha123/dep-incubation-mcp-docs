/**
 * Confidence scoring unit tests.
 * Tests computeConfidenceScore and classifyOperationType in isolation.
 * Run: pnpm --filter doc-indexer test
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { classifyOperationType, computeConfidenceScore } from './parser.js';
import type { ServiceMethodMeta, ApiResponseMeta, DtoFieldMeta, ConfidenceInput } from './parser.js';

// ── helpers ──────────────────────────────────────────────────────────────────

function makeService(prismaCalls: string[]): ServiceMethodMeta {
  return {
    methodName: 'testMethod',
    prismaCalls,
    throws: [],
    hasTransaction: false,
  };
}

function makeParam(source: 'body' | 'param' | 'query') {
  return { name: 'p', type: 'string', source } as const;
}

function makeResponse(status: number): ApiResponseMeta {
  return { status, description: 'ok' };
}

// ── classifyOperationType ─────────────────────────────────────────────────────

describe('classifyOperationType', () => {
  it('read — only findMany', () => {
    assert.equal(classifyOperationType([makeService(['project.findMany'])]), 'read');
  });

  it('write — only create', () => {
    assert.equal(classifyOperationType([makeService(['project.create'])]), 'write');
  });

  it('mixed — create + findMany', () => {
    assert.equal(
      classifyOperationType([makeService(['project.create', 'project.findMany'])]),
      'mixed',
    );
  });

  it('unknown — no Prisma calls', () => {
    assert.equal(classifyOperationType([makeService([])]), 'unknown');
  });

  it('unknown — empty service methods', () => {
    assert.equal(classifyOperationType([]), 'unknown');
  });

  it('write — delete call', () => {
    assert.equal(classifyOperationType([makeService(['user.delete'])]), 'write');
  });

  it('read — count call', () => {
    assert.equal(classifyOperationType([makeService(['topic.count'])]), 'read');
  });

  it('mixed — across multiple service methods', () => {
    assert.equal(
      classifyOperationType([
        makeService(['skillMatrix.findMany']),
        makeService(['skillMatrix.update']),
      ]),
      'mixed',
    );
  });
});

// ── computeConfidenceScore ────────────────────────────────────────────────────

describe('computeConfidenceScore', () => {
  it('0 — nothing present', () => {
    const input: ConfidenceInput = {
      apiSummary: null,
      apiResponses: [],
      serviceMethods: [],
      params: [],
      guards: [],
      dtoFields: {},
    };
    assert.equal(computeConfidenceScore(input), 0);
  });

  it('100 — all criteria met', () => {
    const dtoFields: Record<string, DtoFieldMeta[]> = {
      CreateDto: [{ name: 'x', type: 'string', optional: false, validators: [], example: null }],
    };
    const input: ConfidenceInput = {
      apiSummary: 'Creates a project',
      apiResponses: [makeResponse(201)],
      serviceMethods: [makeService(['project.create'])],
      params: [makeParam('body')],
      guards: ['JwtAuthGuard'],
      dtoFields,
    };
    assert.equal(computeConfidenceScore(input), 100);
  });

  it('+20 for apiSummary only', () => {
    const input: ConfidenceInput = { apiSummary: 'hello', apiResponses: [], serviceMethods: [], params: [], guards: [], dtoFields: {} };
    assert.equal(computeConfidenceScore(input), 20);
  });

  it('+20 for apiResponses≥1', () => {
    const input: ConfidenceInput = { apiSummary: null, apiResponses: [makeResponse(200)], serviceMethods: [], params: [], guards: [], dtoFields: {} };
    assert.equal(computeConfidenceScore(input), 20);
  });

  it('+20 for serviceMethod with Prisma calls', () => {
    const input: ConfidenceInput = { apiSummary: null, apiResponses: [], serviceMethods: [makeService(['user.findUnique'])], params: [], guards: [], dtoFields: {} };
    assert.equal(computeConfidenceScore(input), 20);
  });

  it('+20 for params≥1', () => {
    const input: ConfidenceInput = { apiSummary: null, apiResponses: [], serviceMethods: [], params: [makeParam('query')], guards: [], dtoFields: {} };
    assert.equal(computeConfidenceScore(input), 20);
  });

  it('+10 for guards≥1', () => {
    const input: ConfidenceInput = { apiSummary: null, apiResponses: [], serviceMethods: [], params: [], guards: ['JwtAuthGuard'], dtoFields: {} };
    assert.equal(computeConfidenceScore(input), 10);
  });

  it('+10 for dtoFields≥1', () => {
    const dtoFields: Record<string, DtoFieldMeta[]> = {
      Dto: [{ name: 'x', type: 'string', optional: false, validators: [], example: null }],
    };
    const input: ConfidenceInput = { apiSummary: null, apiResponses: [], serviceMethods: [], params: [], guards: [], dtoFields };
    assert.equal(computeConfidenceScore(input), 10);
  });

  it('never exceeds 100', () => {
    const dtoFields: Record<string, DtoFieldMeta[]> = {
      A: [{ name: 'x', type: 'string', optional: false, validators: [], example: null }],
      B: [{ name: 'y', type: 'string', optional: false, validators: [], example: null }],
    };
    const input: ConfidenceInput = {
      apiSummary: 'summary',
      apiResponses: [makeResponse(200), makeResponse(400)],
      serviceMethods: [makeService(['p.create']), makeService(['p.findMany'])],
      params: [makeParam('body'), makeParam('param')],
      guards: ['JwtAuthGuard', 'RolesGuard'],
      dtoFields,
    };
    const score = computeConfidenceScore(input);
    assert.ok(score <= 100, `score ${score} exceeds 100`);
  });
});
