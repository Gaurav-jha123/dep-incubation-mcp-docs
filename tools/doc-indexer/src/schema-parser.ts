/**
 * Regex-based Prisma schema parser.
 * No external deps — parses models and enums from schema.prisma
 * and generates markdown chunks for each.
 *
 * Intentionally kept simple: handles the patterns present in this
 * codebase. Extend as needed when schema patterns change.
 */

import { readFileSync } from 'node:fs';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SchemaFieldMeta = {
  name: string;
  type: string;       // e.g. "Int", "String", "ProjectType", "ProjectAssignment[]"
  optional: boolean;  // trailing ?
  isRelation: boolean;
  attributes: string[]; // e.g. ["@id", "@default(autoincrement())", "@unique"]
};

export type SchemaModelMeta = {
  kind: 'model';
  name: string;
  dbTable: string | null;   // from @@map("...")
  fields: SchemaFieldMeta[];
  uniqueConstraints: string[][]; // from @@unique([...])
  indices: string[][];           // from @@index([...])
};

export type SchemaEnumMeta = {
  kind: 'enum';
  name: string;
  values: string[];
};

export type SchemaMeta = SchemaModelMeta | SchemaEnumMeta;

export type ParsedSchema = {
  models: SchemaModelMeta[];
  enums: SchemaEnumMeta[];
};

// ---------------------------------------------------------------------------
// Scalar Prisma types (used to distinguish scalars from relations)
// ---------------------------------------------------------------------------

const PRISMA_SCALARS = new Set([
  'String', 'Boolean', 'Int', 'BigInt', 'Float', 'Decimal',
  'DateTime', 'Json', 'Bytes',
]);

function isScalarType(baseType: string): boolean {
  return PRISMA_SCALARS.has(baseType);
}

// ---------------------------------------------------------------------------
// Block extractor — splits schema text into named blocks
// ---------------------------------------------------------------------------

type RawBlock = { keyword: 'model' | 'enum'; name: string; body: string };

function extractBlocks(schema: string): RawBlock[] {
  const blocks: RawBlock[] = [];
  // Match: model Foo { ... } or enum Foo { ... } (possibly multiline)
  const blockRegex = /^(model|enum)\s+(\w+)\s*\{([^}]*)\}/gm;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(schema)) !== null) {
    blocks.push({
      keyword: match[1] as 'model' | 'enum',
      name: match[2],
      body: match[3],
    });
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Field parser
// ---------------------------------------------------------------------------

/**
 * Parse a single field line like:
 *   id        Int      @id @default(autoincrement())
 *   email     String   @unique
 *   clientName  String?  @map("client_name")
 *   assignments ProjectAssignment[]
 */
function parseFieldLine(line: string): SchemaFieldMeta | null {
  // Skip blank lines, comments, and block attributes (@@...)
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) return null;

  // name  type  [...attributes]
  // The type can include ? and []
  const match = trimmed.match(/^(\w+)\s+([\w]+)(\[\])?(\?)?(.*)$/);
  if (!match) return null;

  const name = match[1];
  const baseType = match[2];
  const isArray = !!match[3];
  const optional = !!match[4];
  const rest = (match[5] ?? '').trim();

  const type = `${baseType}${isArray ? '[]' : ''}${optional ? '?' : ''}`;
  const isRelation = !isScalarType(baseType);

  // Collect all attributes as individual tokens from the rest of the line.
  // Split on whitespace runs that precede a '@', keeping the full attr text
  // (including nested parens like @default(autoincrement())).
  const attributes: string[] = [];
  // Use a simple scan: collect runs starting with @
  let i = 0;
  while (i < rest.length) {
    if (rest[i] === '@') {
      let j = i + 1;
      let depth = 0;
      while (j < rest.length) {
        if (rest[j] === '(') depth++;
        else if (rest[j] === ')') {
          depth--;
          if (depth < 0) break;
        } else if (rest[j] === ' ' && depth === 0) break;
        j++;
      }
      attributes.push(rest.slice(i, j));
      i = j;
    } else {
      i++;
    }
  }

  return { name, type, optional, isRelation, attributes };
}

// ---------------------------------------------------------------------------
// Block attribute parsers (@@map, @@unique, @@index)
// ---------------------------------------------------------------------------

