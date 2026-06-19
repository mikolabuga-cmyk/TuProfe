# Hero Motion and Sticker Drag Design

## Goal

Make the hero gallery hover response feel smooth and composed, and allow both speech stickers to move throughout the full hero without triggering competing gallery animation during a drag.

## Interaction Model

- `¡Hola!` and `¿Cómo estás?` remain the only draggable hero decorations.
- Their positioning layer moves from the gallery container to a hero-level overlay.
- The hero element is the drag boundary on desktop, tablet, and mobile. Stickers may cross the headline, CTA, decorative panel, and gallery, but cannot leave the hero.
- Percentage-based positions and session persistence remain in use so positions adapt across viewport changes.
- Pointer capture continues to keep dragging stable when the pointer moves quickly or crosses another element.
- Keyboard arrow nudging uses the same hero boundary and continues to raise the focused sticker above its sibling.

## Motion Design

- Gallery card width, height, transform, and border-radius use `460ms cubic-bezier(0.77, 0, 0.175, 1)` for smooth on-screen morphing.
- Gallery image scale uses `520ms cubic-bezier(0.23, 1, 0.32, 1)` for a softer settle.
- Hover image scale is reduced from `1.035` to `1.025`.
- The current layout, card target sizes, and gallery reflow behavior remain unchanged.
- The existing reduced-motion media query continues to remove image transforms and compress transition duration.

## Conflict Prevention

- Starting a sticker drag sets a hero-level `is-sticker-dragging` state.
- While this state is active, gallery hover and focus expansion rules resolve to the cards' resting dimensions and images remain unscaled.
- Releasing, cancelling, or losing the active pointer clears the state. Gallery hover becomes available again only after drag cleanup.
- Sticker pointer events remain above gallery cards through explicit stacking order.

## Responsive Behavior

- Desktop and tablet retain the expanding gallery cards with the smoother timing.
- Mobile retains its fixed grid and no-transform image behavior.
- Hero-relative sticker coordinates are clamped against the actual rendered hero size at every viewport.
- New hero-relative defaults preserve the stickers' current initial visual placement near the gallery (`¡Hola!` around 29%/64%, `¿Cómo estás?` around 76%/60% on desktop).
- Persistence moves to a versioned hero-coordinate session key so legacy gallery-relative values are not misread in the larger coordinate space. Invalid values continue to fall back per sticker.

## Accessibility

- Sticker buttons keep their current accessible names and keyboard arrow controls.
- Focus visibility remains unchanged.
- Gallery focus expansion follows the same suppression rule as pointer hover during active sticker dragging.
- Reduced-motion preferences continue to disable decorative scaling.

## Verification

- Unit coverage proves hero-relative position clamping and drag-state cleanup behavior.
- CSS coverage proves custom gallery easings, restrained scale, and drag suppression selectors.
- Browser verification covers side-card hover entry and exit, full-hero sticker movement, overlap across a gallery image without card expansion, release cleanup, mobile bounds, and a clean console.
- The production build and complete test suite must pass.
