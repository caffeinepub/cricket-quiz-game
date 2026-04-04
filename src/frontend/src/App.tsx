import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ApiKeyBanner from "./components/wallnova/ApiKeyBanner";
import Footer from "./components/wallnova/Footer";
import Hero from "./components/wallnova/Hero";
import Navbar from "./components/wallnova/Navbar";
import WallpaperGrid from "./components/wallnova/WallpaperGrid";
import WallpaperModal from "./components/wallnova/WallpaperModal";
import {
  getFavorites,
  isFavorited,
  saveFavorites,
  toggleFavorite,
} from "./lib/favorites";
import {
  IS_PLACEHOLDER_KEY,
  fetchCuratedPhotos,
  searchPhotos,
} from "./lib/pexels";
import type { AppView, PexelsPhoto, PexelsResponse } from "./types/pexels";

const queryClient = new QueryClient();

function WallNovaApp() {
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState<PexelsPhoto[]>(() =>
    getFavorites(),
  );
  const [selectedPhoto, setSelectedPhoto] = useState<PexelsPhoto | null>(null);
  const [navSearch, setNavSearch] = useState("");

  const abortRef = useRef<AbortController | null>(null);

  // Fetch photos
  const fetchPhotos = useCallback(
    async (
      query: string,
      category: string,
      pageNum: number,
      append: boolean,
    ) => {
      if (IS_PLACEHOLDER_KEY) return;

      // Cancel previous request
      if (abortRef.current) abortRef.current.abort();

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        let result: PexelsResponse;
        const effectiveQuery = query || category;

        if (effectiveQuery) {
          result = await searchPhotos(effectiveQuery, pageNum);
        } else {
          result = await fetchCuratedPhotos(pageNum);
        }

        const newPhotos = result.photos;
        setPhotos((prev) => (append ? [...prev, ...newPhotos] : newPhotos));
        setHasMore(newPhotos.length === 30 && !!result.next_page);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          toast.error("Failed to load wallpapers. Check your API key.");
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  // Initial load & when query/category changes
  useEffect(() => {
    if (currentView !== "home") return;
    fetchPhotos(searchQuery, activeCategory, 1, false);
    setPage(1);
  }, [searchQuery, activeCategory, currentView, fetchPhotos]);

  const handleCategoryChange = useCallback((query: string) => {
    setActiveCategory(query);
    setSearchQuery("");
    setCurrentView("home");
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setActiveCategory("");
    setCurrentView("home");
  }, []);

  const handleNavSearchSubmit = useCallback((query: string) => {
    setSearchQuery(query);
    setActiveCategory("");
    setCurrentView("home");
  }, []);

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPhotos(searchQuery, activeCategory, nextPage, true);
  }, [page, searchQuery, activeCategory, fetchPhotos]);

  const handleToggleFavorite = useCallback((photo: PexelsPhoto) => {
    setFavorites((prev) => {
      const next = toggleFavorite(photo, prev);
      saveFavorites(next);
      const wasAdded = next.length > prev.length;
      if (wasAdded) {
        toast.success("Added to favorites!");
      } else {
        toast("Removed from favorites");
      }
      return next;
    });
  }, []);

  const handleViewChange = useCallback((view: AppView) => {
    setCurrentView(view);
  }, []);

  const currentPhotos = currentView === "favorites" ? favorites : photos;

  const modalFavorited = selectedPhoto
    ? isFavorited(selectedPhoto, favorites)
    : false;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "oklch(8% 0.01 260)" }}
    >
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        favoritesCount={favorites.length}
        navSearch={navSearch}
        onNavSearch={setNavSearch}
        onNavSearchSubmit={handleNavSearchSubmit}
      />

      {IS_PLACEHOLDER_KEY && <ApiKeyBanner />}

      {currentView === "home" && (
        <Hero
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
        />
      )}

      {currentView === "favorites" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-4 w-full">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              My Favorites
            </h2>
            <span
              className="text-sm px-2.5 py-0.5 rounded-full font-semibold"
              style={{
                background: "oklch(68% 0.26 330 / 0.12)",
                color: "oklch(68% 0.26 330)",
                border: "1px solid oklch(68% 0.26 330 / 0.35)",
              }}
            >
              {favorites.length}
            </span>
          </div>
        </div>
      )}

      <main className="flex-1 pb-8">
        <WallpaperGrid
          photos={currentPhotos}
          favorites={favorites}
          loading={loading}
          hasMore={currentView === "home" && hasMore}
          loadingMore={loadingMore}
          onToggleFavorite={handleToggleFavorite}
          onOpen={setSelectedPhoto}
          onLoadMore={handleLoadMore}
          emptyMessage={
            currentView === "favorites"
              ? "You haven't saved any favorites yet. Browse wallpapers and click the heart icon!"
              : "No wallpapers found. Try a different search term or category."
          }
        />
      </main>

      <Footer />

      {selectedPhoto && (
        <WallpaperModal
          photo={selectedPhoto}
          isFavorited={modalFavorited}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WallNovaApp />
    </QueryClientProvider>
  );
}
