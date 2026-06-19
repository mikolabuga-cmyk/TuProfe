# Hero Motion Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing one-time hero entrance into a smooth 2.37-second sequence where copy leads, the center image settles first, paired side cards arrive in two waves, and desktop stickers drop last.

**Architecture:** Keep the existing `Hero` ready-state behavior and markup unchanged. Encode timing and direction with hero-specific CSS custom properties so gallery entrance animations use `translate` and `scale` independently of existing hover and drag `transform` rules; override only direction variables inside the existing mobile breakpoint.

**Tech Stack:** React 19, CSS keyframes and custom properties, Node test runner, Vite 6, in-app browser.

## Global Constraints

- Run once per page mount on desktop and mobile; never replay on scroll.
- Use `cubic-bezier(0.22, 1, 0.36, 1)` for the refined entrance motion.
- Copy delays are exactly 40ms, 120ms, 200ms, and 280ms with a 560ms duration.
- Decorations start at 600ms and settle over 700ms.
- Gallery order is center `item-3` at 720ms, inner pair `item-2`/`item-4` at 980ms, then outer pair `item-1`/`item-5` at 1180ms.
- Desktop/tablet directions are left for `item-1`/`item-2` and right for `item-4`/`item-5`; mobile directions are left for `item-1`/`item-4` and right for `item-2`/`item-5`.
- Sticker delays are exactly 1650ms and 1770ms with a 600ms duration, ending the desktop sequence at approximately 2370ms.
- Keep all five hero images, copy, assets, dimensions, crops, breakpoints, gallery hover behavior, sticker interactions, and mobile sticker visibility unchanged.
- Animate only opacity and composited transform properties.
- `prefers-reduced-motion: reduce` removes movement, scale, delay, and stagger.
- The project is not a Git repository, so commit steps are omitted.

---

### Task 1: Refine The Hero Motion Contract

**Files:**
- Modify: `src/styles.test.js:118-130`
- Modify: `src/styles.css:11,89-133,423-455`

**Interfaces:**
- Consumes: existing `.hero-load.is-ready`, `.hero-enter-copy`, `.hero-enter-decoration`, `.hero-gallery-item`, `.hero-sticker`, and mobile breakpoint.
- Produces: `--hero-enter-x`, `--hero-enter-y`, and `--hero-enter-scale` card variables plus exact refined timing and direction contracts.

- [ ] **Step 1: Replace the old choreography assertions with failing refined-motion assertions**

Replace the test beginning `hero entrance follows the approved copy gallery sticker order` with assertions covering:

```js
test("hero entrance follows the approved elegant center-out choreography", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");
  const mobileStart = css.indexOf("@media (max-width: 767px)");
  const mobileEnd = css.indexOf("@media (prefers-reduced-motion: reduce)", mobileStart);
  const mobileCss = css.slice(mobileStart, mobileEnd);

  assert.match(css, /--ease-out:\s*cubic-bezier\(0\.22, 1, 0\.36, 1\)/);
  assert.match(css, /\.hero-load\.is-ready \.hero-enter-copy\s*\{[^}]*560ms/);
  assert.match(css, /\.student-proof\.hero-enter-copy\s*\{[^}]*animation-delay:\s*40ms/);
  assert.match(css, /\.figma-hero-copy h1\.hero-enter-copy\s*\{[^}]*animation-delay:\s*120ms/);
  assert.match(css, /\.figma-hero-subtitle\.hero-enter-copy\s*\{[^}]*animation-delay:\s*200ms/);
  assert.match(css, /\.figma-hero-copy > div\.hero-enter-copy:last-child\s*\{[^}]*animation-delay:\s*280ms/);
  assert.match(css, /\.hero-load\.is-ready \.hero-enter-decoration\s*\{[^}]*700ms[^}]*600ms/);
  assert.match(css, /\.hero-gallery-item\.item-3\s*\{[^}]*--hero-delay:\s*720ms;[^}]*--hero-enter-y:\s*48px;[^}]*--hero-enter-scale:\s*\.965/);
  assert.match(css, /\.hero-gallery-item\.item-2[^}]*--hero-delay:\s*980ms;[^}]*--hero-enter-x:\s*-56px;[^}]*--hero-enter-y:\s*18px/);
  assert.match(css, /\.hero-gallery-item\.item-4[^}]*--hero-delay:\s*980ms;[^}]*--hero-enter-x:\s*56px;[^}]*--hero-enter-y:\s*18px/);
  assert.match(css, /\.hero-gallery-item\.item-1[^}]*--hero-delay:\s*1180ms;[^}]*--hero-enter-x:\s*-72px;[^}]*--hero-enter-y:\s*24px/);
  assert.match(css, /\.hero-gallery-item\.item-5[^}]*--hero-delay:\s*1180ms;[^}]*--hero-enter-x:\s*72px;[^}]*--hero-enter-y:\s*24px/);
  assert.match(css, /@keyframes hero-gallery-arrive[\s\S]*translate:\s*var\(--hero-enter-x\) var\(--hero-enter-y\);[\s\S]*scale:\s*var\(--hero-enter-scale\)/);
  assert.match(mobileCss, /\.hero-gallery-item\.item-4\s*\{[^}]*--hero-enter-x:\s*-56px/);
  assert.match(mobileCss, /\.hero-gallery-item\.item-2\s*\{[^}]*--hero-enter-x:\s*56px/);
  assert.match(css, /\.hero-sticker:nth-child\(1\)[^}]*--hero-delay:\s*1650ms/);
  assert.match(css, /\.hero-sticker:nth-child\(2\)[^}]*--hero-delay:\s*1770ms/);
  assert.match(css, /\.hero-load\.is-ready \.hero-sticker\s*\{[^}]*600ms/);
  assert.match(css, /@keyframes hero-sticker-drop[\s\S]*translate:\s*0 -56px;[\s\S]*scale:\s*\.98/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.hero-enter-copy[^}]*animation:\s*none/);
});
```

