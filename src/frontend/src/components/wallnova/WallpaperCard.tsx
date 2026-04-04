import { Download, Heart } from "lucide-react";
import { useCallback } from "react";
import type { PexelsPhoto } from "../../types/pexels";

interface WallpaperCardProps {
  photo: PexelsPhoto;
  isFavorited: boolean;
  onToggleFavorite: (photo: PexelsPhoto) => void;
  onOpen: (photo: PexelsPhoto) => void;
  index: number;
}

export default function WallpaperCard({
  photo,
  isFavorited,
  onToggleFavorite,
  onOpen,
  index,
}: WallpaperCardProps) {
  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite(photo);
    },
    [photo, onToggleFavorite],
  );

  const handleDownloadClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        const response = await fetch(photo.src.large2x);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `wallnova-${photo.id}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
        // Fallback: open in new tab
        window.open(photo.src.large2x, "_blank");
      }
    },
    [photo.src.large2x, photo.id],
  );

  // Aspect ratio based on photo dimensions
  const aspectRatio = photo.width / photo.height;
  const paddingBottom = `${(1 / aspectRatio) * 100}%`;

  return (
    <button
      type="button"
      className="wallpaper-card wallpaper-grid-item text-left w-full"
      onClick={() => onOpen(photo)}
      data-ocid={`gallery.item.${index}`}
    >
      {/* Image container with natural aspect ratio */}
      <div className="relative w-full" style={{ paddingBottom }}>
        <img
          src={photo.src.medium}
          alt={photo.alt || `Wallpaper by ${photo.photographer}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ backgroundColor: photo.avg_color || "oklch(11% 0.015 260)" }}
        />

        {/* Overlay */}
        <div className="card-overlay">
          <button
            type="button"
            onClick={handleDownloadClick}
            className="download-pill"
            data-ocid={`gallery.download_button.${index}`}
          >
            <Download className="inline w-3 h-3 mr-1.5" />
            Download HD
          </button>
        </div>

        {/* Heart button */}
        <button
          type="button"
          className={`heart-btn ${isFavorited ? "active" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
          data-ocid={`gallery.heart.${index}`}
        >
          <Heart
            className="w-4 h-4"
            style={{
              color: isFavorited
                ? "oklch(68% 0.26 330)"
                : "oklch(72% 0.03 260)",
              fill: isFavorited ? "oklch(68% 0.26 330)" : "transparent",
            }}
          />
        </button>

        {/* Resolution badge */}
        <div
          className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs font-semibold"
          style={{
            background: "oklch(8% 0.01 260 / 0.7)",
            color: "oklch(84% 0.19 200)",
            border: "1px solid oklch(84% 0.19 200 / 0.3)",
            backdropFilter: "blur(4px)",
          }}
        >
          {photo.width >= 3840 ? "4K" : photo.width >= 1920 ? "HD" : "SD"}
        </div>
      </div>

      {/* Card info */}
      <div className="px-3 py-2 bg-card">
        <p className="text-xs text-foreground font-medium truncate">
          {photo.alt || `Photo by ${photo.photographer}`}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {photo.width} × {photo.height}
        </p>
      </div>
    </button>
  );
}
