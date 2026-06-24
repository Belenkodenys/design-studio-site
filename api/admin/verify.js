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

export async function verifySession(req) {
  const cookies = parseCookies(req.headers.cookie);
  const sessionToken = cookies.admin_session;

  if (!sessionToken) {
    return false;
  }

  let redis = null;
  try {
    redis = getRedis();
    if (!redis) {
      return false;
    }

    const sessionData = await redis.get(`session:${sessionToken}`);
    redis.disconnect();

    if (!sessionData) {
      return false;
    }

    const session = JSON.parse(sessionData);

    if (session.expiresAt < Date.now()) {
      // Session expired, delete it
      redis = getRedis();
      if (redis) {
        await redis.del(`session:${sessionToken}`);
        redis.disconnect();
      }
      return false;
    }

    return true;
  } catch (error) {
    console.error('Session verification error:', error);
    if (redis) redis.disconnect();
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const isValid = await verifySession(req);

    if (isValid) {
      return res.status(200).json({ authenticated: true });
    } else {
      return res.status(401).json({ authenticated: false });
    }
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
