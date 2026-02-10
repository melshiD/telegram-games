# First Primer Generator

Generate structured "First Primer" onboarding documents for new projects.

## What's a First Primer?

A First Primer is a letter to Claude that explains:
1. What we're building
2. Why it matters
3. The technical approach
4. How to build it with parallel agents

It's the CLAUDE.md that kickstarts a new project.

---

## Invocation

```
/first-primer "Short description of the project idea"
```

Or with more context:
```
/first-primer
Topic: [what you're building]
Purpose: [why / who it's for]
Tech hints: [any known tech choices]
Constraints: [budget, timeline, must-haves]
```

---

## Process

### Phase 1: Discovery (Ask Questions)

Before generating, clarify the idea:

**Core Questions:**
1. What does this thing DO in one sentence?
2. Who uses it? (internal tool, API consumers, end users)
3. What's the primary output? (data, images, actions, content)
4. Is this a standalone tool or does it integrate with other systems?

**Technical Questions:**
5. Any required external APIs or services?
6. Any hard tech constraints? (must be Python, must use X database)
7. Is there a UI, or is this API/CLI only?
8. What's the expected scale? (personal tool, team, public)

**Scope Questions:**
9. What's the MVP vs. full vision?
10. What should it explicitly NOT do?

### Phase 2: Structure the Primer

Use this template:

```markdown
# First Primer: [Project Name]

> A letter to Claude from the project owner

---

## Welcome, Claude

[2-3 sentences: What is this? What's the core value?]

[ASCII diagram of the core flow]

---

## Core Purpose

[Bullet points of what it does]
[What it explicitly does NOT do]

---

## The Pipeline / Architecture

[ASCII diagram showing data flow]
[Explain each step]

---

## API Design (if applicable)

[Main endpoints with request/response examples]

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| ... | ... |

---

## Key Code Structures

[Core interfaces/types]
[Example implementations]

---

## External Integrations (if any)

[API clients, credentials needed]

---

## Parallel Agent Strategy

### Phase 1: [Name] (X Parallel Agents)

**HUMAN ACTION: Open X terminals**

```powershell
git worktree add ..\[name]-[agent1] -b feature/[agent1]
git worktree add ..\[name]-[agent2] -b feature/[agent2]
```

| Terminal | Worktree | Agent Mission |
|----------|----------|---------------|
| 1 | `[name]-[agent1]` | [What this agent builds] |
| 2 | `[name]-[agent2]` | [What this agent builds] |

**Agent 1 prompt:**
```
"You are the [Role] Agent. Build:
1. [Task 1]
2. [Task 2]
3. [Task 3]

Exports: [function1(), function2()]
Work in: src/lib/[folder]/"
```

**Merge point:** [When to merge]

---

### Phase 2: [Name] (X Agent(s))

[Same structure]

---

### Summary

```
[ASCII diagram of all phases]

Total: X agent-sessions across Y phases
```

---

## Project Setup (REQUIRED FIRST STEP)

### 1. Create Project & Add Toolkit as Submodule

```powershell
mkdir C:\projects\[project-name]
cd C:\projects\[project-name]
git init

# Add the toolkit as a submodule
git submodule add https://github.com/melshiD/supercharged-workflows .workflow
```

### 2. Deploy Toolkit to Project

This copies all commands, agents, skills, and templates to your project:

```powershell
# Run setup from the submodule
.\.workflow\setup.ps1 -TargetDir . -type node
```

**What this gives you:**
- `/plan`, `/commit-push-pr`, `/test-fix`, `/refactor` commands
- `verify-app`, `code-simplifier`, `security-reviewer` agents
- `caching-analyzer`, `token-economics`, `api-customer-experience` skills
- Pre-configured settings and hooks

### 3. Install Browser Automation (if needed)

```bash
npm install -g agent-browser && agent-browser install
```

### 4. Install Recommended Plugins (optional but valuable)

```bash
/plugin marketplace add anthropics/claude-plugins-official
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
/plugin install feature-dev@claude-plugins-official
```

### 5. Copy This Primer as CLAUDE.md

```powershell
# If this primer is in the toolkit:
copy .\.workflow\scaffold\templates\CLAUDE-[project-name]-primer.md .\CLAUDE.md

