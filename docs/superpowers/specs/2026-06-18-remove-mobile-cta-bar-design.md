# Remove Mobile CTA Bar Design

## Goal

Remove the fixed `Пробний урок / Тест рівня` bar from mobile without changing the hero CTA, lead form, navigation, or desktop presentation.

## Scope

- Delete the `.mobile-cta-bar` markup from `App.jsx`.
- Delete all `.mobile-cta-bar` CSS rules from the mobile media query.
- Keep every other CTA and anchor unchanged.
- Make no desktop CSS changes.

## Verification

- Add a regression test asserting that `App.jsx` and `styles.css` no longer contain `mobile-cta-bar`.
- Run the targeted test red before implementation and green afterward.
- Run the complete test suite and production build.
- Reload the live mobile preview and confirm the fixed bar is absent while the lead form and hero CTA remain available.

## Non-Goals

- No redesign or repositioning of other controls.
- No copy, form, navigation, or responsive breakpoint changes.
