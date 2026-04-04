import { AlertTriangle } from "lucide-react";

export default function ApiKeyBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
      <div className="api-banner flex items-start sm:items-center gap-3">
        <AlertTriangle
          className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0"
          style={{ color: "oklch(75% 0.22 60)" }}
        />
        <div className="flex-1 text-left">
          <span
            className="font-semibold"
            style={{ color: "oklch(75% 0.22 60)" }}
          >
            API Key Required:{" "}
          </span>
          <span>
            Open{" "}
            <code className="bg-secondary px-1 rounded text-xs">
              src/frontend/src/lib/pexels.ts
            </code>{" "}
            and replace{" "}
            <code className="bg-secondary px-1 rounded text-xs">
              YOUR_PEXELS_API_KEY
            </code>{" "}
            with your free Pexels API key from{" "}
            <a
              href="https://www.pexels.com/api/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
              style={{ color: "oklch(84% 0.19 200)" }}
            >
              pexels.com/api
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
