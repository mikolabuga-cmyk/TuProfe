# Editable Translating Speech Stickers Implementation Plan

**Goal:** Add debounced zero-key Spanish translation to the two hero speech stickers.

**Architecture:** Put translation detection, URL construction, and response validation in `uiState.js`. Keep per-sticker drafts, status, timers, and abort controllers in a hero translation hook; render the two hero stickers as draggable wrappers with nested inputs while leaving every footer shape as a drag-only button.

## Tasks

1. Add failing unit tests for Ukrainian/English detection, MyMemory URLs, successful translation parsing, and errors.
2. Implement the minimal translation helpers in `uiState.js`.
3. Add failing source/CSS contracts for two editable hero stickers, input event isolation, statuses, and a drag-only footer.
4. Implement debounced translation state and editable hero sticker markup in `App.jsx`, plus scoped styles in `styles.css`.
5. Run targeted tests, the full suite, and the production build.
6. Verify English and Ukrainian translations, dragging boundaries, mobile overflow, and console health in the live browser.

## Adaptive Text Follow-up

### Task 1: Deterministic sticker font sizing

**Files:**
- Modify: `src/uiState.test.js`
- Modify: `src/uiState.js`

**Interface:** `getStickerFontSize(text: string): "13px" | "11px" | "9px"`

- [ ] Add assertions that lengths `12`, `13`, `28`, and `29` return `13px`, `11px`, `11px`, and `9px` respectively.
- [ ] Run `node --test src/uiState.test.js` and confirm it fails because `getStickerFontSize` is not exported.
- [ ] Implement the helper using trimmed text length and the two exact thresholds.
- [ ] Re-run `node --test src/uiState.test.js` and confirm it passes.

### Task 2: Wrapping hero sticker editor

**Files:**
- Modify: `src/postHero.test.js`
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

- [ ] Add source/CSS assertions for `getStickerFontSize(stickerTexts[id])`, the `--sticker-font-size` custom property, a `textarea` with `rows={3}`, and hidden overflow with disabled resize.
- [ ] Run `node --test src/postHero.test.js` and confirm the new contract fails.
- [ ] Replace each hero sticker input with a three-row textarea, set `--sticker-font-size` from the helper, and preserve the current change, focus, pointer, and keyboard handlers.
- [ ] Update `.hero-sticker-input` to consume the custom property, wrap text, hide overflow, and disable native resizing.
- [ ] Run `node --test src/postHero.test.js`, `npm test`, and `npm run build` and confirm all pass.
- [ ] In the live browser, enter a phrase over 28 characters and verify the computed font is `9px`, the textarea does not overflow the note, translation still completes, and the page has no horizontal overflow or console errors.
