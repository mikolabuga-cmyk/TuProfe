import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("GitHub Pages builds Vite and publishes only the dist artifact", async () => {
  const workflow = await readFile(new URL("../.github/workflows/static.yml", import.meta.url), "utf8");

  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /path:\s*['"]?dist['"]?/);
  assert.doesNotMatch(workflow, /path:\s*['"]?\.['"]?/);
});

test("the Vite build and public assets support repository subpaths", async () => {
  const [config, app] = await Promise.all([
    readFile(new URL("../vite.config.mjs", import.meta.url), "utf8"),
    readFile(new URL("./App.jsx", import.meta.url), "utf8"),
  ]);

  assert.match(config, /base:\s*["']\.\/["']/);
  assert.match(app, /const assetBase = import\.meta\.env\.BASE_URL;/);
  assert.match(app, /const brand = `\$\{assetBase\}brand\/`;/);
  assert.match(app, /const heroAssets = `\$\{assetBase\}figma-hero\/`;/);
  assert.doesNotMatch(app, /src="\/header\//);
});

test("machine-specific npm configuration is excluded from deployment", async () => {
  const gitignore = await readFile(new URL("../.gitignore", import.meta.url), "utf8");

  assert.match(gitignore, /^\.npmrc$/m);
});
