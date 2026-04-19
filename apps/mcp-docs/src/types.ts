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
};

export type IndexData = {
  lastIndexed: string;
  chunks: Record<string, ChunkEntry>;
  fileMap: Record<string, string[]>;
};
