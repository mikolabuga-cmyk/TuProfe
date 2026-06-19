import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("the Figma proof marquee and school story replace the old post-hero pair", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /<main><Hero \/><ProofMarquee \/><SchoolStory \/>/);
  for (const copy of [
    "Програми за CEFR",
    "7 років на ринку",
    "200+ Студентів",
    "20 Викладачів",
    "Мінігрупи до 6 студентів",
    "Україномовні викладачі",
  ]) {
    assert.match(source, new RegExp(copy.replace(/[+]/g, "\\+")));
  }
  for (const copy of [
    "Ми починали як школа іспанської",
    "Мінігрупи до 6 осіб",
    "Онлайн-платформа",
    "Міжнародні стандарти",
  ]) {
    assert.match(source, new RegExp(copy));
  }
});

test("the proof marquee uses the Figma emoji markers", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  for (const item of [
    '["📚", "Програми за CEFR"]',
    '["🎯", "7 років на ринку"]',
    '["👩‍🏫", "200+ Студентів"]',
    '["🎓", "20 Викладачів"]',
    '["👥", "Мінігрупи до 6 студентів"]',
    '["🇺🇦", "Україномовні викладачі"]',
  ]) {
    assert.ok(source.includes(item), `missing ${item}`);
  }
});

test("the story cards reveal once when their stack enters the viewport", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /const \[cardsVisible, setCardsVisible\] = useState\(false\)/);
  assert.match(source, /new IntersectionObserver/);
  assert.match(source, /setCardsVisible\(true\)/);
  assert.match(source, /observer\.disconnect\(\)/);
  assert.match(source, /cardsVisible \? "is-visible" : ""/);
});

test("the marquee is slow, seamless, clipped, and reduced-motion safe", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.proof-marquee\s*\{[^}]*overflow:\s*hidden/s);
  assert.match(css, /\.proof-marquee-track\s*\{[^}]*animation:\s*proof-marquee-scroll\s+\d+s\s+linear\s+infinite/s);
  assert.match(css, /@keyframes proof-marquee-scroll[\s\S]*translateX\(-50%\)/);
  assert.match(css, /prefers-reduced-motion:[^)]*reduce[\s\S]*\.proof-marquee-track[^}]*animation:\s*none/s);
});

test("the story cards use staggered transform and opacity scroll motion", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.story-benefit-card\s*\{[^}]*opacity:\s*0;[^}]*transform:/s);
  assert.match(css, /\.story-card-stack\.is-visible \.story-benefit-card/s);
  assert.match(css, /\.story-card-stack\.is-visible \.story-card-2[^}]*rotate\(-/s);
  assert.match(css, /\.story-card-2\s*\{[^}]*transition-delay:/s);
  assert.match(css, /\.story-card-3\s*\{[^}]*transition-delay:/s);
});

test("the school story heading uses Montserrat semibold", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.school-story-copy h2\s*\{[^}]*font-weight:\s*600;/s);
});

test("the school team flower renders as a larger bare shape", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.school-team \.school-team-mark\s*\{[^}]*width:\s*68px;[^}]*height:\s*68px;[^}]*padding:\s*0;[^}]*border-radius:\s*0;[^}]*background:\s*transparent;/s);
});

test("the homepage temporarily stops after the Sensum placeholder while keeping the footer", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /const showDeferredSections = false;/);
  assert.match(source, /<main><Hero \/><ProofMarquee \/><SchoolStory \/><SensumPlaceholder \/>\{showDeferredSections && <>/);
  assert.match(source, /<CourseSection \/><Process \/><Teachers \/><Stories \/><FAQ \/><Lead \/><\/>\}<\/main>/);
  assert.match(source, /<Footer \/>/);
});

