# Remove Mobile CTA Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the fixed `Пробний урок / Тест рівня` mobile bar while preserving every other CTA and desktop behavior.

**Architecture:** Delete the bar at its source in `App.jsx`, then remove its now-unused mobile CSS. Protect the removal with a source-level regression test that checks both files.

**Tech Stack:** React 19, CSS, Node test runner, Vite 6, in-app browser.

## Global Constraints

- Keep the hero CTA, lead form, navigation, and desktop presentation unchanged.
- Make no responsive breakpoint, copy, or unrelated style changes.
- The project is not a Git repository, so commit steps are omitted.

---

### Task 1: Remove The Fixed Mobile CTA Bar

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/App.jsx:700`
- Modify: `src/styles.css:487-489`

**Interfaces:**
- Consumes: the `App` component source and mobile stylesheet.
- Produces: an application with no `.mobile-cta-bar` DOM or CSS selector.

- [ ] **Step 1: Write the failing regression test**

Append to `src/styles.test.js`:

```js
test("the fixed mobile CTA bar is removed", async () => {
  const [app, css] = await Promise.all([
    readFile(new URL("./App.jsx", import.meta.url), "utf8"),
    readFile(new URL("./styles.css", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(app, /mobile-cta-bar/);
  assert.doesNotMatch(css, /mobile-cta-bar/);
});
```

- [ ] **Step 2: Run the targeted test and confirm RED**

Run: `npm test -- --test-name-pattern='fixed mobile CTA bar'`

Expected: FAIL because `App.jsx` and `styles.css` still contain `mobile-cta-bar`.

- [ ] **Step 3: Remove the markup and CSS**

Delete from `App.jsx`:

```jsx
<div className="mobile-cta-bar"><a href="#lead">Пробний урок</a><a href="#lead">Тест рівня</a></div>
```

Delete from the `max-width: 767px` block in `styles.css`:

```css
.mobile-cta-bar { position: fixed; z-index: 18; left: 10px; right: 10px; bottom: 10px; padding: 5px; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; border-radius: 999px; background: rgba(255,255,255,.9); backdrop-filter: blur(20px); box-shadow: 0 18px 50px rgba(13,10,89,.16); }
.mobile-cta-bar a { min-height: 44px; display: grid; place-items: center; border-radius: 999px; font-size: 11px; font-weight: 800; color: var(--navy); }
.mobile-cta-bar a:first-child { color: var(--white); background: var(--navy); }
```

- [ ] **Step 4: Run the targeted test and confirm GREEN**

Run: `npm test -- --test-name-pattern='fixed mobile CTA bar'`

Expected: PASS.

- [ ] **Step 5: Run complete automated verification**

Run: `npm test`

Expected: all tests pass with zero failures.

Run: `npm run build`

Expected: Vite exits successfully.

- [ ] **Step 6: Verify the live mobile preview**

Reload `http://127.0.0.1:5174/#lead` at the current mobile viewport and confirm:

- `.mobile-cta-bar` count is zero;
- no fixed bottom bar remains visible;
- the lead form remains present;
- the hero CTA remains present;
- document width equals viewport width;
- the browser console has no new warnings or errors.
