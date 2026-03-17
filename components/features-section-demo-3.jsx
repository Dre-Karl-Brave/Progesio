'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { FEATURES_DATA, GLOBE_CONFIG } from '@/app/constants/landing-page/constants'

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
  const bars = [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 85 },
    { label: 'Wed', value: 45 },
    { label: 'Thu', value: 90 },
    { label: 'Fri', value: 70 },
    { label: 'Sat', value: 30 },
    { label: 'Sun', value: 55 }
  ]

  const stats = [
    { label: 'Completed', value: 24, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'In Progress', value: 8, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Overdue', value: 3, color: 'text-red-500', bg: 'bg-red-50' }
  ]

  return (
    <div className='relative flex flex-col items-start p-6 gap-4 h-full overflow-hidden'>
      <div className='flex gap-3 w-full'>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className={`flex-1 ${stat.bg} rounded-xl border border-[#E5E7EB] p-3 shadow-sm`}
          >
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className='text-xs text-gray-500 mt-0.5'>{stat.label}</p>
          </motion.div>
        ))}
      </div>
      <div className='w-full bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm'>
        <p className='text-xs font-medium text-gray-500 mb-3'>Weekly Progress</p>
        <div className='flex items-end gap-2 h-20'>
          {bars.map((bar, i) => (
            <div key={bar.label} className='flex-1 flex flex-col items-center gap-1 h-full'>
              <div className='flex-1 w-full flex items-end'>
                <motion.div
                  className='w-full bg-blue-500 rounded-t-sm'
                  style={{ height: `${bar.value}%`, originY: 1 }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.07, ease: 'easeOut' }}
                />
              </div>
              <span className='text-xs text-gray-400'>{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='absolute left-0 z-100 inset-y-0 w-20 bg-linear-to-r from-[#FFFFFF] to-transparent h-full pointer-events-none' />
      <div className='absolute right-0 z-100 inset-y-0 w-20 bg-linear-to-l from-[#FFFFFF] to-transparent h-full pointer-events-none' />
    </div>
  )
}

export const SkeletonFour = () => {
  return (
    <div className='h-60 md:h-60 flex flex-col items-center relative bg-transparent mt-10'>
      <Globe className='absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72' />
    </div>
  )
}

export const Globe = ({ className }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    let phi = 0

    if (!canvasRef.current) return

    const globe = createGlobe(canvasRef.current, {
      ...GLOBE_CONFIG,
      onRender: (state) => {
        state.phi = phi
        phi += 0.01
      }
    })

    return () => {
      globe.destroy()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: '100%', aspectRatio: 1 }}
      className={className}
    />
  )
}
