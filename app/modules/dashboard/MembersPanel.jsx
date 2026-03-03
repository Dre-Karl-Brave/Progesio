'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { UserPlus, Crown, X } from 'lucide-react'
import { Tooltip } from '@mui/material'
import { getInitials } from '@/lib/utils'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
]

function getAvatarColor(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function MembersPanel({ members, isOwner, onAddClick, onRemoveMember }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleMemberClick = (userId) => {
    const params = new URLSearchParams(searchParams)
    const currentAssignee = params.get('assignee')

    if (currentAssignee === userId) {
      params.delete('assignee')
    } else {
      params.set('assignee', userId)
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.push(newUrl)
  }

  const isSelected = (userId) => {
    return searchParams.get('assignee') === userId
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {members.map((member) => (
          <Tooltip
            key={member.id}
            title={member.user.email}
            arrow
            placement="top"
          >
            <div
              onClick={() => handleMemberClick(member.user.id)}
              className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold text-white cursor-pointer transition-all hover:scale-105 ${
                isSelected(member.user.id)
                  ? 'border-[#0F172A] shadow-md'
                  : 'border-white'
              } ${getAvatarColor(member.user.id)}`}
            >
              {getInitials(member.user.name || member.user.email)}
              {member.role === 'owner' && (
                <Crown size={10} className="absolute -right-0.5 -top-0.5 text-yellow-400 drop-shadow" />
              )}
            </div>
          </Tooltip>
        ))}
      </div>

      {isOwner && (
        <button
          onClick={onAddClick}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-[#CBD5E1] text-[#475569] transition-colors hover:border-[#0F172A] hover:text-[#0F172A] hover:cursor-pointer"
          title={DASHBOARD_DATA.members.addButton}
        >
          <UserPlus size={14} />
        </button>
      )}
    </div>
  )
}

export function MembersList({ members, isOwner, onRemoveMember }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleMemberClick = (userId) => {
    const params = new URLSearchParams(searchParams)
    const currentAssignee = params.get('assignee')

    if (currentAssignee === userId) {
      params.delete('assignee')
    } else {
      params.set('assignee', userId)
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.push(newUrl)
  }

  const isSelected = (userId) => {
    return searchParams.get('assignee') === userId
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div
          key={member.id}
          className={`flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors ${
            isSelected(member.user.id)
              ? 'bg-[#E5E7EB] border border-[#0F172A]'
              : 'bg-[#F8FAFC] hover:bg-[#E5E7EB]'
          }`}
          onClick={() => handleMemberClick(member.user.id)}
        >
          <div className="flex items-center gap-2">
            <Tooltip title={member.user.email} arrow placement="left">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(member.user.id)}`}
              >
                {getInitials(member.user.name || member.user.email)}
              </div>
            </Tooltip>
            <div>
              <p className="text-sm font-medium text-[#0F172A]">
                {member.user.name || member.user.email}
              </p>
              {member.user.name && (
                <p className="text-xs text-[#475569]">
                  {member.user.email}
                </p>
              )}
            </div>
            {member.role === 'owner' && (
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                {DASHBOARD_DATA.members.ownerBadge}
              </span>
            )}
          </div>
          {isOwner && member.role !== 'owner' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm(DASHBOARD_DATA.members.removeConfirm)) {
                  onRemoveMember(member.id)
                }
              }}
              className="rounded p-1 text-[#94A3B8] transition-colors hover:text-red-500"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
