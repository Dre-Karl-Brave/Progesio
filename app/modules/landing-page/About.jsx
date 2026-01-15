'use client'

import { WobbleCard } from '@/components/ui/wobble-card'
import { motion } from 'motion/react'

export default function About() {
  return (
    <section className='mx-auto max-w-7xl px-4 py-20 mt-20'>
      <div className='grid items-start gap-20 lg:grid-cols-12'>
        {/* Left side - Text content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='space-y-6 lg:col-span-4'
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

        {/* Right side - Wobble cards grid */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='lg:col-span-8'
        >
          <div className='grid grid-cols-1 gap-3 lg:grid-cols-3'>
            {/* Large card - spans 2 columns */}
            <WobbleCard containerClassName='col-span-1 lg:col-span-2 h-full bg-[#0F172A] min-h-[280px] lg:min-h-[220px]'>
              <div className='max-w-xs'>
                <h2 className='text-left text-balance text-sm font-semibold tracking-[-0.015em] text-white md:text-base lg:text-xl'>
                  Built for modern teams who value simplicity
                </h2>
                <p className='mt-2 text-left text-sm/5 text-[#E5E7EB]'>
                  Our platform combines powerful features with an intuitive interface.
                </p>
              </div>
            </WobbleCard>

            {/* Small card - 1 column */}
            <WobbleCard containerClassName='col-span-1 min-h-[220px] bg-[#F8FAFC] border border-[#E5E7EB]'>
              <h2 className='max-w-80 text-left text-balance text-sm font-semibold tracking-[-0.015em] text-[#0F172A] md:text-base lg:text-xl'>
                Security first, always
              </h2>
              <p className='mt-2 max-w-[26rem] text-left text-sm/5 text-[#475569]'>
                Enterprise-grade security and compliance built into every feature.
              </p>
            </WobbleCard>

            {/* Full width card - spans 3 columns */}
            <WobbleCard containerClassName='col-span-1 lg:col-span-3 bg-[#475569] min-h-[280px] lg:min-h-[200px]'>
              <div className='max-w-sm'>
                <h2 className='max-w-sm text-left text-balance text-sm font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-base lg:text-xl'>
                  Start collaborating smarter today
                </h2>
                <p className='mt-2 max-w-[26rem] text-left text-sm/5 text-[#E5E7EB]'>
                  Join thousands of teams who trust our platform for their daily workflows.
                </p>
              </div>
              <img
                src='/linear.webp'
                width={300}
                height={300}
                alt='collaboration demo'
                className='absolute -bottom-6 -right-10 rounded-2xl object-contain md:-right-[40%] lg:-right-[20%]'
              />
            </WobbleCard>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
