import { blogPosts } from '../../data/blogPosts'
import { listBlogPosts } from '../../lib/storage'
import { adaptAdminPost } from '../../lib/blog-adapter'
import BlogListingClient from './BlogListingClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog — Interior Design Insights | Belenko Design',
  description: 'Expert insights on restaurant, bar, and hospitality interior design. Tips on lighting, materials, color psychology, and trends from Belenko Design Studio.',
  keywords: ['interior design blog', 'restaurant design tips', 'bar design', 'hospitality design', 'lighting design', 'color psychology'],
  authors: [{ name: 'Denis Belenko' }],
  creator: 'Belenko Design Studio',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://www.belenko.design/blog',
  },
  openGraph: {
    title: 'Blog — Interior Design Insights | Belenko Design',
    description: 'Expert insights on restaurant, bar, and hospitality interior design from Belenko Design Studio.',
    images: ['/hero-bg.jpg'],
    type: 'website',
  }
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.belenko.design/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.belenko.design/blog" }
  ]
}

export default async function BlogPage() {
  let adminPosts = []
  try {
    const raw = await listBlogPosts()
    adminPosts = raw.filter(p => p.published).map(adaptAdminPost)
  } catch (e) {
    console.error('Failed to load admin blog posts:', e)
  }
  const allPosts = [...adminPosts, ...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogListingClient posts={allPosts} />
    </>
  )
}
