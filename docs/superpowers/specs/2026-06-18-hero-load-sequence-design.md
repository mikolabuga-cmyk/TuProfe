# Hero Load Sequence Design

## Goal

Introduce a simple, polished hero entrance sequence that runs once per page load on desktop and mobile. Scrolling away from the hero and returning must not replay the animation.

## Architecture

- Give `Hero` a dedicated one-time ready state that is activated after its first paint.
- Keep that ready state for the lifetime of the mounted page.
- Use hero-specific CSS classes and transitions instead of the global scroll-based `Reveal` observer.
- Animate only opacity and composited transform properties.
- Keep all elements interactive throughout the sequence.

## Sequence

### Phase 1: Copy

- Student proof, headline, subtitle, and CTA enter first.
- Start at 40ms and use an 80ms stagger in reading order: 40ms, 120ms, 200ms, and 280ms.
- Each element starts at `opacity: 0` and `translateY(14px)`.
- Settle over 560ms with `cubic-bezier(0.22, 1, 0.36, 1)`.

### Phase 2: Decorations And Gallery

- Decorative panel shapes begin at 600ms and settle over 700ms.
- The center card, `item-3`, appears first at 720ms. It rises from `48px` below with `opacity: 0` and scale `.965`, then settles over 760ms.
- The inner pair, `item-2` and `item-4`, begins together at 980ms and settles over 700ms. On desktop and tablet, `item-2` arrives from `56px` left and `item-4` from `56px` right; both also begin `18px` lower with scale `.98`.
- The outer pair, `item-1` and `item-5`, begins together at 1180ms and settles over 700ms. On desktop and tablet, `item-1` arrives from `72px` left and `item-5` from `72px` right; both also begin `24px` lower with scale `.98`.
- On mobile, preserve the approved bento placement and use the visible side of each card for its horizontal entrance: `item-1` and `item-4` arrive from the left; `item-2` and `item-5` arrive from the right. The center-first and paired-wave timings remain unchanged.
- All gallery motion uses `cubic-bezier(0.22, 1, 0.36, 1)` and finishes without bounce.

### Phase 3: Stickers

- Desktop and tablet stickers begin after the gallery has substantially settled.
- The first sticker starts at 1650ms and the second at 1770ms.
- Each sticker drops from `56px` above with opacity and scale `.98`, then settles over 600ms using the same ease-out curve and no bounce.
- Preserve existing sticker rotation, hover, keyboard movement, drag transforms, pointer capture, and session persistence.
- Mobile continues to hide the entire sticker layer and therefore skips this phase.

The complete desktop sequence ends at approximately 2370ms.

## Replay Behavior

- The animation runs once whenever the page is freshly mounted or reloaded.
- The ready state remains active while the user scrolls through the document.
- Returning to `#top` does not reset classes or replay any phase.
- The existing global `Reveal` observer remains unchanged for non-hero sections.

## Responsive Behavior

- Desktop, tablet, and mobile use the same phase order.
- Mobile keeps all five approved images, the approved bento geometry, and the center-first visual hierarchy.
- No hero dimensions, image crops, grid spans, drag boundaries, or breakpoints change.

## Accessibility And Performance

- Under `prefers-reduced-motion: reduce`, remove movement, scale, delay, and stagger; hero elements appear immediately without transform animation.
- Use no layout-affecting animation properties such as width, height, margin, or padding.
- Do not add an animation library.
- Keep focus, pointer, and keyboard behavior available while visuals settle.

## Verification

- Regression tests assert the one-time ready state, ordered hero classes, exact phase delays and durations, desktop and mobile gallery directions, sticker drop delays, and reduced-motion override.
- Browser verification covers a fresh desktop load, a fresh mobile load, and a scroll down/back-to-top cycle that does not replay.
- Confirm the gallery interaction and sticker dragging still work after the entrance settles.
- Run the full test suite and production build and confirm a clean browser console.

## Non-Goals

- No animation changes outside the hero.
- No changes to content, assets, layout, gallery hover morphing, or sticker drag behavior.
- No exit animation.
