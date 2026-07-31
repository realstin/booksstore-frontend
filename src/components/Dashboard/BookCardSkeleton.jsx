/**
 * BookCardSkeleton
 * Placeholder shown while books are loading.
 * Pure CSS animation — no JS timers.
 */
function BookCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      {/* Cover placeholder */}
      <div className="aspect-3/4 w-full animate-pulse bg-neutral-100" />

      {/* Body */}
      <div className="flex flex-col gap-2.5 p-4">
        {/* Category chip */}
        <div className="h-4 w-16 animate-pulse rounded-full bg-neutral-100" />
        {/* Title */}
        <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
        {/* Author */}
        <div className="h-3.5 w-1/2 animate-pulse rounded bg-neutral-100" />
        {/* Rating row */}
        <div className="mt-1 flex items-center gap-2">
          <div className="h-3 w-12 animate-pulse rounded bg-neutral-100" />
          <div className="h-3 w-10 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}

export default BookCardSkeleton;
