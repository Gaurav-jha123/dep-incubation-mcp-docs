# Phase 2 Implementation Plan

## Open Questions — Answered

1. **Fallback-to-source returns**: Extract handler + service layer only (not raw file). Raw TS is too noisy for agents; extract the controller method body + called service method bodies using ts-morph.
2. **Relationships stored**: In a separate `IndexData.relationships` map (not per-chunk). Enables fast graph queries without loading all chunks.
3. **Feedback storage**: File-based JSON log at `.docs/feedback.jsonl` — one JSON object per line. No database needed; maintainers can grep/cat it.
4. **Validation scope**: Run on semantic fields only (`summary`, `businessLogic`). Structural fields are AST-deterministic so validation adds no value there.

---

## Task Dependencies

```
#8 Validation (independent)
#4 Graph Relationships (independent)
  └─> extends modelMap already in IndexData
#5 Fallback-to-Source (depends on #4 for sourceFiles path resolution)
#9 Feedback Loop (independent)
```

**Parallel**: #8, #4, #9 can all start simultaneously.  
**Sequential**: #5 after #4 (needs sourceFiles from ChunkEntry).

---

## Implementation Order

```
Phase A (parallel): #8 + #4 + #9
Phase B (sequential): #5 (after #4)
```

---

## #8: Validation Layer

**Architecture**: Pure function `validateChunkData(chunk: ChunkData): ValidationResult` runs after LLM doc generation in indexer.ts, before writing `.json` file. No LLM calls — fast structural checks only.

**Data flow**:
```
generateDoc(prompt) → doc (markdown)
  → extractSummary/businessLogic (regex)
  → endpointMetaToChunkData(meta, summary, businessLogic)
  → validateChunkData(chunkData)          ← NEW
      if FAIL: log warning, use null for semantic fields
  → writeFileSync(jsonPath, ...)
```

**Validation rules** (semantic fields only):
- `summary.value`: non-null, string, 20–500 chars, no "TODO" or "[1-2 sentence" placeholder text
- `businessLogic.value`: non-null, string, 50–1000 chars, no placeholder text
- `summary.confidence`: number between 0 and 1
- Structural fields: skip (AST-sourced, always valid)

**On failure**: Log `WARN: chunk ${chunkId} failed validation: ${reason}` to stdout. Set invalid semantic field value to `null` and confidence to `0`. Never reject the chunk entirely — always write something.

**Files to create/modify**:
- `tools/doc-indexer/src/validator.ts` — NEW: `validateChunkData()` function
- `tools/doc-indexer/src/indexer.ts` — call validator after `endpointMetaToChunkData()`

---

## #4: Graph Relationships

**Architecture**: After all chunks are built, compute a `relationships` map from existing data (Prisma calls + guards + sourceFiles already parsed by AST). Store in `IndexData`.

**Relationship types**:
```typescript
type RelationshipType = 'mutates' | 'reads' | 'guards' | 'co-located';

type Relationship = {
  from: string;      // chunkId
  to: string;        // chunkId or model name
  type: RelationshipType;
  targetKind: 'chunk' | 'model' | 'guard';
};
```

**How to compute** (all from existing parsed data — no new AST passes):
- `mutates`: chunkId has Prisma calls with `create`, `update`, `upsert`, `delete` → model name
- `reads`: chunkId has Prisma calls with `findMany`, `findFirst`, `findUnique`, `count` → model name
- `guards`: chunkId has `@UseGuards(X)` → guard name (already in `meta.guards`)
- `co-located`: chunkId shares sourceFile with another chunkId (already in `fileMap`)

**Storage**: Add `relationships: Relationship[]` to `IndexData` type. Populated in `indexer.ts` after `computeRelatedChunks()`.

**Impact queries via MCP**: Extend existing `get_impact` tool to use `relationships` map for richer output (reads vs mutates distinction).

**Files to modify**:
- `tools/doc-indexer/src/parser.ts` — add `Relationship`, `RelationshipType` types; export from `IndexData`
- `tools/doc-indexer/src/indexer.ts` — add `computeRelationships()` function, call after chunk build loop
- `apps/mcp-docs/src/tools/get-impact.ts` — extend to show reads vs mutates

