import { Search } from "lucide-react";
import { useCallback, useState } from "react";
import type { Category } from "../../types/pexels";

const CATEGORIES: Category[] = [
  { label: "Nature", query: "nature" },
  { label: "Cars", query: "cars" },
  { label: "Anime", query: "anime" },
  { label: "Gaming", query: "gaming" },
  { label: "Space", query: "space" },
  { label: "Technology", query: "technology" },
  { label: "4K", query: "4k wallpaper" },
  { label: "Mobile", query: "mobile wallpaper" },
];

export { CATEGORIES };

interface HeroProps {
  activeCategory: string;
  onCategoryChange: (query: string) => void;
  onSearch: (query: string) => void;
}

export default function Hero({
  activeCategory,
  onCategoryChange,
  onSearch,
}: HeroProps) {
  const [query, setQuery] = useState("");

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSearch();
    },
    [handleSearch],
  );

  return (
    <section
      className="relative py-16 sm:py-24 px-4 text-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(57% 0.28 295 / 0.12) 0%, transparent 70%), oklch(8% 0.01 260)",
      }}
    >
      {/* Subtle grid bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(57% 0.28 295 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(57% 0.28 295 / 0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-5 animate-fade-up stagger-1">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "oklch(57% 0.28 295 / 0.12)",
              border: "1px solid oklch(57% 0.28 295 / 0.4)",
              color: "oklch(84% 0.19 200)",
            }}
          >
            ✦ Powered by Pexels
          </span>
        </div>

        {/* Main headline */}
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-4 animate-fade-up stagger-2">
          <span className="text-foreground">Download </span>
          <span className="gradient-text-glow">100,000+</span>
          <br />
          <span className="text-foreground">Stunning HD Wallpapers</span>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg mb-8 animate-fade-up stagger-3">
          Free high-resolution wallpapers for desktop & mobile. Nature, Space,
          Gaming & more.
        </p>

        {/* Search bar */}
        <div className="flex gap-0 rounded-full overflow-hidden border border-border search-input bg-input animate-fade-up stagger-4 max-w-xl mx-auto shadow-elevated">
          <div className="flex items-center gap-2 flex-1 px-4">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search cars, anime, space, nature..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
              data-ocid="hero.search_input"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="px-5 py-3 font-semibold text-sm transition-all duration-200 flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(57% 0.28 295), oklch(84% 0.19 200))",
              color: "white",
            }}
            data-ocid="hero.search_button"
          >
            Search
          </button>
        </div>

        {/* Category chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-up stagger-4">
          <button
            type="button"
            className={`category-chip ${activeCategory === "" ? "active" : ""}`}
            onClick={() => onCategoryChange("")}
            data-ocid="hero.all.tab"
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              type="button"
              className={`category-chip ${
                activeCategory === cat.query ? "active" : ""
              }`}
              onClick={() => onCategoryChange(cat.query)}
              data-ocid={`hero.${cat.label.toLowerCase()}.tab`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
