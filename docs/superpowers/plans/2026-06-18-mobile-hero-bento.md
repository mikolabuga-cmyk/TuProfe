# Mobile Hero Bento Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide hero stickers on mobile and reorganize all five hero photos into an asymmetric one-large-plus-four-small bento mosaic.

**Architecture:** Keep the existing React markup and image order. Implement the composition entirely inside the existing `max-width: 767px` CSS block by hiding the sticker layer, converting the gallery to 12 columns, reordering the lead image, and assigning exact row and column spans.

**Tech Stack:** CSS, React 19 markup unchanged, Vite 6, Node test runner, in-app browser verification.

## Global Constraints

- Apply only below `768px` through `@media (max-width: 767px)`.
- Hide `.hero-sticker-layer` with `display: none` so stickers are not visible or focusable.
- Show all five existing images with unchanged sources and alt text.
- `item-3` is the `210px` full-width lead image with `48px` radius.
- Supporting rows are `140px` high with a `10px` gap.
- Row 2 uses `item-1` at 5/12 and `item-2` at 7/12.
- Row 3 uses `item-4` at 7/12 and `item-5` at 5/12.
- Narrow cards use `56px` radius; wide cards use `40px` radius.
- Gallery top padding is `32px`; gallery stage height is `542px`.
- Desktop/tablet, reduced-motion behavior, image assets, and copy remain unchanged.
- The project is not a Git repository, so commit steps are omitted.

---

### Task 1: Lock The Mobile Bento Contract

**Files:**
- Modify: `src/styles.test.js`

**Interfaces:**
- Consumes: `src/styles.css` as text.
- Produces: regression coverage for hidden mobile stickers and exact bento dimensions/spans.

- [ ] **Step 1: Write failing mobile CSS tests**

Append:

```js
test("mobile hides hero stickers and uses the asymmetric bento", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /@media\s*\(max-width:\s*767px\)[\s\S]*\.hero-sticker-layer\s*\{[^}]*display:\s*none;/);
  assert.match(css, /@media\s*\(max-width:\s*767px\)[\s\S]*\.hero-gallery-stage\s*\{[^}]*height:\s*542px;/);
  assert.match(css, /@media\s*\(max-width:\s*767px\)[\s\S]*\.hero-gallery\s*\{[^}]*padding-top:\s*32px;[^}]*grid-template-columns:\s*repeat\(12,/);
  assert.match(css, /\.hero-gallery-item\.item-3\s*\{[^}]*order:\s*1;[^}]*grid-column:\s*1\s*\/\s*-1;[^}]*height:\s*100%;[^}]*border-radius:\s*48px;/);
  assert.match(css, /\.hero-gallery-item\.item-1\s*\{[^}]*order:\s*2;[^}]*grid-column:\s*1\s*\/\s*span\s*5;[^}]*border-radius:\s*56px;/);
  assert.match(css, /\.hero-gallery-item\.item-2\s*\{[^}]*order:\s*3;[^}]*grid-column:\s*6\s*\/\s*-1;[^}]*border-radius:\s*40px;/);
  assert.match(css, /\.hero-gallery-item\.item-4\s*\{[^}]*order:\s*4;[^}]*grid-column:\s*1\s*\/\s*span\s*7;[^}]*border-radius:\s*40px;/);
  assert.match(css, /\.hero-gallery-item\.item-5\s*\{[^}]*order:\s*5;[^}]*grid-column:\s*8\s*\/\s*-1;[^}]*display:\s*block;[^}]*border-radius:\s*56px;/);
});
```

- [ ] **Step 2: Run the targeted test and confirm RED**

Run: `npm test -- --test-name-pattern='asymmetric bento'`

Expected: FAIL because mobile currently uses two equal columns, hides `item-5`, and displays the sticker layer.

---

### Task 2: Implement The Mobile Bento

**Files:**
- Modify: `src/styles.css:403-414`
- Test: `src/styles.test.js`

**Interfaces:**
- Consumes: existing `.hero-gallery-item.item-1` through `.item-5` markup.
- Produces: mobile-only 12-column bento and hidden sticker layer.

- [ ] **Step 1: Replace the mobile gallery rules**

Inside `@media (max-width: 767px)`, replace the current gallery block with:

```css
.hero-gallery-stage { position: relative; inset: auto; height: 542px; margin: -250px 6px 0; }
.hero-gallery { padding-top: 32px; display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); grid-template-rows: 210px 140px 140px; gap: 10px; align-content: start; }
.hero-gallery-item.item-1,
.hero-gallery-item.item-2,
.hero-gallery-item.item-3,
.hero-gallery-item.item-4,
.hero-gallery-item.item-5 { width: 100%; height: 100%; border-width: 3px; }
.hero-gallery-item.item-3 { order: 1; grid-column: 1 / -1; grid-row: 1; height: 100%; border-radius: 48px; }
.hero-gallery-item.item-1 { order: 2; grid-column: 1 / span 5; grid-row: 2; border-radius: 56px; }
.hero-gallery-item.item-2 { order: 3; grid-column: 6 / -1; grid-row: 2; border-radius: 40px; }
.hero-gallery-item.item-4 { order: 4; grid-column: 1 / span 7; grid-row: 3; border-radius: 40px; }
.hero-gallery-item.item-5 { order: 5; grid-column: 8 / -1; grid-row: 3; display: block; border-radius: 56px; }
.hero-gallery-item:not(.item-3):hover,
.hero-gallery-item:not(.item-3):focus-visible { width: 100%; height: 100%; }
.hero-sticker-layer { display: none; }
```

- [ ] **Step 2: Run the targeted test and confirm GREEN**

Run: `npm test -- --test-name-pattern='asymmetric bento'`

Expected: PASS.

---

### Task 3: Verify Responsive Composition

**Files:**
- Modify only if verification reveals a requirement mismatch.

**Interfaces:**
- Consumes: completed mobile CSS.
- Produces: viewport evidence and clean build/test output.

- [ ] **Step 1: Run automated gates**

Run: `npm test`

Expected: all tests pass.

Run: `npm run build`

Expected: Vite exits successfully.

- [ ] **Step 2: Verify 390px composition visually and geometrically**

Reload `http://127.0.0.1:5173/#top` at `390x844`. Confirm:

- zero visible `.hero-sticker` elements;
- `item-3` is the first full-width `358x210` card;
- row 2 widths follow 5/12 and 7/12 proportions;
- row 3 mirrors those proportions;
- all five images are visible and no cards overlap;
- document width is exactly `390px`.

- [ ] **Step 3: Verify boundary widths**

At `320px` and `430px`, confirm all five cards remain inside the gallery and document width equals viewport width.

- [ ] **Step 4: Verify desktop remains unchanged**

Reset the viewport to the normal desktop width and confirm stickers are visible, draggable, and side-image hover rules retain the approved easing.

- [ ] **Step 5: Verify console cleanliness**

Reload from a fresh timestamp and confirm no new browser warnings or errors.
