'use client'

import React from 'react'
import { motion } from 'motion/react'
import { FEATURES_DATA } from '@/app/constants/landing-page/constants'

const ICONS = {
  SkeletonOne: (
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' />
  ),
  SkeletonTwo: (
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
  ),
  SkeletonThree: (
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
  ),
  SkeletonFour: (
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
  )
}

const STATS = [
  { value: '3×', label: 'More productive mornings' },
  { value: '40%', label: 'Fewer missed deadlines' },
  { value: '22m', label: 'Avg focus session saved' }
]

const ACCENT_COLORS = [
  { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', dot: 'bg-blue-400' },
  { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-700', dot: 'bg-violet-400' },
  { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' }
]

const TextBlock0 = ({ feature }) => (
  <div className='flex flex-col gap-6'>
    <div className='flex items-center gap-3'>
      <div className='w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600'>
        <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          {ICONS[feature.skeleton]}
        </svg>
      </div>
      <span className='text-xs font-bold tracking-widest text-blue-500 uppercase'>01</span>
    </div>
    <div>
      <h3 className='text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight'>{feature.title}</h3>
      <p className='text-[#64748B] text-base leading-relaxed mt-3 max-w-sm'>{feature.description}</p>
    </div>
    <div className='flex flex-wrap gap-2'>
      {feature.bullets.map((b) => (
        <span key={b} className='flex items-center gap-1.5 text-xs text-[#334155] bg-[#F1F5F9] border border-[#E2E8F0] rounded-full px-3 py-1.5'>
          <span className='w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0' />
          {b}
        </span>
      ))}
    </div>
  </div>
)

const TextBlock1 = ({ feature }) => (
  <div className='flex flex-col gap-6'>
    <span className='text-xs font-bold tracking-widest text-blue-500 uppercase'>02</span>
    <div className='grid grid-cols-3 gap-3'>
      {STATS.map((s) => (
        <div key={s.label} className='flex flex-col gap-1 p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]'>
          <span className='text-2xl font-extrabold text-[#0F172A]'>{s.value}</span>
          <span className='text-xs text-[#64748B] leading-tight'>{s.label}</span>
        </div>
      ))}
    </div>
    <div>
      <h3 className='text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight'>{feature.title}</h3>
      <p className='text-[#64748B] text-base leading-relaxed mt-3 max-w-sm'>{feature.description}</p>
    </div>
  </div>
)

const TextBlock2 = ({ feature }) => (
  <div className='flex flex-col gap-6'>
    <div className='flex items-center gap-3'>
      <div className='w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600'>
        <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          {ICONS[feature.skeleton]}
        </svg>
      </div>
      <span className='text-xs font-bold tracking-widest text-blue-500 uppercase'>03</span>
    </div>
    <div>
      <h3 className='text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight'>{feature.title}</h3>
      <p className='text-[#64748B] text-base leading-relaxed mt-3 max-w-sm'>{feature.description}</p>
    </div>
    <div className='grid grid-cols-1 gap-2.5'>
      {feature.bullets.map((b, i) => {
        const c = ACCENT_COLORS[i]
        return (
          <div key={b} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${c.bg} ${c.border}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
            <span className={`text-sm font-medium ${c.text}`}>{b}</span>
          </div>
        )
      })}
    </div>
  </div>
)

const TextBlock3 = ({ feature }) => (
  <div className='flex flex-col gap-6'>
    <div className='flex items-center gap-2 w-fit bg-[#0F172A] text-white text-xs font-mono px-3 py-1.5 rounded-full'>
      <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
      progresio ai --assist
    </div>
    <div>
      <h3 className='text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight'>{feature.title}</h3>
      <p className='text-[#64748B] text-base leading-relaxed mt-3 max-w-sm'>{feature.description}</p>
    </div>
    <ul className='flex flex-col gap-3'>
      {feature.bullets.map((b) => (
        <li key={b} className='flex items-center gap-3 text-sm text-[#334155]'>
          <span className='text-blue-500 font-bold text-base leading-none'>→</span>
          {b}
        </li>
      ))}
    </ul>
  </div>
)

const TEXT_BLOCKS = [TextBlock0, TextBlock1, TextBlock2, TextBlock3]

export default function FeaturesSectionDemo() {
  const skeletonComponents = {
    SkeletonOne: <SkeletonOne />,
    SkeletonTwo: <SkeletonTwo />,
    SkeletonThree: <SkeletonThree />,
    SkeletonFour: <SkeletonFour />
  }

  return (
    <div className='relative z-20 py-10 lg:py-32 max-w-7xl mx-auto px-8'>
      <div className='text-center mb-20 lg:mb-28'>
        <h4 className='text-3xl lg:text-5xl lg:leading-tight max-w-4xl mx-auto tracking-tight font-extrabold text-[#0F172A]'>
          {FEATURES_DATA.title}
        </h4>
        <p className='text-sm lg:text-base max-w-2xl mt-4 mx-auto text-[#475569] font-normal'>
          {FEATURES_DATA.description}
        </p>
      </div>

      <div className='flex flex-col'>
        {FEATURES_DATA.features.map((feature, index) => {
          const flipped = index % 2 === 1
          const TextBlock = TEXT_BLOCKS[index]
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-16 lg:py-24 border-b border-[#E5E7EB] last:border-b-0 ${flipped ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className='flex-1'>
                <TextBlock feature={feature} />
              </div>
              <div className='flex-1 w-full'>
                <div className='rounded-2xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden'>
                  {skeletonComponents[feature.skeleton]}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
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
              whileInView={{ width: '40%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: task.delay }}
              className='flex items-center gap-3 p-2 bg-white rounded-lg border border-[#E5E7EB] shadow-sm'
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                    task.done ? 'bg-blue-500' : 'border-2 border-gray-300'
                }`}
              >
                {task.done && (
                  <svg className='w-3 h-3 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                  </svg>
                )}
              </div>
              <span className={`text-xs flex-1 min-w-0 truncate ${task.done ? 'line-through text-gray-400' : 'text-[#0F172A]'}`}>
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
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

export const SkeletonThree = () => {
  const days = [
    { day: 'Mon', load: 30, tasks: 2 },
    { day: 'Tue', load: 60, tasks: 5 },
    { day: 'Wed', load: 90, tasks: 8 },
    { day: 'Thu', load: 75, tasks: 6 },
    { day: 'Fri', load: 45, tasks: 4 }
  ]

  const getColor = (load) => {
    if (load >= 80) return { bar: 'bg-red-400', text: 'text-red-500' }
    if (load >= 55) return { bar: 'bg-yellow-400', text: 'text-yellow-500' }
    return { bar: 'bg-green-400', text: 'text-green-500' }
  }

  return (
    <div className='relative flex py-8 px-2 h-full'>
      <div className='w-full p-5 mx-auto bg-[#F8FAFC] shadow-2xl h-full flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-semibold text-[#0F172A]'>This Week</span>
          <span className='text-xs bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-full'>⚠ Heavy on Wed</span>
        </div>

        <div className='flex items-end gap-2 h-24'>
          {days.map((d, i) => {
            const { bar, text } = getColor(d.load)
            return (
              <div key={d.day} className='flex-1 flex flex-col items-center gap-1 h-full'>
                <motion.p
                  className={`text-xs font-semibold ${text}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  {d.tasks}
                </motion.p>
                <div className='flex-1 w-full flex items-end'>
                  <motion.div
                    className={`w-full rounded-t-sm ${bar}`}
                    style={{ height: `${d.load}%`, originY: 1 }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                  />
                </div>
                <span className='text-xs text-gray-400'>{d.day}</span>
              </div>
            )
          })}
        </div>

        <div className='flex gap-2 flex-wrap'>
          {[{ label: 'Light', color: 'bg-green-400' }, { label: 'Moderate', color: 'bg-yellow-400' }, { label: 'Heavy', color: 'bg-red-400' }].map((item) => (
            <div key={item.label} className='flex items-center gap-1.5'>
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className='text-xs text-gray-400'>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='absolute bottom-0 z-40 inset-x-0 h-40 bg-linear-to-t from-[#FFFFFF] via-[#FFFFFF] to-transparent w-full pointer-events-none' />
      <div className='absolute top-0 z-40 inset-x-0 h-20 bg-linear-to-b from-[#FFFFFF] via-transparent to-transparent w-full pointer-events-none' />
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
        <span className='text-sm font-semibold text-[#0F172A]'>Progresio AI</span> {/* cspell:disable-line */}
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
