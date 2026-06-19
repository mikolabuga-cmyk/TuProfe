# Editable Translating Speech Stickers Design

## Goal

Let visitors type an English or Ukrainian word or short phrase directly into the two draggable hero speech stickers and automatically replace it with Spanish.

## Scope

- Editable stickers: hero `hola` and `como`.
- All footer shapes remain drag-only.
- Preserve hero pointer dragging, keyboard nudging, stacking, entrance animation, and mobile hiding.

## Interaction

- Each editable hero sticker keeps the existing note artwork with a centered, wrapping textarea overlay.
- Focusing the input selects the current text for quick replacement.
- Translation starts after 650ms without typing.
- Cyrillic text is sent as Ukrainian (`uk`); Latin text is sent as English (`en`); Spanish is the target (`es`).
- On success, the input value becomes the Spanish translation.
- Empty input makes no request. Failure preserves the typed text and exposes a short accessible status.
- Pointer events inside the input do not start dragging; grabbing the bubble outside the input still drags it.

## Service

- Use the public MyMemory GET endpoint without an API key.
- Encode user text and the `source|es` language pair in the URL.
- Limit inputs to 80 characters, below MyMemory's documented 500-byte query limit.
- Abort stale requests so slower translations cannot overwrite newer input.

## Accessibility And Responsive Behavior

- Every input has a Ukrainian accessible label and associated live status.
- Arrow keys inside inputs edit text instead of moving the sticker.
- Inputs use high-contrast dark text on the paper notes.
- Text up to 12 characters uses 13px, text from 13–28 characters uses 11px, and text above 28 characters uses 9px.
- The sticker artwork and drag boundary stay fixed so longer translations do not collide with the gallery; text remains centered and clipped inside the note.
- Mobile keeps the current behavior: the decorative hero sticker layer remains hidden.

## Verification

- Unit tests cover language detection, URL construction, successful response parsing, and failure handling.
- Unit tests cover deterministic text-size selection for short, medium, and long translations.
- Source/CSS tests cover exactly two editable hero stickers, input/status markup, drag-event isolation, and a drag-only footer.
- Run the full suite and production build.
- Live browser verification types English and Ukrainian examples, confirms Spanish output, preserves dragging, and checks overflow.
