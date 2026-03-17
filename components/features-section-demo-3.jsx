'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { FEATURES_DATA } from '@/app/constants/landing-page/constants'

export default function FeaturesSectionDemo() {
  const skeletonComponents = {
    SkeletonOne: <SkeletonOne />,
    SkeletonTwo: <SkeletonTwo />,
    SkeletonFour: <SkeletonFour />
  }

  return (
    <div className='relative z-20 py-10 lg:py-40 max-w-7xl mx-auto'>
      <div className='px-8'>
        <h4 className='text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-extrabold text-[#0F172A]'>
          {FEATURES_DATA.title}
        </h4>

        <p className='text-sm lg:text-base max-w-2xl my-4 mx-auto text-[#475569] text-center font-normal'>
          {FEATURES_DATA.description}
        </p>
      </div>
      <div className='relative'>
        <div className='grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md border-[#E5E7EB]'>
          {FEATURES_DATA.features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className='h-full w-full'>{skeletonComponents[feature.skeleton]}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({ children, className }) => {
  return <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>{children}</div>
}

const FeatureTitle = ({ children }) => {
  return (
    <p className='max-w-5xl mx-auto text-left tracking-tight text-[#0F172A] text-xl md:text-2xl md:leading-snug'>
      {children}
    </p>
  )
}

const FeatureDescription = ({ children }) => {
  return (
    <p
      className={cn(
        'text-sm md:text-base max-w-4xl text-left mx-auto',
        'text-[#475569] text-center font-normal',
        'text-left max-w-sm mx-0 md:text-sm my-2'
      )}
    >
      {children}
    </p>
  )
}

export const SkeletonOne = () => {
  const tasks = [
    { id: 1, text: 'Research competitor analysis', priority: 'High', done: true, delay: 0 },
    { id: 2, text: 'Design new landing page', priority: 'Medium', done: true, delay: 0.15 },
    { id: 3, text: 'Write project proposal', priority: 'High', done: false, delay: 0.3 },
    { id: 4, text: 'Schedule team meeting', priority: 'Low', done: false, delay: 0.45 },
    { id: 5, text: 'Review pull requests', priority: 'Medium', done: false, delay: 0.6 }
  ]

  const priorityColors = {
    High: 'bg-red-100 text-red-600',
    Medium: 'bg-yellow-100 text-yellow-600',
    Low: 'bg-green-100 text-green-600'
  }

  return (
    <div className='relative flex py-8 px-2 gap-10 h-full'>
      <div className='w-full p-5 mx-auto bg-[#F8FAFC] shadow-2xl group h-full'>
        <div className='flex flex-col w-full h-full space-y-3'>
          <div className='flex items-center justify-between mb-1'>
            <span className='font-semibold text-[#0F172A] text-sm'>My Tasks</span>
            <span className='text-xs bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded-full'>5 tasks</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-1.5 mb-1'>
            <motion.div
              className='bg-blue-500 h-1.5 rounded-full'
              initial={{ width: 0 }}
              animate={{ width: '40%' }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: task.delay }}
              className='flex items-center gap-3 p-2 bg-white rounded-lg border border-[#E5E7EB] shadow-sm'
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                  task.done ? 'bg-blue-500' : 'border-2 border-gray-300'
                }`}
              >
                {task.done && (
                  <svg className='w-3 h-3 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                  </svg>
                )}
              </div>
              <span className={`text-xs flex-1 ${task.done ? 'line-through text-gray-400' : 'text-[#0F172A]'}`}>
                {task.text}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className='absolute bottom-0 z-40 inset-x-0 h-60 bg-linear-to-t from-[#FFFFFF] via-[#FFFFFF] to-transparent w-full pointer-events-none' />
      <div className='absolute top-0 z-40 inset-x-0 h-60 bg-linear-to-b from-[#FFFFFF] via-transparent to-transparent w-full pointer-events-none' />
    </div>
  )
}

export const SkeletonTwo = () => {
  const insights = [
    {
      icon: '✦',
      text: 'You complete 3× more tasks before noon — try front-loading your day.',
      delay: 0.1
    },
    {
      icon: '✦',
      text: 'Task completion dropped 40% near deadlines. Breaking them earlier could help.',
      delay: 0.3
    },
    {
      icon: '✦',
      text: 'Your focus sessions average 22 min. Consider extending to 45 min blocks.',
      delay: 0.5
    }
  ]

  return (
    <div className='relative flex flex-col items-start p-6 gap-3 h-full overflow-hidden'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full'
      >
        <span className='w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse' />
        AI analyzing your data…
      </motion.div>

      {insights.map((insight, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: insight.delay }}
          className='w-full bg-white rounded-xl border border-[#E5E7EB] p-3 shadow-sm flex gap-2.5 items-start'
        >
          <span className='text-blue-400 text-sm mt-0.5 shrink-0'>{insight.icon}</span>
          <p className='text-xs text-[#334155] leading-relaxed'>{insight.text}</p>
        </motion.div>
      ))}

      <div className='absolute left-0 z-100 inset-y-0 w-20 bg-linear-to-r from-[#FFFFFF] to-transparent h-full pointer-events-none' />
      <div className='absolute right-0 z-100 inset-y-0 w-20 bg-linear-to-l from-[#FFFFFF] to-transparent h-full pointer-events-none' />
    </div>
  )
}

export const SkeletonFour = () => {
  const devices = [
    { label: 'Mobile', icon: '📱', delay: 0.1 },
    { label: 'Laptop', icon: '💻', delay: 0.2 },
    { label: 'Tablet', icon: '📟', delay: 0.3 },
    { label: 'Desktop', icon: '🖥️', delay: 0.4 }
  ]

  const pulseRings = [0, 0.6, 1.2]

  return (
    <div
      className='min-h-80 relative overflow-hidden rounded-b-md'
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1e3a8a 100%)' }}
    >
      {/* Dot grid background */}
      <div
        className='absolute inset-0 opacity-20'
        style={{
          backgroundImage: 'radial-gradient(circle, #60a5fa 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className='relative z-10 flex flex-col items-center justify-center gap-8 px-8 py-12'>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center'
        >
          <p className='text-2xl md:text-3xl font-bold text-white tracking-tight'>Works Anywhere</p>
          <p className='text-sm text-blue-300 mt-1.5'>Access your dashboard from any device, anywhere in the world.</p>
        </motion.div>

        {/* Central sync orb */}
        <div className='relative flex items-center justify-center'>
          {pulseRings.map((delay, i) => (
            <motion.div
              key={i}
              className='absolute rounded-full border border-blue-400'
              initial={{ width: 56, height: 56, opacity: 0.6 }}
              animate={{ width: 160 + i * 50, height: 160 + i * 50, opacity: 0 }}
              transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
          <div
            className='w-16 h-16 rounded-full flex items-center justify-center z-10'
            style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', boxShadow: '0 0 48px rgba(59,130,246,0.7)' }}
          >
            <svg className='w-8 h-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
            </svg>
          </div>
        </div>

        {/* Device cards */}
        <div className='flex gap-4 flex-wrap justify-center'>
          {devices.map((device) => (
            <motion.div
              key={device.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: device.delay, duration: 0.4 }}
              className='flex flex-col items-center gap-2 px-5 py-3 rounded-2xl border border-blue-500/30'
              style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}
            >
              <span className='text-2xl'>{device.icon}</span>
              <span className='text-xs text-blue-200 font-medium'>{device.label}</span>
              <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
