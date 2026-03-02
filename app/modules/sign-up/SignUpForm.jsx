'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { SIGN_UP_DATA } from '@/app/constants/sign-up/constants'

export default function SignUpForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await axios.post('/api/auth/sign-up', { name, email, password })
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
          <h1 className="text-2xl font-bold text-[#0F172A]">{SIGN_UP_DATA.title}</h1>
          <p className="text-[#475569] mt-2">{SIGN_UP_DATA.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              {SIGN_UP_DATA.nameLabel}
            </label>
            <Input
              type="text"
              placeholder={SIGN_UP_DATA.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              {SIGN_UP_DATA.emailLabel}
            </label>
            <Input
              type="email"
              placeholder={SIGN_UP_DATA.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              {SIGN_UP_DATA.passwordLabel}
            </label>
            <Input
              type="password"
              placeholder={SIGN_UP_DATA.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
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
            {loading ? 'Creating account...' : SIGN_UP_DATA.submitButton}
          </button>
        </form>

        <p className="text-center text-sm text-[#475569] mt-6">
          {SIGN_UP_DATA.hasAccount}{' '}
          <Link href="/sign-in" className="text-[#0F172A] font-medium hover:underline">
            {SIGN_UP_DATA.signInLink}
          </Link>
        </p>
      </div>
    </div>
  )
}
