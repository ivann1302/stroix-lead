const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

function cleanValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
  return cleanValue(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function formatLine(label, value) {
  const normalized = cleanValue(value);
  return normalized ? `<b>${label}:</b> ${escapeHtml(normalized)}` : '';
}

export function normalizeLeadPayload(payload = {}) {
  return {
    source: cleanValue(payload.source) || 'Форма сайта',
    name: cleanValue(payload.name),
    phone: cleanValue(payload.phone),
    comment: cleanValue(payload.comment),
    city: cleanValue(payload.city),
    lead_source: cleanValue(payload.lead_source),
    monthly_leads: cleanValue(payload.monthly_leads),
    min_order: cleanValue(payload.min_order),
    page: cleanValue(payload.page),
    createdAt: cleanValue(payload.createdAt) || new Date().toISOString(),
  };
}

export function validateLeadPayload(payload) {
  if (!payload.name && !payload.phone) {
    return 'Укажите имя или телефон.';
  }

  if (!payload.phone) {
    return 'Укажите телефон.';
  }

  return '';
}

export function formatLeadMessage(payload) {
  const lead = normalizeLeadPayload(payload);
  const rows = [
    '🔔 <b>Новая заявка с сайта</b>',
    formatLine('Источник', lead.source),
    formatLine('Имя', lead.name),
    formatLine('Телефон', lead.phone),
    formatLine('Комментарий', lead.comment),
    formatLine('Город', lead.city),
    formatLine('Заявки сейчас', lead.lead_source),
    formatLine('Заявок в месяц', lead.monthly_leads),
    formatLine('Минимальный заказ', lead.min_order),
    formatLine('Страница', lead.page),
    formatLine('Время', lead.createdAt),
  ];

  return rows.filter(Boolean).join('\n');
}

export async function sendLeadToTelegram(payload, env = process.env) {
  const botToken = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  const threadId = env.TELEGRAM_THREAD_ID;
  const normalizedPayload = normalizeLeadPayload(payload);
  const validationError = validateLeadPayload(normalizedPayload);

  if (validationError) {
    return { ok: false, status: 400, error: validationError };
  }

  if (!botToken || !chatId) {
    return {
      ok: false,
      status: 500,
      error: 'Telegram bot is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.',
    };
  }

  const response = await fetch(`${TELEGRAM_API_URL}${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatLeadMessage(normalizedPayload),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...(threadId ? { message_thread_id: threadId } : {}),
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    return {
      ok: false,
      status: 502,
      error: 'Telegram API request failed.',
      details,
    };
  }

  return { ok: true, status: 200 };
}
