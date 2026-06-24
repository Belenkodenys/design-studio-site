import Redis from 'ioredis'
import { Resend } from 'resend'

// Create Redis client
function getRedis() {
  if (!process.env.REDIS_URL) {
    return null
  }
  return new Redis(process.env.REDIS_URL)
}

// Create Resend client
function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

// Send email notification
async function sendEmailNotification(brief) {
  console.log('Starting email notification, RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY)

  const resend = getResend()
  if (!resend) {
    console.log('Resend not configured, skipping email notification')
    return { success: false, error: 'Resend not configured' }
  }

  try {
    const emailHtml = `
      <h2>Новый бриф от ${brief.name}</h2>

      <h3>Контактная информация</h3>
      <ul>
        <li><strong>Имя:</strong> ${brief.name}</li>
        <li><strong>Email:</strong> ${brief.email}</li>
        <li><strong>Телефон:</strong> ${brief.phone}</li>
        ${brief.company ? `<li><strong>Компания:</strong> ${brief.company}</li>` : ''}
      </ul>

      <h3>Информация о проекте</h3>
      <ul>
        <li><strong>Тип проекта:</strong> ${brief.projectType}</li>
        <li><strong>Город:</strong> ${brief.city}</li>
        ${brief.projectName ? `<li><strong>Название проекта:</strong> ${brief.projectName}</li>` : ''}
        ${brief.address ? `<li><strong>Адрес:</strong> ${brief.address}</li>` : ''}
        ${brief.area ? `<li><strong>Площадь:</strong> ${brief.area} м²</li>` : ''}
      </ul>

      ${brief.concept ? `<h3>Концепция</h3><p>${brief.concept}</p>` : ''}
      ${brief.targetAudience ? `<h3>Целевая аудитория</h3><p>${brief.targetAudience}</p>` : ''}
      ${brief.competitors ? `<h3>Конкуренты / Вдохновение</h3><p>${brief.competitors}</p>` : ''}
      ${brief.references ? `<h3>Визуальные референсы</h3><p>${brief.references}</p>` : ''}

      <h3>Бюджет и сроки</h3>
      <ul>
        ${brief.budget ? `<li><strong>Бюджет:</strong> ${brief.budget}</li>` : ''}
        ${brief.timeline ? `<li><strong>Сроки:</strong> ${brief.timeline}</li>` : ''}
        ${brief.startDate ? `<li><strong>Дата начала:</strong> ${brief.startDate}</li>` : ''}
      </ul>

      ${brief.additionalInfo ? `<h3>Дополнительно</h3><p>${brief.additionalInfo}</p>` : ''}

      <hr>
      <p><small>ID брифа: ${brief.id}<br>Отправлено: ${new Date(brief.submittedAt).toLocaleString('ru-RU')}<br>Язык формы: ${brief.language?.toUpperCase()}</small></p>
      <p><a href="https://www.belenko.design/admin/briefs">Открыть в админке</a></p>
    `

    const result = await resend.emails.send({
      from: 'Belenko Studio <noreply@belenko.design>',
      to: ['studiobelenko@gmail.com', 'office@belenko.design'],
      subject: `Новый бриф: ${brief.projectType} в ${brief.city} от ${brief.name}`,
      html: emailHtml
    })

    console.log('Email notification result:', JSON.stringify(result))
    return { success: true, result }
  } catch (error) {
    console.error('Failed to send email notification:', error.message, error)
    return { success: false, error: error.message }
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let redis = null
    try {
      redis = getRedis()
      if (!redis) {
        console.error('Redis not configured')
        return res.status(500).json({ error: 'Database not configured' })
      }

      const {
        name,
        company,
        email,
        phone,
        projectType,
        projectName,
        city,
        address,
        area,
        concept,
        targetAudience,
        competitors,
        references,
        budget,
        timeline,
        startDate,
        additionalInfo,
        language
      } = req.body

      // Generate unique ID for the brief
      const id = `brief_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const submittedAt = new Date().toISOString()

      // Create brief object
      const brief = {
        id,
        name,
        company: company || '',
        email,
        phone,
        projectType,
        projectName: projectName || '',
        city,
        address: address || '',
        area: area || '',
        concept: concept || '',
        targetAudience: targetAudience || '',
        competitors: competitors || '',
        references: references || '',
        budget: budget || '',
        timeline: timeline || '',
        startDate: startDate || '',
        additionalInfo: additionalInfo || '',
        language: language || 'en',
        submittedAt,
        status: 'new'
      }

      // Save to Redis
      await redis.set(`brief:${id}`, JSON.stringify(brief))

      // Add to briefs list for easy retrieval
      await redis.lpush('briefs:list', id)

      redis.disconnect()

      // Send email notification (must await in serverless)
      await sendEmailNotification(brief)

      return res.status(200).json({ success: true, id })
    } catch (error) {
      console.error('Brief API error:', error.message)
      if (redis) redis.disconnect()
      return res.status(500).json({ error: error.message || 'Internal server error' })
    }
  }

  if (req.method === 'GET') {
    let redis = null
    try {
      redis = getRedis()
      if (!redis) {
        return res.status(200).json({ briefs: [], error: 'Database not configured' })
      }

      // Get all brief IDs
      const briefIds = await redis.lrange('briefs:list', 0, -1)

      if (!briefIds || briefIds.length === 0) {
        redis.disconnect()
        return res.status(200).json({ briefs: [] })
      }

      // Get all briefs
      const briefs = []
      for (const id of briefIds) {
        const briefData = await redis.get(`brief:${id}`)
        if (briefData) {
          briefs.push(JSON.parse(briefData))
        }
      }

      // Sort by date (newest first)
      briefs.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

      redis.disconnect()
      return res.status(200).json({ briefs })
    } catch (error) {
      console.error('Brief GET error:', error.message)
      if (redis) redis.disconnect()
      return res.status(500).json({ error: error.message || 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
