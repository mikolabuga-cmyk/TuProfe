# Post-Hero Marquee And Story Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current post-hero trust/why pair with the Figma-matched proof marquee and editorial story section, including a one-time scroll-triggered three-card reveal.

**Architecture:** Keep the implementation inside the existing single-page React structure. Add static content arrays and two focused components in `App.jsx`, reuse the existing `Reveal` IntersectionObserver for the left copy, and give the card stack its own one-time observer state so the staggered final transforms are independent of the generic blur reveal. Add section-specific CSS with existing breakpoints and no new dependency.

**Tech Stack:** React 19, CSS, Node test runner, Vite.

## Global Constraints

- Match Figma node `948:2750` and the captured 1440px reference.
- Insert the two blocks directly after `Hero` and replace `Trust` plus `WhyTuProfe` in the render order.
- Keep the hero, header, later sections, footer, and production assets unchanged.
- Animate cards once on first viewport entry using only `transform` and `opacity`.
- Pause the marquee and expose final card positions under `prefers-reduced-motion: reduce`.
- Avoid horizontal overflow at desktop, 430px, 390px, and 320px.
- Do not add dependencies.

---

### Task 1: Post-Hero Content Contract

**Files:**
- Create: `src/postHero.test.js`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: existing `Reveal` component and `heroAssets` path constant.
- Produces: `ProofMarquee()` and `SchoolStory()` React components; `.proof-marquee`, `.school-story`, `.story-card-stack`, and `.story-benefit-card` class hooks for Task 2.

- [ ] **Step 1: Write the failing source-contract tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("the Figma proof marquee and school story replace the old post-hero pair", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");
  assert.match(source, /<main><Hero \/><ProofMarquee \/><SchoolStory \/>/);
  for (const copy of ["Програми за CEFR", "7 років на ринку", "200+ Студентів", "20 Викладачів", "Мінігрупи до 6 студентів", "Україномовні викладачі"]) {
    assert.match(source, new RegExp(copy.replace(/[+]/g, "\\+")));
  }
  for (const copy of ["Ми починали як школа іспанської", "Мінігрупи до 6 осіб", "Онлайн-платформа", "Міжнародні стандарти"]) {
    assert.match(source, new RegExp(copy));
  }
});

test("the story cards reveal once when their stack enters the viewport", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");
  assert.match(source, /const \[cardsVisible, setCardsVisible\] = useState\(false\)/);
  assert.match(source, /new IntersectionObserver/);
  assert.match(source, /setCardsVisible\(true\)/);
  assert.match(source, /observer\.disconnect\(\)/);
  assert.match(source, /cardsVisible \? "is-visible" : ""/);
});
```

- [ ] **Step 2: Run the new test and verify RED**

Run: `node --test src/postHero.test.js`

Expected: FAIL because `ProofMarquee`, `SchoolStory`, the approved copy, and `cardsVisible` do not exist.

- [ ] **Step 3: Add the minimal content and observer structure**

Add `proofItems` and `storyCards` arrays near the existing data constants. Implement `ProofMarquee` with two identical item groups, marking the second group `aria-hidden="true"`. Implement `SchoolStory` with a local stack ref, `cardsVisible` state, and an IntersectionObserver that calls `setCardsVisible(true)` and disconnects on the first intersection. Render the approved heading, paragraph, four existing portrait images, metrics, and three card articles. Replace `<Trust /><WhyTuProfe />` with `<ProofMarquee /><SchoolStory />` in `App`.

- [ ] **Step 4: Run the test and verify GREEN**

Run: `node --test src/postHero.test.js`

Expected: 2 tests pass.

---

### Task 2: Figma Layout, Marquee, And Scroll Choreography

**Files:**
- Modify: `src/postHero.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: class hooks produced by Task 1.
- Produces: desktop and mobile Figma layout, `proof-marquee-scroll` keyframes, `.story-card-stack.is-visible` reveal state, and reduced-motion final state.

- [ ] **Step 1: Add failing CSS contract tests**

```js
test("the marquee is slow, seamless, clipped, and reduced-motion safe", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");
  assert.match(css, /\.proof-marquee\s*\{[^}]*overflow:\s*hidden/s);
  assert.match(css, /\.proof-marquee-track\s*\{[^}]*animation:\s*proof-marquee-scroll\s+\d+s\s+linear\s+infinite/s);
  assert.match(css, /@keyframes proof-marquee-scroll[\s\S]*translateX\(-50%\)/);
  assert.match(css, /prefers-reduced-motion:[^)]*reduce[\s\S]*\.proof-marquee-track[^}]*animation:\s*none/s);
});

test("the story cards use staggered transform and opacity scroll motion", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");
  assert.match(css, /\.story-benefit-card\s*\{[^}]*opacity:\s*0;[^}]*transform:/s);
  assert.match(css, /\.story-card-stack\.is-visible \.story-benefit-card/s);
  assert.match(css, /\.story-card-stack\.is-visible \.story-card-2[^}]*rotate\(-/s);
  assert.match(css, /\.story-card-2\s*\{[^}]*transition-delay:/s);
  assert.match(css, /\.story-card-3\s*\{[^}]*transition-delay:/s);
});
```

- [ ] **Step 2: Run the CSS tests and verify RED**

Run: `node --test src/postHero.test.js`

Expected: the two new CSS tests fail because section styles and keyframes are absent.

- [ ] **Step 3: Implement the scoped desktop, responsive, and reduced-motion CSS**

Add desktop rules after the hero styles: a clipped full-width marquee with pale gray pill items and a 70–90 second linear loop; a max-width two-column story grid; left typography, portrait strip, and three-column metrics; an overlapping right card stack with gray/violet/gray tones. Start cards at opacity zero and offset transforms, then settle them in `.is-visible` with delays around 0ms, 150ms, and 300ms. Add tablet/mobile stacking rules inside the existing `980px` and `767px` media queries, removing overlap/rotation on mobile. Add reduced-motion overrides that stop the track and force all cards to final visible transforms.

- [ ] **Step 4: Run targeted and full automated verification**

Run: `node --test src/postHero.test.js`

Expected: 4 tests pass.

Run: `npm test`

Expected: all project tests pass with zero failures.

Run: `npm run build`

Expected: Vite exits 0 and writes the production bundle.

---

### Task 3: Live Visual Verification

**Files:**
- Modify only if a verified mismatch requires a minimal correction: `src/styles.css`

**Interfaces:**
- Consumes: the live page at `http://127.0.0.1:5174/#top` and `/private/tmp/tuprofe-figma-948-2750.png`.
- Produces: viewport screenshots and measured overflow/motion evidence.

- [ ] **Step 1: Verify desktop geometry and motion**

Open the live page at 1440px in the in-app browser, scroll the card stack into view, and capture the result. Confirm the heading/card proportions, gray/violet/gray stack, slow marquee, and one-time reveal order against the Figma screenshot.

- [ ] **Step 2: Verify responsive boundaries**

At 430px, 390px, and 320px, confirm `document.documentElement.scrollWidth === window.innerWidth`, all six marquee messages remain in the moving sequence, story copy and metrics remain legible, and all three cards are fully reachable without clipping.

- [ ] **Step 3: Verify accessibility and runtime health**

Confirm reduced-motion media rules expose final content without animation, the duplicate marquee group is hidden from assistive technology, and the browser console contains no warnings or errors.

- [ ] **Step 4: Apply only evidence-driven corrections and re-run verification**

If a mismatch exists, change only the relevant post-hero CSS, then repeat the targeted test, full test suite, build, and affected browser checks before reporting completion.
