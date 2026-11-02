import { projects } from '../data/projects'
import { blogPosts } from '../data/blogPosts'
import { sections } from './clients/proposal/sections'
import { listBlogPosts } from '../lib/storage'

const BASE = 'https://www.belenko.design'

export const revalidate = 3600

// Dynamic sitemap: every project, service package, service page and blog
// post is listed automatically, so new work is discoverable by Google, Bing
// and the AI crawlers (GPTBot, ClaudeBot, PerplexityBot …) as soon as it ships.
export default async function sitemap() {
  const now = new Date()

  const staticPages = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/studio`, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/career`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/florida`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/california-hospitality-design`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/tesla`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/llms.txt`, changeFrequency: 'monthly', priority: 0.3 }
  ]

  const servicePages = [
    'restaurant-design', 'bar-design', 'cafe-design', 'hotel-design',
    'concept-positioning', 'architecture', 'interior-design', 'decor-furniture',
    'branding', 'creative-content', 'author-supervision'
  ].map((s) => ({ url: `${BASE}/services/${s}`, changeFrequency: 'monthly', priority: 0.7 }))

  const packagePages = sections.map((s) => ({
    url: `${BASE}/clients/proposal/${s.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7
  }))

  const projectPages = projects.map((p) => ({
    url: `${BASE}/project/${p.id}`,
    lastModified: p.year ? new Date(`${p.year}-01-01`) : undefined,
    changeFrequency: 'yearly',
    priority: 0.8
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

  return [...staticPages, ...servicePages, ...packagePages, ...projectPages, ...blogPages]
}
