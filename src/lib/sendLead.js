export async function sendLead(payload) {
  const response = await fetch('/api/send-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      page: window.location.href,
      createdAt: new Date().toISOString(),
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.ok) {
    throw new Error(result.error || 'Не удалось отправить заявку.');
  }

  return result;
}
