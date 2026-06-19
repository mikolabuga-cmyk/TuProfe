import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("hero stickers use the full hero drag boundary and versioned positions", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /const heroRef = useRef\(null\)/);
  assert.match(source, /<section[^>]*className=\{`hero[^`]*is-sticker-dragging/s);
  assert.match(source, /ref=\{heroRef\}/);
  assert.match(source, /tuprofe-hero-stickers-v2/);
  assert.match(source, /className="hero-sticker-layer"/);
});

test("sticker stacking updates z-index without reordering animated DOM nodes", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /const heroStickers = \[\{ id: "hola" \}, \{ id: "como" \}\]/);
  assert.match(source, /heroStickers\.map\(\(\{ id \}/);
  assert.match(source, /zIndex:\s*stickerOrder\.findIndex\(\(\{ id: orderId \}\) => orderId === id\) \+ 1/);
  assert.doesNotMatch(source, /stickerOrder\.map\(\(\{ id \}/);
});

test("header uses the supplied utility assets and temporary contact links", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /const headerAssets = `\$\{assetBase\}header\/`/);
  assert.match(source, /`\$\{headerAssets\}phone\.svg`/);
  assert.match(source, /`\$\{headerAssets\}language-ua\.svg`/);
  assert.match(source, /`\$\{headerAssets\}cabinet\.svg`/);
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
