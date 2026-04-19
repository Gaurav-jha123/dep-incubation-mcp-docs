import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listModules } from './tools/list-modules.js';
import { getDoc } from './tools/get-doc.js';
import { searchDocs } from './tools/search-docs.js';

// ---------------------------------------------------------------------------
// Resolve .docs directory
// Env var DOCS_ROOT takes precedence; otherwise resolve relative to repo root.
// apps/mcp-docs/src/ → ../../.. → repo root
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '../../../');

export const DOCS_DIR: string = process.env.DOCS_ROOT
  ? resolve(process.env.DOCS_ROOT)
  : resolve(REPO_ROOT, '.docs');

// ---------------------------------------------------------------------------
// MCP tool schema definitions
// ---------------------------------------------------------------------------

export const TOOLS_SCHEMA = [
  {
    name: 'list_modules',
    description: 'List all API modules and their endpoint chunk IDs.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_doc',
    description:
      'Get the full markdown doc for a specific endpoint chunk, or all endpoints in a module at once. ' +
      'Pass a chunkId (e.g. "projects__id__GET") for a single endpoint, or a module name (e.g. "projects") to get all endpoints in that module concatenated.',
    inputSchema: {
      type: 'object',
      properties: {
        chunkId: {
          type: 'string',
          description:
            'A chunk ID (e.g. "projects__id__GET") or a module name (e.g. "projects") to fetch all endpoints in that module.',
        },
      },
      required: ['chunkId'],
    },
  },
  {
    name: 'search_docs',
    description:
      'Keyword-search across endpoint docs. Returns top-5 matching chunks.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Space-separated keywords to search for',
        },
      },
      required: ['query'],
    },
  },
] as const;

// ---------------------------------------------------------------------------
// JSON-RPC types
// ---------------------------------------------------------------------------

type JsonRpcRequest = {
  jsonrpc: '2.0';
  id: number | string | null;
  method: string;
  params?: Record<string, unknown>;
};

type JsonRpcResponse = {
  jsonrpc: '2.0';
  id: number | string | null;
  result?: unknown;
  error?: { code: number; message: string };
};

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

export async function handleRpc(
  body: JsonRpcRequest,
): Promise<JsonRpcResponse> {
  const { id, method, params } = body;

  try {
    switch (method) {
      case 'initialize':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: {
              name: 'dep-incubation-dashboard-docs',
              version: '1.0.0',
            },
          },
        };

      case 'tools/list':
        return {
          jsonrpc: '2.0',
          id,
          result: { tools: TOOLS_SCHEMA },
        };

      case 'tools/call': {
        const { name, arguments: args = {} } = params as {
          name: string;
          arguments?: Record<string, unknown>;
        };

        let text: string;

        if (name === 'list_modules') {
          text = JSON.stringify(listModules(DOCS_DIR), null, 2);
        } else if (name === 'get_doc') {
          text = getDoc(DOCS_DIR, args['chunkId'] as string);
        } else if (name === 'search_docs') {
          text = JSON.stringify(
            searchDocs(DOCS_DIR, args['query'] as string),
            null,
            2,
          );
        } else {
          throw new Error(`Unknown tool: ${name}`);
        }

        return {
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text }] },
        };
      }

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        };
    }
  } catch (err) {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32603,
        message: err instanceof Error ? err.message : 'Internal error',
      },
    };
  }
}

// ---------------------------------------------------------------------------
// Local HTTP server (for development / self-hosting)
// ---------------------------------------------------------------------------

const isMainModule =
  process.argv[1] &&
  (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/')) ||
    import.meta.url.includes('server.ts'));

if (isMainModule) {
  const { createServer } = await import('node:http');

  const port = Number(process.env.PORT ?? 3001);

  const server = createServer((req, res) => {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
      return;
    }

    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      void (async () => {
        try {
          const body = JSON.parse(
            Buffer.concat(chunks).toString('utf-8'),
          ) as JsonRpcRequest;
          const result = await handleRpc(body);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              jsonrpc: '2.0',
              id: null,
              error: { code: -32700, message: 'Parse error' },
            }),
          );
        }
      })();
    });
  });

  server.listen(port, () => {
    console.log(`MCP docs server listening on http://localhost:${port}`);
    console.log(`DOCS_DIR: ${DOCS_DIR}`);
  });
}
