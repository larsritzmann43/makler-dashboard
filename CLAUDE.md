# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Makler-Dashboard: A communication dashboard prototype for German insurance brokers (TELIS FINANZ AG). Brokers manage incoming client requests from multiple channels (email, phone, WhatsApp, Instagram), generate AI-assisted reply drafts, and archive completed interactions. All UI text is in German (de-DE locale).

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build to `dist/`
- `npm run preview` — Serve production build locally

No test runner or linter is configured.

## Architecture

Vanilla JS (ES Modules) + plain CSS, built with Vite 7. No framework, no TypeScript. Single runtime dependency: OpenAI API (GPT-4o-mini) called from the browser.

### Source files (`src/`)

- **main.js** — App entry point and orchestrator. Owns all state (single mutable `state` object), all DOM rendering (template literals → `innerHTML`), and all event wiring. Imports from all other modules; nothing imports from it.
- **mockData.js** — Static mock data: `mockRequests`, `channels`, `categories`, `priorities`, `mockCalendar`, plus utility functions (`getSortedRequests`, `formatTimeAgo`, `formatDateTime`).
- **templates.js** — 8 pre-written reply templates with `[PLACEHOLDER]` syntax and helpers (`getTemplateById`, `getTemplatesByCategory`, `fillTemplate`).
- **ai.js** — OpenAI API integration. Falls back to template-based generation when no API key is set. API key stored in `localStorage` under `openai_api_key`.
- **counter.js** — Vite scaffolding leftover; unused.

### Key file

- **index.html** — All UI markup lives here (3-column layout shell). JS populates it dynamically.
- **Feature-Liste_Makler-Dashboard.md** — Detailed German feature specification (design reference document).

## Patterns & Conventions

- **State management:** Explicit re-renders after state mutations — call `renderRequestList()`, `renderAnsweredList()`, etc. No reactivity system.
- **DOM elements:** Cached in a top-level `elements` object via `getElementById`. Event handlers re-attached after each re-render on dynamic items.
- **CSS:** BEM-like naming (`.request-item`, `.request-item--active`). Design tokens as CSS custom properties in `:root`. Responsive breakpoints at 1200px, 1024px, 480px. Mobile layout uses `is-visible` class toggling; desktop uses CSS Grid.
- **Resizable columns:** Mouse events on drag-handle divs recalculate `gridTemplateColumns`. Minimums: left 200px, center 300px, right 220px.
- **AI fallback:** No API key → template-based `[PLACEHOLDER]` substitution. Double-click AI status badge to set key via prompt dialog.
- **Data shape:** Requests have `{ id, channel, category, sender, timestamp (Date), preview, originalMessage, summary, answered }`. Categories drive priority automatically.
- **Templates:** Placeholders use `[UPPERCASE_KEY]` format (e.g., `[NAME]`, `[DATUM]`).