function extractDbTable(body: string): string | null {
  const m = body.match(/@@map\s*\(\s*["']([^"']+)["']\s*\)/);
  return m ? m[1] : null;
}

function extractMultiFieldConstraints(body: string, directive: string): string[][] {
  const result: string[][] = [];
  const regex = new RegExp(`@@${directive}\\s*\\(\\[([^\\]]+)\\]`, 'g');
  let m: RegExpExecArray | null;
  while ((m = regex.exec(body)) !== null) {
    const fields = m[1].split(',').map((f) => f.trim().replace(/['"]/g, ''));
    result.push(fields);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Model parser
// ---------------------------------------------------------------------------

function parseModel(name: string, body: string): SchemaModelMeta {
  const fields: SchemaFieldMeta[] = [];

  for (const line of body.split('\n')) {
    const field = parseFieldLine(line);
    if (field) fields.push(field);
  }

  return {
    kind: 'model',
    name,
    dbTable: extractDbTable(body),
    fields,
    uniqueConstraints: extractMultiFieldConstraints(body, 'unique'),
    indices: extractMultiFieldConstraints(body, 'index'),
  };
}

// ---------------------------------------------------------------------------
// Enum parser
// ---------------------------------------------------------------------------

function parseEnum(name: string, body: string): SchemaEnumMeta {
  const values = body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//') && /^\w+$/.test(l));

  return { kind: 'enum', name, values };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function parseSchema(schemaPath: string): ParsedSchema {
  const text = readFileSync(schemaPath, 'utf-8');
  const blocks = extractBlocks(text);

  // First pass: collect enum names so they can be treated as scalars in models
  const enumNames = new Set<string>();
  const enums: SchemaEnumMeta[] = [];
  for (const block of blocks) {
    if (block.keyword === 'enum') {
      const en = parseEnum(block.name, block.body);
      enums.push(en);
      enumNames.add(block.name);
    }
  }

  // Second pass: parse models, classifying enum-typed fields as non-relations
  const models: SchemaModelMeta[] = [];
  for (const block of blocks) {
    if (block.keyword === 'model') {
      const model = parseModel(block.name, block.body);
      // Reclassify any field whose base type is a known enum
      for (const field of model.fields) {
        const baseType = field.type.replace(/[\[\]?]/g, '');
        if (enumNames.has(baseType)) {
          field.isRelation = false;
        }
      }
      models.push(model);
    }
  }

  return { models, enums };
}

// ---------------------------------------------------------------------------
// Markdown renderers
// ---------------------------------------------------------------------------

export function renderModelDoc(model: SchemaModelMeta): string {
  const scalarFields = model.fields.filter((f) => !f.isRelation);
  const relationFields = model.fields.filter((f) => f.isRelation);

  const fieldRows = scalarFields
    .map((f) => {
      const attrs = f.attributes.join(' ');
      return `| \`${f.name}\` | \`${f.type}\` | ${f.optional ? 'Yes' : 'No'} | ${attrs || '—'} |`;
    })
    .join('\n');

  const relationsSection =
    relationFields.length > 0
      ? `\n### Relations\n` +
        relationFields
          .map((f) => `- \`${f.name}\` → \`${f.type}\``)
          .join('\n') +
        '\n'
      : '';

  const constraintsLines: string[] = [];
  for (const uc of model.uniqueConstraints) {
    constraintsLines.push(`- Unique: \`${uc.join(', ')}\``);
  }
  for (const idx of model.indices) {
    constraintsLines.push(`- Index: \`${idx.join(', ')}\``);
  }
  const constraintsSection =
    constraintsLines.length > 0
      ? `\n### Constraints & Indexes\n${constraintsLines.join('\n')}\n`
      : '';

  const tableNote = model.dbTable ? `\n**DB Table:** \`${model.dbTable}\`` : '';

  return `## Model: ${model.name}${tableNote}

### Fields
| Field | Type | Optional | Attributes |
|-------|------|----------|------------|
${fieldRows || '| — | — | — | — |'}
${relationsSection}${constraintsSection}`;
}

export function renderEnumDoc(en: SchemaEnumMeta): string {
  const rows = en.values.map((v) => `| \`${v}\` |`).join('\n');

  return `## Enum: ${en.name}

| Value |
|-------|
${rows}
`;
}
