Done. Here's what was built and shipped:

**InvoiceTrack** — Invoice follow-up mini-app for freelancers (`apps/invoice-tracker/index.html`)

**Features built:**
- **Dashboard** with summary stats (outstanding/overdue/paid counts and totals)
- **Invoice creation/editing** with client name, email, Telegram handle, amount, currency, due date, description, and notes
- **Filter tabs** — All, Outstanding, Overdue, Paid with counts
- **Escalating reminder schedule** — configurable day 3/7/14/30/60 follow-ups after due date, with "Send Now" buttons for due reminders
- **Reminder progress bar** on each invoice card showing sent vs pending reminders
- **Telegram integration** — send reminders via Telegram contact, share invoice details, haptic feedback, back button support
- **Detail view** with full timeline, client info, reminder schedule, and action buttons (mark paid, reopen, edit, share, delete)
- **Stats view** with all-time totals, collection rate, avg days to pay, reminders sent, top clients
- **localStorage persistence** for all data
- **Telegram theme-aware** UI matching the project's dark design system

**Live at:** `https://melshid.github.io/telegram-games/apps/invoice-tracker/`

---
[auto-commit] Committing and pushing changes...
