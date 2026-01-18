'use client'

import Link from 'next/link'
import { FOOTER_DATA } from '@/app/constants/landing-page/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='w-full bg-[#0F172A] px-4 py-12 mt-32'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {/* Brand Section */}
          <div>
            <h3 className='text-2xl font-bold text-white'>{FOOTER_DATA.brand.name}</h3>
            <p className='mt-3 text-sm text-[#E5E7EB] leading-relaxed'>{FOOTER_DATA.brand.tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-sm font-semibold text-white uppercase tracking-wider'>
              {FOOTER_DATA.quickLinks.title}
            </h4>
            <ul className='mt-4 space-y-2'>
              {FOOTER_DATA.quickLinks.links.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className='text-sm text-[#E5E7EB] hover:text-white transition-colors'>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='text-sm font-semibold text-white uppercase tracking-wider'>{FOOTER_DATA.support.title}</h4>
            <ul className='mt-4 space-y-2'>
              {FOOTER_DATA.support.links.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className='text-sm text-[#E5E7EB] hover:text-white transition-colors'>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 pt-8 border-t border-[#475569]'>
          <p className='text-center text-sm text-[#E5E7EB]'>
            © {currentYear} {FOOTER_DATA.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
