import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Redis from 'ioredis';

function getRedis() {
  if (!process.env.REDIS_URL) {
    return null;
  }
  return new Redis(process.env.REDIS_URL);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let redis = null;
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!passwordHash) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const isValid = await bcrypt.compare(password, passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionData = {
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    // Store session in Redis
    redis = getRedis();
    if (redis) {
      await redis.set(
        `session:${sessionToken}`,
        JSON.stringify(sessionData),
        'EX',
        7 * 24 * 60 * 60 // 7 days in seconds
      );
      redis.disconnect();
    }

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', [
      `admin_session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    if (redis) redis.disconnect();
    return res.status(500).json({ error: 'Internal server error' });
  }
}
