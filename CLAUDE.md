# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # start the static server
node server.js   # run the dev server directly
```

- Serves at `http://localhost:8080/` by default; override with `PORT` env var. Auto-increments port on `EADDRINUSE`.
- No build step, bundler, linter, or test framework is configured.

## Architecture

- `server.js` — Minimal Node.js HTTP static file server (repo root, security headers, path-traversal guard, MIME types).
- `index.html` — Single-page app shell: inline CSS (multiple visual themes via CSS variables) and all HUD DOM.
- `main.js` — All application logic (~4500 lines, single ES module):
  - Three.js 0.160.0 via CDN importmap (scene, camera, OrbitControls, Nebula ShaderMaterial, formations, energy beams).
  - Web Audio API for synth/drone sounds and effects.
  - State via localStorage (`portfolio_*` keys), hash routing (`#project-id`), live GitHub API data with local cache.

## Notes for Future Sessions

- Frontend is vanilla JS ES modules + Three.js from CDN; no bundler — do not introduce one without need.
- No tests or linting configured; verify changes by running the server and loading the page in a browser.
