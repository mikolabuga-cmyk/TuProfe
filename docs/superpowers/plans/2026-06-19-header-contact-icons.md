# Header Contact Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the header utility visuals with the three supplied SVG assets and add a reusable contact card shown as a desktop popover and inside the mobile menu.

**Architecture:** Copy the supplied SVG files into `public/header` without altering their markup. `Header` owns desktop contact state and dismissal behavior; a focused `ContactCard` renders the shared phone, Telegram, and Viber destinations for both desktop and mobile surfaces.

**Tech Stack:** React 19, CSS, Phosphor React icons, Node test runner, Vite 6, in-app browser.

## Global Constraints

- Use `+34 612 345 678`, `tel:+34612345678`, `tg://resolve?phone=34612345678`, and `viber://chat?number=%2B34612345678` exactly.
- Preserve the supplied SVG geometry, colors, and view boxes.
- Keep every utility control at least `44px` square.
- Keep `Header` public props unchanged.
- Preserve existing language and cabinet placeholder behavior.
- Desktop contact UI is an anchored, non-modal dialog; mobile contact UI is always visible inside the open menu.
- Desktop dismissal supports trigger toggle, close button, outside pointer down, and `Escape`.
- No navigation, hero, typography, or page-section changes.
- The workspace is not a Git repository, so commit steps are omitted.

---

### Task 1: Add Header Assets And Contact Behavior

**Files:**
- Create: `public/header/phone.svg`
- Create: `public/header/language-ua.svg`
- Create: `public/header/cabinet.svg`
- Modify: `src/hero.test.js`
- Modify: `src/App.jsx:1-28,196-223`
- Modify: `src/styles.css:28-52,401-427`

**Interfaces:**
- Consumes: existing `Header({ menuOpen, setMenuOpen, showPageNotice })`, `TelegramLogo`, menu overlay, and utility control styles.
- Produces: `ContactCard({ className, onClose })`, desktop `contactOpen` state, `#header-contact-popover`, and `.mobile-header-tools`.

- [ ] **Step 1: Write failing header contact source-contract tests**

Append tests to `src/hero.test.js` that read `App.jsx` and `styles.css` and assert:

```js
test("header uses the supplied utility assets and temporary contact links", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /\/header\/phone\.svg/);
  assert.match(source, /\/header\/language-ua\.svg/);
  assert.match(source, /\/header\/cabinet\.svg/);
  assert.match(source, /\+34 612 345 678/);
  assert.match(source, /tel:\+34612345678/);
  assert.match(source, /tg:\/\/resolve\?phone=34612345678/);
  assert.match(source, /viber:\/\/chat\?number=%2B34612345678/);
});

test("header contact UI supports desktop dialog and mobile menu presentation", async () => {
  const [source, css] = await Promise.all([
    readFile(new URL("./App.jsx", import.meta.url), "utf8"),
    readFile(new URL("./styles.css", import.meta.url), "utf8"),
  ]);

  assert.match(source, /const \[contactOpen, setContactOpen\] = useState\(false\)/);
  assert.match(source, /aria-expanded=\{contactOpen\}/);
  assert.match(source, /aria-controls="header-contact-popover"/);
  assert.match(source, /id="header-contact-popover"[^>]*role="dialog"[^>]*aria-label="Контакти TuProfe"/s);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /contactRef\.current\?\.contains\(event\.target\)/);
  assert.match(source, /<ContactCard className="mobile-contact-card"/);
  assert.match(css, /\.mobile-header-tools\s*\{/);
  assert.match(css, /@media \(max-width: 980px\)[\s\S]*\.mobile-header-tools\s*\{[^}]*display:\s*flex/);
});
```

- [ ] **Step 2: Run the targeted tests and confirm RED**

Run: `npm test -- --test-name-pattern='header uses the supplied|header contact UI supports'`

Expected: both new tests fail because the assets, `ContactCard`, and contact state are absent.

- [ ] **Step 3: Copy the three supplied assets verbatim**

Run:

