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
  const messages = [
    {
      role: 'user',
      text: 'I have a research paper due Friday. Help me break it down.',
      delay: 0.1
    },
    {
      role: 'ai',
      text: "Sure! Here's a plan:",
      delay: 0.4
    },
    {
      role: 'ai',
      text: null,
      tasks: ['Pick topic & outline — Today', 'Research & notes — Tomorrow', 'First draft — Thursday', 'Proofread & submit — Friday'],
      delay: 0.7
    },
    {
      role: 'user',
      text: 'Can you mark the first one as high priority?',
      delay: 1.1
    },
    {
      role: 'ai',
      text: 'Done! "Pick topic & outline" is now set to High priority.',
      delay: 1.4
    }
  ]

  return (
    <div className='min-h-80 flex flex-col gap-3 px-6 py-6'>
      {/* Chat header */}
      <div className='flex items-center gap-2 pb-2 border-b border-[#E5E7EB]'>
        <div className='w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center'>
          <svg className='w-4 h-4 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.607L5 14.5m14.8.5-1.477.36a9.065 9.065 0 01-4.573.08' />
          </svg>
        </div>
        <span className='text-sm font-semibold text-[#0F172A]'>Progresio AI</span>
        <span className='ml-auto flex items-center gap-1 text-xs text-green-600'>
          <span className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse' />
          Online
        </span>
      </div>

      {/* Messages */}
      <div className='flex flex-col gap-2.5'>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: msg.delay }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.tasks ? (
              <div className='flex flex-col gap-1.5 max-w-xs'>
                {msg.tasks.map((task, j) => (
                  <div key={j} className='flex items-center gap-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-3 py-1.5'>
                    <span className='w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0' />
                    <span className='text-xs text-[#334155]'>{task}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`px-3 py-2 rounded-2xl text-xs max-w-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-[#F1F5F9] text-[#334155] rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
