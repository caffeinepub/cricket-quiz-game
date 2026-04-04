export default function SkeletonCard({ index }: { index: number }) {
  // Vary heights for masonry feel
  const heights = ["200px", "260px", "180px", "300px", "220px", "240px"];
  const h = heights[index % heights.length];

  return (
    <div className="wallpaper-grid-item">
      <div className="rounded-xl overflow-hidden border border-border">
        <div className="skeleton-shimmer w-full" style={{ height: h }} />
        <div className="px-3 py-2 bg-card">
          <div className="skeleton-shimmer h-3 w-3/4 rounded mb-1.5" />
          <div className="skeleton-shimmer h-2.5 w-1/3 rounded" />
        </div>
      </div>
    </div>
  );
}
