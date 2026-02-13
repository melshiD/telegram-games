# BioLinks - Link-in-Bio with Email Capture

A Telegram Mini App for creating beautiful, shareable link-in-bio pages. Manage everything from within Telegram!

## Features

- **Link Management**: Add, edit, and organize your important links
- **Social Profiles**: Connect your Instagram, Twitter, YouTube, TikTok, LinkedIn, GitHub, Facebook, and Telegram
- **Email Capture**: Optional email signup form to build your audience
- **Custom Branding**: Add your name, bio, and avatar
- **Live Preview**: See how your page looks before sharing
- **Easy Sharing**: Copy link or share directly from the app
- **Export Options**: Download your data as JSON or generate a standalone HTML page

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Telegram Integration**: Telegram Mini App SDK
- **Storage**: LocalStorage (client-side)
- **Hosting**: GitHub Pages compatible

## Setup

### 1. Host on GitHub Pages

1. Create a new GitHub repository (e.g., `my-biolinks`)
2. Upload all files from the `biolinks/` directory
3. Go to Settings > Pages
4. Select the branch and root folder
5. Your app will be available at `https://yourusername.github.io/my-biolinks/`

### 2. Create Telegram Bot

1. Open [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot with `/newbot`
3. Set the bot name and username
4. Save your bot token

### 3. Configure Mini App

1. Send `/newapp` to [@BotFather](https://t.me/botfather)
2. Select your bot
3. Enter app details:
   - **Title**: BioLinks
   - **Description**: Create your link-in-bio page
   - **Photo**: Upload a 640x360px image
   - **Short Name**: biolinks (used in URL)
4. Set the Web App URL to your GitHub Pages URL

### 4. Test Your App

1. Open your bot in Telegram
2. Tap the menu button or send a command
3. Select your Mini App
4. Start building your bio page!

## File Structure

```
biolinks/
├── index.html          # Main app interface
├── bio-page.html       # Public-facing bio page
├── css/
│   └── styles.css      # App styles
├── js/
│   └── app.js          # App logic
└── README.md           # This file
```

## Usage

### Adding Links

1. Open the app in Telegram
2. Go to the **Links** tab
3. Tap **+ Add Link**
4. Enter title, URL, and optional emoji icon
5. Tap **Save**

### Adding Social Profiles

1. Go to the **Socials** tab
2. Tap on any platform
3. Enter your username
4. Tap **Save**

### Configuring Settings

1. Go to the **Settings** tab
2. Fill in your profile information:
   - Display Name
   - Bio (optional)
   - Avatar URL (optional)
3. Enable email capture if desired
4. Tap **Save Settings**

### Sharing Your Page

1. Go to the **Settings** tab
2. Find "Your Bio Page" section
3. Tap **Copy Link** or **Share**
4. Add the link to your social media profiles!

### Previewing Your Page

1. Go to the **Preview** tab
2. See how your page looks
3. Tap **Open in Browser** to test

### Exporting Data

1. Go to the **Settings** tab
2. Scroll to "Export Data"
3. Options:
   - **Export JSON**: Download your raw data
   - **Generate Bio Page**: Create a standalone HTML file

## Customization

### Changing Colors

Edit `css/styles.css` and modify the CSS variables:

```css
:root {
    --primary-color: #3b82f6;
    --secondary-color: #8b5cf6;
    /* ... more colors ... */
}
```

### Adding New Social Platforms

Edit `js/app.js` and add to the `SOCIAL_PLATFORMS` array:

```javascript
const SOCIAL_PLATFORMS = [
    // ... existing platforms ...
    { id: 'newplatform', name: 'New Platform', icon: '🔗', placeholder: 'username' }
];
```

### Customizing Bio Page Template

Edit the `generateBioPage()` function in `js/app.js` to modify the generated HTML structure and styles.

## Monetization Ideas

This app is priced at **$5/mo** and targets:
- Creators on Instagram/TikTok/Telegram
- Influencers building their personal brand
- Small business owners
- Content creators wanting a simple bio page

### Premium Features to Add:

1. **Custom Themes**: Multiple color schemes
2. **Analytics**: Track link clicks and email signups
3. **Backend Integration**: Real email delivery (Mailchimp, ConvertKit)
4. **Custom Domains**: Allow users to use their own domain
5. **Advanced Layouts**: Different page templates
6. **Scheduling**: Schedule when links appear/disappear

## Deployment Checklist

- [ ] Test all features in Telegram
- [ ] Add analytics tracking (optional)
- [ ] Set up email backend (optional)
- [ ] Create marketing materials
- [ ] Set up payment processing
- [ ] Configure bot commands
- [ ] Test on different devices
- [ ] Add terms of service and privacy policy

## Bot Commands

Add these commands via [@BotFather](https://t.me/botfather):

```
start - Open BioLinks app
edit - Edit your bio page
preview - Preview your page
share - Get your share link
help - Get help
```

## Costs

**Infrastructure Used:**
- GitHub Pages (Free tier: unlimited static sites)

**Per-App Costs:**
- $0/month (fully client-side)

**Revenue Model:**
- $5/month subscription per user
- Or $19 lifetime purchase option

## Support

For questions or issues:
1. Check the in-app help
2. Contact support via Telegram bot
3. Visit the GitHub repository

## License

MIT License - feel free to modify and use for your projects!

---

Made with 🔗 by BioLinks
