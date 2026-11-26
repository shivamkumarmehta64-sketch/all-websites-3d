# DESIGN.md — Shivam Kumar Mehta Portfolio (Project All-Websites-3D)

Semantic Design System for Google Stitch & Frontend Implementation.

---

## 1. Visual Atmosphere
- **Mood:** Nocturnal, hardware-grounded, high-agency systems engineering.
- **Density:** 4 / 10 (Editorial spaciousness in Hero & Flagships; structured density in Distribution Matrix).
- **Variance:** 8 / 10 (Asymmetric 2-column Hero, alternating left/right Zig-Zag Flagships, 4-node horizontal ECE Pipeline, Bento Project Grid).
- **Motion:** 6 / 10 (Choreographed `ease-out` entrance, Lenis inertial scroll, GPU-composited `transform`/`opacity` reveals, interactive Three.js 3D Systems Core).

---

## 2. Color Calibration
- **Dark Mode (Warm Obsidian & Space Titanium):**
  - Canvas Base (`--bg`): `#0a0a0c`
  - Elevated Surface (`--bg-elevated`): `#121215` with `inset 0 1px 0 rgba(255, 255, 255, 0.05)` specular edge
  - Interactive Surface (`--bg-surface`): `#18181c` (hover `#212126`)
  - Primary Ink (`--text`): `#f5f5f7`, Secondary: `#a1a1aa`
  - Accent (`--accent`): Apple Pro Sapphire `#2997ff`
  - Status Emerald (`--emerald`): `#2fb36d`
- **Light Mode (Porcelain Studio & Anodized Aluminum):**
  - Canvas Base (`--bg`): `#f9f9fb`
  - Elevated Surface (`--bg-elevated`): `#ffffff` with soft elevation shadow
  - Interactive Surface (`--bg-surface`): `#f2f2f5` (hover `#e8e8ed`)
  - Primary Ink (`--text`): `#1d1d1f`, Secondary: `#515154`
  - Accent (`--accent`): Editorial Sapphire `#0066cc`
  - Status Emerald (`--emerald`): Forest Emerald `#1b7a3d`
- **Project Status Discipline:** Restrained 3-tone hardware palette (Sapphire `#3b9eff`, Sage Emerald `#2fb36d`, Warm Titanium Amber `#d49a2a`) — zero neon rainbow saturation.

---

## 3. Typographic Architecture
- **Display & UI Sans:** `"Plus Jakarta Sans", system-ui, sans-serif` (weights `400`–`800`, 100% free via Google Fonts) — extra-bold `800` tight tracking (`-0.036em`) on Hero & section titles, calm leading (`1.58`) on body.
- **Editorial Highlighting:** `.hl` (sapphire-tinted underline) and `.hl-emerald` (emerald-tinted underline) for bold `700` emphasis on key engineering phrases without neon background blocks.
- **Editorial Serif Accent:** `"Instrument Serif", italic` — used exclusively for the emphatic phrase *"from the metal up."* in the Hero `<h1>`.
- **Technical & Telemetry Mono:** `"JetBrains Mono", monospace` with `font-variant-numeric: tabular-nums` — used for timestamps, footprints (`~460 KB`, `<60 MB`), test counts (`223`), and pipeline step indices (`01 / Sensors & ECE`).
- **Scale:** `clamp()` responsive scaling from mobile (`390px`) to desktop (`1440px`), body minimum `15px`.

---

## 4. Layout & Section Architecture
1. **Sticky Glass Navbar:** `rgba(9, 9, 11, 0.84)` + `backdrop-filter: blur(20px)`, top 2px `#scroll-progress` hairline, active section underline.
2. **Asymmetric Split Hero (`min-height` balanced above fold):**
   - Left: Institutional ECE eyebrow badge (`B.Tech ECE · Purnea College of Engineering`) + `<h1>` + concise human bio + primary CTA (`Explore Releases`).
   - Right: Interactive Three.js WebGL 3D Systems Core responding to cursor drag and scroll depth.
3. **Alternating Zig-Zag Flagships (`#flagships`):** MetShield-AI (MoES / IMD SIH 2026) and Black Browser (`~460 KB`, `<60 MB` RAM benchmark bar).
4. **ECE Hardware-to-Cloud Pipeline (`#ecosystem`):** 4-step signal path (`01 Sensors & ECE` → `02 Cryptographic Edge` → `03 Native Desktop` → `04 Cloud Telemetry`) + live GitHub telemetry strip + filterable Bento grid (`All (8)`, `Native & Rust (3)`, `AI & Web (2)`, `Security & ECE (3)`).
5. **Distribution & Runtime Matrix (`#distribution`):** Scrollable responsive table synced with GitHub Releases.
6. **Engineering Standards (`#architecture`) & Builder's Note (`#connect`):** Direct LinkedIn, Email, and one-click `Copy Email` toast action.

---

## 5. Motion Philosophy
- **GPU-Only Properties:** Animate exclusively via `transform` and `opacity` (never `width`, `height`, `top`, or `left`).
- **Scroll Engine:** Lenis inertial scrolling (`duration: 1.05`) paired with `IntersectionObserver` (`threshold: 0.08`) for staggered `.reveal`, `.ece-node` (`100ms` cascade), and `.project-card` (`65ms` cascade).
- **Accessibility:** Complete `@media (prefers-reduced-motion: reduce)` disablement for all transitions, keyframe pulses, and Lenis.

---

## 6. Anti-Patterns (Strictly Banned)
- No `Inter` font, no purple/neon gradient glows, no centered hero templates.
- No unmeasured or fabricated benchmark stats (`98.7% Macro F1`, `0.005 ms` removed).
- No emojis as UI icons (use FontAwesome / inline SVG).
- No `"Scroll to explore"` filler labels.
