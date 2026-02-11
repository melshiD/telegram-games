# Project: Telegram App Factory

> General-purpose prototyping and production platform for Telegram mini-apps. Ship fast, iterate faster.

---

## Project Overview

This repo is a **Telegram app factory** — a place to rapidly build, demo, and ship any Telegram mini-app or bot. It serves three purposes:

1. **Queued production builds**: The autobot (Kishbrac) works through `queue.json`, building apps one at a time and reporting back on Telegram.
2. **Ad-hoc prototypes & demos**: Any Claude agent or human can create an app in `apps/` at any time for any reason — experiments, client demos, hackathon entries, proof-of-concepts.
3. **Reusable patterns**: Templates, conventions, and shared utilities that make every new app faster to build.

All apps are built with zero build complexity — pure static HTML/CSS/JavaScript via CDN, deployed to GitHub Pages. Each app is a self-contained folder in `apps/`.

**Important**: This repo is not limited to queue items. Treat it as the default home for ANY Telegram mini-app, prototype, demo, or experiment. If it runs in Telegram, it belongs here.

## Tech Stack

- **Language**: Vanilla JavaScript (ES6+)
- **Framework**: Vue 3 (CDN via unpkg)
- **Styling**: Tailwind CSS (CDN, optional) + Telegram theme variables
- **Mobile SDK**: Telegram WebApp SDK (CDN)
- **State**: localStorage (client-side only)
- **Hosting**: GitHub Pages (auto-deploy on push to main)
- **Build Tools**: None — all CDN-based, no build step

---

## Quick Reference

### Deployment

```bash
# Apps auto-deploy on push to main
# Live at: https://melshid.github.io/telegram-games/apps/{app-name}/
git push origin main
```

### Project Structure

```
telegram-games/
├── CLAUDE.md                    # This file — project memory
├── CONVENTIONS.md               # Vue 3 CDN + Telegram coding patterns
├── DELEGATE.md                  # Task delegation patterns
├── QUEUE_CONVENTION.md          # How the build queue works
├── queue.json                   # Build queue (autobot processes this)
├── OPPORTUNITY_PIPELINE.md      # Full opportunity pipeline (reference)
├── apps/                        # Production apps (one folder per app)
│   └── {app-name}/
│       └── index.html           # Single-file app
├── examples/                    # Reference implementations
│   └── simple-clicker.html
├── templates/                   # Starter templates
│   └── game-template.html
├── .claude/                     # Agent config (commands, agents, skills)
├── .github/workflows/           # CI/CD (PR review, security, issues)
└── .workflow/                   # Supercharged workflows submodule
```

### Creating a New App

1. Create `apps/{app-name}/index.html`
2. Use `templates/game-template.html` as starting point
3. Follow patterns in `CONVENTIONS.md`
4. Update `queue.json` status to `done`
5. Commit and push

---

## Build Queue (Autobot)

The autobot reads `queue.json` and builds apps sequentially. See `QUEUE_CONVENTION.md` for full details.

Key rules:
- Pick lowest priority number with `status: "pending"`
- Set to `"in_progress"` before building
- Each app goes in `apps/{name}/index.html`
- Set to `"done"` after push, report back on Telegram

## Ad-Hoc Apps (Anyone)

Not everything goes through the queue. To create an app outside the queue:

1. Create `apps/{app-name}/index.html`
2. Follow conventions in `CONVENTIONS.md`
3. Commit and push — it's live on GitHub Pages
4. Optionally add to `queue.json` retroactively with `status: "done"`

Use this for: demos, experiments, client prototypes, hackathon builds, one-off tools, anything.

---

## Backend & Cost Architecture

See `BACKEND_ARCHITECTURE.md` for full details. Key principles:

- **Shared infrastructure, not per-app infra.** One Cloudflare Worker, one Supabase project, one Stripe account serves all apps.
- **Three tiers**: Tier 1 (pure frontend, $0), Tier 2 (shared bot backend, $0 on free tier), Tier 3 (bot + external APIs, variable)
- **Cost tracking in two layers**: shared costs in `infrastructure.json`, per-app marginal costs in `queue.json`
- **QueuePilot** (app #0) is the dashboard for both

---

## Coding Standards

### App Requirements

- Single-file HTML (Vue 3 CDN, no build tools)
- Mobile-first design (Telegram is mobile)
- Telegram theme-aware (`var(--tg-theme-*)` CSS variables)
- localStorage for persistence
- Haptic feedback on key interactions (`tg.HapticFeedback`)
- Share functionality via Telegram

### Naming Conventions

- **Files**: `kebab-case.html`
- **App folders**: `kebab-case/`
- **Variables**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Functions**: `camelCase` verbs (`handleClick`, `saveGame`)

### Vue 3 Pattern

```javascript
const { createApp, ref, computed, onMounted } = Vue;
createApp({
    setup() {
        // Telegram SDK
        const tg = window.Telegram.WebApp;
        onMounted(() => { tg.ready(); tg.expand(); });
        // App logic here
        return { /* template bindings */ };
    }
}).mount('#app');
```

See `CONVENTIONS.md` for complete patterns.

---

## Git Workflow

### Commit Messages

Use conventional commits:
- `feat(app-name):` New app or feature
- `fix(app-name):` Bug fix
- `refactor(app-name):` Code restructuring
- `docs:` Documentation
- `chore:` Maintenance (queue updates, config)

---

## Agent Instructions

### Build Queue Processing

1. Read `queue.json`, find next `pending` item
2. Update status to `in_progress`
3. Build the app following the spec
4. Place in `apps/{name}/index.html`
5. Commit, push, update status to `done`
6. Report completion on Telegram

### When Building an App

- Start from `templates/game-template.html`
- Follow `CONVENTIONS.md` patterns exactly
- Test Telegram SDK integration (theme, haptics, sharing)
- Keep it simple — MVP first, iterate later
- Each app should work standalone (single HTML file)

### When Stuck

- Check `CONVENTIONS.md` for patterns
- Check `examples/simple-clicker.html` for reference
- If blocked, set queue status to `blocked` with notes
- Report blocker on Telegram, move to next item

---

*Last updated: 2026-02-10*
