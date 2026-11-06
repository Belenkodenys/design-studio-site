import { projects } from '../../../../data/projects'

// RSS 2.0 feeds for Pinterest auto-publish (Settings → Bulk create Pins →
// Auto-publish). One feed per project (/feeds/pinterest/project-42.xml) and
// one per venue type (/feeds/pinterest/restaurants.xml …). Each item is one
// photo: Pinterest turns it into a Pin with the title, description and link.
export const dynamic = 'force-static'

const BASE = 'https://www.belenko.design'

const KW = {
  restaurant: ['Restaurant interior design', 'Restaurant design ideas', 'Restaurant decor', 'Hospitality interior design', 'Commercial interior design', 'Restaurant lighting design', 'Restaurant bar design', 'Modern restaurant interior'],
  bar: ['Bar interior design', 'Bar design ideas', 'Cocktail bar interior', 'Hospitality interior design', 'Bar lighting design', 'Pub interior design', 'Lounge bar design', 'Commercial interior design'],
  cafe: ['Cafe interior design', 'Coffee shop design', 'Cafe design ideas', 'Bakery interior design', 'Hospitality interior design', 'Small cafe interior', 'Cafe decor', 'Commercial interior design'],
  hotel: ['Hotel interior design', 'Hotel lobby design', 'Boutique hotel interior', 'Hospitality interior design', 'Hotel restaurant design', 'Hotel room design', 'Resort interior design', 'Commercial interior design'],
  residential: ['Apartment interior design', 'Residential interior design', 'Living room design', 'Modern apartment design', 'Interior design ideas', 'Kitchen design', 'Bedroom interior design', 'Mediterranean apartment']
}
const kind = (c = '') => {
  c = c.toLowerCase()
  if (c.includes('bar')) return 'bar'
  if (c.includes('cafe') || c.includes('coffee')) return 'cafe'
  if (c.includes('hotel') || c.includes('resort')) return 'hotel'
  if (c.includes('apart') || c.includes('resid')) return 'residential'
  return 'restaurant'
}
const COLLECTIONS = { restaurants: 'restaurant', bars: 'bar', cafes: 'cafe', hotels: 'hotel', apartments: 'residential' }

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function itemsFor(p, limit) {
  const k = kind(p.category)
  const city = (p.location || '').split(',')[0].trim()
  const imgs = (p.images && p.images.length ? p.images : [p.image]).filter(Boolean).slice(0, limit || 999)
  const services = (p.services || []).join(', ')
  // Oldest first is published first, so spread dates backwards from the project year.
  const base = Date.UTC(Number(p.year) || 2020, 5, 1)
  return imgs.map((img, i) => {
    const phrase = KW[k][i % KW[k].length]
    const title = `${phrase} — ${p.title}, ${city}${i ? ` · ${i + 1}` : ''}`
    let text = `${phrase}: ${p.title}, ${(p.category || 'restaurant').toLowerCase()} in ${p.location}${p.year ? ` (${p.year})` : ''}. ${p.description || ''} Designed by Belenko Design Studio, Barcelona — ${services || 'concept and interior design'}. 250 restaurants, bars and hotels in 27 years. #${k}design #interiordesign #hospitalitydesign #belenkodesign`
    if (text.length > 490) text = text.slice(0, 420).replace(/\s[^.]*$/, '') + ` Belenko Design Studio, Barcelona. #${k}design #interiordesign #hospitalitydesign #belenkodesign`
    const url = `${BASE}${img}`
    const slug = `${slugify(p.title)}-${i + 1}`
    return `    <item>
      <title>${esc(title)}</title>
      <link>${BASE}/?pin=${slug}</link>
      <guid isPermaLink="false">belenko-pin-${slug}</guid>
      <pubDate>${new Date(base + i * 3600 * 1000).toUTCString()}</pubDate>
      <description>${esc(`<img src="${url}" alt="${esc(title)}" /><p>${text}</p>`)}</description>
      <enclosure url="${url}" type="image/webp" />
      <media:content url="${url}" medium="image" />
    </item>`
  })
}

export function generateStaticParams() {
  return [
    ...projects.map((p) => ({ slug: `project-${p.id}.xml` })),
    ...Object.keys(COLLECTIONS).map((c) => ({ slug: `${c}.xml` }))
  ]
}

export async function GET(_req, { params }) {
  const { slug } = await params
  const name = slug.replace(/\.xml$/, '')
  let title, items
  if (name.startsWith('project-')) {
    const p = projects.find((x) => String(x.id) === name.slice(8))
    if (!p) return new Response('Not found', { status: 404 })
    const city = (p.location || '').split(',')[0].trim()
    title = `${KW[kind(p.category)][0]} — ${p.title}, ${city}`
    items = itemsFor(p)
  } else if (COLLECTIONS[name]) {
    const k = COLLECTIONS[name]
    title = `${KW[k][0]} ideas by Belenko Design Studio`
    items = projects.filter((p) => kind(p.category) === k).flatMap((p) => itemsFor(p, 6))
  } else {
    return new Response('Not found', { status: 404 })
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(title)}</title>
    <link>${BASE}/</link>
    <description>${esc(title)} — Belenko Design Studio, Barcelona. Hospitality interior design: restaurants, bars, cafes and hotels.</description>
    <language>en</language>
    <atom:link href="${BASE}/feeds/pinterest/${slug}" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}
