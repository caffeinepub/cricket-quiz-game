# WallNova HD

## Current State
New project -- no existing code.

## Requested Changes (Diff)

### Add
- Full wallpaper browsing website called "WallNova HD"
- Pexels API integration (frontend HTTP outcalls) with placeholder API key
- Homepage with hero section, search bar, category filters
- Masonry/Pinterest-style grid layout
- Wallpaper preview modal with HD download button
- Favorites system using localStorage (save/remove)
- Load More pagination
- Contact section with support number: 9241763753
- Footer with category links and about section
- Dark neon UI (black background + neon gradients)

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend
- Minimal Motoko backend (no backend logic needed -- all Pexels API calls happen from frontend)
- Simple actor with a greeting or health check

### Frontend
- `App.tsx`: Main app with routing/state
- `components/Hero.tsx`: Hero section with search bar
- `components/Gallery.tsx`: Masonry grid of wallpapers fetched from Pexels API
- `components/WallpaperCard.tsx`: Individual card with hover effects, favorite button
- `components/Modal.tsx`: Full-screen preview with download button and resolution display
- `components/CategoryFilter.tsx`: Category pills (Nature, Cars, Anime, Gaming, Space, Technology, 4K, Mobile)
- `components/Favorites.tsx`: Favorites page/section using localStorage
- `components/Footer.tsx`: Links and about section
- `hooks/usePexels.ts`: Custom hook for Pexels API calls (search, curated, pagination)
- `hooks/useFavorites.ts`: Custom hook for localStorage favorites management
- Pexels API key stored as a constant with placeholder `YOUR_PEXELS_API_KEY`
- Categories map to Pexels search queries
- Lazy loading via IntersectionObserver or native loading="lazy"
- Mobile-first responsive design
