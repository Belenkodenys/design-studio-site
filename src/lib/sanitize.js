export function sanitizeHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/\s+style="[^"]*"/gi, '')
    .replace(/\s+style='[^']*'/gi, '')
    .replace(/\s+class="[^"]*"/gi, '')
    .replace(/\s+class='[^']*'/gi, '')
    .replace(/<font\b[^>]*>/gi, '')
    .replace(/<\/font>/gi, '')
    .replace(/<o:p\b[^>]*>.*?<\/o:p>/gis, '');
}

export function sanitizeTranslations(translations) {
  if (!translations || typeof translations !== 'object') return translations;
  const out = {};
  for (const [lang, tr] of Object.entries(translations)) {
    if (!tr || typeof tr !== 'object') continue;
    out[lang] = { ...tr, content: sanitizeHtml(tr.content) };
  }
  return out;
}
