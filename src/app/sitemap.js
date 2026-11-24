import { projects } from '../data/projects'
import { blogPosts } from '../data/blogPosts'
import { listBlogPosts } from '../lib/storage'
import { gallery as brandingGallery } from './branding/gallery'
import residentialPages from '../data/residentialSitemap.json'

const BASE = 'https://www.belenko.design'

export const revalidate = 3600

// Pictures on the home page: hero slides and the covers of the project films.
const HOME_IMAGES = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => `/belenko-studio-hero-${n}.jpg`),
  ...['intro-poster', 'pixi-poster2', 'agata-poster2', 'video3-poster', 'saint-poster2', 'monkeys2-poster3', 'cent-aura-poster', 'nikos-poster2'].map(
    (n) => `/projects/belenko-interior-design-${n}-2x.webp`
  )
]

// Dynamic sitemap: every project, service package, service page and blog
// post is listed automatically, so new work is discoverable by Google, Bing
// and the AI crawlers (GPTBot, ClaudeBot, PerplexityBot …) as soon as it ships.
export default async function sitemap() {
  const now = new Date()

  const staticPages = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0, images: HOME_IMAGES.map((i) => `${BASE}${i}`) },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/projects`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/contact`, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${BASE}/branding`, changeFrequency: 'monthly', priority: 0.8, images: brandingGallery.map((g) => `${BASE}${g.src}`) },
    { url: `${BASE}/studio`, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/career`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/florida`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/california-hospitality-design`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/llms.txt`, changeFrequency: 'monthly', priority: 0.3 }
  ]

  const servicePages = [
    'restaurant-design', 'bar-design', 'cafe-design', 'hotel-design',
    'concept-positioning', 'architecture', 'interior-design', 'decor-furniture',
    'branding', 'creative-content', 'author-supervision'
  ].map((s) => ({ url: `${BASE}/services/${s}`, changeFrequency: 'monthly', priority: 0.7 }))

  // /tesla and the /clients/proposal/* packages are noindex (client-only pages), so they are not listed here.

  // Every project page lists its photos (Google Image sitemap extension), so
  // the pictures are indexed with the page context — venue type, city, studio.
  const projectPages = projects.map((p) => ({
    url: `${BASE}/project/${p.id}`,
    lastModified: p.year ? new Date(`${p.year}-01-01`) : undefined,
    changeFrequency: 'yearly',
    priority: 0.8,
    images: (p.images || [p.image]).filter(Boolean).map((i) => `${BASE}${i}`)
  }))

  // Belenko Residential (static pages in public/residential); list built by scripts/residential-sitemap.mjs
  const residential = residentialPages.map((p) => ({
    url: `${BASE}${p.path}`,
    lastModified: new Date(p.lastModified),
    changeFrequency: p.path === '/residential' || p.path.endsWith('/journal') || p.path.endsWith('/projects') ? 'weekly' : 'monthly',
    priority: p.path === '/residential' ? 0.9 : p.path.includes('/projects/') ? 0.8 : 0.7,
    images: p.images.map((i) => `${BASE}${i}`)
  }))

  let adminPosts = []
  try {
    adminPosts = (await listBlogPosts()) || []
  } catch (_) {
    adminPosts = []
  }
  const blogPages = [
    ...blogPosts.map((p) => ({ url: `${BASE}/blog/${p.slug}`, changeFrequency: 'monthly', priority: 0.6 })),
    ...adminPosts
      .filter((p) => p && p.slug && p.status !== 'draft')
      .map((p) => ({
        url: `${BASE}/blog/${p.slug}`,
        lastModified: p.updatedAt || p.createdAt ? new Date(p.updatedAt || p.createdAt) : undefined,
        changeFrequency: 'monthly',
        priority: 0.6
      }))
  ]

  return [...staticPages, ...servicePages, ...projectPages, ...residential, ...blogPages]
}
