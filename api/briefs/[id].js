import Redis from 'ioredis'

// Create Redis client
function getRedis() {
  if (!process.env.REDIS_URL) {
    return null
  }
  return new Redis(process.env.REDIS_URL)
}

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    let redis = null
    try {
      redis = getRedis()
      if (!redis) {
        return res.status(500).json({ error: 'Database not configured' })
      }

      const briefData = await redis.get(`brief:${id}`)
      redis.disconnect()

      if (!briefData) {
        return res.status(404).json({ error: 'Brief not found' })
      }

      return res.status(200).json(JSON.parse(briefData))
    } catch (error) {
      console.error('Brief GET error:', error.message)
      if (redis) redis.disconnect()
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'PATCH') {
    let redis = null
    try {
      const updates = req.body

      redis = getRedis()
      if (!redis) {
        return res.status(500).json({ error: 'Database not configured' })
      }

      // Get existing brief
      const existing = await redis.get(`brief:${id}`)
      if (!existing) {
        redis.disconnect()
        return res.status(404).json({ error: 'Brief not found' })
      }

      const brief = JSON.parse(existing)

      // Update the brief
      const updatedBrief = {
        ...brief,
        ...updates,
        updatedAt: new Date().toISOString()
      }

      await redis.set(`brief:${id}`, JSON.stringify(updatedBrief))
      redis.disconnect()

      return res.status(200).json(updatedBrief)
    } catch (error) {
      console.error('Brief PATCH error:', error.message)
      if (redis) redis.disconnect()
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'DELETE') {
    let redis = null
    try {
      redis = getRedis()
      if (!redis) {
        return res.status(500).json({ error: 'Database not configured' })
      }

      // Delete brief
      await redis.del(`brief:${id}`)

      // Remove from list
      await redis.lrem('briefs:list', 0, id)

      redis.disconnect()
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Brief DELETE error:', error.message)
      if (redis) redis.disconnect()
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
