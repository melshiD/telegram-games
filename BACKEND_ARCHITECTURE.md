# Backend Architecture

## Principle: Shared Infrastructure, Not Per-App Infra

Every app does NOT get its own database, its own hosting, its own cron runner. That's how you end up bleeding $50/mo across 5 services before you've charged anyone a dime.

Instead: **one shared stack serves all apps.** Per-app marginal cost should be near-zero until the app has paying users.

---

## The Stack

```
                    Telegram Users
                         |
                    Telegram Bot API
                         |
              ┌──────────┴──────────┐
              │  Cloudflare Worker   │  ← Single worker, routes by bot token
              │  (webhook router)    │     Free: 100k req/day
              └──────────┬──────────┘
                         |
              ┌──────────┴──────────┐
              │     Supabase        │  ← Single project, per-app tables
              │  (Postgres + Auth)  │     Free: 500MB, 50k MAU
              └──────────┬──────────┘
                         |
              ┌──────────┴──────────┐
              │   GitHub Pages      │  ← All mini-app frontends
              │   (static hosting)  │     Free: 100GB bandwidth/mo
              └─────────────────────┘
```

### Why This Works

| Concern | Solution |
|---------|----------|
| "But each app needs its own bot" | Yes, each app has its own BotFather token. The shared worker routes incoming webhooks by token to the right handler. One deployment, many bots. |
| "But each app needs its own database" | One Supabase project, separate schemas or table prefixes per app. `gatebot_users`, `dripflow_sequences`, etc. |
| "But I need cron jobs" | Cloudflare Cron Triggers (free) — one worker handles all scheduled tasks, dispatches by app. |
| "What about file storage?" | Supabase Storage (1GB free) for apps like DocDrop. Or just have the bot forward files to a private Telegram channel as cheap storage. |
| "What about AI features?" | Claude API (pay-per-use). Only SnapExpense and ActionPull need this. Estimated $0.50 per 1k uses. Don't provision capacity — pay as you go. |
| "What about payments?" | One Stripe account. Each app creates its own Products/Prices. No monthly Stripe fee — just 2.9% + $0.30 per transaction. |

---

## App Tiers

### Tier 1: Pure Frontend ($0/mo, no backend)

These apps run entirely in the browser. localStorage for state, GitHub Pages for hosting, Telegram WebApp SDK for integration.

**Apps:** QueuePilot, BioLinks, FitPlan

**Architecture:**
```
GitHub Pages → index.html (Vue 3 + Telegram SDK)
                  ↓
              localStorage (state)
              GitHub API (for QueuePilot reading queue.json)
```

**When to use:** The app only needs to store data on the user's device, or read/write to a static file via API.

### Tier 2: Bot + Shared Backend ($0/mo on free tier)

These apps need a running process — scheduled messages, webhook handling, multi-user state.

**Apps:** TeleScheduler, StandupTG, DripFlow, BookPing, ReviewPush, DocDrop, InvoiceTrack

**Architecture:**
```
Telegram Bot API
       ↓ (webhook)
Cloudflare Worker (shared, routes by bot token)
       ↓
Supabase (shared Postgres, per-app tables)
       ↓
Cloudflare Cron Trigger (shared, per-app scheduled tasks)
```

**When to use:** The app needs to send messages on a schedule, track state across users, or respond to bot commands.

### Tier 3: Bot + External APIs ($0-10/mo variable)

Same as Tier 2, plus calls to paid external APIs.

**Apps:** GateBot (Stripe), SnapExpense (Claude API for OCR), ActionPull (Claude API for extraction)

**Architecture:**
```
Same as Tier 2, plus:
       ↓
Stripe API (for payments, webhooks back to worker)
Claude API (for AI features, pay-per-token)
```

**When to use:** The app needs payments or AI/ML capabilities.

---

## Shared Worker Pattern

One Cloudflare Worker handles all bots:

