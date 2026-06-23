# GoGoScrum Shortcut Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compact “项” shortcut that opens GoGoScrum safely in a new tab.

**Architecture:** Extend the existing table-driven shortcut test and reuse the current character shortcut markup and CSS. No new component, state, or styling is required.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, Vite, GitHub Pages

---

### Task 1: Add and publish the GoGoScrum shortcut

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing test**

Add this case to the existing shortcut parameter table:

```tsx
['GoGoScrum', 'https://gogoscrum.com'],
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL because no link with the accessible name `GoGoScrum` exists.

- [ ] **Step 3: Add the minimal implementation**

Insert after the “饮” shortcut:

```tsx
<a className="icon-button shortcut-character" href="https://gogoscrum.com" target="_blank" rel="noopener noreferrer" aria-label="GoGoScrum" title="GoGoScrum">项</a>
```

- [ ] **Step 4: Run complete verification**

Run:

```bash
npm test -- --run
GITHUB_ACTIONS=true GITHUB_REPOSITORY=sange1022/project-checkin-dashboard npm run build
git diff --check
```

Expected: all tests pass, the production build succeeds, and no whitespace errors are reported.

- [ ] **Step 5: Commit and publish**

```bash
git add src/App.tsx src/App.test.tsx docs/superpowers/plans/2026-06-23-gogoscrum-shortcut.md
git commit -m "feat: add GoGoScrum shortcut"
git -c http.version=HTTP/1.1 push origin HEAD:main
git -c http.version=HTTP/1.1 push origin codex/project-checkin-web
```

Confirm the GitHub Pages workflow completes successfully.
