import { sendLeadToTelegram } from '../../src/server/telegramLead.mjs';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Method not allowed.' }),
    };
  }

  try {
    const payload = event.body ? JSON.parse(event.body) : {};
    const result = await sendLeadToTelegram(payload);

    return {
      statusCode: result.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: result.ok,
        error: result.ok ? undefined : result.error,
      }),
    };
  } catch {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Failed to send lead.' }),
    };
  }
}
