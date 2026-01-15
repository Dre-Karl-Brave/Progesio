export default function Divider() {
  return (
    <div className='mt-20 px-4'>
      <div className='mx-auto max-w-7xl'>
        <div className='relative flex items-center justify-center'>
          {/* Left line with gradient fade */}
          <div className='h-0.5 flex-1 bg-linear-to-r from-transparent via-[#CBD5E1] to-[#0F172A]' />

          {/* Center ornament */}
          <div className='relative mx-6 flex items-center justify-center'>
            <div className='absolute h-3 w-3 animate-pulse rounded-full bg-[#0F172A]' />
            <div className='h-2 w-2 rounded-full bg-white ring-2 ring-[#0F172A]' />
          </div>

          {/* Right line with gradient fade */}
          <div className='h-0.5 flex-1 bg-linear-to-l from-transparent via-[#CBD5E1] to-[#0F172A]' />
        </div>

        {/* Decorative dots */}
        <div className='mt-2 flex items-center justify-center gap-2'>
          <div className='h-1 w-1 rounded-full bg-[#94A3B8]' />
          <div className='h-1.5 w-1.5 rounded-full bg-[#64748B]' />
          <div className='h-1 w-1 rounded-full bg-[#94A3B8]' />
        </div>
      </div>
    </div>
  )
}
