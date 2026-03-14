'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, GitBranch, Clock } from 'lucide-react'

const actions = [
  {
    id: 'summarize',
    Icon: FileText,
    title: 'Summarize task',
    description: 'Generate a concise summary based on title, description, and activity.'
  },
  {
    id: 'subtasks',
    Icon: GitBranch,
    title: 'Generate subtasks',
    description: 'Break this task into smaller, actionable subtasks to track progress.'
  },
  {
    id: 'estimate',
    Icon: Clock,
    title: 'Estimate effort',
    description: 'Get an AI-powered effort estimate based on task complexity.'
  }
]

export default function TaskIntelligenceDialog({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          style={{ background: 'rgba(0,0,0,0.3)' }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            style={{
              width: 580,
              background: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: 18,
              boxShadow: '0 20px 60px rgba(0,0,0,0.13)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '28px 28px 22px', borderBottom: '1px solid #F1F5F9' }}>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-[11px] font-semibold text-[#94A3B8] mb-2 tracking-widest uppercase'>
                    AI Assistant
                  </p>
                  <h2 className='text-[18px] font-semibold text-[#0F172A]'>Task-level intelligence</h2>
                  <p className='text-[13px] text-[#64748B] mt-1.5 leading-relaxed'>
                    Let AI analyze and enhance the selected task with intelligent suggestions.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className='flex items-center justify-center rounded-full cursor-pointer shrink-0'
                  style={{
                    width: 30,
                    height: 30,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    color: '#64748B'
                  }}
                >
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Actions — horizontal */}
            <div className='grid' style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: '20px 20px' }}>
              {actions.map((action) => (
                <button
                  key={action.id}
                  className='flex flex-col items-center text-center rounded-xl cursor-pointer transition-all'
                  style={{
                    padding: '20px 16px',
                    border: '1px solid transparent',
                    background: '#F8FAFC'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F1F5F9'
                    e.currentTarget.style.border = '1px solid #E2E8F0'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F8FAFC'
                    e.currentTarget.style.border = '1px solid transparent'
                  }}
                  onClick={() => {
                    console.log(action.id)
                    onClose()
                  }}
                >
                  <span className='text-[13px] font-semibold text-[#0F172A] mb-2 leading-snug'>{action.title}</span>
                  <span className='text-[11.5px] text-[#64748B] leading-relaxed mb-5'>{action.description}</span>
                  <div
                    className='flex items-center justify-center rounded-lg mt-auto'
                    style={{
                      width: 40,
                      height: 40,
                      background: '#fff',
                      border: '1px solid #E2E8F0',
                      color: '#0F172A'
                    }}
                  >
                    <action.Icon size={17} strokeWidth={1.8} />
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div
              className='flex items-center justify-between'
              style={{ padding: '14px 24px', borderTop: '1px solid #F1F5F9' }}
            >
              <p className='text-[11px] text-[#94A3B8]'>Powered by AI · Results may vary</p>
              <button
                onClick={onClose}
                className='cursor-pointer text-[12px] font-medium text-[#475569] transition-colors hover:bg-[#F1F5F9]'
                style={{ padding: '7px 16px', border: '1px solid #E2E8F0', borderRadius: 8 }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
