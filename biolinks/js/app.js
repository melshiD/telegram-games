// Telegram Web App initialization
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Apply Telegram theme colors
document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2481cc');
document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#f4f4f5');

// Data storage key
const STORAGE_KEY = 'biolinks_data';

// Social platforms configuration
const SOCIAL_PLATFORMS = [
    { id: 'instagram', name: 'Instagram', icon: '📷', placeholder: 'username' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', placeholder: 'username' },
    { id: 'youtube', name: 'YouTube', icon: '▶️', placeholder: 'channel' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', placeholder: '@username' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', placeholder: 'username' },
    { id: 'github', name: 'GitHub', icon: '🐙', placeholder: 'username' },
    { id: 'facebook', name: 'Facebook', icon: '👥', placeholder: 'username' },
    { id: 'telegram', name: 'Telegram', icon: '✈️', placeholder: 'username' },
];

// App state
let appData = {
    profile: {
        name: tg.initDataUnsafe?.user?.first_name || 'Your Name',
        bio: '',
        avatar: '',
        emailCapture: false,
        emailPrompt: 'Join my newsletter!'
    },
    links: [],
    socials: {}
};

// Load data from localStorage
function loadData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            appData = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error loading data:', e);
    }
}

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
        tg.showPopup({
            message: 'Changes saved successfully!',
            buttons: [{type: 'ok'}]
        });
    } catch (e) {
        console.error('Error saving data:', e);
        tg.showPopup({
            message: 'Error saving data. Please try again.',
            buttons: [{type: 'ok'}]
        });
    }
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Refresh content based on tab
        if (tabName === 'socials') {
            renderSocials();
        } else if (tabName === 'settings') {
            loadSettings();
        } else if (tabName === 'preview') {
            refreshPreview();
        }
    });
});

