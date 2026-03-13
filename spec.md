# Kuzo Game Hub

## Current State
Kuzo Game Hub has 4 games: Quiz Challenge, Tile Puzzle, Neon Racer, Survival. Routes exist for /quiz, /puzzle, /racing, /survival. Games are listed in Games.tsx with cards.

## Requested Changes (Diff)

### Add
- Ludo game page (/ludo): 2-4 player Ludo board game playable in browser. Canvas or CSS-based board. 2 players (Player vs Computer). Dice roll mechanic. Token movement on classic Ludo board.
- Endless Runner game page (/runner): Subway Surfers style side-scrolling endless runner. Player runs, jumps over obstacles, collects coins. Increasing speed. Score display. Game over on collision.
- Both games added to Games.tsx cards list.
- Both routes added to App.tsx.

### Modify
- Games.tsx: add 2 new game cards for Ludo and Endless Runner.
- App.tsx: add /ludo and /runner routes.

### Remove
- Nothing removed.

## Implementation Plan
1. Create src/frontend/src/pages/Ludo.tsx - full Ludo game with canvas, 2 players (human vs CPU), dice, token movement
2. Create src/frontend/src/pages/EndlessRunner.tsx - side-scrolling runner game with canvas, jump mechanic, obstacles, coins, score
3. Update Games.tsx to add 2 new game cards
4. Update App.tsx to add routes and imports
5. Validate
