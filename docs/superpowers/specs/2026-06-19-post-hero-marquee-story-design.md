# Post-Hero Marquee And Story Section Design

## Goal

Recreate the two sections immediately below the TuProfe hero from Figma node `948:2750`: a slow continuous proof marquee followed by the editorial school-story section with three overlapping benefit cards.

## Scope And Placement

- Insert both blocks directly after `Hero` and before the remaining homepage content.
- Replace the current `Trust` and `WhyTuProfe` output in that position rather than duplicating similar trust content farther down the page.
- Preserve the approved hero, header, footer, lead form, and all later homepage sections.
- Use the existing Montserrat typography, color variables, image assets, and responsive breakpoints.

## Proof Marquee

- Render a single horizontal row of pale gray rounded pills matching the Figma frame.
- Include the proof messages shown in the design: CEFR programs, 7 years on the market, 200+ students, 20 teachers, groups up to 6 students, and Ukrainian-speaking teachers.
- Duplicate the sequence only for a visually seamless CSS loop; hide the duplicate sequence from assistive technology.
- Move continuously from right to left at a deliberately slow, constant pace without controls or abrupt resets.
- Pause the animation when the user prefers reduced motion and keep one readable row visible.
- Clip the marquee internally without creating document-level horizontal overflow.

## Story Layout

- Use a spacious white two-column layout on desktop, matching the Figma proportions.
- Left column:
  - Large statement: `Ми починали як школа іспанської в Києві, а сьогодні навчаємо українців онлайн де б вони не були`.
  - Supporting paragraph explaining study from zero, continued levels, relocation, work, travel, children, and official exams.
  - A compact team portrait strip using existing real TuProfe portrait/brand assets.
  - Three proof metrics: `200+ Студентів`, `20 Викладачів у команді`, and `7 Років на ринку`.
- Right column:
  - Three vertically overlapping rounded cards.
  - Card 1: `Мінігрупи до 6 осіб` on pale gray.
  - Card 2: `Онлайн-платформа` as the emphasized violet card with a restrained counterclockwise rotation.
  - Card 3: `Міжнародні стандарти` on pale gray.
- Match the Figma hierarchy, card overlap, corner radii, typography, spacing, and muted body-copy color.

## Scroll Motion

- Trigger the card choreography when the card stack first enters the viewport.
- Play once per page load; scrolling away and back must not replay it.
- Reveal in visual order: top gray card, violet middle card, then bottom gray card.
- Each card arrives with a small horizontal/vertical translation and opacity transition; the violet card settles into its designed rotation.
- Use the project easing and stagger the cards for a calm, deliberate sequence.
- Animate only `transform` and `opacity` for performance.
- Under `prefers-reduced-motion: reduce`, show the final card positions immediately.

## Responsive Behavior

- At tablet/mobile widths, stack the story copy above the cards.
- Preserve the full text, portrait strip, metrics, and all three cards.
- Reduce or remove card overlap and rotation where necessary for legibility and stable document flow.
- Maintain at least 16px readable body text where the existing system permits and prevent horizontal overflow at 320px, 390px, and 430px.

## Accessibility

- Use semantic section headings and descriptive group labels.
- Keep decorative marquee symbols and brand flourishes out of the accessibility tree.
- Do not encode essential meaning in emoji alone; each proof pill contains readable text.
- Maintain sufficient contrast for gray and violet card copy.

## Verification

- Add source-contract tests for placement after the hero, the six marquee items, all story copy/cards/metrics, one-time IntersectionObserver reveal, and reduced-motion handling.
- Run the targeted tests red before implementation and green afterward.
- Run the full test suite and production build.
- Verify in the in-app browser at desktop and at 390px, with boundary checks at 320px and 430px.
- Confirm seamless slow marquee motion, one-time scroll reveal, correct card order, no clipping, no horizontal overflow, and no console errors.
- Compare the live result against the captured 1440px Figma reference at the same viewport and correct visible spacing, sizing, radii, and alignment differences.

## Non-Goals

- No changes to the hero entrance animation or draggable hero stickers.
- No new routes, navigation behavior, forms, or backend integration.
- No redesign of later homepage sections.
