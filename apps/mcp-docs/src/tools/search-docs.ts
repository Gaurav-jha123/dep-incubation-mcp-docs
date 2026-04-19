import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { IndexData } from '../types.js';

export type SearchResult = {
  chunkId: string;
  module: string;
  method: string;
  path: string;
  score: number;
};

// ---------------------------------------------------------------------------
// Synonym map — expands query tokens to related terms
// ---------------------------------------------------------------------------
const SYNONYMS: Record<string, string[]> = {
  auth: ['authentication', 'login', 'signup', 'logout', 'token', 'jwt'],
  authentication: ['auth', 'login', 'token', 'jwt'],
  login: ['auth', 'signin', 'authenticate'],
  logout: ['auth', 'signout'],
  signup: ['register', 'create', 'auth'],
  user: ['users', 'profile', 'account'],
  users: ['user', 'profile', 'account'],
  project: ['projects'],
  projects: ['project'],
  skill: ['skills', 'skill-matrix', 'matrix', 'topic'],
  skills: ['skill', 'skill-matrix', 'matrix'],
  topic: ['topics', 'skill', 'category'],
  topics: ['topic', 'skill'],
  subtopic: ['sub-topics', 'subtopics', 'sub_topic'],
  delete: ['remove', 'destroy'],
  create: ['add', 'new', 'post'],
  update: ['edit', 'patch', 'put', 'modify'],
  get: ['fetch', 'list', 'find', 'retrieve'],
  list: ['get', 'all', 'fetch'],
  assign: ['assignments', 'assigned'],
  assignments: ['assign', 'members', 'users'],
};

function expandTokens(tokens: string[]): string[] {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    const synonyms = SYNONYMS[token];
    if (synonyms) {
      for (const s of synonyms) expanded.add(s);
    }
  }
  return [...expanded];
}

// ---------------------------------------------------------------------------
// TF-IDF scoring
// Each chunk is treated as a "document" with weighted fields.
// Field weights: path > module > method > chunkId
// ---------------------------------------------------------------------------

type ChunkCorpusEntry = {
  chunkId: string;
  module: string;
  method: string;
  path: string;
  // pre-tokenized weighted term frequency map
  tf: Map<string, number>;
};

function tokenize(text: string): string[] {
  // Split PascalCase/camelCase before lowercasing so e.g. ConflictException → conflict + exception
  const expanded = text.replace(/([a-z])([A-Z])/g, '$1 $2');
  return expanded
    .toLowerCase()
    .split(/[\s/_\-.:,`|#*]+/)
    .filter((t) => t.length > 1);
}

function buildTf(
  entry: { chunkId: string; module: string; method: string; path: string },
  docContent: string,
): Map<string, number> {
  const tf = new Map<string, number>();

  // Field weights: path > module > method > chunkId > doc content
  const fields: [string, number][] = [
    [entry.path, 4],
    [entry.module, 3],
    [entry.method, 2],
    [entry.chunkId, 1],
    [docContent, 1],   // Fix 2: doc body as low-weight searchable field
  ];

  for (const [text, weight] of fields) {
    for (const token of tokenize(text)) {
      tf.set(token, (tf.get(token) ?? 0) + weight);
    }
  }

  return tf;
}

function computeIdf(corpus: ChunkCorpusEntry[], token: string): number {
  const docsWithToken = corpus.filter((doc) => doc.tf.has(token)).length;
  if (docsWithToken === 0) return 0;
  // log(N / df) + 1 (smooth IDF)
  return Math.log(corpus.length / docsWithToken) + 1;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function searchDocs(docsDir: string, query: string): SearchResult[] {
  const raw = readFileSync(resolve(docsDir, 'index.json'), 'utf-8');
  const index = JSON.parse(raw) as IndexData;

  const rawTokens = tokenize(query);
  const queryTokens = expandTokens(rawTokens);

  const corpus: ChunkCorpusEntry[] = Object.values(index.chunks).map((entry) => {
    // Fix 2: load doc content for each chunk so body text is searchable
    let docContent = '';
    try {
      docContent = readFileSync(resolve(docsDir, 'chunks', `${entry.chunkId}.md`), 'utf-8');
    } catch {
      // chunk file missing — skip content
    }
    return {
      chunkId: entry.chunkId,
      module: entry.module,
      method: entry.method,
      path: entry.path,
      tf: buildTf(entry, docContent),
    };
  });

  // Pre-compute IDF for each query token
  const idfCache = new Map<string, number>();
  for (const token of queryTokens) {
    idfCache.set(token, computeIdf(corpus, token));
  }

  const scored = corpus.map((doc) => {
    let tfidfScore = 0;
    for (const token of queryTokens) {
      const tf = doc.tf.get(token) ?? 0;
      const idf = idfCache.get(token) ?? 0;
      tfidfScore += tf * idf;
    }

    return {
      chunkId: doc.chunkId,
      module: doc.module,
      method: doc.method,
      path: doc.path,
      score: Math.round(tfidfScore * 100) / 100,
    };
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
