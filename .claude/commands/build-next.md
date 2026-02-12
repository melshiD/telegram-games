# Build Next — Kishbrac Build Command

Build the next queued app from queue.json. This is the command Kishbrac runs to execute a build.

## Process

1. **Pull latest** — run `git pull origin main` to get the latest queue.json and any recent changes
2. **Read queue.json** — find the item with `status: "in_progress"` whose `apps/{name}/index.html` does not yet exist
3. **If no target found** — report "Nothing to build" and stop
4. **Read conventions** — read `CONVENTIONS.md`, `CLAUDE.md`, `templates/game-template.html`, and `examples/simple-clicker.html` for patterns
5. **Create the app folder** — `apps/{name}/`
6. **Build `apps/{name}/index.html`** — a complete, working single-file app following the spec exactly:
   - Vue 3 CDN (Composition API, `setup()`)
   - Telegram WebApp SDK with stub fallback for browser testing
   - Mobile-first design, Telegram theme variables
   - localStorage for persistence
   - Haptic feedback on key interactions
   - Share functionality via Telegram
   - Follow every pattern in CONVENTIONS.md
7. **Update queue.json**:
   - Set `status` to `"done"`
   - Set `completed_at` to current ISO timestamp
   - Fill in the `costs` object based on the app's tier:
     - Tier 1: `shared_infra_used: ["GitHub Pages"]`, zero burn
     - Tier 2: add `Cloudflare Workers` and/or `Supabase` to shared_infra_used
     - Tier 3: add app_specific_services with estimated costs
   - Calculate `break_even_users` = `app_burn_rate_usd_per_month` / `price_per_user_usd_per_month`
8. **Commit and push**:
   - Stage `apps/{name}/index.html` and `queue.json`
   - Commit message: `feat({name}): Build {title}`
   - Push to main
9. **Report** — output the live URL: `https://melshid.github.io/telegram-games/apps/{name}/`

## Rules

- One app per build. Do not build multiple apps.
- Follow the spec faithfully. If something is unclear, make a reasonable decision and note it.
- If blocked (missing API key, external dependency, design decision), set status to `"blocked"`, add explanation to `notes`, and stop.
- Keep the app under 500 lines unless the spec demands more complexity (like QueuePilot).
- Test that the HTML is valid and renders correctly before committing.

## Example

```
Pulling latest from main...
Reading queue.json...
Found: telescheduler (priority #1) — TeleScheduler - Recurring Message Scheduler
Building apps/telescheduler/index.html...
Updating queue.json — status: done, completed_at: 2026-02-11T...
Committing: feat(telescheduler): Build TeleScheduler - Recurring Message Scheduler
Pushing to main...
Live at: https://melshid.github.io/telegram-games/apps/telescheduler/
```
