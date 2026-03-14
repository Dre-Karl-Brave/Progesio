'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SquareCheckBig, LayoutDashboard, X } from 'lucide-react'

const options = [
  { id: 'task', label: 'Task-level intelligence', Icon: SquareCheckBig },
  { id: 'board', label: 'Board-level intelligence', Icon: LayoutDashboard }
]

export default function AIButton({ onTaskIntelligence, onBoardIntelligence }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)

  const handleClick = (id) => {
    if (id === 'task') onTaskIntelligence?.()
    if (id === 'board') onBoardIntelligence?.()
    setIsOpen(false)
    setHoveredId(null)
  }

  const toggleOpen = () => {
    setIsOpen((v) => !v)
    setHoveredId(null)
  }

  // Shared size for all 3 buttons
  const BTN_SIZE = 44

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3'>
      {/* Option buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            // ↕ Increase or decrease gap between the 2 option buttons here
            className='flex flex-col items-center gap-3'
            initial='hidden'
            animate='visible'
            exit='hidden'
          >
            {options.map((opt, i) => (
              <motion.div
                key={opt.id}
                className='relative flex items-center justify-end'
                variants={{
                  hidden: { opacity: 0, y: 6, scale: 0.88 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { delay: i * 0.05, type: 'spring', stiffness: 380, damping: 22 }
                  }
                }}
              >
                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredId === opt.id && (
                    <motion.span
                      className='absolute whitespace-nowrap text-xs font-medium pointer-events-none select-none'
                      style={{
                        right: BTN_SIZE + 8,
                        background: '#0F172A',
                        color: '#fff',
                        padding: '3px 8px',
                        borderRadius: 5
                      }}
                      initial={{ opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 4 }}
                      transition={{ duration: 0.12 }}
                    >
                      {opt.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Circle option button — same size as main button */}
                <motion.button
                  onClick={() => handleClick(opt.id)}
                  onMouseEnter={() => setHoveredId(opt.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className='flex items-center justify-center rounded-full cursor-pointer'
                  animate={{
                    background: hoveredId === opt.id ? '#0F172A' : '#ffffff',
                    color: hoveredId === opt.id ? '#ffffff' : '#0F172A'
                  }}
                  transition={{ duration: 0.13 }}
                  style={{
                    width: BTN_SIZE,
                    height: BTN_SIZE,
                    border: '1.5px solid #0F172A',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.09)'
                  }}
                  whileTap={{ scale: 0.93 }}
                >
                  <opt.Icon size={16} strokeWidth={1.8} />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main AI button */}
      <motion.button
        onClick={toggleOpen}
        className='flex items-center justify-center rounded-full cursor-pointer'
        animate={{ scale: isOpen ? 1.07 : 1 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          width: BTN_SIZE,
          height: BTN_SIZE,
          background: '#0F172A',
          boxShadow: isOpen ? '0 4px 18px rgba(0,0,0,0.22)' : '0 2px 8px rgba(0,0,0,0.13)',
          border: '1.5px solid #0F172A'
        }}
      >
        <AnimatePresence mode='wait'>
          {isOpen ? (
            <motion.span
              key='close'
              initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className='flex items-center justify-center text-white'
            >
              <X size={16} strokeWidth={2} />
            </motion.span>
          ) : (
            <motion.svg
              key='ai'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              initial={{ opacity: 0, rotate: 20, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -20, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              style={{ color: '#fff' }}
            >
              <circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='1.5' opacity='0.5' />
              <circle cx='12' cy='12' r='2' stroke='currentColor' strokeWidth='1.5' fill='none' />
              <circle cx='12' cy='6' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
              <circle cx='17.5' cy='10' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
              <circle cx='17.5' cy='14' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
              <circle cx='12' cy='18' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
              <circle cx='6.5' cy='14' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
              <circle cx='6.5' cy='10' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
              <line x1='12' y1='12' x2='12' y2='6' stroke='currentColor' strokeWidth='1' opacity='0.3' />
              <line x1='12' y1='12' x2='17.5' y2='10' stroke='currentColor' strokeWidth='1' opacity='0.3' />
              <line x1='12' y1='12' x2='17.5' y2='14' stroke='currentColor' strokeWidth='1' opacity='0.3' />
              <line x1='12' y1='12' x2='12' y2='18' stroke='currentColor' strokeWidth='1' opacity='0.3' />
              <line x1='12' y1='12' x2='6.5' y2='14' stroke='currentColor' strokeWidth='1' opacity='0.3' />
              <line x1='12' y1='12' x2='6.5' y2='10' stroke='currentColor' strokeWidth='1' opacity='0.3' />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
