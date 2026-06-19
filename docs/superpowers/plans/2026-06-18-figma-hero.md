# Figma Hero and Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing TuProfe navigation and first hero screen with a responsive, interaction-complete recreation of Figma node `948:2750`.

**Architecture:** Keep the existing single-page React structure and CSS system. Add pure sticker persistence helpers in `uiState.js`, render the new header and hero/gallery in `App.jsx`, store Figma assets locally under `public/figma-hero/`, and implement layout/motion in `styles.css`.

**Tech Stack:** React 19, Vite 6, plain CSS, Pointer Events, sessionStorage, Phosphor Icons, Node test runner.

## Global Constraints

- Figma file `NJpVlyniZTyOUX9DX2t0eW`, node `948:2750`, is the visual source of truth.
- Do not add Tailwind or new runtime dependencies.
- Only `¡Hola!` and `¿Cómo estás?` are draggable.
- Gallery hover/focus expansion must not cause horizontal overflow.
- Touch layouts use the static responsive gallery.
- Respect `prefers-reduced-motion` and keep interactive targets at least 44 by 44 pixels.
- The folder is not a Git repository, so commit steps are unavailable.

---

### Task 1: Sticker State Contracts

**Files:**
- Modify: `src/uiState.test.js`
- Modify: `src/uiState.js`

**Interfaces:**
- Produces: `sanitizeStickerPositions(value, defaults)` returning validated `{ [id]: { x, y } }` positions.
- Consumes: existing `clampFooterShapePosition(position, size, bounds)` and `raiseFooterShape(items, id)` helpers.

- [ ] **Step 1: Add a failing sanitization test**

```js
test("sanitizeStickerPositions keeps finite saved coordinates and falls back per sticker", () => {
  const defaults = { hola: { x: 28, y: 24 }, como: { x: 72, y: 12 } };
  assert.deepEqual(
    sanitizeStickerPositions({ hola: { x: 40, y: 35 }, como: { x: "bad", y: 8 } }, defaults),
    { hola: { x: 40, y: 35 }, como: { x: 72, y: 12 } },
  );
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test`

Expected: FAIL because `sanitizeStickerPositions` is not exported.

- [ ] **Step 3: Implement the pure helper**

