import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import EndlessRunner from "./pages/EndlessRunner";
import Games from "./pages/Games";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Ludo from "./pages/Ludo";
import Puzzle from "./pages/Puzzle";
import Quiz from "./pages/Quiz";
import Racing from "./pages/Racing";
import Survival from "./pages/Survival";

const queryClient = new QueryClient();

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col game-bg">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games",
  component: Games,
});
const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz",
  component: Quiz,
});
const puzzleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/puzzle",
  component: Puzzle,
});
const racingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/racing",
  component: Racing,
});
const survivalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/survival",
  component: Survival,
});
const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: Leaderboard,
});
const ludoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ludo",
  component: Ludo,
});
const runnerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/runner",
  component: EndlessRunner,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  gamesRoute,
  quizRoute,
  puzzleRoute,
  racingRoute,
  survivalRoute,
  leaderboardRoute,
  ludoRoute,
  runnerRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
