import { create } from "zustand";

interface GameStore {
  health: number;
  speed: number;
  wantedLevel: number;
  isPlaying: boolean;
  setHealth: (health: number) => void;
  setSpeed: (speed: number) => void;
  setWantedLevel: (level: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  health: 100,
  speed: 0,
  wantedLevel: 0,
  isPlaying: false,
  setHealth: (health) => set({ health }),
  setSpeed: (speed) => set({ speed }),
  setWantedLevel: (wantedLevel) => set({ wantedLevel }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}));
