import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

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

export async function POST(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`blog/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
