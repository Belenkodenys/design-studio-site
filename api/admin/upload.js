import { put } from '@vercel/blob';
import { verifySession } from './verify.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify authentication
  const isAuthenticated = await verifySession(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const contentType = req.headers['content-type'] || '';

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.some(type => contentType.includes(type))) {
      return res.status(400).json({ error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' });
    }

    // Get filename from query or generate one
    const filename = req.query.filename || `image-${Date.now()}.jpg`;

    // Read body as buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Check file size (5MB limit)
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large. Maximum size: 5MB' });
    }

    // Upload to Vercel Blob
    const blob = await put(`blog/${filename}`, buffer, {
      access: 'public',
      contentType: contentType.split(';')[0]
    });

    return res.status(200).json({
      url: blob.url,
      filename: filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
