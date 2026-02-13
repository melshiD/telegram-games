# BioLinks - Deployment Guide

## Quick Start (5 minutes)

### 1. Host on GitHub Pages

```bash
# Create a new repository on GitHub
# Name it: biolinks (or any name you prefer)

# Clone this directory
git clone <your-repo-url>
cd biolinks

# Add all files
git add .
git commit -m "Initial commit - BioLinks Mini App"
git push origin main

# Enable GitHub Pages
# Go to: Settings > Pages
# Source: Deploy from branch
# Branch: main
# Folder: / (root)
# Save
```

Your app will be live at: `https://yourusername.github.io/biolinks/`

### 2. Create Telegram Bot

Open [@BotFather](https://t.me/botfather) and follow these steps:

#### Create Bot
```
/newbot
```
- Name: `BioLinks Bot` (or your choice)
- Username: `biolinks_bot` (must be unique)
- Save the token!

#### Set Commands
```
/setcommands
```
Select your bot, then paste:
```
start - Open BioLinks app
edit - Edit your bio page
preview - Preview your page
share - Get your share link
export - Export your data
help - Get help
```

#### Set Description
```
/setdescription
```
Select your bot, then paste:
```
Create a beautiful link-in-bio page in seconds! Manage all your important links, social profiles, and email capture - all from Telegram. Perfect for creators, influencers, and small businesses.
```

#### Set About
```
/setabouttext
```
Select your bot, then paste:
```
BioLinks - Your personal link-in-bio manager. Free, simple, and powerful.
```

### 3. Create Mini App

```
/newapp
```
Select your bot, then:
- **Title**: `BioLinks`
- **Description**: `Create your link-in-bio page`
- **Photo**: Upload a 640x360px image (create one at Canva)
- **Demo GIF** (optional): Upload a screen recording
- **Short name**: `biolinks` (used in URL)
- **Web App URL**: `https://yourusername.github.io/biolinks/`

### 4. Set Menu Button (Optional)

```
/setmenubutton
```
Select your bot, then:
- **Button text**: `Open BioLinks`
- **URL**: `https://yourusername.github.io/biolinks/`

### 5. Test Your Bot

1. Open your bot in Telegram
2. Send `/start`
3. Tap the mini app button
4. Create your first bio page!

## Advanced Setup

### Custom Domain (Optional)

#### Option 1: Cloudflare Pages
1. Sign up at [Cloudflare Pages](https://pages.cloudflare.com/)
2. Connect your GitHub repository
3. Deploy to your custom domain
4. Update bot URL in BotFather

#### Option 2: Netlify
1. Sign up at [Netlify](https://www.netlify.com/)
2. Connect your GitHub repository
3. Add custom domain
4. Update bot URL in BotFather

### Analytics (Optional)

#### Google Analytics
Add to `index.html` before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Plausible (Privacy-friendly)
Add to `index.html` before `</head>`:
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### Backend Integration (Optional)

If you want to store data server-side and enable sync:

#### Option 1: Firebase
1. Create a Firebase project
2. Add Firebase SDK to your app
3. Update `js/app.js` to use Firestore
4. Deploy Firebase rules

#### Option 2: Supabase
1. Create a Supabase project
2. Add Supabase client
3. Update storage to use Supabase
4. Set up authentication

### Payment Integration (Optional)

#### Telegram Payments
```javascript
// In your bot handler
bot.command('premium', async (ctx) => {
  await ctx.replyWithInvoice({
    title: 'BioLinks Pro',
    description: 'Unlock premium features',
    payload: 'premium_subscription',
    provider_token: 'YOUR_PAYMENT_TOKEN',
    currency: 'USD',
    prices: [{ label: 'Monthly', amount: 500 }] // $5.00
  });
});
```

#### Stripe
1. Create Stripe account
2. Generate payment links
3. Add to your bot or mini app
4. Use webhooks for subscription management

## Environment Configuration

### Development
```bash
# No build process needed!
# Just open index.html in browser
# Or use a local server:
python3 -m http.server 8000
# Then open: http://localhost:8000
```

### Production
```bash
# Already configured for production!
# Files are optimized for:
# - GitHub Pages
# - Cloudflare Pages
# - Netlify
# - Any static hosting
```

## Bot Handler Setup (Optional)

### Python Bot
```bash
pip install python-telegram-bot
python bot.py
```

See `bot-example.md` for full code.

### Node.js Bot
```bash
npm install telegraf
node bot.js
```

See `bot-example.md` for full code.

## Monitoring

### Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com/) - Free, monitors your site
- [StatusCake](https://www.statuscake.com/) - Free tier available

### Error Tracking
- [Sentry](https://sentry.io/) - Free tier for error monitoring
- [LogRocket](https://logrocket.com/) - Session replay

### User Analytics
- [Plausible](https://plausible.io/) - Privacy-friendly
- [Fathom](https://usefathom.com/) - GDPR compliant
- [Umami](https://umami.is/) - Self-hosted, free

## Security Checklist

- [ ] HTTPS enabled (automatic with GitHub Pages)
- [ ] Bot token stored securely (if using backend)
- [ ] CSP headers configured (optional)
- [ ] Rate limiting on backend (if applicable)
- [ ] Input sanitization (already implemented)
- [ ] Regular dependency updates

## Performance Optimization

### Already Optimized
✅ No external dependencies (except Telegram SDK)
✅ Minimal CSS/JS file sizes
✅ No build process needed
✅ Fast loading times (<100ms)
✅ Mobile-optimized

### Optional Enhancements
- [ ] Add service worker for offline support
- [ ] Implement caching strategies
- [ ] Compress images (if you add custom ones)
- [ ] Use CDN for static assets

## Troubleshooting

### App doesn't load in Telegram
1. Check URL is correct in BotFather
2. Ensure GitHub Pages is enabled
3. Verify HTTPS is working
4. Clear Telegram cache

### Data not saving
1. Check browser console for errors
2. Verify localStorage is enabled
3. Check storage quota not exceeded
4. Test in different browser

### Links not working
1. Ensure URLs include `https://`
2. Check for typos in URLs
3. Test links in regular browser
4. Verify external sites are accessible

### Bot not responding
1. Check bot token is correct
2. Verify bot is not stopped
3. Check server/hosting is running
4. Review error logs

## Backup & Recovery

### Export User Data
Users can export their data anytime:
1. Go to Settings tab
2. Tap "Export JSON"
3. Save the file

### Restore Data
1. Open browser console
2. Run: `localStorage.setItem('biolinks_data', 'PASTE_JSON_HERE')`
3. Refresh page

### Bulk Export (Admin)
```javascript
// Run in console to export all users' data
const data = localStorage.getItem('biolinks_data');
console.log(data);
```

## Scaling Considerations

### Current Capacity
- ✅ GitHub Pages: Unlimited users
- ✅ Client-side storage: Per-user limits
- ✅ No bandwidth costs
- ✅ No database costs

### When to Add Backend
Consider backend when:
- Need cross-device sync
- Want real-time analytics
- Collecting emails for delivery
- Need team features
- Want mobile app version

### Recommended Backend Stack
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Supabase Edge Functions
- **Cost**: Free tier → $25/mo (paid)

## Marketing Launch Checklist

- [ ] Test all features thoroughly
- [ ] Create demo video (30 seconds)
- [ ] Write launch tweet/post
- [ ] Submit to bot directories
- [ ] Post on Product Hunt
- [ ] Share in Telegram groups
- [ ] Create tutorial blog post
- [ ] Set up support channel
- [ ] Prepare FAQ document
- [ ] Set up feedback system

## Post-Launch

### Week 1
- Monitor for bugs
- Respond to user feedback
- Track key metrics
- Fix critical issues

### Month 1
- Analyze user behavior
- Prioritize feature requests
- Optimize conversion funnel
- Plan premium features

### Month 3
- Review pricing strategy
- Consider premium tier
- Evaluate backend needs
- Scale infrastructure

## Support Resources

### Documentation
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

### Community
- [Telegram Bot Developers](https://t.me/BotDevelopers)
- [r/TelegramBots](https://reddit.com/r/TelegramBots)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/telegram-bot)

### Tools
- [BotFather](https://t.me/botfather) - Bot management
- [Bot API Updates](https://core.telegram.org/bots/api#recent-changes)
- [Mini Apps Debugger](https://core.telegram.org/bots/webapps#debug-mode)

## Next Steps

1. ✅ Deploy to GitHub Pages
2. ✅ Create and configure bot
3. ✅ Test in Telegram
4. 📊 Set up analytics
5. 📣 Launch marketing
6. 💰 Set up monetization
7. 🚀 Scale and grow

---

**Congratulations!** 🎉 Your BioLinks mini-app is ready to launch!

Need help? Open an issue on GitHub or contact support.
