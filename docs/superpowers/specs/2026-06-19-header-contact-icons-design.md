# Header Contact Icons Design

## Goal

Replace the three current desktop header utility visuals with the supplied phone, Ukrainian flag, and cabinet SVG assets. The phone control opens an accessible contact popover, and the same utility controls appear inside the mobile menu below the existing navigation.

## Assets

Copy the supplied files into the project with stable, descriptive names:

- `/Users/mykolabuga/Desktop/TuProfe/Link.svg` to `public/header/phone.svg`
- `/Users/mykolabuga/Desktop/TuProfe/Container.svg` to `public/header/language-ua.svg`
- `/Users/mykolabuga/Desktop/TuProfe/Link - Кабінет.svg` to `public/header/cabinet.svg`

Render the assets with `<img alt="">` inside controls that already provide an accessible name. Keep the SVG geometry, colors, and view boxes unchanged.

## Header Mapping

- Replace the current globe icon with `phone.svg` and change its accessible label to `Відкрити контакти`.
- Replace the current `UA` text circle with `language-ua.svg`. Preserve the language button, caret, and existing placeholder language action.
- Replace the current `UserCircle` icon with `cabinet.svg`. Preserve the cabinet button and existing placeholder cabinet action.
- Keep all controls at a minimum `44px` hit target. Size the flag artwork at `24px`; allow the phone and cabinet assets to use their supplied aspect ratios within the existing control height.

## Contact Data And Links

Use temporary Spanish contact data:

- Display: `+34 612 345 678`
- Phone: `tel:+34612345678`
- Telegram: `tg://resolve?phone=34612345678`
- Viber: `viber://chat?number=%2B34612345678`

The contact card contains a short label, the phone number as a callable link, and separate Telegram and Viber icon links. Telegram may use the existing Phosphor `TelegramLogo`; Viber uses a small local inline SVG with a decorative path and an accessible name on the link.

## Desktop Interaction

- Clicking the phone button toggles a compact popover anchored below the utility controls.
- The trigger exposes `aria-expanded` and `aria-controls`.
- The popover uses `role="dialog"`, `aria-label="Контакти TuProfe"`, and contains a visible close button.
- The popover closes when the user clicks the trigger again, presses `Escape`, clicks outside the contact area, or selects the close button.
- The popover is positioned within the header so it does not create horizontal page overflow.
- Use a short opacity and translate transition that respects the existing reduced-motion override.

## Mobile Interaction

- The existing `nav-actions` remain hidden below `980px`.
- Add a mobile utility row inside the open full-screen menu after the navigation links.
- The row includes the phone asset, Ukrainian flag, and cabinet asset.
- The contact card is visible directly below the mobile utility row while the menu is open; the user does not need to open a nested popover.
- Phone, Telegram, and Viber links use the same temporary contact data as desktop.
- Language and cabinet controls keep their existing placeholder behavior and close the mobile menu before showing feedback.

## Component Structure

- `ContactCard` owns only contact presentation and links; it receives an optional close callback for the desktop close button.
- `Header` owns `contactOpen`, the contact-area ref, outside-click handling, and `Escape` handling.
- Desktop and mobile reuse `ContactCard` so phone copy and link destinations cannot drift.
- Keep the existing `Header` public props unchanged.

## Accessibility

- Preserve semantic buttons for actions and links for phone/messaging destinations.
- Every icon-only button or link has an explicit Ukrainian `aria-label`.
- Decorative images use empty alt text.
- Preserve visible focus styles or add `:focus-visible` outlines where the new controls need them.
- Do not trap focus because the desktop popover is non-modal; its close button and links remain keyboard reachable.

## Testing And Verification

- Source-contract tests assert the three copied asset paths, accessible trigger state, stable temporary contact links, desktop dialog, and mobile contact-card instance.
- Run the complete test suite and production build.
- Desktop browser verification confirms all three supplied visuals render, the phone popover opens and closes by trigger, close button, outside click, and `Escape`, and contact links expose the expected destinations.
- Mobile verification at `390px` confirms the three controls and contact card appear inside the open menu, remain within the viewport, and have at least `44px` hit targets.
- Confirm no horizontal overflow and no console warnings or errors.

## Non-Goals

- No real production phone number, Telegram username, or Viber business account.
- No language picker implementation.
- No cabinet authentication or navigation.
- No changes to header layout outside the utility controls and contact surfaces.
- No hero, typography, or page-section changes.
