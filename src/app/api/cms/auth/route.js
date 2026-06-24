import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'belenko2024'

// POST - Login
export async function POST(request) {
  try {
    const { password } = await request.json()

    if (password === ADMIN_PASSWORD) {
      const sessionToken = Buffer.from(`admin:${Date.now()}`).toString('base64')

      const cookieStore = await cookies()
      cookieStore.set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE - Logout
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  return NextResponse.json({ success: true })
}

// GET - Verify session
export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')

  if (session?.value) {
    try {
      const decoded = Buffer.from(session.value, 'base64').toString()
      if (decoded.startsWith('admin:')) {
        return NextResponse.json({ authenticated: true })
      }
    } catch {
      // Invalid session
    }
  }

  return NextResponse.json({ authenticated: false }, { status: 401 })
}
