import { Heart, Search, Sparkles, X } from "lucide-react";
import { useCallback, useState } from "react";
import type { AppView } from "../../types/pexels";

interface NavbarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  favoritesCount: number;
  navSearch: string;
  onNavSearch: (query: string) => void;
  onNavSearchSubmit: (query: string) => void;
}

export default function Navbar({
  currentView,
  onViewChange,
  favoritesCount,
  navSearch,
  onNavSearch,
  onNavSearchSubmit,
}: NavbarProps) {
  const [focused, setFocused] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && navSearch.trim()) {
        onNavSearchSubmit(navSearch.trim());
        if (currentView !== "home") onViewChange("home");
      }
    },
    [navSearch, onNavSearchSubmit, currentView, onViewChange],
  );

  return (
    <header className="navbar-glass sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2 flex-shrink-0 cursor-pointer select-none bg-transparent border-none p-0"
            onClick={() => onViewChange("home")}
            data-ocid="nav.link"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
              style={{
                background:
                  "linear-gradient(135deg, oklch(57% 0.28 295), oklch(84% 0.19 200))",
                boxShadow: "0 0 15px oklch(57% 0.28 295 / 0.5)",
              }}
            >
              <span className="text-white">W</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground hidden sm:block">
              WallNova <span className="gradient-text">HD</span>
            </span>
          </button>

          {/* Nav Search (desktop) */}
          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-200 ${
                focused
                  ? "search-input bg-input border border-neon-cyan/50"
                  : "bg-input border border-border"
              }`}
            >
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search wallpapers..."
                value={navSearch}
                onChange={(e) => onNavSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                data-ocid="nav.search_input"
              />
              {navSearch && (
                <button
                  type="button"
                  onClick={() => {
                    onNavSearch("");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right nav links */}
          <nav className="flex items-center gap-1 ml-auto">
            <button
              type="button"
              onClick={() => onViewChange("home")}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === "home"
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              data-ocid="nav.discover.link"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Discover
            </button>

            <button
              type="button"
              onClick={() => onViewChange("favorites")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === "favorites"
                  ? "text-neon-pink"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              data-ocid="nav.favorites.link"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  currentView === "favorites" ? "fill-neon-pink" : ""
                }`}
                style={{
                  color:
                    currentView === "favorites"
                      ? "oklch(68% 0.26 330)"
                      : undefined,
                }}
              />
              <span className="hidden sm:inline">Favorites</span>
              {favoritesCount > 0 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{
                    background: "oklch(68% 0.26 330 / 0.15)",
                    color: "oklch(68% 0.26 330)",
                    border: "1px solid oklch(68% 0.26 330 / 0.4)",
                  }}
                >
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
