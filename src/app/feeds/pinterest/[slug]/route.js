import { projects } from '../../../../data/projects'
import { pinterestCopy } from '../../../../data/pinterestCopy'

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

// Open questions invite comments; one closes each description.
const ASK = {
  restaurant: ['Which table would you choose?', 'What detail would you take for your own restaurant?', 'Would you book a table here?'],
  bar: ['Bar counter or a corner table?', 'What would you order here?', 'Which detail makes this bar for you?'],
  cafe: ['Window seat or counter?', 'Would this be your morning coffee spot?', 'What detail would you borrow for your own cafe?'],
  hotel: ['Would you stay here?', 'Which detail would you take home?', 'Sea view or courtyard?'],
  residential: ['Which room would you move into?', 'What would you change?', 'Which detail would you take for your own home?']
}
const NOUN = { restaurant: 'restaurant', bar: 'bar', cafe: 'cafe', hotel: 'hotel', residential: 'apartment' }
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
// Mid-sentence form of a style: lower-case unless it starts with a proper adjective.
const mid = (s) => (/^(Greek|French|Italian|Japanese|Parisian|Brooklyn|Scandinavian|Baroque)/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1))

// Title = what people search for + what makes this venue different + its name.
// Features describe the venue as a whole, so every photo of it can carry them.
function pinText(p, i) {
  const k = kind(p.category)
  const city = (p.location || '').split(',')[0].trim()
  const copy = pinterestCopy[p.id] || { style: cap(NOUN[k]), features: [] }
  const leads = [...new Set([`${copy.style} interior design`, `${copy.style} design ideas`, ...KW[k]])]
  const lead = leads[i % leads.length]
  const feature = copy.features.length ? copy.features[i % copy.features.length] : ''
  let title = `${lead}${feature ? ` · ${feature}` : ''} | ${p.title}, ${city}`
  if (title.length > 100) title = `${lead} | ${p.title}, ${city}`
  const services = (p.services || []).join(', ').toLowerCase() || 'concept and interior design'
  const intro = `${lead}: ${p.title}, ${mid(copy.style)} in ${p.location}${p.year ? ` (${p.year})` : ''}${feature ? ` — ${feature}` : ''}.`
  const tail = `By Belenko Design Studio, Barcelona: ${services}. ${ASK[k][i % ASK[k].length]} See the full project on belenko.design.`
  let body = (p.description || '').split('\n')[0].trim()
  const room = 480 - intro.length - tail.length - 2
  if (body.length > room) body = room > 60 ? body.slice(0, room).replace(/[\s,;:—-]+[^\s]*$/, '') + '…' : ''
  const text = [intro, body, tail].filter(Boolean).join(' ')
  const alt = `${p.title} — ${mid(copy.style)} in ${p.location}, interior photo ${i + 1}${feature ? `: ${feature}` : ''}. Interior design by Belenko Design Studio`
  return { title, text, alt }
}

function itemsFor(p, limit) {
  const imgs = (p.images && p.images.length ? p.images : [p.image]).filter(Boolean).slice(0, limit || 999)
  // Oldest first is published first, so spread dates backwards from the project year.
  const base = Date.UTC(Number(p.year) || 2020, 5, 1)
  return imgs.map((img, i) => {
    const { title, text, alt } = pinText(p, i)
    const url = `${BASE}${img}`
    const slug = `${slugify(p.title)}-${i + 1}`
    // Each Pin opens its own project page (not the homepage); the guid stays as it
    // was so Pinterest does not treat already published photos as new ones.
    const link = `${BASE}/project/${p.id}?utm_source=pinterest&utm_medium=social&utm_content=${slug}`
    return `    <item>
      <title>${esc(title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="false">belenko-pin-${slug}</guid>
      <pubDate>${new Date(base + i * 3600 * 1000).toUTCString()}</pubDate>
      <description>${esc(`<img src="${url}" alt="${esc(alt)}" /><p>${text}</p>`)}</description>
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
    const copy = pinterestCopy[p.id]
    title = `${copy ? `${copy.style} interior design` : KW[kind(p.category)][0]} — ${p.title}, ${city}`
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
