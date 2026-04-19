import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleRpc } from '../src/server.js';

type JsonRpcRequest = {
  jsonrpc: '2.0';
  id: number | string | null;
  method: string;
  params?: Record<string, unknown>;
};

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