// Links management
function renderLinks() {
    const linksList = document.getElementById('links-list');

    if (appData.links.length === 0) {
        linksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔗</div>
                <p>No links yet. Add your first link!</p>
            </div>
        `;
        return;
    }

    linksList.innerHTML = appData.links.map((link, index) => `
        <div class="link-item" data-index="${index}">
            <div class="link-icon">${link.icon || '🔗'}</div>
            <div class="link-info">
                <div class="link-title">${escapeHtml(link.title)}</div>
                <div class="link-url">${escapeHtml(link.url)}</div>
            </div>
            <div class="link-actions">
                <button class="icon-btn edit-link-btn" data-index="${index}">✏️</button>
                <button class="icon-btn delete-link-btn" data-index="${index}">🗑️</button>
            </div>
        </div>
    `).join('');

    // Attach event listeners
    document.querySelectorAll('.edit-link-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            editLink(index);
        });
    });

    document.querySelectorAll('.delete-link-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            deleteLink(index);
        });
    });
}

function openLinkModal(linkData = null, index = null) {
    const modal = document.getElementById('link-modal');
    const form = document.getElementById('link-form');
    const title = document.getElementById('link-modal-title');

    if (linkData) {
        title.textContent = 'Edit Link';
        document.getElementById('link-id').value = index;
        document.getElementById('link-title').value = linkData.title;
        document.getElementById('link-url').value = linkData.url;
        document.getElementById('link-icon').value = linkData.icon || '';
    } else {
        title.textContent = 'Add Link';
        form.reset();
        document.getElementById('link-id').value = '';
    }

    modal.classList.add('active');
}

function closeLinkModal() {
    document.getElementById('link-modal').classList.remove('active');
}

function editLink(index) {
    openLinkModal(appData.links[index], index);
}

function deleteLink(index) {
    tg.showPopup({
        message: 'Delete this link?',
        buttons: [
            {id: 'delete', type: 'destructive', text: 'Delete'},
            {id: 'cancel', type: 'cancel'}
        ]
    }, (buttonId) => {
        if (buttonId === 'delete') {
            appData.links.splice(index, 1);
            saveData();
            renderLinks();
        }
    });
}

// Link form handling
document.getElementById('add-link-btn').addEventListener('click', () => {
    openLinkModal();
});

document.getElementById('close-link-modal').addEventListener('click', closeLinkModal);
document.getElementById('cancel-link-btn').addEventListener('click', closeLinkModal);

document.getElementById('link-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const linkId = document.getElementById('link-id').value;
    const linkData = {
        title: document.getElementById('link-title').value,
        url: document.getElementById('link-url').value,
        icon: document.getElementById('link-icon').value || '🔗'
    };

    if (linkId === '') {
        // Add new link
        appData.links.push(linkData);
    } else {
        // Update existing link
        appData.links[parseInt(linkId)] = linkData;
    }

    saveData();
    renderLinks();
    closeLinkModal();
});

// Socials management
function renderSocials() {
    const socialsList = document.getElementById('socials-list');

    socialsList.innerHTML = SOCIAL_PLATFORMS.map(platform => {
        const username = appData.socials[platform.id] || '';
        const isActive = username !== '';

        return `
            <div class="social-item ${isActive ? 'active' : ''}" data-platform="${platform.id}">
                <div class="social-icon">${platform.icon}</div>
                <div class="social-name">${platform.name}</div>
                <div class="social-username">${isActive ? '@' + escapeHtml(username) : 'Not set'}</div>
            </div>
        `;
    }).join('');

    // Attach click handlers
    document.querySelectorAll('.social-item').forEach(item => {
        item.addEventListener('click', () => {
            const platformId = item.dataset.platform;
            const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
            editSocial(platform);
        });
    });
}

function editSocial(platform) {
    const currentValue = appData.socials[platform.id] || '';

    tg.showPopup({
        title: platform.name,
        message: `Enter your ${platform.name} ${platform.placeholder}:`,
        buttons: [
            {id: 'save', type: 'default', text: 'Save'},
            {id: 'remove', type: 'destructive', text: 'Remove'},
            {id: 'cancel', type: 'cancel'}
        ]
    }, (buttonId) => {
        if (buttonId === 'save') {
            // Note: Telegram Mini Apps don't support text input in popups
            // In production, you'd use a custom modal with input field
            const username = prompt(`Enter your ${platform.name} username:`, currentValue);
            if (username !== null) {
                if (username.trim() === '') {
                    delete appData.socials[platform.id];
                } else {
                    appData.socials[platform.id] = username.trim();
                }
                saveData();
                renderSocials();
            }
        } else if (buttonId === 'remove') {
            delete appData.socials[platform.id];
            saveData();
            renderSocials();
        }
    });
}

// Settings management
function loadSettings() {
    document.getElementById('profile-name').value = appData.profile.name;
    document.getElementById('profile-bio').value = appData.profile.bio;
    document.getElementById('profile-avatar').value = appData.profile.avatar;
    document.getElementById('enable-email-capture').checked = appData.profile.emailCapture;
    document.getElementById('email-prompt').value = appData.profile.emailPrompt;

    toggleEmailPrompt();
    updateBioUrl();
}

function toggleEmailPrompt() {
    const enabled = document.getElementById('enable-email-capture').checked;
    const group = document.getElementById('email-prompt-group');
    group.style.display = enabled ? 'block' : 'none';
}

document.getElementById('enable-email-capture').addEventListener('change', toggleEmailPrompt);

document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();

    appData.profile.name = document.getElementById('profile-name').value;
    appData.profile.bio = document.getElementById('profile-bio').value;
    appData.profile.avatar = document.getElementById('profile-avatar').value;
    appData.profile.emailCapture = document.getElementById('enable-email-capture').checked;
    appData.profile.emailPrompt = document.getElementById('email-prompt').value;

    saveData();
});

function updateBioUrl() {
    const userId = tg.initDataUnsafe?.user?.id || 'demo';
    const bioUrl = `${window.location.origin}${window.location.pathname.replace('index.html', '')}bio-page.html?user=${userId}`;
    document.getElementById('bio-url').textContent = bioUrl;
}

document.getElementById('copy-url-btn').addEventListener('click', () => {
    const bioUrl = document.getElementById('bio-url').textContent;
    navigator.clipboard.writeText(bioUrl).then(() => {
        tg.showPopup({
            message: 'Link copied to clipboard!',
            buttons: [{type: 'ok'}]
        });
    }).catch(() => {
        tg.showPopup({
            message: 'Could not copy link. Please copy manually.',
            buttons: [{type: 'ok'}]
        });
    });
});

document.getElementById('share-url-btn').addEventListener('click', () => {
    const bioUrl = document.getElementById('bio-url').textContent;
    if (navigator.share) {
        navigator.share({
            title: 'My BioLinks Page',
            url: bioUrl
        });
    } else {
        tg.openLink(bioUrl);
    }
});

// Export data
document.getElementById('export-data-btn').addEventListener('click', () => {
    const dataStr = JSON.stringify(appData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'biolinks-data.json';
    link.click();
    URL.revokeObjectURL(url);
});

document.getElementById('generate-page-btn').addEventListener('click', () => {
    generateBioPage();
});

// Generate bio page HTML
function generateBioPage() {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(appData.profile.name)} - BioLinks</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }
        .profile {
            text-align: center;
            margin-bottom: 30px;
        }
        .avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-bottom: 16px;
            border: 4px solid white;
            object-fit: cover;
        }
        .name {
            font-size: 24px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
        }
        .bio {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.5;
        }
        .links {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 30px;
        }
        .link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            background: white;
            border-radius: 12px;
            text-decoration: none;
            color: #333;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .link:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .link-icon {
            font-size: 24px;
        }
        .link-title {
            font-weight: 600;
            font-size: 16px;
        }
        .socials {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        .social {
            width: 48px;
            height: 48px;
            background: white;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-size: 24px;
            transition: transform 0.2s;
        }
        .social:hover {
            transform: scale(1.1);
        }
        .email-capture {
            background: white;
            padding: 24px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .email-capture h3 {
            font-size: 18px;
            margin-bottom: 12px;
        }
        .email-capture input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 12px;
        }
        .email-capture button {
            width: 100%;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
        }
        .email-capture button:hover {
            background: #5568d3;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="profile">
            ${appData.profile.avatar ? `<img src="${escapeHtml(appData.profile.avatar)}" alt="Avatar" class="avatar">` : ''}
            <h1 class="name">${escapeHtml(appData.profile.name)}</h1>
            ${appData.profile.bio ? `<p class="bio">${escapeHtml(appData.profile.bio)}</p>` : ''}
        </div>

        <div class="links">
            ${appData.links.map(link => `
                <a href="${escapeHtml(link.url)}" class="link" target="_blank" rel="noopener">
                    <span class="link-icon">${link.icon}</span>
                    <span class="link-title">${escapeHtml(link.title)}</span>
                </a>
            `).join('')}
        </div>

        ${Object.keys(appData.socials).length > 0 ? `
            <div class="socials">
                ${Object.entries(appData.socials).map(([platformId, username]) => {
                    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
                    const urls = {
                        instagram: `https://instagram.com/${username}`,
                        twitter: `https://twitter.com/${username}`,
                        youtube: `https://youtube.com/@${username}`,
                        tiktok: `https://tiktok.com/@${username}`,
                        linkedin: `https://linkedin.com/in/${username}`,
                        github: `https://github.com/${username}`,
                        facebook: `https://facebook.com/${username}`,
                        telegram: `https://t.me/${username}`
                    };
                    return platform ? `
                        <a href="${urls[platformId]}" class="social" target="_blank" rel="noopener">
                            ${platform.icon}
                        </a>
                    ` : '';
                }).join('')}
            </div>
        ` : ''}

        ${appData.profile.emailCapture ? `
            <div class="email-capture">
                <h3>${escapeHtml(appData.profile.emailPrompt)}</h3>
                <form id="email-form">
                    <input type="email" placeholder="Enter your email" required>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
            <script>
                document.getElementById('email-form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = e.target.querySelector('input').value;
                    // Store email in localStorage (in production, send to backend)
                    const emails = JSON.parse(localStorage.getItem('biolinks_emails') || '[]');
                    emails.push({ email, timestamp: new Date().toISOString() });
                    localStorage.setItem('biolinks_emails', JSON.stringify(emails));
                    alert('Thanks for subscribing!');
                    e.target.reset();
                });
            </script>
        ` : ''}

        <div class="footer">
            Made with BioLinks
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bio-page.html';
    link.click();
    URL.revokeObjectURL(url);

    tg.showPopup({
        message: 'Bio page generated! Upload it to GitHub Pages or any web host.',
        buttons: [{type: 'ok'}]
    });
}

// Preview
function refreshPreview() {
    const iframe = document.getElementById('preview-frame');
    iframe.src = 'bio-page.html?t=' + Date.now();
}

document.getElementById('refresh-preview-btn').addEventListener('click', refreshPreview);
document.getElementById('open-preview-btn').addEventListener('click', () => {
    const userId = tg.initDataUnsafe?.user?.id || 'demo';
    const bioUrl = `${window.location.origin}${window.location.pathname.replace('index.html', '')}bio-page.html?user=${userId}`;
    tg.openLink(bioUrl);
});

// Utility function
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize app
loadData();
renderLinks();
updateBioUrl();
