# Hero Motion and Sticker Drag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Smooth the hero gallery hover motion and let both speech stickers move across the full hero without triggering gallery expansion during a drag.

**Architecture:** Keep the behavior inside the existing `Hero` component. Replace the gallery drag boundary with a hero-level ref, render stickers in a hero overlay sibling above the panel and gallery, and expose active drag state as a hero class that CSS uses to neutralize gallery hover/focus rules.

**Tech Stack:** React 19, CSS, Vite 6, Node test runner, in-app browser verification.

## Global Constraints

- Only `¡Hola!` and `¿Cómo estás?` are draggable; the arc and flower remain fixed.
- Stickers may cross the headline, CTA, decorative panel, and gallery but must remain inside the hero.
- Gallery card morphing uses `460ms cubic-bezier(0.77, 0, 0.175, 1)`.
- Gallery image scaling uses `520ms cubic-bezier(0.23, 1, 0.32, 1)` and a maximum scale of `1.025`.
- Active sticker dragging suppresses both gallery hover and focus expansion.
- Mobile keeps its fixed gallery grid and no image transforms.
- Reduced-motion behavior remains intact.
- The project directory is not a Git repository, so commit steps are omitted.

---

### Task 1: Lock The Motion And Conflict Contract In Tests

**Files:**
- Modify: `src/styles.test.js`

**Interfaces:**
- Consumes: `src/styles.css` as text.
- Produces: regression assertions for the custom gallery curves, restrained scale, and drag suppression selectors.

- [ ] **Step 1: Write failing CSS contract tests**

Append tests that read `styles.css` and assert these exact contracts:

```js
test("hero gallery hover uses deliberate morph and image easings", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.hero-gallery-item\s*\{[^}]*460ms cubic-bezier\(0\.77, 0, 0\.175, 1\)/s);
  assert.match(css, /\.hero-gallery-item img\s*\{[^}]*520ms cubic-bezier\(0\.23, 1, 0\.32, 1\)/s);
  assert.match(css, /\.hero-gallery-item:hover img[^}]*scale\(1\.025\)/s);
});

test("active sticker dragging suppresses gallery hover motion", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.hero\.is-sticker-dragging[^{]*\.hero-gallery-item[^}]*transform:\s*none/s);
  assert.match(css, /\.hero\.is-sticker-dragging[^{]*\.hero-gallery-item:not\(\.item-3\)[^}]*width:/s);
});
```

- [ ] **Step 2: Run the targeted tests and confirm RED**

Run: `npm test -- --test-name-pattern='gallery hover|sticker dragging suppresses'`

Expected: both new tests fail because the current CSS uses `260ms`, `380ms`, `scale(1.035)`, and has no drag-suppression rules.

---

### Task 2: Move Sticker Coordinates To The Hero

**Files:**
- Modify: `src/App.jsx:41-44`
- Modify: `src/App.jsx:226-354`
- Test: `src/uiState.test.js`
- Create: `src/hero.test.js`

**Interfaces:**
- Consumes: `clampFooterShapePosition(position, size, bounds)` and `sanitizeStickerPositions(value, defaults)` from `src/uiState.js`.
- Produces: `heroRef`, hero-relative percentage positions, `is-sticker-dragging` class state, and a `hero-sticker-layer` overlay.

- [ ] **Step 1: Write a failing test for new hero-relative defaults**

Update the sticker fallback test to use and expect the approved hero defaults:

```js
const defaults = { hola: { x: 29, y: 64 }, como: { x: 76, y: 60 } };
```

Add a source assertion in `src/styles.test.js` proving the overlay fills the hero:

```js
test("the sticker layer covers the full hero", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");
  assert.match(css, /\.hero-sticker-layer\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;/s);
});
```

Create `src/hero.test.js` to lock the component wiring and versioned coordinate storage:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("hero stickers use the full hero drag boundary and versioned positions", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /const heroRef = useRef\(null\)/);
  assert.match(source, /<section[^>]*className=\{`hero[^`]*is-sticker-dragging/s);
  assert.match(source, /ref=\{heroRef\}/);
  assert.match(source, /tuprofe-hero-stickers-v2/);
  assert.match(source, /className="hero-sticker-layer"/);
});
```

- [ ] **Step 2: Run the targeted tests and confirm RED**

Run: `npm test -- --test-name-pattern='sticker|full hero'`

Expected: the overlay assertion fails because `.hero-sticker-layer` does not exist.

- [ ] **Step 3: Implement hero-relative drag bounds and overlay rendering**

In `Hero`, replace `stageRef` with `heroRef`, use that ref in pointer and keyboard clamping, and apply it to the section:

```jsx
const heroRef = useRef(null);

<section
  className={`hero ${activeSticker ? "is-sticker-dragging" : ""}`}
  id="top"
  ref={heroRef}
>
```

Update initial values and persistence:

```js
const heroStickerDefaults = {
  hola: { x: 29, y: 64 },
  como: { x: 76, y: 60 },
};