# Or paste the primer content directly into CLAUDE.md
```

### Updating the Toolkit Later

```powershell
git submodule update --remote .workflow
.\.workflow\setup.ps1 -TargetDir . --force
```

---

### Relevant Skills (from toolkit)

| Skill | Use |
|-------|-----|
| `[skill]` | [when to use] |

---

## API Keys & Dependencies

### API Keys Needed
- [ ] [Key 1]
- [ ] [Key 2]

### Dependencies
```json
{
  "dependencies": { ... }
}
```

---

## Let's Begin

Once you've read this and set up API keys:

```
"I've read the [Project] Primer.

[Summary of what we're building]

Starting Phase 1 (parallel):
1. [Agent 1 summary]
2. [Agent 2 summary]

After merge, Phase 2:
3. [Agent 3 summary]

X agent-sessions total. Let's start coding."
```

---

*This primer was generated using the Supercharged Workflows toolkit.*
```

### Phase 3: Determine Parallel Strategy

Rules for splitting work:

**Can run in parallel if:**
- No code dependencies between agents
- Different directories/modules
- Can be merged without conflicts

**Must be sequential if:**
- Agent 2 needs Agent 1's exports
- Integration/wiring work
- Testing against combined code

**Typical patterns:**

| Project Type | Phase 1 | Phase 2 |
|--------------|---------|---------|
| API + UI | Backend, Frontend | Integration |
| Pipeline | Each stage | Orchestrator |
| Multi-service | Service A, Service B | Gateway/API |
| Data + ML | Data pipeline, Model | Inference API |

**Agent count guidelines:**
- Simple tool: 2-3 agents total
- Medium project: 3-5 agents total
- Complex system: 5-8 agents total

### Phase 4: Generate the Primer

Output the complete primer markdown file.

---

## Examples

### Example 1: Simple Tool

**Input:** "A CLI that converts markdown files to PDF with syntax highlighting"

**Output primer includes:**
- Purpose: Markdown → styled PDF
- Tech: Node.js, Puppeteer or WeasyPrint
- Parallel strategy: 2 agents
  - Agent 1: Markdown parser + syntax highlighter
  - Agent 2: PDF renderer + CLI interface
- Total: 2 agent-sessions, 1 phase

### Example 2: API Service

**Input:** "An API that analyzes GitHub repos and scores code quality"

**Output primer includes:**
- Purpose: GitHub URL → quality report
- Tech: Node.js, GitHub API, static analysis tools
- Parallel strategy: 4 agents across 2 phases
  - Phase 1: GitHub client, AST analyzer, metrics calculator
  - Phase 2: API routes + scoring aggregator
- Total: 4 agent-sessions, 2 phases

### Example 3: Full-Stack App

**Input:** "A bookmark manager with tagging, search, and browser extension"

**Output primer includes:**
- Purpose: Save/organize/search bookmarks
- Tech: Next.js, Postgres, browser extension APIs
- Parallel strategy: 5 agents across 2 phases
  - Phase 1: Database/API, Search engine, Browser extension
  - Phase 2: Web UI, Integration
- Total: 5 agent-sessions, 2 phases

---

## Quality Checklist

Before finalizing a primer, verify:

- [ ] **Clear purpose** - One sentence explains what it does
- [ ] **Scope boundaries** - What it does NOT do is explicit
- [ ] **Tech stack justified** - Choices make sense for the problem
- [ ] **API design** - If applicable, endpoints are specified
- [ ] **Agent missions are independent** - Parallel agents don't block each other
- [ ] **Merge points are clear** - When to combine work
- [ ] **Human actions are marked** - ⚠️ for required human steps
- [ ] **Setup requirements listed** - API keys, dependencies
- [ ] **"Let's Begin" is actionable** - Claude knows exactly how to start

---

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Too many agents | Coordination overhead | Combine related work |
| Vague agent missions | Agent doesn't know when done | Specific deliverables + exports |
| Missing integration phase | Code doesn't work together | Always have a wiring phase |
| No scope limits | Project creeps | Explicit "does NOT do" section |
| Assumed knowledge | Claude lacks context | Include code examples |
| No API design | Unclear interfaces | Define endpoints/types upfront |

---

## Output

Save the generated primer to:
```
scaffold/templates/CLAUDE-[project-name]-primer.md
```

Or give directly to user to save as their project's `CLAUDE.md`.

---

## Related

- Existing primers in `scaffold/templates/CLAUDE-*-primer.md`
- Parallel agent setup: `/parallel-setup` command
- Project scaffolding: `/scaffold` command