```js
export function sanitizeStickerPositions(value, defaults) {
  const saved = value && typeof value === "object" ? value : {};
  return Object.fromEntries(Object.entries(defaults).map(([id, fallback]) => {
    const position = saved[id];
    const valid = Number.isFinite(position?.x) && Number.isFinite(position?.y);
    return [id, valid ? { x: position.x, y: position.y } : { ...fallback }];
  }));
}
```

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test`

Expected: all tests pass.

---

### Task 2: Local Figma Assets

**Files:**
- Create: `public/figma-hero/logo.png`
- Create: `public/figma-hero/student-1.png` through `student-4.png`
- Create: `public/figma-hero/gallery-1.png` through `gallery-5.png`
- Create: `public/figma-hero/speech-sticker.png`

**Interfaces:**
- Produces stable `/figma-hero/<asset>.png` URLs for the header and hero.
- Consumes the Figma MCP asset URLs returned for node `948:2750`.

- [ ] **Step 1: Download each Figma asset to its final path**

```bash
mkdir -p public/figma-hero
curl -L https://www.figma.com/api/mcp/asset/d40c5fca-912d-4ed4-a04f-4edf01923e84 -o public/figma-hero/logo.png
curl -L https://www.figma.com/api/mcp/asset/fef72d7e-0591-4ea9-8218-9d9081af19cd -o public/figma-hero/student-1.png
curl -L https://www.figma.com/api/mcp/asset/675fd319-55d6-482b-a8d5-3bdeddc703ff -o public/figma-hero/student-2.png
curl -L https://www.figma.com/api/mcp/asset/67e563bc-15d7-48c2-b039-d96fde985e79 -o public/figma-hero/student-3.png
curl -L https://www.figma.com/api/mcp/asset/13e9a835-4211-4285-b1d5-e8a524a179cc -o public/figma-hero/student-4.png
curl -L https://www.figma.com/api/mcp/asset/0018f481-cb95-4c3a-a6ec-38b9d6078a15 -o public/figma-hero/gallery-1.png
curl -L https://www.figma.com/api/mcp/asset/52a8fc42-1a73-428e-869e-4bc944ad5326 -o public/figma-hero/gallery-2.png
curl -L https://www.figma.com/api/mcp/asset/61958537-b868-4743-98f0-7f16014db826 -o public/figma-hero/gallery-3.png
curl -L https://www.figma.com/api/mcp/asset/22c3d374-d6f9-4bab-8620-c4f38fc94110 -o public/figma-hero/gallery-4.png
curl -L https://www.figma.com/api/mcp/asset/efc76ee6-d15c-48e2-8295-a90a04540e42 -o public/figma-hero/gallery-5.png
curl -L https://www.figma.com/api/mcp/asset/26898db4-f3ce-4e04-bc6d-b15003f1a6e2 -o public/figma-hero/speech-sticker.png
```

- [ ] **Step 2: Verify asset types and dimensions**

Run: `file public/figma-hero/*.png`

Expected: every file is a readable PNG, JPEG, or WebP image despite the normalized `.png` filename.

- [ ] **Step 3: Verify no expiring Figma URLs remain in source**

Run: `rg "figma.com/api/mcp/asset" src public/figma-hero`

Expected: no matches.

---

### Task 3: Header, Hero, Gallery, and Sticker UI

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `sanitizeStickerPositions`, `clampFooterShapePosition`, `raiseFooterShape`, and `/figma-hero/` assets.
- Produces: responsive `Navigation`, `HeroGallery`, `DraggableSticker`, and revised `Hero` markup.

- [ ] **Step 1: Replace the desktop header content**

Render the Figma links `Курси`, `Для компаній`, `Про нас`, `Матеріали`, `Контакти`; utility controls; and `Підібрати навчання`. Preserve existing menu state, anchor routing, accessible names, and the mobile overlay.

- [ ] **Step 2: Add gallery data and sticker defaults**

```js
const heroGallery = [
  ["gallery-1.png", "Студентка TuProfe на занятті"],
  ["gallery-2.png", "Студент TuProfe практикує іспанську"],
  ["gallery-3.png", "Онлайн-урок TuProfe"],
  ["gallery-4.png", "Студентка TuProfe вивчає іспанську"],
  ["gallery-5.png", "Спільнота студентів TuProfe"],
];

const heroStickerDefaults = {
  hola: { x: 28, y: 24 },
  como: { x: 72, y: 12 },
};
```

- [ ] **Step 3: Implement session-backed sticker state**

Initialize from `sessionStorage.getItem("tuprofe-hero-stickers")`, sanitize through `sanitizeStickerPositions`, and write updated positions in an effect. Ignore malformed JSON and use defaults.

- [ ] **Step 4: Implement pointer and keyboard movement**

Use the same pointer capture pattern as the footer collage. Convert client coordinates to bounded stage percentages with `clampFooterShapePosition`. Arrow keys move the focused sticker by 10px and `raiseFooterShape` puts it above its sibling.

- [ ] **Step 5: Replace the hero markup**

Render the avatar proof row, approved Figma headline/supporting copy, green CTA, fixed arc/flower SVGs, five-image gallery, and the two draggable speech stickers. Give gallery items `tabIndex="0"` so keyboard focus mirrors hover expansion.

- [ ] **Step 6: Run tests**

Run: `npm test`

Expected: all tests pass without React import or syntax errors.

---

### Task 4: Figma-Faithful Styling and Responsive Behavior

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

**Interfaces:**
- Consumes the class names rendered by Task 3.
- Produces the 1440px Figma composition, hover/focus gallery expansion, mobile layout, and overflow containment.

- [ ] **Step 1: Add a failing structural CSS test**

```js
test("the Figma hero clips decoration and supports reduced motion", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");
  assert.match(css, /\.figma-hero-panel\s*\{[^}]*overflow:\s*clip;/s);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/s);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: FAIL because `.figma-hero-panel` is not styled.

- [ ] **Step 3: Implement desktop layout**

Style the 80px white header, 32px insets, 756px lavender panel, centered copy, 59px headline, 20px body, 24px-radius CTA, fixed decorations, and gallery measurements from Figma.

- [ ] **Step 4: Implement gallery expansion**

Use flex growth and width transitions so `.hero-gallery-item:hover` and `.hero-gallery-item:focus-visible` approach `396px` by `341px`, while `.hero-gallery:has(...)` reduces sibling widths. Keep the center item visually dominant at rest.

- [ ] **Step 5: Implement responsive states**

At tablet widths hide desktop navigation and show the existing menu trigger. At 390px stack hero copy, scale typography, render a static grid/strip gallery, hide hover-only resizing, and keep both stickers inside the panel.

- [ ] **Step 6: Implement reduced motion**

Inside `@media (prefers-reduced-motion: reduce)`, remove gallery/sticker transitions and transforms while preserving final states.

- [ ] **Step 7: Run tests and build**

Run: `npm test && npm run build`

Expected: all tests pass and Vite exits with code 0.

---

### Task 5: Browser QA and Documentation

**Files:**
- Modify: `design-qa.md`

**Interfaces:**
- Produces recorded desktop/mobile measurements and interaction evidence.

- [ ] **Step 1: Reload `http://127.0.0.1:5173/#top`**

Confirm the new header and hero render without console errors.

- [ ] **Step 2: Verify desktop composition**

At 1440px, compare header height/insets, lavender panel geometry, text hierarchy, gallery silhouettes, and decoration placement against node `948:2750`.

- [ ] **Step 3: Verify gallery behavior**

Hover and keyboard-focus each side image. Confirm it grows toward the center footprint and the page retains zero horizontal overflow.

- [ ] **Step 4: Verify sticker behavior**

Drag and keyboard-nudge both stickers. Confirm bounds, front ordering, sessionStorage persistence after reload, and that the arc/flower remain fixed.

- [ ] **Step 5: Verify mobile behavior**

At 390 by 844, confirm the mobile menu, static gallery, readable hierarchy, 44px controls, and `scrollWidth === clientWidth`.

- [ ] **Step 6: Record evidence and run final verification**

Update `design-qa.md`, then run `npm test` and `npm run build` once more.
