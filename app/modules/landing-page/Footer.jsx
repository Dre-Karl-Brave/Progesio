'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='w-full bg-[#0F172A] px-4 py-12 mt-32'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {/* Brand Section */}
          <div>
            <h3 className='text-2xl font-bold text-white'>Progresio</h3>
            <p className='mt-3 text-sm text-[#E5E7EB] leading-relaxed'>
              AI-powered productivity for students, built by students.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-sm font-semibold text-white uppercase tracking-wider'>Quick Links</h4>
            <ul className='mt-4 space-y-2'>
              <li>
                <a href='#about' className='text-sm text-[#E5E7EB] hover:text-white transition-colors'>
                  About
                </a>
              </li>
              <li>
                <a href='#faq' className='text-sm text-[#E5E7EB] hover:text-white transition-colors'>
                  FAQ
                </a>
              </li>
              <li>
                <a href='/sign-in' className='text-sm text-[#E5E7EB] hover:text-white transition-colors'>
                  Get Started
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='text-sm font-semibold text-white uppercase tracking-wider'>Support</h4>
            <ul className='mt-4 space-y-2'>
              <li>
                <a href='#' className='text-sm text-[#E5E7EB] hover:text-white transition-colors'>
                  Contact Us
                </a>
              </li>
              <li>
                <a href='#' className='text-sm text-[#E5E7EB] hover:text-white transition-colors'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='#' className='text-sm text-[#E5E7EB] hover:text-white transition-colors'>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 pt-8 border-t border-[#475569]'>
          <p className='text-center text-sm text-[#E5E7EB]'>© {currentYear} Progresio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