```bash
mkdir -p public/header
cp '/Users/mykolabuga/Desktop/TuProfe/Link.svg' public/header/phone.svg
cp '/Users/mykolabuga/Desktop/TuProfe/Container.svg' public/header/language-ua.svg
cp '/Users/mykolabuga/Desktop/TuProfe/Link - Кабінет.svg' public/header/cabinet.svg
```

Verify with `cmp` that each destination matches its source byte for byte.

- [ ] **Step 4: Add reusable contact presentation**

In `src/App.jsx`, remove the unused `Globe` and `UserCircle` imports. Add centralized contact constants and these components before `Header`:

```jsx
const temporaryContact = {
  display: "+34 612 345 678",
  phone: "tel:+34612345678",
  telegram: "tg://resolve?phone=34612345678",
  viber: "viber://chat?number=%2B34612345678",
};

function ViberIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4.5h14v11H10l-4.5 4v-4H5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 8.2c.7 2.1 2 3.4 4.1 4.1l1.1-1.1c.2-.2.5-.3.8-.2l1.4.5v2c0 .4-.3.7-.7.7-4.4 0-8-3.6-8-8 0-.4.3-.7.7-.7h2l.5 1.4c.1.3 0 .6-.2.8z" fill="currentColor" />
    </svg>
  );
}

function ContactCard({ className = "", onClose }) {
  return (
    <div className={`header-contact-card ${className}`}>
      <div className="header-contact-card-top">
        <span>Зв’язатися з нами</span>
        {onClose && <button type="button" aria-label="Закрити контакти" onClick={onClose}><X size={18} /></button>}
      </div>
      <a className="header-contact-phone" href={temporaryContact.phone}>{temporaryContact.display}</a>
      <div className="header-contact-messengers">
        <a href={temporaryContact.telegram} aria-label="Написати в Telegram"><TelegramLogo size={22} weight="fill" /></a>
        <a href={temporaryContact.viber} aria-label="Написати у Viber"><ViberIcon /></a>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Implement desktop state and stable supplied icons**

Inside `Header`, add `contactOpen`, `contactRef`, and an effect that closes on outside `pointerdown` or `Escape`. Wrap the desktop phone trigger and popover in a ref-backed `.header-contact-area`. Use:

```jsx
const contactRef = useRef(null);
const [contactOpen, setContactOpen] = useState(false);

useEffect(() => {
  const closeOnEscape = (event) => {
    if (event.key === "Escape") setContactOpen(false);
  };
  const closeOutside = (event) => {
    if (!contactRef.current?.contains(event.target)) setContactOpen(false);
  };
  document.addEventListener("keydown", closeOnEscape);
  document.addEventListener("pointerdown", closeOutside);
  return () => {
    document.removeEventListener("keydown", closeOnEscape);
    document.removeEventListener("pointerdown", closeOutside);
  };
}, []);
```

Wrap the phone trigger and popover with `<div className="header-contact-area" ref={contactRef}>` and use:

```jsx
<button
  type="button"
  className="header-icon-button phone-button"
  aria-label="Відкрити контакти"
  aria-expanded={contactOpen}
  aria-controls="header-contact-popover"
  onClick={() => setContactOpen((open) => !open)}
>
  <img src="/header/phone.svg" alt="" />
</button>
```

Render the dialog only while open:

```jsx
{contactOpen && (
  <div id="header-contact-popover" role="dialog" aria-label="Контакти TuProfe">
    <ContactCard onClose={() => setContactOpen(false)} />
  </div>
)}
```

Replace the language visual with `<img src="/header/language-ua.svg" alt="" />` while preserving its caret and click behavior. Replace the cabinet visual with `<img src="/header/cabinet.svg" alt="" />` while preserving its click behavior.

- [ ] **Step 6: Add mobile controls and contact card**

Inside `.menu-overlay`, after the existing navigation, add `.mobile-header-tools` with phone, language, and cabinet controls using the same three asset paths. The phone is a `tel:` link; language and cabinet are buttons that close the menu and call `showPageNotice`. Render `<ContactCard className="mobile-contact-card" />` immediately after the utility row.

```jsx
<div className="mobile-header-tools" aria-label="Швидкі дії">
  <a className="mobile-header-tool" href={temporaryContact.phone} aria-label="Зателефонувати TuProfe">
    <img src="/header/phone.svg" alt="" />
  </a>
  <button type="button" className="mobile-header-tool" aria-label="Змінити мову" onClick={() => { setMenuOpen(false); showPageNotice("Мова"); }}>
    <img src="/header/language-ua.svg" alt="" />
  </button>
  <button type="button" className="mobile-header-tool" aria-label="Кабінет студента" onClick={() => { setMenuOpen(false); showPageNotice("Кабінет"); }}>
    <img src="/header/cabinet.svg" alt="" />
  </button>
