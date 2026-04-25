import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleRpc } from '../src/server.js';

type JsonRpcRequest = {
  jsonrpc: '2.0';
  id: number | string | null;
  method: string;
  params?: Record<string, unknown>;
};

/**
 * Check the Authorization header against the MCP_API_KEY env var.
 * Returns true if auth passes or if no key is configured (dev mode).
 */
function isAuthorized(req: IncomingMessage): boolean {
  const requiredKey = process.env.MCP_API_KEY;
  if (!requiredKey) return true; // no key configured → open (dev mode)

  const authHeader = req.headers['authorization'] ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  // Constant-time comparison to prevent timing attacks
  if (token.length !== requiredKey.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ requiredKey.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Vercel serverless function entry point.
 *
 * Vercel automatically parses JSON request bodies, so `req` has a `body`
 * property already populated when Content-Type is application/json.
 */
export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  if (!isAuthorized(req)) {
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

  try {
    let body: JsonRpcRequest;

    if (req.body !== undefined) {
      // Body already parsed by Vercel runtime
      body = req.body as JsonRpcRequest;
    } else {
      // Manual body parsing (local / non-Vercel environments)
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk as Buffer);
      }
      body = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as JsonRpcRequest;
    }

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
}
