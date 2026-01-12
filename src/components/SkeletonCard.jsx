function SkeletonCard() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            #2a2a2a 0%,
            #3a3a3a 50%,
            #2a2a2a 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>
      <div className="animate-pulse">
        {/* Poster skeleton */}
        <div className="aspect-[2/3] rounded-md skeleton-shimmer"></div>

        {/* Title skeleton */}
        <div className="mt-2 h-4 skeleton-shimmer rounded w-3/4"></div>

        {/* Subtitle skeleton */}
        <div className="mt-1 h-3 skeleton-shimmer rounded w-1/2"></div>
      </div>
    </>
  );
}

export default SkeletonCard;
