import { kv } from '@vercel/kv';
import { verifySession } from '../verify.js';

export default async function handler(req, res) {
  // Verify authentication
  const isAuthenticated = await verifySession(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Post ID required' });
  }

  if (req.method === 'GET') {
    return handleGet(req, res, id);
  } else if (req.method === 'PUT') {
    return handlePut(req, res, id);
  } else if (req.method === 'DELETE') {
    return handleDelete(req, res, id);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req, res, id) {
  try {
    const post = await kv.get(`blog:post:${id}`);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.status(200).json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handlePut(req, res, id) {
  try {
    const existingPost = await kv.get(`blog:post:${id}`);

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { slug, status, category, imageUrl, translations } = req.body;

    // Check if slug changed and new slug already exists
    if (slug && slug !== existingPost.slug) {
      const existingSlug = await kv.get(`blog:slug:${slug}`);
      if (existingSlug && existingSlug !== id) {
        return res.status(400).json({ error: 'Slug already exists' });
      }

      // Delete old slug mapping
      await kv.del(`blog:slug:${existingPost.slug}`);

      // Create new slug mapping
      await kv.set(`blog:slug:${slug}`, id);
    }

    const now = new Date().toISOString();
    const wasPublished = existingPost.status === 'published';
    const isNowPublished = status === 'published';

    const updatedPost = {
      ...existingPost,
      slug: slug || existingPost.slug,
      status: status || existingPost.status,
      category: category !== undefined ? category : existingPost.category,
      imageUrl: imageUrl !== undefined ? imageUrl : existingPost.imageUrl,
      translations: translations || existingPost.translations,
      updatedAt: now,
      publishedAt: !wasPublished && isNowPublished ? now : existingPost.publishedAt
    };

    await kv.set(`blog:post:${id}`, updatedPost);

    return res.status(200).json({ post: updatedPost });
  } catch (error) {
    console.error('Update post error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleDelete(req, res, id) {
  try {
    const post = await kv.get(`blog:post:${id}`);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Delete post
    await kv.del(`blog:post:${id}`);

    // Remove from index
    await kv.srem('blog:posts:index', id);

    // Delete slug mapping
    if (post.slug) {
      await kv.del(`blog:slug:${post.slug}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
