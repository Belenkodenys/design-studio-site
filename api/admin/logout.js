import Redis from 'ioredis';

function getRedis() {
  if (!process.env.REDIS_URL) {
    return null;
  }
  return new Redis(process.env.REDIS_URL);
}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    cookies[name] = rest.join('=');
  });
  return cookies;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let redis = null;
  try {
    const cookies = parseCookies(req.headers.cookie);
    const sessionToken = cookies.admin_session;

    if (sessionToken) {
      // Delete session from Redis
      redis = getRedis();
      if (redis) {
        await redis.del(`session:${sessionToken}`);
        redis.disconnect();
      }
    }

    // Clear cookie
    res.setHeader('Set-Cookie', [
      'admin_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    if (redis) redis.disconnect();
    return res.status(500).json({ error: 'Internal server error' });
  }
}