---

## #5: Fallback-to-Source

**Architecture**: New MCP tool `get_doc_source` — when agent sees `confidence < 0.65` on a chunk's semantic fields, it calls this tool to get extracted handler + service source code.

**Confidence threshold**: `0.65` — below this, LLM summary is unreliable enough to warrant reading source directly.

**Triggers**: Only `summary` and `businessLogic` fields. Structural fields never need fallback.

**What it returns**: Extracted TypeScript — not raw file. Use `sourceFiles` + `handlerLine` from ChunkEntry to:
1. Read the controller file
2. Extract handler method body (from `handlerLine`, scan until matching `}`)
3. Read the service file (same sourceFiles array, second entry if exists)
4. Extract called service method bodies (from `meta.serviceMethods[].methodName`)

**Caching**: No cache — read fresh each time. Source files change rarely; cache adds complexity with no real benefit here.

**Data flow**:
```
Agent calls search_docs → gets results with confidence scores
Agent sees confidence < 0.65 on a chunk
Agent calls get_doc_source(chunkId)
  → reads ChunkEntry.sourceFiles from index.json
  → uses ts-morph to extract handler + service methods
  → returns extracted source as string
Agent uses source to answer question directly
```

**Files to create/modify**:
- `apps/mcp-docs/src/tools/get-doc-source.ts` — NEW: `getDocSource(docsDir, repoRoot, chunkId): string`
- `apps/mcp-docs/src/server.ts` — import + register `get_doc_source` tool

**Note**: `repoRoot` resolved the same way as in server.ts (`__dirname → ../../../`).

---

## #9: Feedback Loop

**Architecture**: New MCP tool `report_feedback` (rename/extend existing `report_issue` which already writes to `.docs/issues.jsonl`). Store richer correction data.

**Storage**: `.docs/feedback.jsonl` — append-only, one JSON object per line.

**Schema per entry**:
```typescript
type FeedbackEntry = {
  timestamp: string;       // ISO
  chunkId: string;
  fieldName: string;       // e.g. 'summary', 'businessLogic'
  issue: string;           // free text from agent
  suggestedValue?: string; // optional corrected value
  observedConfidence: number; // what confidence was shown
};
```

**Retraining**: Manual — maintainers review `.docs/feedback.jsonl` and adjust hardcoded thresholds in `parser.ts`. No automatic learning (YAGNI).

**MCP exposure**: Extend existing `report_issue` tool to accept optional `fieldName`, `suggestedValue`, `observedConfidence` params. Write to `feedback.jsonl` instead of (or in addition to) `issues.jsonl`.

**Files to modify**:
- `apps/mcp-docs/src/tools/report-issue.ts` — add feedback params, write to `feedback.jsonl`
- `apps/mcp-docs/src/server.ts` — update tool schema with new optional params

---

## File Change Summary

| File | Change | Task |
|------|--------|------|
| `tools/doc-indexer/src/validator.ts` | NEW — validateChunkData() | #8 |
| `tools/doc-indexer/src/indexer.ts` | Call validator + computeRelationships() | #8 + #4 |
| `tools/doc-indexer/src/parser.ts` | Add Relationship types to IndexData | #4 |
| `apps/mcp-docs/src/tools/get-doc-source.ts` | NEW — extract handler+service source | #5 |
| `apps/mcp-docs/src/tools/get-impact.ts` | Extend with reads/mutates distinction | #4 |
| `apps/mcp-docs/src/tools/report-issue.ts` | Add feedback fields, write feedback.jsonl | #9 |
| `apps/mcp-docs/src/server.ts` | Register get_doc_source, update report_issue schema | #5 + #9 |

**Total**: 7 files (2 new, 5 modified). No new dependencies.

---

## Execution Order for Sonnet

1. `#8` — validator.ts (pure function, isolated, no deps)
2. `#4` — graph relationships (extends existing indexer loop)
3. `#9` — feedback loop (small change to report-issue)
4. `#5` — get-doc-source (depends on sourceFiles from #4 being reliable)

Commit after each. Build + lint check between tasks.
