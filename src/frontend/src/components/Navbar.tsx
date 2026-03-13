import { Link } from "@tanstack/react-router";
import { Gamepad2, Menu, Trophy, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/games", label: "Games" },
  { to: "/leaderboard", label: "Leaderboard" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:glow-purple transition-all">
            <Gamepad2 className="w-5 h-5 text-neon-purple" />
          </div>
          <span className="font-display font-bold text-xl">
            <span className="neon-text-purple">Kuzo</span>
            <span className="text-foreground"> Game Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              activeProps={{ className: "text-foreground bg-muted/50" }}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/leaderboard"
            className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-neon-purple text-sm font-semibold hover:bg-primary/30 transition-all"
            data-ocid="nav.leaderboard_link"
          >
            <Trophy className="w-4 h-4" />
            Scores
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-all"
          onClick={() => setOpen(!open)}
          data-ocid="nav.toggle"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-6 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
              onClick={() => setOpen(false)}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
