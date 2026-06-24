import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

// Check authentication
async function isAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (!session?.value) return false
  try {
    const decoded = Buffer.from(session.value, 'base64').toString()
    return decoded.startsWith('admin:')
  } catch {
    return false
  }
}

// GET all posts
export async function GET() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all post keys
    const keys = await kv.keys('blog:post:*')
    const posts = []

    for (const key of keys) {
      const post = await kv.get(key)
      if (post) {
        posts.push(post)
      }
    }

    // Sort by createdAt descending
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

// POST create new post
export async function POST(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    const post = {
      id,
      slug: data.slug || id,
      status: data.status || 'draft',
      category: data.category || 'Design',
      imageUrl: data.imageUrl || '',
      createdAt: now,
      updatedAt: now,
      publishedAt: data.status === 'published' ? now : null,
      translations: {
        en: { title: data.title_en || '', content: data.content_en || '', excerpt: data.excerpt_en || '' },
        uk: { title: data.title_uk || '', content: data.content_uk || '', excerpt: data.excerpt_uk || '' },
        ru: { title: data.title_ru || '', content: data.content_ru || '', excerpt: data.excerpt_ru || '' },
        es: { title: data.title_es || '', content: data.content_es || '', excerpt: data.excerpt_es || '' }
      }
    }

    await kv.set(`blog:post:${id}`, post)

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
