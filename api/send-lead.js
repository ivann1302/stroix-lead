import { sendLeadToTelegram } from '../src/server/telegramLead.mjs';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ ok: false, error: 'Method not allowed.' });
    return;
  }

  try {
    const payload = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const result = await sendLeadToTelegram(payload);

    response.status(result.status).json({
      ok: result.ok,
      error: result.ok ? undefined : result.error,
    });
  } catch {
    response.status(500).json({ ok: false, error: 'Failed to send lead.' });
  }
}
