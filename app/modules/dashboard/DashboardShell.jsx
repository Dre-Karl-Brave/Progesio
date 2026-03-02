'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { LogOut } from 'lucide-react'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'

export default function DashboardShell({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get('/api/auth/me').then((res) => setUser(res.data.user)).catch(() => {})
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
          <span className="text-lg font-bold text-[#0F172A]">
            {DASHBOARD_DATA.shell.logoText}
          </span>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-[#475569]">{user.name || user.email}</span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            >
              <LogOut size={16} />
              {DASHBOARD_DATA.shell.logoutButton}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}
