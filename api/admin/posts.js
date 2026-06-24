import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';
import { verifySession } from './verify.js';

export default async function handler(req, res) {
  // Verify authentication
  const isAuthenticated = await verifySession(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'POST') {
    return handlePost(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req, res) {
  try {
    // Get all post IDs from the index
    const postIds = await kv.smembers('blog:posts:index') || [];

    if (postIds.length === 0) {
      return res.status(200).json({ posts: [] });
    }

    // Get all posts
    const posts = await Promise.all(
      postIds.map(async (id) => {
        const post = await kv.get(`blog:post:${id}`);
        return post;
      })
    );

    // Filter out nulls and sort by createdAt descending
    const validPosts = posts
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({ posts: validPosts });
  } catch (error) {
    console.error('Get posts error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handlePost(req, res) {
  try {
    const { slug, status, category, imageUrl, translations } = req.body;

    // Validate required fields
    if (!slug || !translations) {
      return res.status(400).json({ error: 'Slug and translations are required' });
    }

    // Check if slug already exists
    const existingSlug = await kv.get(`blog:slug:${slug}`);
    if (existingSlug) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    const post = {
      id,
      slug,
      status: status || 'draft',
      category: category || '',
      imageUrl: imageUrl || '',
      createdAt: now,
      updatedAt: now,
      publishedAt: status === 'published' ? now : null,
      translations: translations || {
        en: { title: '', content: '', excerpt: '' },
        ru: { title: '', content: '', excerpt: '' },
        uk: { title: '', content: '', excerpt: '' },
        es: { title: '', content: '', excerpt: '' }
      }
    };

    // Save post
    await kv.set(`blog:post:${id}`, post);

    // Add to posts index
    await kv.sadd('blog:posts:index', id);

    // Save slug mapping
    await kv.set(`blog:slug:${slug}`, id);

    return res.status(201).json({ post });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
