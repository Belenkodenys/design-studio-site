import { getBlogPost, getAllBlogSlugs } from '../../../data/blogPosts'
import { projects } from '../../../data/projects'
import { getBlogPost as getAdminBlogPost } from '../../../lib/storage'
import { adaptAdminPost } from '../../../lib/blog-adapter'
import BlogPostClient from './BlogPostClient'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({
    slug: slug,
  }))
}

async function loadPost(slug) {
  const staticPost = getBlogPost(slug)
  if (staticPost) return staticPost
  try {
    const adminPost = await getAdminBlogPost(slug)
    if (adminPost && adminPost.published) return adaptAdminPost(adminPost)
  } catch (e) {
    console.error('Failed to load admin post:', e)
  }
  return null
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await loadPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found | Belenko Design',
    }
  }

  const title = post.title.en
  const description = post.excerpt.en

  return {
    title: `${title} | Belenko Design Blog`,
    description: description,
    authors: [{ name: 'Denis Belenko' }],
    keywords: ['interior design', 'restaurant design', 'bar design', 'hospitality design', post.category],
    creator: 'Belenko Design Studio',
    robots: 'index, follow',
    alternates: {
      canonical: `https://www.belenko.design/blog/${slug}`,
    },
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: `https://www.belenko.design${post.image}`,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [`https://www.belenko.design${post.image}`],
    },
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await loadPost(slug)

  if (!post) {
    return <div>Post not found</div>
  }

  const relatedProjectsData = post.relatedProjects
    ? post.relatedProjects.map(id => projects.find(p => p.id === id)).filter(Boolean)
    : []

  const postTitle = typeof post.title === 'string' ? post.title : (post.title.en || slug)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.belenko.design/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.belenko.design/blog" },
      { "@type": "ListItem", "position": 3, "name": postTitle, "item": `https://www.belenko.design/blog/${slug}` }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPostClient post={post} relatedProjects={relatedProjectsData} />
    </>
  )
}
