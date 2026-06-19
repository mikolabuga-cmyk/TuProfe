# Figma Hero and Navigation Design

Recreate the first TuProfe screen from Figma node `948:2750` in the existing React/Vite prototype.

## Source of Truth

- Figma file: `NJpVlyniZTyOUX9DX2t0eW`
- Node: `948:2750`
- The Figma screenshot and node measurements define layout, hierarchy, spacing, typography, colors, image crops, and visible content.
- Remote Figma assets must be downloaded into `public/figma-hero/` so the implementation does not depend on expiring asset URLs.

## Navigation

- Replace the current floating pill navigation with the Figma header.
- Use a white, 80px desktop header inset 32px from the page edges and 24px from the top.
- Preserve the Figma information architecture: logo, course/company menus, standard links, utility controls, and the outlined `Підібрати навчання` action.
- Existing page anchors remain functional. Controls without a finished destination use the prototype's existing non-navigating feedback pattern.
- Below the desktop breakpoint, collapse navigation into the existing accessible mobile menu behavior.

## Hero Layout

- Place a lavender `#d9d8ff` panel below the header with 32px page margins, a 32px radius, and clipped decorative overflow.
- Center the student proof row, 59px Montserrat headline, 20px supporting copy, and green primary CTA.
- Keep the Figma copy verbatim.
- The decorative periwinkle arc and flower remain fixed, non-interactive background elements.
- At desktop size, the composition follows the 1440px Figma frame. At narrower widths, spacing and type scale reduce without changing content hierarchy.

## Image Gallery

- Recreate the five-image gallery overlapping the lower part of the lavender panel.
- The center image is the resting focal image at 396 by 341 pixels in the 1440px desktop composition.
- The four side images retain their pill silhouettes and smaller resting sizes.
- Hovering or keyboard-focusing a side image expands it toward the center image's footprint. The gallery redistributes available width so siblings compress or move smoothly rather than overflowing.
- Motion lasts 200-300ms and uses transform and flexible sizing. Respect `prefers-reduced-motion`.
- Touch layouts use a static responsive gallery because hover is unavailable.

## Draggable Stickers

- Only the `¡Hola!` and `¿Cómo estás?` speech stickers are draggable.
- Pointer events support mouse, pen, and touch through one interaction path.
- Keyboard users can focus a sticker and move it with arrow keys.
- Drag coordinates are clamped to the hero/gallery stage and must never create horizontal page overflow.
- The grabbed sticker moves above its sibling. Positions use session storage, survive reloads in the current browser session, and clear when that session ends.
- The large arc and flower are not draggable.

## Component Boundaries

- `Navigation`: responsive header, anchors, utility controls, and mobile menu.
- `Hero`: copy, proof row, fixed decoration, CTA, and gallery composition.
- `HeroGallery`: image sizing/focus state and accessible gallery semantics.
- `DraggableSticker`: pointer/keyboard movement and bounded positioning.
- Pure interaction helpers remain in `uiState.js` so clamping and ordering can be tested without the DOM.

## Accessibility and Failure Handling

- Navigation and draggable controls have explicit accessible names and visible focus states.
- Images use meaningful alt text; decorative assets use empty alt text.
- Interactive targets remain at least 44 by 44 pixels.
- Missing gallery images preserve their container geometry and accessible labels instead of collapsing the layout.
- Reduced-motion users receive immediate size and position changes.

## Verification

- Add failing tests first for hero sticker clamping, front ordering, and persisted session coordinates.
- Verify the header and hero at the 1440px Figma target, the current desktop viewport, and a 390px mobile viewport.
- Confirm gallery hover/focus expansion, sticker pointer and keyboard movement, mobile menu behavior, and zero horizontal overflow.
- Run `npm test` and `npm run build` before completion.
