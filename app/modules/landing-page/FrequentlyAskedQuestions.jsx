'use client'

import { motion } from 'motion/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { FAQ_DATA } from '@/app/constants/landing-page/constants'

export default function FAQ() {
  return (
    <section id='faq' className='w-full px-4 py-20 mt-60'>
      <div className='mx-auto max-w-7xl px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='mb-12'
        >
          <h2 className='text-4xl font-bold text-[#0F172A] lg:text-5xl'>Frequently Asked Questions</h2>
          <p className='mt-4 text-lg text-[#475569]'>Everything you need to know about our productivity platform</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type='single' collapsible className='w-full'>
            {FAQ_DATA.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className='text-[#0F172A] cursor-pointer font-semibold hover:no-underline items-center'>
                  <span className='text-left flex-1'>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className='text-[#475569] leading-relaxed'>
                  {faq.answer.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='mt-16 pt-8 border-t border-[#E5E7EB]'
          >
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <h3 className='text-lg font-semibold text-[#0F172A]'>Still have questions?</h3>
                <p className='text-sm text-[#475569] mt-1'>We&apos;re here to help. Reach out to our support team.</p>
              </div>
              <Button
                variant='outline'
                className='border border-[#0F172A]/50 text-[#0F172A] hover:bg-[#0F172A] hover:text-white px-8 py-6 font-medium rounded-lg cursor-pointer transition-all shrink-0'
              >
                Contact Support
              </Button>
            </div> 
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
