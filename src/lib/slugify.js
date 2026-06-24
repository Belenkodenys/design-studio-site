const CYRILLIC_MAP = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo',
  ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  і: 'i', ї: 'yi', є: 'ye', ґ: 'g',
}

function transliterate(input) {
  return input
    .toLowerCase()
    .split('')
    .map((ch) => (CYRILLIC_MAP[ch] !== undefined ? CYRILLIC_MAP[ch] : ch))
    .join('')
}

export function slugify(input) {
  if (!input) return ''
  return transliterate(String(input))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
