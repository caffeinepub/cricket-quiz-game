export default function Footer() {
  const year = new Date().getFullYear();

  const categoryLinks = [
    { label: "Nature", query: "nature" },
    { label: "Cars", query: "cars" },
    { label: "Anime", query: "anime" },
    { label: "Gaming", query: "gaming" },
    { label: "Space", query: "space" },
    { label: "Technology", query: "technology" },
  ];

  return (
    <footer
      className="mt-16 border-t"
      style={{ borderColor: "oklch(22% 0.02 260)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/assets/generated/wallnova-logo-transparent.dim_400x400.png"
                alt="WallNova HD"
                className="w-8 h-8 object-contain"
              />
              <span className="font-display font-bold text-foreground">
                WallNova <span className="gradient-text">HD</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Browse and download stunning HD and 4K wallpapers powered by
              Pexels. Free for personal and commercial use.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">
              Categories
            </h4>
            <ul className="space-y-2">
              {categoryLinks.map((cat) => (
                <li key={cat.query}>
                  <a
                    href={`#${cat.query}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.label} Wallpapers
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">
              About
            </h4>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              WallNova HD delivers curated high-resolution wallpapers from
              Pexels API. Download, save favorites, and discover stunning
              visuals.
            </p>
            <p className="text-sm text-muted-foreground">
              Support:{" "}
              <a
                href="tel:9241763753"
                className="text-foreground hover:text-accent transition-colors"
              >
                9241763753
              </a>
            </p>
          </div>
        </div>

        {/* Footer links row */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t text-xs text-muted-foreground"
          style={{ borderColor: "oklch(22% 0.02 260)" }}
        >
          <div className="flex items-center gap-4">
            <a
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a href="/faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
            <a
              href="tel:9241763753"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
          <p>© {year} WallNova HD. Created by Kush Ranjan</p>
        </div>
      </div>
    </footer>
  );
}