</div>
<ContactCard className="mobile-contact-card" />
```

- [ ] **Step 7: Add scoped desktop and mobile styling**

In `src/styles.css`, add the following scoped rules, adjusting only line wrapping if needed:

```css
.header-contact-area { position: relative; display: flex; }
.header-icon-button { padding: 0; }
.header-icon-button img { display: block; object-fit: contain; }
.phone-button img { width: 50px; height: 40px; }
.language-button img { width: 24px; height: 24px; border-radius: 50%; }
.cabinet-button img { width: 42px; height: 40px; }
#header-contact-popover { position: absolute; z-index: 50; top: calc(100% + 14px); right: 0; width: 280px; }
.header-contact-card { padding: 18px; color: var(--navy); background: var(--white); border: 1px solid rgba(13,10,89,.1); border-radius: 22px; box-shadow: 0 20px 50px rgba(13,10,89,.16); }
.header-contact-card-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; font-size: 12px; font-weight: 700; }
.header-contact-card-top button { width: 44px; height: 44px; padding: 0; border: 0; border-radius: 50%; display: grid; place-items: center; color: var(--navy); background: var(--light); cursor: pointer; }
.header-contact-phone { margin-top: 14px; display: block; font-size: 22px; font-weight: 800; }
.header-contact-messengers { margin-top: 16px; display: flex; gap: 10px; }
.header-contact-messengers a { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 50%; color: var(--white); background: #229ed9; }
.header-contact-messengers a:last-child { background: #7360f2; }
.header-contact-messengers svg { width: 22px; height: 22px; }
.mobile-header-tools, .mobile-contact-card { display: none; }
.mobile-header-tool { width: 48px; height: 48px; padding: 0; border: 0; border-radius: 14px; display: grid; place-items: center; background: var(--white); cursor: pointer; }
.mobile-header-tool img { max-width: 42px; max-height: 40px; object-fit: contain; }
```

Within `@media (max-width: 980px)`, add:

```css
.mobile-header-tools { display: flex; align-items: center; gap: 10px; }
.mobile-contact-card { display: block; width: min(100%, 340px); }
```

Within `@media (max-width: 767px)`, add:

```css
.menu-overlay { padding: 96px 16px 24px; gap: 24px; }
.menu-overlay nav button { font-size: clamp(30px, 9vw, 42px); }
```

Use only named opacity/transform transitions, and rely on the existing reduced-motion rule.

- [ ] **Step 8: Run targeted tests and confirm GREEN**

Run: `npm test -- --test-name-pattern='header uses the supplied|header contact UI supports'`

Expected: both matching tests pass with zero failures.

- [ ] **Step 9: Run complete automated verification**

Run: `npm test`

Expected: all tests pass with zero failures.

Run: `npm run build`

Expected: Vite exits successfully and emits the production bundle.

- [ ] **Step 10: Verify desktop and mobile behavior live**

At `http://127.0.0.1:5174/#top`:

- Desktop: confirm the supplied phone, flag, and cabinet assets render at the correct controls.
- Open the phone popover and verify its role, label, phone copy, and exact `href` values.
- Close it through the trigger, close button, outside click, and `Escape`.
- Confirm the page width does not change and the console remains clean.
- At `390px`, open the mobile menu and confirm the three supplied assets plus contact card are visible, all controls are at least `44px`, and document width equals viewport width.
- Confirm the existing language/cabinet placeholder feedback still works and closes the mobile menu.
