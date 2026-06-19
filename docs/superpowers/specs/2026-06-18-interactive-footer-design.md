# Interactive TuProfe Footer Design

Recreate the supplied editorial footer reference within the existing TuProfe homepage.

## Layout

- A centered newsletter block with a large pill input and nested submit control.
- An oversized brand statement: "Іспанська з собою."
- Social links and three concise navigation columns.
- A bottom collage made from the official TuProfe SVG shapes.
- Legal copy and copyright at the base.

## Interaction

- Validate newsletter email locally and show a success state without navigation.
- Each brand shape lifts on hover, can be dragged within the collage stage, and moves above the others when grabbed.
- Use pointer events so mouse, pen, and touch all share the same interaction path.
- Keep dragged positions for the current browser session only.

## Responsive Behavior

- Reflow navigation columns and typography below 768px.
- Keep the collage stage bounded and draggable without creating horizontal page overflow.
- Retain the existing mobile CTA bar above the footer.

