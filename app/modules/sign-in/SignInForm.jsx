'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { SIGN_IN_DATA } from '@/app/constants/sign-in/constants'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await axios.post('/api/auth/sign-in', { email, password })
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">{SIGN_IN_DATA.title}</h1>
          <p className="text-[#475569] mt-2">{SIGN_IN_DATA.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              {SIGN_IN_DATA.emailLabel}
            </label>
            <Input
              type="email"
              placeholder={SIGN_IN_DATA.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              {SIGN_IN_DATA.passwordLabel}
            </label>
            <Input
              type="password"
              placeholder={SIGN_IN_DATA.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-[#0F172A] text-white rounded-md text-sm font-medium hover:bg-[#0F172A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : SIGN_IN_DATA.submitButton}
          </button>
        </form>

        <p className="text-center text-sm text-[#475569] mt-6">
          {SIGN_IN_DATA.noAccount}{' '}
          <Link href="/sign-up" className="text-[#0F172A] font-medium hover:underline">
            {SIGN_IN_DATA.signUpLink}
          </Link>
        </p>
      </div>
    </div>
  )
}
