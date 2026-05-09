export type ChunkEntry = {
  chunkId: string;
  module: string;
  method: string;
  path: string;
  fingerprint: string;
  sourceFiles: string[];
  docFile: string;
  lastUpdated: string;
  guards: string[];
  roles: string[];
  relatedChunks: string[];
  handlerLine: number;
  commitSha: string;
};

export type Relationship = {
  from: string;
  to: string;
  type: 'mutates' | 'reads' | 'guards' | 'co-located';
  targetKind: 'chunk' | 'model' | 'guard';
};

export type IndexData = {
  lastIndexed: string;
  chunks: Record<string, ChunkEntry>;
  fileMap: Record<string, string[]>;
  modelMap?: Record<string, string[]>;
  relationships?: Relationship[];
};
