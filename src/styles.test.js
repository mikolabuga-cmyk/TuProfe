import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("the hero clips decorative artwork that extends past the viewport", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.hero\s*\{[^}]*overflow:\s*clip;/s);
});

test("the Figma hero clips decoration and supports reduced motion", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.figma-hero-panel\s*\{[^}]*overflow:\s*clip;/s);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/s);
});

test("the desktop hero contains the full center gallery image", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");
  const heroHeight = Number(css.match(/\.hero\s*\{[^}]*min-height:\s*(\d+)px;/s)?.[1]);
  const stageRule = css.match(/\.hero-gallery-stage\s*\{([^}]*)\}/s)?.[1] ?? "";
  const galleryRule = css.match(/\.hero-gallery\s*\{([^}]*)\}/s)?.[1] ?? "";
  const centerRule = css.match(/\.hero-gallery-item\.item-3\s*\{([^}]*)\}/s)?.[1] ?? "";
  const stageTop = Number(stageRule.match(/top:\s*(\d+)px/)?.[1]);
  const stageHeight = Number(stageRule.match(/height:\s*(\d+)px/)?.[1]);
  const galleryPaddingTop = Number(galleryRule.match(/padding-top:\s*(\d+)px/)?.[1]);
  const centerHeight = Number(centerRule.match(/height:\s*(\d+)px/)?.[1]);
  const galleryContentHeight = stageHeight - galleryPaddingTop;
  const centerBottom = stageTop + galleryPaddingTop + (galleryContentHeight - centerHeight) / 2 + centerHeight;

  assert.ok(centerBottom <= heroHeight, `center image ends at ${centerBottom}px beyond the ${heroHeight}px hero`);
});

test("hero gallery hover uses deliberate morph and image easings", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.hero-gallery-item\s*\{[^}]*460ms cubic-bezier\(0\.77, 0, 0\.175, 1\)/s);
  assert.match(css, /\.hero-gallery-item img\s*\{[^}]*520ms cubic-bezier\(0\.23, 1, 0\.32, 1\)/s);
  assert.match(css, /\.hero-gallery-item:hover img[^}]*scale\(1\.025\)/s);
});

test("active sticker dragging suppresses gallery hover motion", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.hero\.is-sticker-dragging[^{]*\.hero-gallery-item[^}]*transform:\s*none/s);
  assert.match(css, /\.hero\.is-sticker-dragging[^{]*\.hero-gallery-item:not\(\.item-3\)[^}]*width:/s);
});

test("the sticker layer covers the full hero", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.hero-sticker-layer\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;/s);
});

test("mobile hides hero stickers and uses the asymmetric bento", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");
  const mobileMedia = "@media (max-width: 767px)";
  const reducedMotionMedia = "@media (prefers-reduced-motion: reduce)";
  const mobileStart = css.indexOf(mobileMedia);
  const mobileEnd = css.indexOf(reducedMotionMedia, mobileStart);

  assert.notEqual(mobileStart, -1, "mobile media block is present");
  assert.notEqual(mobileEnd, -1, "reduced-motion media block follows mobile styles");

  const desktopCss = css.slice(0, mobileStart);
  const mobileCss = css.slice(mobileStart, mobileEnd);
  const hiddenMobileSelectors = [...mobileCss.matchAll(/([^{}]+)\{[^{}]*display:\s*none;[^{}]*\}/g)]
    .map((match) => match[1])
    .join(", ");

  assert.doesNotMatch(desktopCss, /\.hero-sticker-layer\s*\{[^}]*display:\s*none;/);
  assert.match(desktopCss, /\.hero-gallery\s*\{[^}]*display:\s*flex;/);

  assert.match(mobileCss, /\.hero-sticker-layer\s*\{[^}]*display:\s*none;/);
  assert.match(mobileCss, /\.hero-gallery-stage\s*\{[^}]*height:\s*542px;/);
  assert.match(mobileCss, /\.hero-gallery\s*\{[^}]*padding-top:\s*32px;/);
  assert.match(mobileCss, /\.hero-gallery\s*\{[^}]*grid-template-columns:\s*repeat\(12,/);
  assert.match(mobileCss, /\.hero-gallery\s*\{[^}]*grid-template-rows:\s*210px\s+140px\s+140px;/);
  assert.match(mobileCss, /\.hero-gallery\s*\{[^}]*gap:\s*10px;/);
  assert.match(mobileCss, /\.hero-gallery-item\.item-3\s*\{[^}]*order:\s*1;[^}]*grid-column:\s*1\s*\/\s*-1;[^}]*height:\s*100%;[^}]*border-radius:\s*48px;/);
  assert.match(mobileCss, /\.hero-gallery-item\.item-1\s*\{[^}]*order:\s*2;[^}]*grid-column:\s*1\s*\/\s*span\s*5;[^}]*border-radius:\s*56px;/);
  assert.match(mobileCss, /\.hero-gallery-item\.item-2\s*\{[^}]*order:\s*3;[^}]*grid-column:\s*6\s*\/\s*-1;[^}]*border-radius:\s*40px;/);
  assert.match(mobileCss, /\.hero-gallery-item\.item-4\s*\{[^}]*order:\s*4;[^}]*grid-column:\s*1\s*\/\s*span\s*7;[^}]*border-radius:\s*40px;/);
  assert.match(mobileCss, /\.hero-gallery-item\.item-5\s*\{[^}]*order:\s*5;[^}]*grid-column:\s*8\s*\/\s*-1;[^}]*display:\s*block;[^}]*border-radius:\s*56px;/);
  for (const item of [1, 2, 3, 4, 5]) {
    assert.doesNotMatch(hiddenMobileSelectors, new RegExp(`\\.hero-gallery-item\\.item-${item}\\b`));
  }
});

