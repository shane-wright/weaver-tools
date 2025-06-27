# Coding Standards for Star Wars Side-Scroller

This document defines the coding standards and technologies used for the Star Wars side-scroller game to ensure consistent, maintainable, and high-quality code, including Star Wars-themed assets.

## Technologies
- **Frontend**:
  - HTML5: For the application structure.
  - JavaScript (ES6+): For game logic and Canvas API rendering.
  - Canvas API: For 2D rendering of sprites (X-Wing, TIE Fighters, lasers).
- **Assets**:
  - Sprites: PNG images (`x-wing.png`, `tie-fighter.png`, `laser.png`) for visual elements.
  - Audio: MP3 files (`laser.mp3`, `explosion.mp3`) for sound effects.
- **Backend**:
  - Tauri: Rust-based framework for bundling the web app into a desktop application.
- **Build Tools**:
  - Node.js: For managing dependencies and development scripts.
  - Rust: For Tauri’s backend and build process.
  - Tauri CLI: For development and bundling.

## Coding Standards
### JavaScript
- **Style**:
  - Use ESLint with Airbnb’s JavaScript style guide as a base.
  - Use `const` for variables that won’t be reassigned; use `let` for variables that will.
  - Prefer arrow functions for event handlers and callbacks.
  - Use camelCase for variable and function names.
  - Indent with 2 spaces, no tabs.
- **Structure**:
  - Organize code into logical sections (e.g., asset loading, player logic, enemy logic, rendering).
  - Keep functions small and focused (single responsibility principle).
  - Use descriptive variable/function names (e.g., `xWingImg` instead of `img1`).
- **Asset Handling**:
  - Load images with `new Image()` and ensure `onload` is used before rendering.
  - Use `<audio>` elements for sound effects, with `play()` triggered on events (e.g., laser firing, enemy destruction).
  - Provide fallback rendering (e.g., shapes) if assets fail to load.
- **Error Handling**:
  - Validate canvas context and asset loading before rendering.
  - Handle edge cases (e.g., out-of-bounds coordinates, array bounds, audio playback failures).
- **Comments**:
  - Use `//` for single-line comments explaining complex logic.
  - Use JSDoc for functions to document parameters and return values.

### HTML
- Use semantic HTML5 elements where applicable.
- Keep inline CSS minimal; prefer a `<style>` block in `index.html`.
- Include `<audio>` tags for sound effects with clear IDs.
- Ensure canvas element has an ID for JavaScript access.

### Tauri
- Keep `tauri.conf.json` minimal, enabling only necessary permissions (e.g., no file I/O unless required).
- Update Content Security Policy (CSP) to allow audio playback: `default-src 'self' blob: data:`.
- Use a single window configuration with fixed dimensions (800x600) unless specified otherwise.

### Asset Guidelines
- **Sprites**:
  - Format: PNG with transparent backgrounds.
  - Sizes: X-Wing (50x30 pixels), TIE Fighter (40x30 pixels), Laser (10x4 pixels).
  - Store in `src/assets/`.
  - Load asynchronously with `Promise.all` to ensure rendering starts after assets are ready.
- **Audio**:
  - Format: MP3 for compatibility.
  - Files: `laser.mp3` (firing sound), `explosion.mp3` (enemy destruction).
  - Keep files short (<1 second) to minimize latency.
  - Store in `src/assets/`.
- **Legal Note**: Assets must be created or sourced legally for personal use to avoid Star Wars IP issues.

### File Structure
- `src/index.html`: Main game file.
- `src/assets/`: Sprites (`x-wing.png`, `tie-fighter.png`, `laser.png`) and audio (`laser.mp3`, `explosion.mp3`).
- `src-tauri/tauri.conf.json`: Tauri configuration.
- `src-tauri/icons/`: App icons.

### Version Control
- Commit messages: `[Type]: Short description` (e.g., `feat: Add sprite rendering`).
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- Create feature branches (e.g., `feature/sprite-system`) and merge via pull requests.

### Testing
- Test game in browser before Tauri bundling to ensure asset loading and compatibility.
- Verify controls, collision detection, scoring, and audio playback in each build.
- Check Tauri builds on target platforms (Windows, macOS, Linux).

### Performance
- Optimize Canvas rendering by minimizing redraws (e.g., clear only necessary areas).
- Limit enemy and laser arrays to prevent memory leaks.
- Cap frame rate using `requestAnimationFrame`.
- Ensure audio files are lightweight to avoid playback delays.

### Linting and Formatting
- Use ESLint (`npm install eslint --save-dev`) with Airbnb rules:
  ```bash
  npx eslint --init
  ```
- Run `eslint .` before commits.
- Format with Prettier:
  ```bash
  npm install prettier --save-dev
  npx prettier --write .
  ```

### Example Code Snippet
```javascript
// Load and draw X-Wing sprite
const xWingImg = new Image();
xWingImg.src = 'assets/x-wing.png';
function drawPlayer() {
  if (xWingImg.complete) {
    ctx.drawImage(xWingImg, player.x, player.y, player.width, player.height);
  } else {
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x + player.width, player.y + player.height / 2);
    ctx.closePath();
    ctx.fill();
  }
}
```

## Extending the Project
- Add more sprites (e.g., backgrounds, power-ups) using the same `Image` loading pattern.
- Implement additional sounds (e.g., background music) with `<audio>` tags, ensuring CSP compliance.
- Add features (e.g., levels, power-ups) in modular functions.

Follow these standards to ensure a consistent, scalable, and Star Wars-themed codebase.
