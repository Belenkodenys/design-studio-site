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

// GET single post
export async function GET(request, { params }) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const post = await kv.get(`blog:post:${id}`)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

// PUT update post
export async function PUT(request, { params }) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const data = await request.json()

    const existingPost = await kv.get(`blog:post:${id}`)
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const now = new Date().toISOString()
    const wasPublished = existingPost.status === 'published'
    const isNowPublished = data.status === 'published'

    const post = {
      ...existingPost,
      slug: data.slug || existingPost.slug,
      status: data.status || existingPost.status,
      category: data.category || existingPost.category,
      imageUrl: data.imageUrl || existingPost.imageUrl,
      updatedAt: now,
      publishedAt: !wasPublished && isNowPublished ? now : existingPost.publishedAt,
      translations: {
        en: {
          title: data.title_en ?? existingPost.translations.en.title,
          content: data.content_en ?? existingPost.translations.en.content,
          excerpt: data.excerpt_en ?? existingPost.translations.en.excerpt
        },
        uk: {
          title: data.title_uk ?? existingPost.translations.uk.title,
          content: data.content_uk ?? existingPost.translations.uk.content,
          excerpt: data.excerpt_uk ?? existingPost.translations.uk.excerpt
        },
        ru: {
          title: data.title_ru ?? existingPost.translations.ru.title,
          content: data.content_ru ?? existingPost.translations.ru.content,
          excerpt: data.excerpt_ru ?? existingPost.translations.ru.excerpt
        },
        es: {
          title: data.title_es ?? existingPost.translations.es.title,
          content: data.content_es ?? existingPost.translations.es.content,
          excerpt: data.excerpt_es ?? existingPost.translations.es.excerpt
        }
      }
    }

    await kv.set(`blog:post:${id}`, post)

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

// DELETE post
export async function DELETE(request, { params }) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await kv.del(`blog:post:${id}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
