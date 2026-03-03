export default function BoardCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="h-5 w-32 animate-pulse rounded bg-[#E5E7EB]"></div>
        <div className="h-4 w-4 animate-pulse rounded bg-[#E5E7EB]"></div>
      </div>
      <div className="mt-1.5 h-4 w-full animate-pulse rounded bg-[#E5E7EB]"></div>
      <div className="mt-1 h-4 w-3/4 animate-pulse rounded bg-[#E5E7EB]"></div>
      <div className="mt-3 flex items-center gap-4">
        <div className="h-3 w-20 animate-pulse rounded bg-[#E5E7EB]"></div>
        <div className="h-3 w-20 animate-pulse rounded bg-[#E5E7EB]"></div>
      </div>
    </div>
  )
}
