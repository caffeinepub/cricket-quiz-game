import { Download, ExternalLink, Heart, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { PexelsPhoto } from "../../types/pexels";

interface WallpaperModalProps {
  photo: PexelsPhoto | null;
  isFavorited: boolean;
  onToggleFavorite: (photo: PexelsPhoto) => void;
  onClose: () => void;
}

export default function WallpaperModal({
  photo,
  isFavorited,
  onToggleFavorite,
  onClose,
}: WallpaperModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  const photoId = photo?.id;
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset when photo changes
  useEffect(() => {
    setImgLoaded(false);
  }, [photoId]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) onClose();
    },
    [onClose],
  );

  const handleBackdropKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  const handleDownload = useCallback(async () => {
    if (!photo) return;
    setDownloading(true);
    try {
      const response = await fetch(photo.src.large2x || photo.src.large);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wallnova-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Wallpaper downloaded!");
    } catch {
      // Fallback: open image in new tab
      window.open(photo.src.large2x || photo.src.large, "_blank");
      toast.success("Opened in new tab for download");
    } finally {
      setDownloading(false);
    }
  }, [photo]);

  if (!photo) return null;

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop animate-fade-in"
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
      data-ocid="wallpaper.modal"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: "oklch(10% 0.015 260)",
          border: "1px solid oklch(22% 0.02 260)",
          boxShadow:
            "0 0 60px oklch(57% 0.28 295 / 0.2), 0 25px 80px oklch(0 0 0 / 0.7)",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: "oklch(8% 0.01 260 / 0.8)",
            border: "1px solid oklch(22% 0.02 260)",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "oklch(84% 0.19 200 / 0.6)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "oklch(22% 0.02 260)";
          }}
          data-ocid="wallpaper.close_button"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>

        {/* Image */}
        <div className="relative flex-1 min-h-0 bg-card">
          {!imgLoaded && (
            <div
              className="absolute inset-0 skeleton-shimmer"
              style={{ minHeight: "300px" }}
              data-ocid="wallpaper.loading_state"
            />
          )}
          <img
            src={photo.src.large2x || photo.src.large}
            alt={photo.alt || `Wallpaper by ${photo.photographer}`}
            className="w-full object-contain max-h-[60vh]"
            style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.3s" }}
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        {/* Info & actions */}
        <div className="px-5 py-4 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Photo info */}
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-semibold text-sm truncate">
                {photo.alt || `Photo by ${photo.photographer}`}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground">
                  {photo.width} × {photo.height}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded font-semibold"
                  style={{
                    background: "oklch(84% 0.19 200 / 0.1)",
                    color: "oklch(84% 0.19 200)",
                    border: "1px solid oklch(84% 0.19 200 / 0.3)",
                  }}
                >
                  {photo.width >= 3840
                    ? "4K"
                    : photo.width >= 1920
                      ? "Full HD"
                      : "HD"}
                </span>
                <a
                  href={photo.photographer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {photo.photographer}
                </a>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => onToggleFavorite(photo)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  border: `1px solid ${
                    isFavorited ? "oklch(68% 0.26 330)" : "oklch(22% 0.02 260)"
                  }`,
                  background: isFavorited
                    ? "oklch(68% 0.26 330 / 0.12)"
                    : "transparent",
                  color: isFavorited
                    ? "oklch(68% 0.26 330)"
                    : "oklch(72% 0.03 260)",
                }}
                data-ocid="wallpaper.favorite_button"
              >
                <Heart
                  className="w-4 h-4"
                  style={{
                    fill: isFavorited ? "oklch(68% 0.26 330)" : "transparent",
                  }}
                />
                {isFavorited ? "Favorited" : "Favorite"}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(57% 0.28 295), oklch(84% 0.19 200))",
                  boxShadow: "0 0 15px oklch(57% 0.28 295 / 0.3)",
                }}
                data-ocid="wallpaper.download_button"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download HD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
