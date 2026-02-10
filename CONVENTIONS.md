# Code Conventions

Style guide for all Telegram Games projects. Follow these patterns for consistency.

## File Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>[Game Name]</title>
    
    <!-- Telegram WebApp SDK -->
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    
    <!-- Tailwind CSS (optional) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Vue 3 -->
    <script src="https://unpkg.com/vue@3"></script>
    
    <style>
        /* Inline styles for critical CSS */
    </style>
</head>
<body>
    <div id="app">
        <!-- Vue app here -->
    </div>
    
    <script>
        const { createApp } = Vue;
        
        createApp({
            // App logic here
        }).mount('#app');
    </script>
</body>
</html>
```

## Vue Patterns

### Use Composition API

```javascript
const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        // State
        const score = ref(0);
        const multiplier = ref(1);
        
        // Computed
        const displayScore = computed(() => {
            return score.value.toLocaleString();
        });
        
        // Methods
        function click() {
            score.value += multiplier.value;
            saveGame();
        }
        
        // Lifecycle
        onMounted(() => {
            loadGame();
        });
        
        return { score, multiplier, displayScore, click };
    }
}).mount('#app');
```

### State Management

Use localStorage for persistence:

```javascript
function saveGame() {
    const state = {
        score: score.value,
        multiplier: multiplier.value,
        timestamp: Date.now()
    };
    localStorage.setItem('game-[game-name]', JSON.stringify(state));
}

function loadGame() {
    const saved = localStorage.getItem('game-[game-name]');
    if (saved) {
        const state = JSON.parse(saved);
        score.value = state.score;
        multiplier.value = state.multiplier;
    }
}
```

## Telegram Integration

### Initialize WebApp

```javascript
const tg = window.Telegram.WebApp;

onMounted(() => {
    tg.ready();
    tg.expand();
    
    // Apply Telegram theme
    document.body.style.backgroundColor = tg.themeParams.bg_color || '#ffffff';
});
```

### Haptic Feedback

```javascript
function handleClick() {
    tg.HapticFeedback.impactOccurred('medium');
    // Game logic...
}

function handleSuccess() {
    tg.HapticFeedback.notificationOccurred('success');
}
```

### Share Score

```javascript
function shareScore() {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('I scored ' + score.value + ' points!')}`;
    tg.openTelegramLink(url);
}
```

## CSS Conventions

### Mobile-First

```css
/* Mobile (default) */
button {
    padding: 12px 24px;
    font-size: 16px;
}

/* Tablet+ */
@media (min-width: 768px) {
    button {
        padding: 16px 32px;
        font-size: 18px;
    }
}
```

### Touch Targets

Minimum 44x44px for all interactive elements:

```css
button, .clickable {
    min-width: 44px;
    min-height: 44px;
    touch-action: manipulation; /* Disable double-tap zoom */
}
```

### Telegram Theme Integration

```css
:root {
    --tg-bg: var(--tg-theme-bg-color, #ffffff);
    --tg-text: var(--tg-theme-text-color, #000000);
    --tg-button: var(--tg-theme-button-color, #3390ec);
}

body {
    background: var(--tg-bg);
    color: var(--tg-text);
}

button.primary {
    background: var(--tg-button);
}
```

## Performance

### Debounce Frequent Events

```javascript
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedSave = debounce(saveGame, 1000);
```

### Throttle Game Loop

```javascript
let lastFrame = 0;

function gameLoop(timestamp) {
    const delta = timestamp - lastFrame;
    
    if (delta >= 16.67) { // 60 FPS
        update(delta);
        lastFrame = timestamp;
    }
    
    requestAnimationFrame(gameLoop);
}
```

## Naming Conventions

- **Files**: `kebab-case.html`
- **Vue components**: `PascalCase` (if using SFC, but we're not)
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Functions**: `camelCase` verbs (`handleClick`, `saveGame`)

## Comments

```javascript
// Single-line comments for brief explanations

/**
 * Multi-line JSDoc for complex functions
 * @param {number} amount - Amount to add
 * @returns {number} New score
 */
function addScore(amount) {
    return score.value += amount;
}
```

## Error Handling

```javascript
try {
    const state = JSON.parse(localStorage.getItem('game-data'));
    // Use state...
} catch (error) {
    console.error('Failed to load game:', error);
    // Provide fallback or reset
}
```

## Git Commit Messages

```
feat: Add clicker game
fix: Correct score calculation overflow
polish: Improve button animations
docs: Update game tutorial
refactor: Extract save/load logic
```

---

**Principle**: Keep it simple. No over-engineering. Ship fast, iterate faster.