test("the Sensum placeholder matches the supplied message and hover badge", async () => {
  const [source, css] = await Promise.all([
    readFile(new URL("./App.jsx", import.meta.url), "utf8"),
    readFile(new URL("./styles.css", import.meta.url), "utf8"),
  ]);

  assert.match(source, /function SensumPlaceholder\(\)/);
  assert.match(source, /Далі буде ще більше магії/);
  assert.match(source, /Contact Sensum Studio/);
  assert.match(source, /onPointerMove=\{moveSensumBadge\}/);
  assert.match(css, /\.sensum-placeholder-card\s*\{[^}]*border:[^;]*dashed[^;]*;[^}]*border-radius:/s);
  assert.match(css, /\.sensum-contact-badge\s*\{[^}]*opacity:\s*0;/s);
  assert.match(css, /\.sensum-placeholder-card:hover \.sensum-contact-badge[^}]*opacity:\s*1;/s);
  assert.match(css, /@media \(hover: none\)[\s\S]*\.sensum-contact-badge[^}]*opacity:\s*1;/s);
});

test("the footer newsletter is temporarily hidden without hiding the footer", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /const showFooterNewsletter = false;/);
  assert.match(source, /\{showFooterNewsletter && <Reveal className="footer-newsletter">/);
  assert.match(source, /<footer className="site-footer" id="footer">/);
  assert.match(source, /<Reveal className="footer-statement"/);
});

test("the footer sticker stage hides its instruction and container background", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.footer-collage-wrap > p\s*\{[^}]*display:\s*none;/s);
  assert.match(css, /\.footer-collage\s*\{[^}]*background:\s*transparent;[^}]*box-shadow:\s*none;/s);
});

test("the footer statement uses the reduced responsive scale", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.footer-statement\s*\{[^}]*font-size:\s*clamp\(76px,\s*12vw,\s*170px\)/s);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.footer-statement\s*\{[^}]*font-size:\s*clamp\(64px,\s*21vw,\s*92px\)/s);
});

test("two hero stickers expose isolated translation inputs and footer stickers stay drag-only", async () => {
  const [source, css] = await Promise.all([
    readFile(new URL("./App.jsx", import.meta.url), "utf8"),
    readFile(new URL("./styles.css", import.meta.url), "utf8"),
  ]);

  assert.match(source, /useSpanishStickerTranslations\(\{ hola: "¡Hola!", como: "¿Cómo estás\?" \}\)/);
  assert.match(source, /translateToSpanish/);
  assert.match(source, /window\.setTimeout[^]*650/);
  assert.match(source, /className="hero-sticker-input"/);
  assert.match(source, /<textarea[^>]*className="hero-sticker-input"[^>]*rows=\{3\}/s);
  assert.match(source, /"--sticker-font-size": getStickerFontSize\(stickerTexts\[id\]\)/);
  assert.match(source, /maxLength=\{80\}/);
  assert.match(source, /onPointerDown=\{\(event\) => event\.stopPropagation\(\)\}/);
  assert.match(source, /className="hero-translation-status"[^>]*aria-live="polite"/);
  assert.match(source, /como_estas_bubble\.svg/);
  assert.match(source, /vamos_bubble\.svg/);
  assert.doesNotMatch(source, /footer-shape-input|editable:\s*true/);
  assert.match(css, /\.hero-sticker-input\s*\{[^}]*position:\s*absolute;[^}]*background:\s*transparent;/s);
  assert.match(css, /\.hero-sticker-input\s*\{[^}]*font-size:\s*var\(--sticker-font-size\);[^}]*overflow:\s*hidden;[^}]*resize:\s*none;/s);
  assert.match(css, /\.hero-sticker-input\s*\{[^}]*height:\s*56px;/s);
  assert.match(css, /\.hero-translation-status\s*\{[^}]*width:\s*1px;[^}]*height:\s*1px;[^}]*overflow:\s*hidden;[^}]*clip-path:\s*inset\(50%\);/s);
  assert.doesNotMatch(css, /\.footer-shape-input|\.footer-translation-status/);
});
