/**
 * Schema-parser snapshot tests.
 * Run: pnpm --filter doc-indexer test
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseSchema, renderModelDoc, renderEnumDoc } from './schema-parser.js';

const SCHEMA_PATH = '../../apps/api/prisma/schema.prisma';

describe('parseSchema', () => {
  const schema = parseSchema(SCHEMA_PATH);

  it('parses 6 models', () => {
    assert.equal(schema.models.length, 6);
  });

  it('parses 4 enums', () => {
    assert.equal(schema.enums.length, 4);
  });

  it('model names match expected set', () => {
    const names = new Set(schema.models.map(m => m.name));
    for (const expected of ['User', 'Topic', 'Project', 'ProjectAssignment', 'SkillMatrix', 'SubTopic']) {
      assert.ok(names.has(expected), `model "${expected}" not found`);
    }
  });

  it('enum names match expected set', () => {
    const names = new Set(schema.enums.map(e => e.name));
    for (const expected of ['Role', 'ProjectType', 'ProjectStatus', 'AssignmentStatus']) {
      assert.ok(names.has(expected), `enum "${expected}" not found`);
    }
  });

  describe('Project model', () => {
    const model = schema.models.find(m => m.name === 'Project')!;

    it('is found', () => assert.ok(model));
    it('dbTable is "projects"', () => assert.equal(model.dbTable, 'projects'));

    it('type and status fields are NOT relations (enum reclassification fix)', () => {
      const typeField = model.fields.find(f => f.name === 'type');
      const statusField = model.fields.find(f => f.name === 'status');
      assert.ok(typeField, '"type" field not found');
      assert.ok(statusField, '"status" field not found');
      assert.equal(typeField.isRelation, false, '"type" should be non-relation (enum)');
      assert.equal(statusField.isRelation, false, '"status" should be non-relation (enum)');
    });

    it('assignments field IS a relation', () => {
      const f = model.fields.find(f => f.name === 'assignments');
      assert.ok(f, '"assignments" field not found');
      assert.equal(f.isRelation, true);
    });
  });

  describe('ProjectAssignment model', () => {
    const model = schema.models.find(m => m.name === 'ProjectAssignment')!;

    it('has unique constraint on userId + projectId', () => {
      assert.ok(
        model.uniqueConstraints.some(c => c.includes('userId') && c.includes('projectId')),
        'expected unique constraint on userId+projectId',
      );
    });
  });

  describe('renderModelDoc', () => {
    const model = schema.models.find(m => m.name === 'Project')!;
    const doc = renderModelDoc(model);

    it('contains model heading', () => {
      assert.ok(doc.includes('## Model: Project'));
    });

    it('contains Fields table header', () => {
      assert.ok(doc.includes('### Fields'));
    });

    it('does NOT list enum fields in Relations section', () => {
      // "type" and "status" are enums — should not appear as relations
      const relSection = doc.split('### Relations')[1] ?? '';
      assert.ok(!relSection.includes('`type`'), '"type" should not be in Relations');
      assert.ok(!relSection.includes('`status`'), '"status" should not be in Relations');
    });
  });

  describe('renderEnumDoc', () => {
    const en = schema.enums.find(e => e.name === 'AssignmentStatus')!;
    const doc = renderEnumDoc(en);

    it('contains enum heading', () => {
      assert.ok(doc.includes('## Enum: AssignmentStatus'));
    });

    it('contains all enum values', () => {
      for (const val of ['PROPOSED', 'PRESELECTED', 'BOOKED', 'ASSIGNED', 'ONBOARDED']) {
        assert.ok(doc.includes(val), `value "${val}" missing`);
      }
    });
  });
});
