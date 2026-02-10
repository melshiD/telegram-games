# Claude Code Delegation Patterns

Complete guide for delegating tasks to Claude Code in this repo.

## General Pattern

```bash
/opt/tools/claude-delegate.sh "[task description]" [output-file] --cwd $(pwd)
```

**Key principles:**
- Be specific about requirements
- Reference existing files/templates when relevant
- Specify output location
- Include constraints (CDN-only, no build tools, etc.)

---

## Research Tasks

### Research Game Mechanics
```bash
claude-delegate.sh "Research [game type] mechanics for Telegram mini-apps. Requirements: (1) Analyze 5 popular examples, (2) List core engagement loops, (3) Identify mechanics that work in mobile WebApps, (4) Suggest 3 variations suitable for Telegram. Output structured research document." research/[game-type]-mechanics.md --cwd $(pwd)
```

### Competitive Analysis
```bash
claude-delegate.sh "Find and analyze top 10 Telegram games by DAU. For each: (1) Core mechanic, (2) Monetization approach, (3) Social features, (4) What makes it sticky. Create comparison table." research/competitive-analysis.md --cwd $(pwd)
```

### Technical Feasibility
```bash
claude-delegate.sh "Assess technical feasibility of [game concept] using Vue 3 CDN + Telegram WebApp SDK. Consider: (1) Performance constraints, (2) Storage limitations (localStorage only), (3) API rate limits, (4) Mobile browser compatibility. Output go/no-go recommendation with alternatives." research/feasibility-[concept].md --cwd $(pwd)
```

---

## Build Tasks

### New Game from Scratch
```bash
claude-delegate.sh "Build a working Telegram mini-app game: [concept]. Requirements: (1) Use Vue 3 CDN (unpkg.com/vue@3), (2) Telegram WebApp SDK integration, (3) Follow /templates/game-template.html structure, (4) Include score tracking, (5) Responsive mobile design, (6) Save state to localStorage. Output complete working game." games/[game-name].html --cwd $(pwd)
```

### Clone Existing Game Mechanic
```bash
claude-delegate.sh "Clone [popular game] mechanics for Telegram. Study examples/[reference-game].html for structure. Requirements: (1) Match core gameplay loop, (2) Simplify for mobile, (3) Add Telegram-specific features (haptic feedback, share scores), (4) Keep under 500 lines. Output working prototype." games/[game-name].html --cwd $(pwd)
```

### Template Variation
```bash
claude-delegate.sh "Create variation of templates/[template-name].html with these changes: [specific modifications]. Maintain: (1) Vue 3 CDN structure, (2) Telegram SDK integration, (3) Responsive design. Output new game." games/[variation-name].html --cwd $(pwd)
```

---

## Iteration Tasks

### Bug Fix
```bash
claude-delegate.sh "Fix bug in games/[game-name].html: [bug description]. Requirements: (1) Maintain existing game state logic, (2) Don't break current features, (3) Test edge cases, (4) Document fix in code comments." iteration-log.md --cwd $(pwd)
```

### Feature Addition
```bash
claude-delegate.sh "Add [feature] to games/[game-name].html. Requirements: (1) Don't break existing gameplay, (2) Follow existing code style, (3) Add inline comments for new code, (4) Update game instructions if UI changes." iteration-log.md --cwd $(pwd)
```

### Polish Pass
```bash
claude-delegate.sh "Polish games/[game-name].html for production. Requirements: (1) Improve animations/transitions, (2) Add haptic feedback at key moments, (3) Enhance visual feedback, (4) Optimize for 60fps, (5) Add loading states. Maintain all functionality." iteration-log.md --cwd $(pwd)
```

### Performance Optimization
```bash
claude-delegate.sh "Optimize games/[game-name].html performance. Profile and improve: (1) Reduce unnecessary Vue reactivity, (2) Throttle/debounce frequent events, (3) Optimize render cycles, (4) Minimize localStorage writes. Document changes." iteration-log.md --cwd $(pwd)
```

---

## Documentation Tasks

### Game Design Doc
```bash
claude-delegate.sh "Create comprehensive design document for [game concept]. Include: (1) Core gameplay loop diagram, (2) User flows, (3) Feature list with priorities, (4) Technical architecture, (5) Monetization ideas, (6) Launch checklist. Use Markdown with diagrams." docs/[game-name]-design.md --cwd $(pwd)
```

### Tutorial Creation
```bash
claude-delegate.sh "Write player-facing tutorial for games/[game-name].html. Requirements: (1) 3-5 simple steps, (2) Visual aids (emoji/icons), (3) Under 200 words, (4) Mobile-friendly format. Output as standalone HTML or integration code." docs/[game-name]-tutorial.html --cwd $(pwd)
```

---

## Testing Tasks

### Generate Test Suite
```bash
claude-delegate.sh "Create manual test checklist for games/[game-name].html. Cover: (1) All user interactions, (2) Edge cases (score limits, negative values), (3) Telegram WebApp integration, (4) Mobile browser compatibility, (5) localStorage persistence. Output structured checklist." tests/[game-name]-checklist.md --cwd $(pwd)
```

---

## Constraints to Always Include

When delegating, remind Claude Code of these constraints:

1. **No build tools** - Pure HTML/CSS/JS, CDN only
2. **Vue 3 via CDN** - `https://unpkg.com/vue@3`
3. **Telegram SDK via CDN** - `https://telegram.org/js/telegram-web-app.js`
4. **Mobile-first** - Design for phone screens
5. **Fast load** - Keep files under 1MB, lazy load assets
6. **Offline-capable** - localStorage for persistence
7. **No backend** - All logic client-side (until we need it)

---

## Output File Naming

- Research: `research/[topic]-[date].md`
- Games: `games/[game-name].html`
- Docs: `docs/[game-name]-[type].md`
- Logs: `iteration-log.md` or `[task-type]-log-[date].md`

---

## Example Full Workflow

```bash
# 1. Research
claude-delegate.sh "Research idle clicker mechanics for Telegram. Analyze Cookie Clicker, Adventure Capitalist, Egg Inc. Suggest 3 Telegram-friendly variations." research/idle-clicker.md --cwd $(pwd)

# 2. Build prototype
claude-delegate.sh "Build idle clicker Telegram game based on research/idle-clicker.md. Use templates/game-template.html. Include: auto-clicker upgrades, prestige system, Telegram score sharing." games/idle-clicker.html --cwd $(pwd)

# 3. Test and iterate
# (Manual testing)

# 4. Polish
claude-delegate.sh "Polish games/idle-clicker.html. Add particle effects on clicks, smooth upgrade animations, haptic feedback, better mobile touch targets." iteration-log.md --cwd $(pwd)

# 5. Deploy
git add games/idle-clicker.html
git commit -m "Add idle clicker game"
git push
# Live at: melshid.github.io/telegram-games/games/idle-clicker.html
```

---

**Remember:** Claude Code can read this file! You can say "follow DELEGATE.md pattern #3" and it knows what to do.
