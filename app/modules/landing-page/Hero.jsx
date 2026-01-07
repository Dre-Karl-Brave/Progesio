'use client'

import { motion } from 'motion/react'
import { HERO_DATA } from '@/app/constants/landing-page/constants'

export default function HeroSection() {
  const titleWords = HERO_DATA.title.rest.split(' ')

  return (
    <div className='relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center'>
      <div className='px-4 py-10 md:py-20'>
        <h1 className='relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold leading-tight md:text-4xl md:leading-tight lg:text-7xl lg:leading-tight'>
          <motion.span
            initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0,
              ease: 'easeInOut'
            }}
            className='mr-2 inline-block font-extrabold text-[#0F172A] underline decoration-[#475569] decoration-4 underline-offset-4'
          >
            {HERO_DATA.title.emphasis}
          </motion.span>
          {titleWords.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{
                duration: 0.3,
                delay: (index + 1) * 0.1,
                ease: 'easeInOut'
              }}
              className='mr-2 inline-block text-[#0F172A]'
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            duration: 0.3,
            delay: 0.8
          }}
          className='relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-[#475569]'
        >
          {HERO_DATA.description}
        </motion.p>
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            duration: 0.3,
            delay: 1
          }}
          className='relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4'
        >
          <button className='w-60 transform rounded-lg bg-[#0F172A] px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1e293b]'>
            {HERO_DATA.buttons.primary}
          </button>
          <button className='w-60 transform rounded-lg border border-[#E5E7EB] bg-white px-6 py-2 font-medium text-[#0F172A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F8FAFC]'>
            {HERO_DATA.buttons.secondary}
          </button>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.3,
            delay: 1.2
          }}
          className='relative z-10 mt-20 rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 shadow-md'
        >
          <div className='w-full overflow-hidden rounded-xl border border-[#E5E7EB]'>
            <img
              src={HERO_DATA.image.src}
              alt={HERO_DATA.image.alt}
              className='aspect-[16/9] h-auto w-full object-cover'
              height={1000}
              width={1000}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
