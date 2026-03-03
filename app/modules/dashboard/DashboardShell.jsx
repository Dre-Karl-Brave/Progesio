'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { LogOut } from 'lucide-react'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'

export default function DashboardShell({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get('/api/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/sign-out')
    } catch {
      // ignore
    }
    window.location.href = '/sign-in'
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          {loading ? (
            <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-1">
              <div className="h-6 w-6 animate-pulse rounded-full bg-[#E5E7EB]"></div>
              <div className="h-4 w-24 animate-pulse rounded bg-[#E5E7EB]"></div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F172A] text-xs font-bold text-white">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-[#0F172A]">
                {user.name || user.email}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-[#0F172A]">
              {DASHBOARD_DATA.shell.logoText}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A] cursor-pointer"
          >
            <LogOut size={16} />
            {DASHBOARD_DATA.shell.logoutButton}
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}
