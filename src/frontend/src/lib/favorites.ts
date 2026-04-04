import type { PexelsPhoto } from "../types/pexels";

const STORAGE_KEY = "wallnova_favorites";

export function getFavorites(): PexelsPhoto[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as PexelsPhoto[];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: PexelsPhoto[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function isFavorited(
  photo: PexelsPhoto,
  favorites: PexelsPhoto[],
): boolean {
  return favorites.some((f) => f.id === photo.id);
}

export function toggleFavorite(
  photo: PexelsPhoto,
  favorites: PexelsPhoto[],
): PexelsPhoto[] {
  if (isFavorited(photo, favorites)) {
    return favorites.filter((f) => f.id !== photo.id);
  }
  return [...favorites, photo];
}