test("mobile hero copy stays above the overlapping gallery stage", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");
  const mobileStart = css.indexOf("@media (max-width: 767px)");
  const mobileEnd = css.indexOf("@media (prefers-reduced-motion: reduce)", mobileStart);
  const mobileCss = css.slice(mobileStart, mobileEnd);

  assert.match(mobileCss, /\.figma-hero-copy\s*\{[^}]*z-index:\s*5;/);
});

test("the fixed mobile CTA bar is removed", async () => {
  const [app, css] = await Promise.all([
    readFile(new URL("./App.jsx", import.meta.url), "utf8"),
    readFile(new URL("./styles.css", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(app, /mobile-cta-bar/);
  assert.doesNotMatch(css, /mobile-cta-bar/);
});

test("hero entrance uses a persistent one-time ready state", async () => {
  const app = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(app, /const \[heroReady, setHeroReady\] = useState\(false\)/);
  assert.match(app, /requestAnimationFrame\(\(\) => setHeroReady\(true\)\)/);
  assert.match(app, /heroReady \? "is-ready" : ""/);
  assert.doesNotMatch(app, /<Reveal className="hero-gallery-stage"/);
});

test("hero entrance follows the approved elegant center-out choreography", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");
  const mobileStart = css.indexOf("@media (max-width: 767px)");
  const mobileEnd = css.indexOf("@media (prefers-reduced-motion: reduce)", mobileStart);
  const mobileCss = css.slice(mobileStart, mobileEnd);

  assert.match(css, /--ease-out:\s*cubic-bezier\(0\.22, 1, 0\.36, 1\)/);
  assert.match(css, /\.hero-load\.is-ready \.hero-enter-copy\s*\{[^}]*560ms/);
  assert.match(css, /\.student-proof\.hero-enter-copy\s*\{[^}]*animation-delay:\s*40ms/);
  assert.match(css, /\.figma-hero-copy h1\.hero-enter-copy\s*\{[^}]*animation-delay:\s*120ms/);
  assert.match(css, /\.figma-hero-subtitle\.hero-enter-copy\s*\{[^}]*animation-delay:\s*200ms/);
  assert.match(css, /\.figma-hero-copy > div\.hero-enter-copy:last-child\s*\{[^}]*animation-delay:\s*280ms/);
  assert.match(css, /\.hero-load\.is-ready \.hero-enter-decoration\s*\{[^}]*700ms[^}]*600ms/);
  assert.match(css, /\.hero-gallery-item\.item-3\s*\{[^}]*--hero-delay:\s*720ms;[^}]*--hero-enter-y:\s*48px;[^}]*--hero-enter-scale:\s*\.965/);
  assert.match(css, /\.hero-gallery-item\.item-2[^}]*--hero-delay:\s*980ms;[^}]*--hero-enter-x:\s*-56px;[^}]*--hero-enter-y:\s*18px/);
  assert.match(css, /\.hero-gallery-item\.item-4[^}]*--hero-delay:\s*980ms;[^}]*--hero-enter-x:\s*56px;[^}]*--hero-enter-y:\s*18px/);
  assert.match(css, /\.hero-gallery-item\.item-1[^}]*--hero-delay:\s*1180ms;[^}]*--hero-enter-x:\s*-72px;[^}]*--hero-enter-y:\s*24px/);
  assert.match(css, /\.hero-gallery-item\.item-5[^}]*--hero-delay:\s*1180ms;[^}]*--hero-enter-x:\s*72px;[^}]*--hero-enter-y:\s*24px/);
  assert.match(css, /@keyframes hero-gallery-arrive[\s\S]*translate:\s*var\(--hero-enter-x\) var\(--hero-enter-y\);[\s\S]*scale:\s*var\(--hero-enter-scale\)/);
  assert.match(mobileCss, /\.hero-gallery-item\.item-4\s*\{[^}]*--hero-enter-x:\s*-56px/);
  assert.match(mobileCss, /\.hero-gallery-item\.item-2\s*\{[^}]*--hero-enter-x:\s*56px/);
  assert.match(css, /\.hero-sticker-hola\s*\{[^}]*--hero-delay:\s*1650ms/);
  assert.match(css, /\.hero-sticker-como\s*\{[^}]*--hero-delay:\s*1770ms/);
  assert.match(css, /\.hero-load\.is-ready \.hero-sticker\s*\{[^}]*600ms/);
  assert.match(css, /@keyframes hero-sticker-drop[\s\S]*translate:\s*0 -56px;[\s\S]*scale:\s*\.98/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.hero-enter-copy[^}]*animation:\s*none/);
});

test("sticker entrance delays stay attached to sticker identity during reordering", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /\.hero-sticker-hola\s*\{[^}]*--hero-delay:\s*1650ms/);
  assert.match(css, /\.hero-sticker-como\s*\{[^}]*--hero-delay:\s*1770ms/);
  assert.doesNotMatch(css, /\.hero-sticker:nth-child\([^)]*\)\s*\{[^}]*--hero-delay/);
});

test("all page text inherits Montserrat without Arial overrides", async () => {
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(css, /body\s*\{[^}]*font-family:\s*"Montserrat",\s*sans-serif/);
  assert.doesNotMatch(css, /font-family:\s*Arial,\s*sans-serif/i);
});
