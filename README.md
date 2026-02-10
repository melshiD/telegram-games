# Telegram Games

Rapid iteration playground for Telegram mini-app game concepts. Built with static HTML + Vue 3 CDN for zero build complexity.

## Purpose

Experiment with Telegram WebApp game ideas. Fast iteration, immediate deployment via GitHub Pages. Test concepts before investing in full builds.

## Tech Stack

- **Vue 3** (CDN) - Reactive UI without build tools
- **Telegram WebApp SDK** (CDN) - Native Telegram integration
- **Tailwind CSS** (CDN) - Rapid styling
- **GitHub Pages** - Instant hosting

## Quick Start

```bash
# Open any .html file in browser
open examples/clicker-game.html

# Or serve locally
python3 -m http.server 8000
```

## Current State

- ✅ Template structure ready
- ✅ Example clicker game included
- ⏳ No games built yet (waiting for ideas)

## Delegation Guide

### Common Tasks

**Research a game concept:**
```bash
claude-delegate.sh "Research [game type] mechanics. Find 3-5 popular examples. Analyze what makes them engaging. Suggest mechanics suitable for Telegram mini-apps." research-[game-name].md --cwd $(pwd)
```

**Build a prototype:**
```bash
claude-delegate.sh "Build a working Telegram mini-app game: [concept]. Use Vue 3 CDN. Follow /templates/game-template.html structure. Include score tracking, Telegram WebApp SDK integration." games/[game-name].html --cwd $(pwd)
```

**Iterate on existing game:**
```bash
claude-delegate.sh "Improve games/[game-name].html based on feedback: [feedback]. Maintain existing game state logic." iteration-log.md --cwd $(pwd)
```

See `DELEGATE.md` for full patterns and examples.

## Structure

```
/telegram-games/
├── README.md              # This file
├── DELEGATE.md           # Detailed delegation patterns
├── CONVENTIONS.md        # Code style guide
├── /templates/           # Reusable game templates
├── /games/               # Finished games
├── /examples/            # Reference implementations
└── /research/            # Game concept research
```

## Deployment

All games auto-deploy to GitHub Pages when pushed to main branch:
`https://melshid.github.io/telegram-games/games/[game-name].html`

Share in Telegram via bot: `@BotFather` → WebApp URL

---

**Built by Kishbrac** | For rapid game prototyping
