import { Heart, LogIn, LogOut, Search, Sparkles, User, X } from "lucide-react";
import { useCallback, useState } from "react";
import type { AppView } from "../../types/pexels";

interface NavbarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  favoritesCount: number;
  navSearch: string;
  onNavSearch: (query: string) => void;
  onNavSearchSubmit: (query: string) => void;
  userEmail: string | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Navbar({
  currentView,
  onViewChange,
  favoritesCount,
  navSearch,
  onNavSearch,
  onNavSearchSubmit,
  userEmail,
  onOpenAuth,
  onLogout,
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

  // Truncate email for display
  const displayEmail = userEmail
    ? userEmail.length > 18
      ? `${userEmail.slice(0, 15)}...`
      : userEmail
    : null;

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
            <img
              src="/assets/generated/wallnova-logo-transparent.dim_400x400.png"
              alt="WallNova HD"
              className="w-8 h-8 object-contain"
            />
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

            {/* Auth button */}
            {userEmail ? (
              <div className="flex items-center gap-1">
                <div
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: "oklch(57% 0.28 295 / 0.1)",
                    border: "1px solid oklch(57% 0.28 295 / 0.3)",
                    color: "oklch(72% 0.15 295)",
                  }}
                >
                  <User className="w-3 h-3" />
                  <span className="max-w-[120px] truncate">{displayEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  title="Logout"
                  data-ocid="nav.logout.button"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(57% 0.28 295 / 0.2), oklch(84% 0.19 200 / 0.15))",
                  border: "1px solid oklch(57% 0.28 295 / 0.5)",
                  color: "oklch(84% 0.19 200)",
                }}
                data-ocid="nav.login.button"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
