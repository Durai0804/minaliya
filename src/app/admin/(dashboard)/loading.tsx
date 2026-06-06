function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className}`}
      style={{ background: "var(--color-stone-200)" }}
    />
  );
}

export default function AdminLoading() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome banner skeleton */}
      <SkeletonBlock className="h-28 sm:h-32 rounded-3xl" />

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-36 rounded-2xl" />
        ))}
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-3">
          <SkeletonBlock className="h-12 rounded-t-2xl" />
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-14" />
          ))}
        </div>
        <SkeletonBlock className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}
