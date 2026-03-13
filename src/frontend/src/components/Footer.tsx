import { Gamepad2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-neon-purple" />
          <span className="font-display font-bold text-lg">
            <span className="neon-text-purple">Kuzo</span>
            <span className="text-foreground"> Game Hub</span>
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          Created by{" "}
          <span className="text-neon-cyan font-semibold">Kush Ranjan</span>
        </p>
        <div className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} Kuzo Game Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
