import { NextResponse } from 'next/server'
import { removeAuthCookie } from '@/lib/auth'

export async function POST() {
  try {
    await removeAuthCookie()
    return NextResponse.json({ message: 'Signed out' })
  } catch (error) {
    console.error('Sign-out error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
