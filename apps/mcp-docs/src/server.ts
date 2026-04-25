import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listModules } from './tools/list-modules.js';
import { getDoc } from './tools/get-doc.js';
import { searchDocs } from './tools/search-docs.js';
import { getSchema } from './tools/get-schema.js';
import { getImpact } from './tools/get-impact.js';
import { reportIssue } from './tools/report-issue.js';

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
      'Get the full markdown doc for a specific endpoint. ' +
      'Accepts: (1) a chunkId like "projects__id__GET", ' +
      '(2) a module name like "projects" to get all endpoints in that module, or ' +
      '(3) "METHOD /path" like "GET /projects/:id" for direct lookup.',
    inputSchema: {
      type: 'object',
      properties: {
        chunkId: {
          type: 'string',
          description:
            'A chunkId (e.g. "projects__id__GET"), a module name (e.g. "projects"), or "METHOD /path" (e.g. "GET /projects/:id").',
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
  {
    name: 'get_schema',
    description:
      'Get the Prisma model or enum definition as a markdown doc. ' +
      'Pass a model/enum name (e.g. "Project", "ProjectType") to get its fields and relations. ' +
      'Omit the name to list all available models and enums.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Model or enum name (e.g. "Project", "Role"). Omit to list all.',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_impact',
    description:
      'List all endpoints that access a given Prisma model. ' +
      'Pass a model name (e.g. "Project") to see which endpoints read or write to it. ' +
      'Omit the name to list all tracked models with endpoint counts. ' +
      'Useful for impact analysis before changing a schema model.',
    inputSchema: {
      type: 'object',
      properties: {
        model: {
          type: 'string',
          description: 'Prisma model name (e.g. "Project"). Omit to list all models.',
        },
      },
      required: [],
    },
  },
  {
    name: 'report_issue',
    description:
      'Report an inaccuracy or missing information in a doc chunk. ' +
      'Feedback is stored server-side for maintainers to review. ' +
      'Provide the chunkId (e.g. "projects__id__GET") and a short issue description.',
    inputSchema: {
      type: 'object',
      properties: {
        chunkId: {
          type: 'string',
          description: 'The chunk ID to report an issue for.',
        },
        issue: {
          type: 'string',
          description: 'A short description of the inaccuracy or gap.',
        },
      },
      required: ['chunkId', 'issue'],
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
        } else if (name === 'get_schema') {
          text = getSchema(DOCS_DIR, args['name'] as string | undefined);
        } else if (name === 'get_impact') {
          text = getImpact(DOCS_DIR, args['model'] as string | undefined);
        } else if (name === 'report_issue') {
          text = reportIssue(
            DOCS_DIR,
            args['chunkId'] as string,
            args['issue'] as string,
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

    // API key auth — check MCP_API_KEY env var if set
    const requiredKey = process.env.MCP_API_KEY;
    if (requiredKey) {
      const authHeader = (req.headers['authorization'] as string | undefined) ?? '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
      let diff = token.length !== requiredKey.length ? 1 : 0;
      for (let i = 0; i < Math.min(token.length, requiredKey.length); i++) {
        diff |= token.charCodeAt(i) ^ requiredKey.charCodeAt(i);
      }
      if (diff !== 0) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: { code: -32600, message: 'Unauthorized' },
          }),
        );
        return;
      }
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
