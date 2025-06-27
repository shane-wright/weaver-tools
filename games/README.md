# Star Wars Side-Scroller Game

A Star Wars-themed side-scroller game built with JavaScript, Canvas API, and Tauri. Players control an X-Wing, shoot lasers to destroy TIE Fighters, and avoid collisions to earn points. The game includes Star Wars-themed sprites and sound effects for an immersive experience.

## Features
- **Player Controls**: Move the X-Wing with arrow keys and fire lasers with the spacebar.
- **Enemies**: TIE Fighters spawn from the right and move left.
- **Scoring**: Earn 10 points per TIE Fighter destroyed.
- **Game Over**: Colliding with an enemy resets the game.
- **Assets**: Custom X-Wing, TIE Fighter, and laser sprites, plus laser and explosion sound effects.
- **Desktop App**: Bundled as a lightweight desktop application using Tauri.

## Technologies
- **Frontend**: HTML5, JavaScript, Canvas API
- **Assets**: PNG images for sprites, MP3 files for sound effects
- **Backend**: Tauri (Rust-based framework for desktop apps)
- **Build Tools**: Node.js, Rust, Tauri CLI

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://www.rust-lang.org/) (stable)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites) (`cargo install tauri-cli`)

## Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd star-wars-scroller
   ```
2. Install Tauri CLI:
   ```bash
   cargo install tauri-cli
   ```
3. Place the `index.html` file in the `src` directory.
4. Add assets to `src/assets/`:
   - `x-wing.png`: X-Wing sprite (50x30 pixels recommended).
   - `tie-fighter.png`: TIE Fighter sprite (40x30 pixels recommended).
   - `laser.png`: Laser sprite (10x4 pixels recommended).
   - `laser.mp3`: Laser firing sound.
   - `explosion.mp3`: Enemy destruction sound.
   - Ensure assets are legally sourced or created for personal use.
5. Ensure icon files are in `src-tauri/icons/` (generate using `tauri icon` if needed).

## Running the Game
- **Development**:
  ```bash
  cargo tauri dev
  ```
  This starts a local server and opens the game in a desktop window.
- **Build**:
  ```bash
  cargo tauri build
  ```
  This creates a standalone desktop app in `src-tauri/target/release`.

## Playing the Game
- **Controls**:
  - Arrow keys: Move X-Wing (left, right, up, down)
  - Spacebar: Fire lasers (triggers laser sound)
- **Objective**: Destroy TIE Fighters to earn points, avoid collisions.
- **Visuals and Audio**: X-Wing and TIE Fighter sprites, laser effects, starry background, with laser and explosion sounds.

## Project Structure
- `src/index.html`: Main game file with HTML, JavaScript, and Canvas logic.
- `src/assets/`: Sprites (`x-wing.png`, `tie-fighter.png`, `laser.png`) and audio (`laser.mp3`, `explosion.mp3`).
- `src-tauri/tauri.conf.json`: Tauri configuration for desktop bundling.
- `src-tauri/icons/`: Icon files for the desktop app.

## Asset Guidelines
- **Sprites**: Use PNGs with transparent backgrounds for best rendering. Recommended sizes:
  - X-Wing: 50x30 pixels
  - TIE Fighter: 40x30 pixels
  - Laser: 10x4 pixels
- **Audio**: Use MP3 files for compatibility. Keep files short (e.g., <1 second) to avoid delays.
- **Sourcing**: Create assets or source legally for personal use to avoid copyright issues with Star Wars IP.

## Contributing
See `coding-standards.md` for coding guidelines and `ask.md` for the business ask and application narrative.

## License
For personal use only, not for distribution due to potential Star Wars IP considerations.
