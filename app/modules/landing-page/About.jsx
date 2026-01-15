'use client'

import { WobbleCard } from '@/components/ui/wobble-card'
import { motion } from 'motion/react'
import { ABOUT_DATA } from '@/app/constants/landing-page/constants'

export default function About() {
  return (
    <section className='mx-auto max-w-7xl px-4 py-20 mt-32'>
      <div className='grid items-start gap-20 lg:grid-cols-12'>
        {/* Left side - Text content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='space-y-6 lg:col-span-4'
        >
          <h2 className='text-4xl mt-10 font-bold text-[#0F172A] lg:text-5xl'>{ABOUT_DATA.title}</h2>
          <p className='text-lg mt-6 leading-relaxed text-[#475569]'>{ABOUT_DATA.description}</p>
          <p className='text-lg mt-5 leading-relaxed text-[#475569]'>{ABOUT_DATA.subdescription}</p>
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
                  {ABOUT_DATA.cards[0].title}
                </h2>
                <p className='mt-2 text-left text-sm/5 text-[#E5E7EB]'>{ABOUT_DATA.cards[0].description}</p>
              </div>
            </WobbleCard>

            {/* Small card - 1 column */}
            <WobbleCard containerClassName='col-span-1 min-h-[220px] bg-[#F8FAFC] border border-[#E5E7EB]'>
              <h2 className='max-w-80 text-left text-balance text-sm font-semibold tracking-[-0.015em] text-[#0F172A] md:text-base lg:text-xl'>
                {ABOUT_DATA.cards[1].title}
              </h2>
              <p className='mt-2 max-w-[26rem] text-left text-sm/5 text-[#475569]'>{ABOUT_DATA.cards[1].description}</p>
            </WobbleCard>

            {/* Full width card - spans 3 columns */}
            <WobbleCard containerClassName='col-span-1 lg:col-span-3 bg-[#475569] min-h-[280px] lg:min-h-[200px]'>
              <div className='max-w-sm'>
                <h2 className='max-w-sm text-left text-balance text-sm font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-base lg:text-xl'>
                  {ABOUT_DATA.cards[2].title}
                </h2>
                <p className='mt-2 max-w-[26rem] text-left text-sm/5 text-[#E5E7EB]'>
                  {ABOUT_DATA.cards[2].description}
                </p>
              </div>
            </WobbleCard>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
