# WallNova HD

## Current State
WallNova HD is a wallpaper download site using Pexels API. Features: dark UI, grid layout, search, categories, favorites (localStorage), HD download, wallpaper modal. The backend has authorization component (role-based access control) and http-outcalls. The app currently has no login/signup UI -- it's a purely frontend experience with no user accounts.

## Requested Changes (Diff)

### Add
- Login / Signup page with email + password (using the existing authorization component)
- Navbar login/logout button -- shows user's email when logged in
- Protected favorites: favorites still work for guests but show a prompt to sign in for saving across devices
- Support section (phone number: 9241763753) in the footer or a dedicated support page/modal

### Modify
- Footer: Add support contact number 9241763753
- Navbar: Add Login/Signup button, show logged-in state
- Backend: Add user registration (email+password stored in canister), login via password check, logout

### Remove
- Nothing removed

## Implementation Plan
1. Update backend (main.mo) to add: user registration with email+password (hashed), login function, getLoggedInUser query. Use existing authorization component.
2. Add frontend Auth page (Login + Signup tabs) as a modal or separate route.
3. Update Navbar to show Login button (opens auth modal) or logged-in user email with logout.
4. Update Footer to show support number 9241763753.
5. Keep all existing wallpaper features (search, categories, favorites, download) unchanged.
