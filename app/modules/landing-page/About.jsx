'use client'

import { WobbleCard } from '@/components/ui/wobble-card'
import { motion } from 'motion/react'

export default function About() {
  return (
    <section className='mx-auto max-w-7xl px-4 py-20'>
      <div className='grid items-center gap-12 lg:grid-cols-2'>
        {/* Left side - Text content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='space-y-6'
        >
          <h2 className='text-4xl font-bold text-[#0F172A] lg:text-5xl'>About Our Platform</h2>
          <p className='text-lg leading-relaxed text-[#475569]'>
            We're revolutionizing the way teams collaborate and work together. Our platform combines powerful tools with
            intuitive design to help you achieve more.
          </p>
          <p className='text-lg leading-relaxed text-[#475569]'>
            Built with modern technology and designed for the future, we're committed to delivering exceptional
            experiences that empower your team to reach new heights.
          </p>
          <div className='pt-4'>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3'>
                <span className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#0F172A]' />
                <span className='text-[#475569]'>Seamless collaboration across teams</span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#0F172A]' />
                <span className='text-[#475569]'>Enterprise-grade security and reliability</span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#0F172A]' />
                <span className='text-[#475569]'>Intuitive interface designed for productivity</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Right side - Wobble card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <WobbleCard containerClassName='h-full min-h-[500px]'>
            <div className='flex h-full flex-col justify-between'>
              <div>
                <h3 className='text-left text-xl font-semibold text-white md:text-3xl'>Innovation Meets Simplicity</h3>
                <p className='mt-4 text-left text-base text-white/80'>
                  Experience the perfect blend of cutting-edge technology and user-friendly design. Our platform adapts
                  to your needs.
                </p>
              </div>
              <div className='mt-8'>
                <div className='flex items-center gap-4'>
                  <div className='h-12 w-12 rounded-full bg-white/20' />
                  <div className='h-12 w-12 rounded-full bg-white/20' />
                  <div className='h-12 w-12 rounded-full bg-white/20' />
                </div>
              </div>
            </div>
          </WobbleCard>
        </motion.div>
      </div>
    </section>
  )
}
