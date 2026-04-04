import { ImageOff, Loader2 } from "lucide-react";
import type { PexelsPhoto } from "../../types/pexels";
import SkeletonCard from "./SkeletonCard";
import WallpaperCard from "./WallpaperCard";

interface WallpaperGridProps {
  photos: PexelsPhoto[];
  favorites: PexelsPhoto[];
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onToggleFavorite: (photo: PexelsPhoto) => void;
  onOpen: (photo: PexelsPhoto) => void;
  onLoadMore: () => void;
  emptyMessage?: string;
}

export default function WallpaperGrid({
  photos,
  favorites,
  loading,
  hasMore,
  loadingMore,
  onToggleFavorite,
  onOpen,
  onLoadMore,
  emptyMessage = "No wallpapers found. Try a different search.",
}: WallpaperGridProps) {
  const favoriteIds = new Set(favorites.map((f) => f.id));

  if (loading && photos.length === 0) {
    return (
      <div className="wallpaper-grid px-4 sm:px-6 max-w-7xl mx-auto">
        {Array.from({ length: 12 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable IDs
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    );
  }

  if (!loading && photos.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 text-center px-4"
        data-ocid="gallery.empty_state"
      >
        <ImageOff
          className="w-16 h-16 mb-4"
          style={{ color: "oklch(57% 0.28 295 / 0.5)" }}
        />
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          No wallpapers found
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="wallpaper-grid">
        {photos.map((photo, i) => (
          <WallpaperCard
            key={photo.id}
            photo={photo}
            isFavorited={favoriteIds.has(photo.id)}
            onToggleFavorite={onToggleFavorite}
            onOpen={onOpen}
            index={i + 1}
          />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center mt-10 mb-4">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200 disabled:opacity-60"
            style={{
              border: "1px solid oklch(57% 0.28 295 / 0.6)",
              background: "oklch(57% 0.28 295 / 0.08)",
              color: "oklch(84% 0.19 200)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 20px oklch(57% 0.28 295 / 0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
            data-ocid="gallery.load_more.button"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Wallpapers"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