- [ ] **Step 2: Run the targeted test and confirm RED**

Run: `npm test -- --test-name-pattern='elegant center-out choreography'`

Expected: FAIL on the old `--ease-out` curve or old motion duration, proving the new contract is not already implemented.

- [ ] **Step 3: Implement the exact CSS timing and desktop direction variables**

In `src/styles.css`, update `--ease-out` to `cubic-bezier(0.22, 1, 0.36, 1)`. Replace the old gallery delay groups with individual rules that assign the approved delay, horizontal travel, vertical travel, and scale variables. Update the ready-state animations to 560ms for copy, 700ms/600ms for decorations, 760ms for `item-3`, 700ms for side cards, and 600ms for stickers. Add selector-specific `animation-delay` declarations for the four copy elements so they override the existing inline custom-property values without changing JSX.

Use these gallery keyframe endpoints:

```css
@keyframes hero-gallery-arrive {
  from {
    opacity: 0;
    translate: var(--hero-enter-x) var(--hero-enter-y);
    scale: var(--hero-enter-scale);
  }
  to { opacity: 1; translate: 0 0; scale: 1; }
}
```

Use `translate: 0 -56px; scale: .98` as the sticker start state and restore `scale: 1` at the end.

- [ ] **Step 4: Add mobile-only direction overrides**

Inside `@media (max-width: 767px)`, keep all grid geometry unchanged and add:

```css
.hero-gallery-item.item-1 { --hero-enter-x: -72px; }
.hero-gallery-item.item-2 { --hero-enter-x: 56px; }
.hero-gallery-item.item-4 { --hero-enter-x: -56px; }
.hero-gallery-item.item-5 { --hero-enter-x: 72px; }
```

- [ ] **Step 5: Run the targeted test and confirm GREEN**

Run: `npm test -- --test-name-pattern='elegant center-out choreography'`

Expected: one matching test passes with zero failures.

- [ ] **Step 6: Run complete automated verification**

Run: `npm test`

Expected: all tests pass with zero failures.

Run: `npm run build`

Expected: Vite exits successfully and emits the production bundle.

- [ ] **Step 7: Verify the live preview**

At `http://127.0.0.1:5174/#top`:

- Reload at desktop width and visually confirm copy, center card, inner pair, outer pair, then two stickers in that order.
- Confirm the whole desktop entrance settles in approximately 2.37 seconds without bounce.
- Confirm gallery hover and sticker drag still work after the sequence settles.
- Scroll to the bottom and back to `#top`; confirm `.hero.is-ready` remains set and no animation restarts.
- Reload at 390px, 320px, and 430px; confirm the mobile side directions match card placement, all five images remain visible, CTA is usable, and `scrollWidth === innerWidth`.
- Confirm the browser console has no warnings or errors.
