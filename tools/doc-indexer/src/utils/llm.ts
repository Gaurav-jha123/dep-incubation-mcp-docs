/**
 * LLM wrapper — currently using Groq (OpenAI-compatible API).
 * Swap this file for another LLM provider — the exported interface stays identical.
 *
 * If GROQ_API_KEY is not set or USE_TEMPLATE_FALLBACK=true, falls back to
 * a static template generator (useful when no API key is available).
 */

import type { EndpointMeta } from '../parser.js';

function templateDoc(meta: EndpointMeta): string {
  const paramsTable =
    meta.params.length > 0
      ? meta.params
          .map((p) => `| \`${p.name}\` | \`${p.type}\` | ${p.source} |`)
          .join('\n')
      : '| — | — | — |';

  const businessLogic =
    meta.serviceMethods.length > 0
      ? meta.serviceMethods
          .map((sm) => {
            const db =
              sm.prismaCalls.length > 0
                ? `Calls \`${sm.prismaCalls.join('\`, \`')}\``
                : 'No direct DB calls';
            const throws =
              sm.throws.length > 0
                ? ` May throw: ${sm.throws.join(', ')}.`
                : '';
            return `\`${sm.methodName}()\` — ${db}.${throws}`;
          })
          .join(' ')
      : 'No service methods inferred.';

  const authLines: string[] = [];
  if (meta.guards.length > 0) authLines.push(`**Guards:** ${meta.guards.join(', ')}`);
  if (meta.roles.length > 0) authLines.push(`**Required roles:** ${meta.roles.join(', ')}`);
  const authSection = authLines.length > 0 ? `\n### Auth\n${authLines.join('\n')}\n` : '';

  const errorsSection =
    meta.apiResponses.filter((r) => r.status >= 400).length > 0
      ? `\n### Errors\n| Status | Description |\n|--------|-------------|\n` +
        meta.apiResponses
          .filter((r) => r.status >= 400)
          .map((r) => `| ${r.status} | ${r.description} |`)
          .join('\n') + '\n'
      : '';

  const whatItDoes = meta.apiSummary
    ?? `Handles \`${meta.method} ${meta.path}\` requests via \`${meta.handlerName}\`.${meta.jsdoc ? ' ' + meta.jsdoc : ''}`;

  const successResponse = meta.apiResponses.find((r) => r.status < 400);
  const responseDesc = successResponse ? successResponse.description : `\`${meta.returnType}\``;

  return `## ${meta.method} ${meta.path}
**Module:** ${meta.module}

### What it does
${whatItDoes}

### Request
| Param | Type | Source |
|-------|------|--------|
${paramsTable}

### Response
${responseDesc}

### Business Logic
${businessLogic}
${authSection}${errorsSection}### Notes
Requires JWT authentication. See module guards for role requirements.
`;
}

export async function generateDoc(prompt: string, meta?: EndpointMeta): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const useFallback = process.env.USE_TEMPLATE_FALLBACK === 'true' || !apiKey;

  if (useFallback) {
    if (!meta) throw new Error('meta required for template fallback');
    return templateDoc(meta);
  }

  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Groq API error: ${response.status} ${response.statusText}\n${body}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };

  return data.choices[0].message.content;
}