```javascript
// Simplified routing pattern
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const botToken = url.pathname.split('/')[1]; // /BOT_TOKEN/webhook

    // Route to the right app handler
    const handlers = {
      [env.TELESCHEDULER_TOKEN]: handleTeleScheduler,
      [env.STANDUP_TOKEN]: handleStandupBot,
      [env.GATEBOT_TOKEN]: handleGateBot,
      // ... one line per app
    };

    const handler = handlers[botToken];
    if (!handler) return new Response('Not found', { status: 404 });

    return handler(request, env);
  },

  // Shared cron handler
  async scheduled(event, env) {
    await Promise.all([
      runTeleSchedulerCrons(env),
      runStandupCrons(env),
      runBookPingReminders(env),
      // ... one line per app
    ]);
  }
};
```

Each app's handler lives in its own module file within the worker project. Adding a new bot = adding one import and one routing line.

---

## Supabase Schema Convention

One Supabase project. Each app gets a table prefix:

```sql
-- GateBot tables
gatebot_members (id, telegram_user_id, group_id, stripe_customer_id, status, created_at)
gatebot_groups  (id, telegram_group_id, owner_id, stripe_price_id, created_at)

-- DripFlow tables
dripflow_sequences (id, owner_id, title, created_at)
dripflow_lessons   (id, sequence_id, day_number, content_type, content, created_at)
dripflow_progress  (id, user_id, sequence_id, current_day, started_at)

-- StandupTG tables
standup_teams     (id, group_id, questions, schedule_cron, timezone)
standup_responses (id, team_id, user_id, answers, submitted_at)
```

Row-Level Security (RLS) policies per app ensure data isolation.

---

## Cost Tracking

Two files drive cost visibility:

### `infrastructure.json` — Shared costs
Tracks services shared across all apps. Updated when a new shared service is added or a free tier is exceeded.

### `queue.json` — Per-app marginal costs
Each app's `costs` object tracks services specific to that app (e.g., Claude API usage for SnapExpense).

### QueuePilot Dashboard Shows Both

**Shared Infrastructure Panel:**
```
Shared Services                          Status
─────────────────────────────────────────────────
GitHub Pages .............. FREE    (1GB/100GB used)
Cloudflare Workers ........ FREE    (2k/100k req used)
Supabase .................. FREE    (12MB/500MB used)
Stripe .................... FREE    (per-txn only)
─────────────────────────────────────────────────
Shared burn rate:                        $0.00/mo
After free tier exceeded:               $30.00/mo
```

**Per-App Panel:**
```
App                   Status    Burn    Revenue   Net      Users
──────────────────────────────────────────────────────────────────
QueuePilot            done      $0      $0        $0       —
TeleScheduler         done      $0      $36       +$36     4
GateBot               done      $0      $57       +$57     3
SnapExpense           done      $3      $15       +$12     3
──────────────────────────────────────────────────────────────────
Portfolio totals:               $3/mo   $108/mo   +$105/mo
```

**Alerts:**
- "SnapExpense is bleeding $3/mo with 0 paying users"
- "Supabase at 80% of free tier — will cost $25/mo when exceeded"
- "GateBot breaks even at 1 user (currently 3)"

---

## Decision Tree: Does My App Need a Backend?

```
Does the app need to...
  ├─ Send messages on a schedule? → YES, Tier 2 (shared worker + cron)
  ├─ Track state across multiple users? → YES, Tier 2 (shared worker + Supabase)
  ├─ Process payments? → YES, Tier 3 (add Stripe)
  ├─ Use AI/ML (OCR, NLP, etc.)? → YES, Tier 3 (add Claude API)
  └─ Only store data for one user at a time? → NO, Tier 1 (localStorage is fine)
```

---

## Setting Up the Shared Backend (One-Time)

When the first Tier 2 app is built, set up:

1. **Cloudflare account** → Create one Worker (`telegram-app-factory`)
2. **Supabase account** → Create one project (`telegram-apps`)
3. **Stripe account** → One account, create Products per paid app
4. **Secrets** → Store all tokens/keys in Cloudflare Worker env vars and `.env`

After this, each new app just needs:
- A new BotFather token
- A routing line in the shared worker
- Tables in the shared Supabase project
- An entry in `infrastructure.json` `used_by` arrays