const saved = JSON.parse(sessionStorage.getItem("tuprofe-hero-stickers-v2") || "null");
sessionStorage.setItem("tuprofe-hero-stickers-v2", JSON.stringify(stickerPositions));
```

In `beginStickerDrag`, `moveSticker`, and `nudgeSticker`, use `heroRef.current` and its bounding rectangle as the clamp stage. Keep pointer capture and the existing release/cancel cleanup.

Move the sticker map out of `.hero-gallery` and render it after the gallery stage:

```jsx
<div className="hero-sticker-layer" aria-label="Рухомі стікери TuProfe">
  {stickerOrder.map(({ id }, index) => {
    const label = id === "hola" ? "¡Hola!" : "¿Cómo estás?";
    const position = stickerPositions[id];
    return (
      <button
        className={`hero-sticker hero-sticker-${id} ${activeSticker === id ? "is-dragging" : ""}`}
        style={{ "--sticker-x": `${position.x}%`, "--sticker-y": `${position.y}%`, zIndex: index + 1 }}
        aria-label={`Перемістити стікер ${label}`}
        key={id}
        onPointerDown={(event) => beginStickerDrag(event, id)}
        onPointerMove={(event) => moveSticker(event, id)}
        onPointerUp={(event) => endStickerDrag(event, id)}
        onPointerCancel={(event) => endStickerDrag(event, id)}
        onKeyDown={(event) => nudgeSticker(event, id)}
      >
        <img src={`${heroAssets}speech-sticker.png`} alt="" />
        <span>{label}</span>
      </button>
    );
  })}
</div>
```

- [ ] **Step 4: Add overlay layout without blocking the hero**

Add:

```css
.hero-sticker-layer { position: absolute; z-index: 8; inset: 0; pointer-events: none; }
.hero-sticker-layer .hero-sticker { pointer-events: auto; }
```

Keep sticker positioning absolute and hero-relative. Ensure the sticker z-index remains above gallery cards.

- [ ] **Step 5: Run targeted tests and confirm GREEN**

Run: `npm test -- --test-name-pattern='sticker|full hero'`

Expected: all matching tests pass.

---

### Task 3: Apply Smooth Gallery Motion And Drag Suppression

**Files:**
- Modify: `src/styles.css:81-95`
- Test: `src/styles.test.js`

**Interfaces:**
- Consumes: `.hero.is-sticker-dragging` from Task 2.
- Produces: smoother card morphing, softer image scaling, and resting card dimensions during active dragging.

- [ ] **Step 1: Replace the sharp transition curves**

Use exact property transitions:

```css
.hero-gallery-item {
  transition:
    width 460ms cubic-bezier(0.77, 0, 0.175, 1),
    height 460ms cubic-bezier(0.77, 0, 0.175, 1),
    transform 460ms cubic-bezier(0.77, 0, 0.175, 1),
    border-radius 460ms cubic-bezier(0.77, 0, 0.175, 1);
}
.hero-gallery-item img {
  transition: transform 520ms cubic-bezier(0.23, 1, 0.32, 1);
}
.hero-gallery-item:hover img,
.hero-gallery-item:focus-visible img { transform: scale(1.025); }
```

- [ ] **Step 2: Neutralize image and card expansion during a drag**

Add desktop resting dimensions under the active hero state:

```css
.hero.is-sticker-dragging .hero-gallery-item img,
.hero.is-sticker-dragging .hero-gallery-item:hover img,
.hero.is-sticker-dragging .hero-gallery-item:focus-visible img { transform: none; }

.hero.is-sticker-dragging .hero-gallery-item.item-1,
.hero.is-sticker-dragging .hero-gallery-item.item-5 { width: 180px; height: 209px; border-radius: 999px; }
.hero.is-sticker-dragging .hero-gallery-item.item-2,
.hero.is-sticker-dragging .hero-gallery-item.item-4 { width: 158px; height: 285px; border-radius: 999px; }
```

Inside the existing `max-width: 980px` block, add equivalent active-drag rules using the tablet resting sizes (`13vw/190px` and `11.5vw/250px`). Mobile already fixes all card sizes and image transforms.

- [ ] **Step 3: Run motion contract tests and confirm GREEN**

Run: `npm test -- --test-name-pattern='gallery hover|sticker dragging suppresses'`

Expected: all matching tests pass.

---

### Task 4: Verify Interaction And Production Gates

**Files:**
- Modify only if verification exposes a requirement mismatch.

**Interfaces:**
- Consumes: completed Tasks 1-3.
- Produces: browser evidence and clean build/test output.

- [ ] **Step 1: Run complete automated verification**

Run: `npm test`

Expected: all tests pass with zero failures.

Run: `npm run build`

Expected: Vite production build exits successfully.

- [ ] **Step 2: Verify desktop hover quality**

At `http://127.0.0.1:5173/#top`, hover side gallery images and confirm expansion/reversal are smooth, interruptible, preserve the center image, and do not create horizontal overflow.

- [ ] **Step 3: Verify full-hero dragging and conflict suppression**

Drag each sticker over the headline, CTA, and gallery. Confirm it remains inside the hero, stays above content, and no gallery card or image expands while the pointer crosses an image. Confirm hover works again after release and pointer cancellation.

- [ ] **Step 4: Verify keyboard and mobile behavior**

Use arrow keys on each sticker and confirm clamping against hero edges. At 390px width, confirm both stickers remain inside the hero, the gallery stays fixed, and the document width remains 390px.

- [ ] **Step 5: Verify runtime cleanliness**

Reload from a fresh timestamp and inspect browser warning/error logs.

Expected: no new warnings or errors.
