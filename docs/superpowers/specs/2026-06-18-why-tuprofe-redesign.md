# Why TuProfe Redesign

Recreate only the "Чому студенти обирають TuProfe" section from the supplied editorial reference. Keep the existing Ukrainian content and TuProfe brand palette.

## Composition

- Use a two-column editorial split on desktop.
- Place the eyebrow, large statement, short supporting paragraph, and compact proof metrics on the left.
- Place three overlapping, softly rotated benefit cards on the right.
- Combine the teacher and platform messages in the emphasized middle card so all four existing benefits remain represented.
- Use TuProfe double-bezel shells, Montserrat typography, and the supplied brand SVG accents.

## Responsive Behavior

- Remove rotation and overlap below 768px.
- Stack the intro, proof metrics, and cards in a single column.
- Preserve at least 44px interactive targets and avoid horizontal overflow.

## Motion

- Reuse the existing IntersectionObserver reveal system.
- Animate only transform and opacity with the project cubic-bezier easing.
- Add restrained hover lift and rotation correction on pointer devices.

