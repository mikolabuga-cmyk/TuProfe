# Hero Load Sequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a one-time hero entrance sequence where copy enters first, gallery cards rise center-out, and desktop stickers drop last.

**Architecture:** `Hero` owns a persistent `isReady` state activated on the first animation frame after mount. Hero-specific CSS keyframes animate opacity plus individual `translate` and `scale` properties, avoiding conflicts with existing gallery hover and sticker drag transforms. The global `Reveal` observer remains unchanged outside the hero.

**Tech Stack:** React 19, CSS keyframes, Node test runner, Vite 6, in-app browser.

## Global Constraints

- Run once per page mount on desktop and mobile; never replay on scroll.
- Keep all hero copy, assets, dimensions, crops, breakpoints, gallery hover behavior, and sticker interactions unchanged.
- Animate only opacity and composited transform properties.
- Mobile keeps stickers hidden.
- `prefers-reduced-motion: reduce` removes movement, scale, delay, and stagger.
- The project is not a Git repository, so commit steps are omitted.

---

### Task 1: Implement The One-Time Hero Sequence

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/App.jsx:226-355`
- Modify: `src/styles.css:68-103,488-493`

**Interfaces:**
- Consumes: existing `Hero`, gallery item classes, sticker state, and reduced-motion media query.
- Produces: persistent `.hero.is-ready`, `.hero-enter-copy`, `.hero-enter-decoration`, gallery card delays, and sticker drop delays.

- [ ] **Step 1: Write failing source-contract tests**

Append to `src/styles.test.js`:

```js
test("hero entrance uses a persistent one-time ready state", async () => {
  const app = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(app, /const \[heroReady, setHeroReady\] = useState\(false\)/);
  assert.match(app, /requestAnimationFrame\(\(\) => setHeroReady\(true\)\)/);
  assert.match(app, /heroReady \? "is-ready" : ""/);
  assert.doesNotMatch(app, /<Reveal className="hero-gallery-stage"/);
});

test("hero entrance follows the approved copy gallery sticker order", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /@keyframes hero-copy-enter[\s\S]*translate:\s*0 14px/);
  assert.match(css, /\.hero-gallery-item\.item-3\s*\{[^}]*--hero-delay:\s*560ms;/);
  assert.match(css, /\.hero-gallery-item\.item-2[^}]*--hero-delay:\s*630ms;/);
  assert.match(css, /\.hero-gallery-item\.item-1[^}]*--hero-delay:\s*700ms;/);
  assert.match(css, /@keyframes hero-gallery-arrive[\s\S]*translate:\s*0 36px;[\s\S]*scale:\s*\.98/);
  assert.match(css, /\.hero-sticker:nth-child\(1\)[^}]*--hero-delay:\s*1120ms;/);
  assert.match(css, /\.hero-sticker:nth-child\(2\)[^}]*--hero-delay:\s*1200ms;/);
  assert.match(css, /@keyframes hero-sticker-drop[\s\S]*translate:\s*0 -44px/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.hero-enter-copy[^}]*animation:\s*none/);
});
```

- [ ] **Step 2: Run the targeted tests and confirm RED**

Run: `npm test -- --test-name-pattern='hero entrance'`

Expected: FAIL because the ready state, hero-specific classes, keyframes, and delay tokens do not exist.

- [ ] **Step 3: Add the persistent ready state and hero classes**

In `Hero`, add:

```jsx
const [heroReady, setHeroReady] = useState(false);

