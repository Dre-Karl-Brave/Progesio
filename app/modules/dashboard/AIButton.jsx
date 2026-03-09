'use client'

import { useState } from 'react'

export default function AIButton({ onClick }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className='fixed bottom-6 right-6 flex items-center justify-center rounded-full bg-[#0F172A] p-3 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-110 cursor-pointer group'
    >
      {/* AI Neural Network Icon */}
      <svg
        width='22'
        height='22'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='transition-transform duration-300 group-hover:rotate-12 text-white'
      >
        {/* Outer circle */}
        <circle
          cx='12'
          cy='12'
          r='9'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='opacity-50'
        />

        {/* Central core node - outlined with pulse */}
        <circle cx='12' cy='12' r='2' stroke='currentColor' strokeWidth='1.5' fill='none' className='animate-pulse' />

        {/* Outer nodes - all outlined */}
        <circle cx='12' cy='6' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
        <circle cx='17.5' cy='10' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
        <circle cx='17.5' cy='14' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
        <circle cx='12' cy='18' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
        <circle cx='6.5' cy='14' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
        <circle cx='6.5' cy='10' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />

        {/* Connection lines radiating from center */}
        <line x1='12' y1='12' x2='12' y2='6' stroke='currentColor' strokeWidth='1' opacity='0.3' />
        <line x1='12' y1='12' x2='17.5' y2='10' stroke='currentColor' strokeWidth='1' opacity='0.3' />
        <line x1='12' y1='12' x2='17.5' y2='14' stroke='currentColor' strokeWidth='1' opacity='0.3' />
        <line x1='12' y1='12' x2='12' y2='18' stroke='currentColor' strokeWidth='1' opacity='0.3' />
        <line x1='12' y1='12' x2='6.5' y2='14' stroke='currentColor' strokeWidth='1' opacity='0.3' />
        <line x1='12' y1='12' x2='6.5' y2='10' stroke='currentColor' strokeWidth='1' opacity='0.3' />
      </svg>

      {/* Glow effect */}
      <div className='absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300' />
    </button>
  )
}
