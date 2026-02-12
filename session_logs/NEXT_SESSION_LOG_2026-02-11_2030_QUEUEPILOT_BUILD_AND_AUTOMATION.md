# NEXT_SESSION_LOG — 2026-02-11 ~20:30 ET

## Session: QueuePilot Build + Kishbrac Automation Pipeline

---

## What We Built

### 1. QueuePilot — `apps/queue-manager/index.html` (1,039 lines)
- Full Telegram mini-app for managing the build queue from Dave's phone
- 6 views: Setup, Dashboard, Detail, Add, Costs, Settings
- GitHub Contents API read/write with SHA conflict handling (409 merge strategy)
- SortableJS drag-to-reorder with debounced save
- 30s polling, pull-to-refresh, visibility-change refresh, offline cache
- Telegram SDK integration (BackButton, haptics, theme vars, stub fallback)
- Bottom nav: Queue | Add | Costs
- Toast notification system
- Tier chips (T1 green, T2 yellow, T3 red) on dashboard cards
- Live demo link button on detail view for completed apps
- Live at: https://melshid.github.io/telegram-games/apps/queue-manager/

### 2. GitHub Actions Workflow — `.github/workflows/build-agent.yml`
- Triggers on `queue.json` changes (push to main)
- Detects `in_progress` items without existing app folders
- Creates Telegram forum topics per app (dedup via `forum_topic_id` field)
- Posts full spec to the topic
- Commits `forum_topic_id` back to `queue.json`
- Uses ESM (`--input-type=module`) for top-level await on Node 20

### 3. Build-Next Command — `.claude/commands/build-next.md`
- Claude Code slash command for Kishbrac to execute builds
- Steps: git pull → read queue → build app → update queue.json → commit → push
- Includes rules for tier-based cost tracking, spec adherence, blocking

### 4. Queue Data Updates
- Added `tier` field to all 13 apps in `queue.json`
- T1: queue-manager, link-in-bio (frontend only)
- T2: telescheduler, gatebot, dripflow, invoice-tracker, appointment-reminders, workout-builder, standup-bot, review-requester, doc-collector
- T3: receipt-expense, action-extractor (external APIs)

---

## Key Learnings & Gotchas

### Node 20 on GitHub Actions
- Default is ESM — `require()` throws `ReferenceError: require is not defined`
- `--input-type=commonjs` fixes require but breaks top-level `await`
- **Solution:** Use `--input-type=module` with `import fs from 'fs'` — gets both

### Telegram Bot Limitations
- **Bots don't receive their own messages.** The workflow sends messages AS Kishbrac, so Kishbrac's webhook/polling never sees them. This was the core blocker for automation.
- **Bots can't DM other bots.** Dispatcher bot pattern doesn't work for direct triggers.
- **Group privacy is ON by default.** Bots only see `/commands` and @mentions in groups. Disable via BotFather `/setprivacy`. Must remove and re-add bot after changing.
- **Kishbrac doesn't respond in groups** — likely a code-level filter on his VPS, not a Telegram setting issue. Needs investigation.
- **Getting group chat ID is painful.** `getUpdates` returns empty if webhook is consuming. Best method: open Telegram Web (`web.telegram.org/a/`), open the group, grab the number from the URL.

### PAT Security
- PAT entered at runtime, stored in localStorage only — never in source code
- Fine-grained PAT scoped to the single repo is recommended
- Repo is public (GitHub Pages free tier requires it) — all specs/code/costs visible

### QueuePilot Architecture
- Pure frontend — no backend. Reads/writes JSON files via GitHub Contents API
- Each button tap that changes status = a git commit to main
- That commit triggers GitHub Actions workflows

---

## Current State

### What's Working
- QueuePilot is live and functional on GitHub Pages
- Dave can manage the full queue from his phone via Telegram
- GitHub Action fires on queue changes, creates forum topics, posts specs
- Secrets configured: `TELEGRAM_BOT_TOKEN`, `KISHBRAC_CHAT_ID`

### What's NOT Working
- **Kishbrac is not building automatically.** He was asked via DM to add a `queue.json` polling loop, but no build has been pushed yet. `link-in-bio` is `in_progress` but `apps/link-in-bio/` doesn't exist.
- **Kishbrac doesn't respond in the Telegram group.** His VPS code likely filters to private chats only.
- **The workflow's Telegram message is a dead end.** It posts to the group but Kishbrac never sees it (bots don't receive own messages).

### Queue Status
- `done`: queue-manager (#0)
- `in_progress`: link-in-bio (#10) — waiting on Kishbrac
- `pending`: all others (telescheduler, gatebot, dripflow, invoice-tracker, appointment-reminders, workout-builder, receipt-expense, standup-bot, action-extractor, review-requester, doc-collector)

---

## Priority for Next Session

### P0 — Get Kishbrac Building Autonomously
1. **Check Kishbrac's status** — DM him, ask if the polling loop is running, what happened with the link-in-bio build
2. **If polling isn't working:** The most reliable trigger is having Kishbrac poll `queue.json` via GitHub API every 60s, looking for `in_progress` items without existing app folders
3. **Alternative:** Add a Claude Code build step directly in the GitHub Action (like `claude-issue-handler.yml` does with `anthropics/claude-code-action@v1`) — this removes Kishbrac from the loop entirely but works immediately. Needs `ANTHROPIC_API_KEY` secret.

### P1 — Fix Group Communication
- Kishbrac needs to handle group messages (not just DMs)
- Either fix his VPS code filter or have him join the group fresh after `/setprivacy` disable
- This enables the forum topic threads to be actual build logs

### P2 — Polish QueuePilot
- The spec text in `queue.json` has encoding corruption (em dashes → `ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ`) from repeated read/write cycles through QueuePilot. Needs investigation — likely a `btoa`/`atob` encoding issue with non-ASCII characters.
- Consider adding a "Refresh" button more prominently on dashboard
- Build days countdown / progress indicator

### P3 — Workflow Cleanup
- Update the Telegram message text (currently says "Run `/build-next`" which is misleading)
- Consider removing the Telegram notification from the workflow entirely if Kishbrac polls queue.json directly (the forum topic creation is still useful for tracking)

---

## Files Changed This Session

| File | Action | Purpose |
|------|--------|---------|
| `apps/queue-manager/index.html` | CREATE | QueuePilot app (1,039+ lines) |
| `.github/workflows/build-agent.yml` | CREATE | Build dispatch workflow |
| `.claude/commands/build-next.md` | CREATE | Kishbrac build command |
| `queue.json` | MODIFIED | Added tiers, status changes, resets |
| `session_logs/` | CREATE | This session log |

---

## Context for Next Agent

You're picking up a Telegram app factory project. The internal tool (QueuePilot) is built and live. The automation pipeline (Dave taps button → Kishbrac builds) is partially wired — the trigger works (QueuePilot → GitHub → Action → Telegram), but the last mile (Kishbrac receiving the trigger and running Claude Code) is the open problem. Kishbrac runs on a VPS in a container, communicates via Telegram DMs, but doesn't respond in groups. Start by checking if Kishbrac has the polling loop running.