useEffect(() => {
  const frame = window.requestAnimationFrame(() => setHeroReady(true));
  return () => window.cancelAnimationFrame(frame);
}, []);
```

Update the hero root and replace hero-only `Reveal` wrappers:

```jsx
<section className={`hero hero-load ${heroReady ? "is-ready" : ""} ${activeSticker ? "is-sticker-dragging" : ""}`} ...>
  <div className="figma-hero-panel">
    <div className="figma-hero-copy">
      <div className="student-proof hero-enter-copy" style={{ "--hero-delay": "40ms" }}>...</div>
      <h1 className="hero-enter-copy" style={{ "--hero-delay": "95ms" }}>...</h1>
      <p className="figma-hero-subtitle hero-enter-copy" style={{ "--hero-delay": "150ms" }}>...</p>
      <div className="hero-enter-copy" style={{ "--hero-delay": "205ms" }}>...</div>
    </div>
    <img className="figma-hero-arc hero-enter-decoration" ... />
    <img className="figma-hero-flower hero-enter-decoration" ... />
  </div>
  <div className="hero-gallery-stage">
    ...
  </div>
  ...
</section>
```

- [ ] **Step 4: Add ordered CSS keyframes and delays**

Add hero-load rules using these exact contracts:

```css
.hero-load .hero-enter-copy,
.hero-load .hero-enter-decoration,
.hero-load .hero-gallery-item,
.hero-load .hero-sticker { opacity: 0; }

.hero-load.is-ready .hero-enter-copy { animation: hero-copy-enter 420ms var(--ease-out) var(--hero-delay) both; }
.hero-load.is-ready .hero-enter-decoration { animation: hero-decoration-enter 450ms var(--ease-out) 380ms both; }
.hero-load.is-ready .hero-gallery-item { animation: hero-gallery-arrive 480ms var(--ease-out) var(--hero-delay) both; }
.hero-load.is-ready .hero-sticker { animation: hero-sticker-drop 420ms var(--ease-out) var(--hero-delay) both; }

.hero-gallery-item.item-3 { --hero-delay: 560ms; }
.hero-gallery-item.item-2, .hero-gallery-item.item-4 { --hero-delay: 630ms; }
.hero-gallery-item.item-1, .hero-gallery-item.item-5 { --hero-delay: 700ms; }
.hero-sticker:nth-child(1) { --hero-delay: 1120ms; }
.hero-sticker:nth-child(2) { --hero-delay: 1200ms; }

@keyframes hero-copy-enter {
  from { opacity: 0; translate: 0 14px; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes hero-decoration-enter {
  from { opacity: 0; scale: .96; }
  to { opacity: 1; scale: 1; }
}
@keyframes hero-gallery-arrive {
  from { opacity: 0; translate: 0 36px; scale: .98; }
  to { opacity: 1; translate: 0 0; scale: 1; }
}
@keyframes hero-sticker-drop {
  from { opacity: 0; translate: 0 -44px; }
  to { opacity: 1; translate: 0 0; }
}
```

Add `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` to `:root`.

- [ ] **Step 5: Add the reduced-motion override**

Inside the existing reduced-motion block add:

```css
.hero-load .hero-enter-copy,
.hero-load .hero-enter-decoration,
.hero-load .hero-gallery-item,
.hero-load .hero-sticker {
  opacity: 1;
  animation: none;
  translate: none;
  scale: none;
}
```

- [ ] **Step 6: Run targeted tests and confirm GREEN**

Run: `npm test -- --test-name-pattern='hero entrance'`

Expected: PASS.

- [ ] **Step 7: Run complete automated verification**

Run: `npm test`

Expected: all tests pass with zero failures.

Run: `npm run build`

Expected: Vite exits successfully.

- [ ] **Step 8: Verify live desktop and mobile behavior**

At `http://127.0.0.1:5174/#top`:

- Reload desktop and confirm copy begins first, gallery rises center-out, and stickers drop last.
- Confirm `.hero.is-ready` remains present after scrolling to the bottom and back to the top.
- Confirm completed hero animations stay finished and do not restart after scrolling.
- Verify gallery hover and sticker drag still respond after entrance completion.
- Reload at 390px and confirm the same copy-then-gallery order, all five images remain present, stickers remain hidden, and document width equals viewport width.
- Confirm no browser warnings or errors.
