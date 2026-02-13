# BioLinks Bot Setup Example

This guide shows how to integrate BioLinks with a Telegram bot.

## Bot Configuration

### 1. Create Bot with BotFather

```
/newbot
Name: BioLinks Bot
Username: biolinks_bot (or your choice)
```

Save your bot token: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### 2. Create Mini App

```
/newapp
Select bot: @biolinks_bot
Title: BioLinks
Description: Create your link-in-bio page
Short name: biolinks
```

Upload a photo (640x360px) and set your GitHub Pages URL.

### 3. Set Bot Commands

```
/setcommands
Select bot: @biolinks_bot

Commands:
start - Open BioLinks app
edit - Edit your bio page
preview - Preview your page
share - Get your share link
export - Export your data
help - Get help
```

### 4. Set Bot Description

```
/setdescription
Select bot: @biolinks_bot

Description:
Create a beautiful link-in-bio page in seconds! Manage all your important links, social profiles, and email capture - all from Telegram.
```

### 5. Set About Text

```
/setabouttext
Select bot: @biolinks_bot

About:
BioLinks - Your personal link-in-bio manager. Perfect for creators, influencers, and anyone who needs a simple landing page.
```

## Bot Handler Example (Optional Backend)

If you want to add backend functionality (optional):

```python
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

BOT_TOKEN = "YOUR_BOT_TOKEN"
WEB_APP_URL = "https://yourusername.github.io/biolinks/"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Send a message with a button to open the web app."""
    keyboard = [
        [InlineKeyboardButton(
            "🔗 Open BioLinks",
            web_app=WebAppInfo(url=WEB_APP_URL)
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        "Welcome to BioLinks! 🎉\n\n"
        "Create your perfect link-in-bio page in minutes.\n\n"
        "Tap the button below to get started:",
        reply_markup=reply_markup
    )

async def edit(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Open the app directly."""
    keyboard = [[InlineKeyboardButton(
        "✏️ Edit Your Page",
        web_app=WebAppInfo(url=WEB_APP_URL)
    )]]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        "Open the app to edit your bio page:",
        reply_markup=reply_markup
    )

async def share(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Get shareable link."""
    user_id = update.effective_user.id
    bio_url = f"{WEB_APP_URL}bio-page.html?user={user_id}"

    await update.message.reply_text(
        f"🔗 Your BioLinks page:\n\n{bio_url}\n\n"
        "Share this link anywhere - Instagram, TikTok, Twitter, or your Telegram profile!"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show help information."""
    await update.message.reply_text(
        "🔗 *BioLinks Help*\n\n"
        "*Commands:*\n"
        "/start - Open the app\n"
        "/edit - Edit your page\n"
        "/share - Get your share link\n"
        "/export - Export your data\n"
        "/help - Show this help\n\n"
        "*Features:*\n"
        "• Add unlimited links\n"
        "• Connect social profiles\n"
        "• Email capture form\n"
        "• Live preview\n"
        "• Easy sharing\n\n"
        "Questions? Contact @support",
        parse_mode='Markdown'
    )

def main():
    """Start the bot."""
    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("edit", edit))
    app.add_handler(CommandHandler("share", share))
    app.add_handler(CommandHandler("help", help_command))

    app.run_polling()

if __name__ == '__main__':
    main()
```

## Node.js Bot Example

```javascript
const { Telegram, Markup } = require('telegraf');

const BOT_TOKEN = 'YOUR_BOT_TOKEN';
const WEB_APP_URL = 'https://yourusername.github.io/biolinks/';

const bot = new Telegram(BOT_TOKEN);

bot.command('start', (ctx) => {
  ctx.reply(
    'Welcome to BioLinks! 🎉\n\n' +
    'Create your perfect link-in-bio page in minutes.\n\n' +
    'Tap the button below to get started:',
    Markup.inlineKeyboard([
      [Markup.button.webApp('🔗 Open BioLinks', WEB_APP_URL)]
    ])
  );
});

bot.command('share', (ctx) => {
  const userId = ctx.from.id;
  const bioUrl = `${WEB_APP_URL}bio-page.html?user=${userId}`;

  ctx.reply(
    `🔗 Your BioLinks page:\n\n${bioUrl}\n\n` +
    'Share this link anywhere!'
  );
});

bot.launch();
```

## Deployment Options

### Option 1: No Backend (Recommended)
- Host on GitHub Pages (free)
- All data stored client-side
- No server maintenance
- Zero operational costs

### Option 2: With Backend
- Store user data on server
- Sync across devices
- Advanced analytics
- Email delivery integration
- Requires hosting (Heroku, Railway, etc.)

## Next Steps

1. **Test your bot** - Send /start to verify it works
2. **Customize colors** - Edit `css/styles.css`
3. **Add analytics** - Integrate Google Analytics or Plausible
4. **Set up payments** - Use Stripe or Telegram Payments
5. **Market your bot** - Share on social media and bot directories

## Resources

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Telegram Mini Apps Guide](https://core.telegram.org/bots/webapps)
- [GitHub Pages Setup](https://pages.github.com/)
- [Stripe Integration](https://stripe.com/docs)

## Support

Need help? Contact:
- Email: support@biolinks.example
- Telegram: @biolinks_support
- GitHub Issues: github.com/yourusername/biolinks/issues
