# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## TuProfe Hero Decisions

- Figma node `948:2750` is the source of truth for the first screen, including the replacement navigation.
- Only the `¡Hola!` and `¿Cómo estás?` speech stickers are draggable; the arc and flower remain fixed.
- Hovering or keyboard-focusing a side gallery image expands it toward the center image's size while the gallery reflows without horizontal overflow.
- The two speech stickers can be dragged across the entire hero, including over the headline and CTA, while remaining bounded inside the hero.
- While a speech sticker is actively dragged, gallery image hover/focus expansion is suppressed to prevent competing motion.
- Gallery hover motion should feel soft and elegant: use custom easing, slower reflow, and restrained image scaling rather than sharp size changes.
- Below 768px, hide the draggable speech stickers completely and present all five hero photos as an asymmetric bento: one full-width lead image followed by alternating 5/12–7/12 and 7/12–5/12 rows.
