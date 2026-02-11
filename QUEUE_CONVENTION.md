# Build Queue Convention

This document defines how the autobot (Kishbrac) processes the build queue.

## Queue File

`queue.json` — array of app objects, processed sequentially by `priority`.

## App Object Schema

```json
{
  "id": 1,
  "status": "pending | in_progress | done | blocked",
  "name": "kebab-case-name",
  "title": "Human-Readable Title",
  "source": "Pipeline reference",
  "spec": "What to build, features, UX",
  "price": "Target pricing",
  "users": "Target users",
  "build_days": 3,
  "priority": 1,
  "started_at": "ISO timestamp (set when in_progress)",
  "completed_at": "ISO timestamp (set when done)",
  "pr_url": "GitHub PR URL (set when done)",
  "notes": "Any blockers or decisions made during build",
  "tier": "1 | 2 | 3",
  "costs": {
    "shared_infra_used": ["Cloudflare Workers", "Supabase"],
    "app_specific_services": [
      { "name": "Claude API", "usd_per_month_estimated": 3.00, "pricing_model": "per-use", "purpose": "Receipt OCR parsing" }
    ],
    "app_burn_rate_usd_per_month": 3.00,
    "revenue_usd_per_month": 0,
    "net_usd_per_month": -3.00,
    "paying_users": 0,
    "price_per_user_usd_per_month": 5.00,
    "break_even_users": 1
  }
}
```

## Processing Rules

1. **Pick next task**: Find the lowest-priority-number item with `status: "pending"`
2. **Claim it**: Set `status` to `"in_progress"`, add `started_at` timestamp
3. **Build it**: Follow the spec, create the app in `apps/{name}/`
4. **Commit & push**: Commit the app, push to main
5. **Mark done**: Set `status` to `"done"`, add `completed_at` and `pr_url`
6. **Report back**: Send completion message to Telegram with:
   - App name and description
   - Live URL: `https://melshid.github.io/telegram-games/apps/{name}/`
   - Any decisions or deviations from spec
7. **Move to next**: Repeat from step 1

## Build Standards

Each app lives in `apps/{name}/` and must include:

- `index.html` — Single-file app (Vue 3 CDN + Telegram WebApp SDK)
- Follow conventions in `CONVENTIONS.md`
- Mobile-first, Telegram theme-aware
- localStorage for client-side persistence
- Haptic feedback on key interactions
- Share functionality via Telegram

## Status Definitions

| Status | Meaning |
|--------|---------|
| `pending` | Ready to build, waiting in queue |
| `in_progress` | Currently being built |
| `done` | Built, pushed, and deployed |
| `blocked` | Cannot proceed — see `notes` field for reason |

## Adding New Apps

New apps can be added to the queue via:
- Direct edit of `queue.json`
- Telegram message to Kishbrac (bot appends to queue)

When adding, assign the next available `id` and a `priority` number. Lower priority = built first.

## Cost Tracking

Costs are tracked at **two levels** to give full visibility without double-counting.

### Level 1: Shared Infrastructure (`infrastructure.json`)

Services shared across all apps (Cloudflare Workers, Supabase, Stripe, GitHub Pages). This file lives at the repo root and is updated when:
- A new shared service is added
- A free tier is exceeded
- Usage metrics change

Each app's `shared_infra_used` array references which shared services it depends on. This lets QueuePilot show you: "If you kill SnapExpense, you still need Supabase for 6 other apps."

### Level 2: Per-App Marginal Costs (`queue.json` → `costs`)

Services specific to one app that no other app uses (e.g., Claude API for SnapExpense's OCR). These are the costs that go away if you kill that specific app.

### Rules

- Every app MUST have `costs` filled in after build
- `shared_infra_used` lists shared services by name (details in `infrastructure.json`)
- `app_specific_services` lists ONLY services unique to this app
- `app_burn_rate_usd_per_month` = sum of `app_specific_services` only (not shared)
- `break_even_users` = `app_burn_rate_usd_per_month` / `price_per_user_usd_per_month`
- Apps with `app_burn_rate_usd_per_month > 0` and `paying_users: 0` are flagged as "bleeding"

### QueuePilot Shows Both

**Shared infra panel**: Total shared burn, free tier usage %, projected cost when tiers exceeded
**Per-app panel**: Each app's marginal burn, revenue, net, break-even point
**Portfolio rollup**: shared burn + sum of all per-app burns = true total

### Tier 1 (zero-cost) example:
```json
"tier": "1",
"costs": {
  "shared_infra_used": ["GitHub Pages"],
  "app_specific_services": [],
  "app_burn_rate_usd_per_month": 0,
  "revenue_usd_per_month": 0,
  "net_usd_per_month": 0,
  "paying_users": 0,
  "price_per_user_usd_per_month": 0,
  "break_even_users": 0
}
```

### Tier 3 (AI-powered) example:
```json
"tier": "3",
"costs": {
  "shared_infra_used": ["GitHub Pages", "Cloudflare Workers", "Supabase"],
  "app_specific_services": [
    { "name": "Claude API", "usd_per_month_estimated": 3.00, "pricing_model": "per-use", "purpose": "Receipt OCR parsing" }
  ],
  "app_burn_rate_usd_per_month": 3.00,
  "revenue_usd_per_month": 15.00,
  "net_usd_per_month": 12.00,
  "paying_users": 3,
  "price_per_user_usd_per_month": 5.00,
  "break_even_users": 1
}
```

## Blocking & Skipping

If a build is blocked (e.g., needs an API key, external service setup, design decision):
1. Set `status` to `"blocked"`
2. Add explanation to `notes`
3. Report the blocker on Telegram
4. Move to the next `pending` item
5. Come back to blocked items when unblocked
