# Mobile Hero Bento Design

## Goal

Make the mobile hero calmer and more organized by removing draggable stickers and restructuring all five gallery photos into an expressive asymmetric bento mosaic.

## Scope

- The change applies only below `768px` through the existing `max-width: 767px` breakpoint.
- Desktop and tablet gallery layout, hover behavior, and sticker dragging remain unchanged.
- No image assets or copy change.

## Sticker Behavior

- Hide `.hero-sticker-layer` completely at the mobile breakpoint with `display: none`.
- Hidden sticker buttons must not remain visible, clickable, or keyboard-focusable on mobile.
- Stored sticker positions remain untouched and become available again when returning to a wider viewport.

## Bento Composition

- Show all five gallery images on mobile.
- Reorder the center teacher image (`item-3`) as the first and dominant card.
- Place the remaining images in two asymmetric rows:
  - Row 2: `item-1` spans 5 of 12 columns; `item-2` spans 7 of 12 columns.
  - Row 3: `item-4` spans 7 of 12 columns; `item-5` spans 5 of 12 columns.
- The dominant image spans all 12 columns and is `210px` high with a `48px` radius.
- Supporting images share a `140px` row height. Narrow cards use a `56px` radius; wide cards use a `40px` radius.
- Use a consistent `10px` gap.
- Remove the old hidden `item-5` rule and the current two-column equal-width layout.

## Layout Sizing

- Use a 12-column CSS grid so proportions remain stable across supported mobile widths.
- Reduce gallery top padding from the current `70px` to `32px` so the bento stays visually connected to the CTA without excessive empty space.
- Set the gallery stage to `542px`: `32px` top padding + `210px` lead row + two `140px` support rows + two `10px` gaps.
- Preserve the existing 10px horizontal hero margins and prevent document overflow at 320px, 390px, and 430px widths.

## Image Treatment

- Keep `object-fit: cover` for all cards.
- The lead teacher image keeps its current focal crop.
- Supporting cards use their existing image order and source assets.
- Mobile continues to disable gallery image transforms and hover expansion.

## Accessibility

- All visible images retain their current alt text.
- Hidden stickers are removed from mobile focus navigation through `display: none` on their parent layer.
- Reduced-motion behavior remains unchanged.

## Verification

- CSS regression tests assert the mobile sticker layer is hidden, all five image items are displayed, and the 12-column bento spans match the approved layout.
- Browser review at 390px verifies one full-width lead image, alternating asymmetric support rows, no overlap, no clipped cards, and a 390px document width.
- Additional width checks at 320px and 430px confirm responsive proportions.
- The full test suite, production build, and browser console must be clean.
