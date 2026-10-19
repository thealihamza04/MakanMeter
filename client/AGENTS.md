<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MakanMeter — Frontend Design System & UI Rules

**Project Name**: **MakanMeter**  
All agents and developers working on this frontend codebase MUST strictly adhere to the following rules:

---

## 1. Typography & Font Enforcements
- **Strictly Inter Font Only**:
  - The entire application exclusively uses the **Inter** font family (`var(--font-inter), 'Inter', sans-serif`).
  - Never import external font links (e.g., Google Material Symbols, Roboto, Geist) in HTML or CSS.
  - Tailwind classes `--font-sans`, `--font-heading`, and `--font-mono` are all mapped to Inter.
- **Normal Letter-Spacing**:
  - Always enforce normal character spacing (`letter-spacing: normal !important`). Do NOT use exaggerated tracking like `tracking-widest` or negative tracking on body text.
- **Tabular Numbers**:
  - All numeric outputs, prices, currency (PKR, Crore, Lakhs), percentages, counts, and dates MUST use `tabular-nums` for alignment without width jumping.
  - Never use monospace (`font-mono`) classes.

---

## 2. Iconography & Visual Assets
- **Zero Emojis**:
  - Emojis (e.g., 🏠, 💰, 📊, 🚀) are strictly FORBIDDEN anywhere in the UI (buttons, headers, dialogs, badges, tooltips, or toast notifications).
- **Lucide Icons Only**:
  - Use stroked icons from `lucide-react` exclusively.
  - Sizing must be intentional and balanced (`w-3 h-3` for inline pills, `w-3.5 h-3.5` for buttons/cards, `w-4 h-4` for headers).
  - Use appropriate semantic colors (e.g., `text-indigo-400`, `text-emerald-400`, `text-quiet-text`).

---

## 3. Color Palette & Dark Institutional Theme
The application follows a dark institutional, financial-terminal aesthetic:
- **Canvas / Background**: `#08090a` (pure deep black base)
- **Surfaces**: `#0f1011` (primary card/modal background)
- **Containers & Elevated Surfaces**:
  - Surface Lowest: `#0d0e0f`
  - Surface Low: `#1b1c1d`
  - Surface Container: `#1f2021` / `#14161b`
  - Surface High: `#292a2b`
- **Borders & Outlines**: `#2a2d33` / `#23262f` / `#1c1f26`
- **Text Hierarchy**:
  - Primary: `#f7f8f8`
  - Supporting: `#d0d6e0`
  - Quiet / Muted: `#8a8f98`
- **Accent & Functional Colors**:
  - Primary Accent: Indigo `#4f46e5` (hover: `#6366f1` / `#4338ca`)
  - Verified / Growth: Emerald `#10b981` (badge: `bg-emerald-500/10 border-emerald-500/25 text-emerald-400`)
  - Layout / Structural: Amber `#f59e0b`
  - Amortization / Alert: Rose `#f43f5e`
  - Geospatial: Sky Blue `#38bdf8` / `#0284c7`

---

## 4. Layout, Information Density & Dialog Standards
- **High Information Density**:
  - Avoid bloated vertical padding. Prefer compact paddings (`py-1.5` to `py-2.5`, `px-3` to `px-4`).
  - Dialogs must fit gracefully within standard viewport heights without requiring endless scrolling.
- **Compact Multi-Column Data**:
  - Feature lists and parameter lists must use dense 2-column or 3-column grids (`grid-cols-1 sm:grid-cols-2 gap-1.5`).
  - Single-line row formats (Rank + Category Dot + Label + Progress Track + Percentage).
- **Table Standards**:
  - When displaying benchmark or matrix tables, use flush borderless tables: `border-none` and `rounded-none` (`rounded: 0`).
  - Avoid thick borders or rounded table wrappers.
- **No Text Overflow / Clipping**:
  - Banners and insight callouts must have full horizontal width.
  - Category badges, legend pills, and status tags must flex-wrap or sit at the bottom footer of card containers to prevent clipping out of modals.

---

## 5. Valuation State Management & User Experience
- **Output Box Persistence**:
  - When the user modifies inputs in the simulator form, NEVER unmount, hide, or clear the valuation result box (`result` state must remain visible).
- **Form Dirty Tracking (`isDirty`)**:
  - Track whether form state differs from the currently calculated valuation.
  - Disable the calculate button when the valuation is up to date ("Valuation Up to Date").
  - Enable the calculate button as soon as any field changes ("Update Property Value").
- **Animated Price Transitions**:
  - When re-calculating or modifying inputs, numbers must roll smoothly via `requestAnimationFrame` with `easeOutCubic` (`<AnimatedPrice />`). Never cause abrupt layout flashes.
- **Auto-Submission**:
  - On page load, if pre-filled parameters exist (from defaults or URL search params), automatically trigger valuation on initial mount via ref guard.
- **Audio Feedback**:
  - On receiving verified model predictions, play a subtle chime using the browser Web Audio API (`AudioContext`).

---

## 6. Chart Components (`@reui/c-chart-19`)
- **Donut Chart Pattern**:
  - Feature attribution must use the `@reui/c-chart-19` pattern built with `recharts`.
  - Include SVG 3D drop-shadow filter (`#chart19-3d`) and multi-stop linear gradients.
  - Centered label showing the total asset value in `₨ X.XX Cr`.
  - Provide both standard and `compact` modes for responsive dialogs.
  - Under *"How we calculated this"*, provide a toggle between **Pie Chart** and **List** views.

---

## 7. Hardware & Tool Execution Constraints
- **Builds**: NEVER execute `npm run build` or `next build` unless explicitly asked by the user.
- **Emulators**: NEVER start or open Android emulators.
- **Hardware Limitations**: Keep dev processes lightweight; avoid unnecessary background polling or memory-intensive tasks.

