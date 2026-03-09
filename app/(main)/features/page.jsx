import NavbarComponent from '@/app/modules/landing-page/Navbar'
import FeatureComponent from '@/app/modules/landing-page/Feature'
import Footer from '@/app/modules/landing-page/Footer'

export const metadata = {
  title: 'Features'
}

export default function Features() {
  return (
    <div className='min-h-screen bg-[#F8FAFC]'>
      <NavbarComponent />
      <FeatureComponent />
      <Footer />
    </div>
  )
}
