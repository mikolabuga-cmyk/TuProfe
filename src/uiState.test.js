import test from "node:test";
import assert from "node:assert/strict";

import {
  buildWhyFeatureLayout,
  clampFooterShapePosition,
  buildTranslationUrl,
  detectTranslationSource,
  filterCourses,
  getPageNotice,
  raiseFooterShape,
  sanitizeStickerPositions,
  translateToSpanish,
  validateLead,
  validateNewsletter,
} from "./uiState.js";
import * as uiState from "./uiState.js";

const courses = [
  { id: "group", category: "adult" },
  { id: "private", category: "adult" },
  { id: "kids", category: "kids" },
  { id: "company", category: "business" },
];

test("filterCourses returns every course for the all filter", () => {
  assert.deepEqual(filterCourses(courses, "all"), courses);
});

test("filterCourses returns only courses in the selected category", () => {
  assert.deepEqual(filterCourses(courses, "kids"), [courses[2]]);
});

test("validateLead reports the required name and contact fields", () => {
  assert.deepEqual(validateLead({ name: "", contact: "" }), {
    name: "Вкажіть, будь ласка, ім’я",
    contact: "Додайте телефон або Telegram",
  });
});

test("validateLead accepts a complete lead", () => {
  assert.deepEqual(
    validateLead({ name: "Марія", contact: "@maria" }),
    {},
  );
});

test("getPageNotice creates non-navigating feedback for a future page", () => {
  assert.equal(
    getPageNotice("Викладачі"),
    "Сторінка «Викладачі» буде доступна в наступній версії",
  );
});

test("buildWhyFeatureLayout maps benefits into the reference card cascade", () => {
  const benefits = [
    ["01", "Мінігрупи", "Практика"],
    ["02", "Викладачі", "Підтримка"],
    ["03", "CEFR", "Система"],
  ];

  assert.deepEqual(buildWhyFeatureLayout(benefits), [
    { number: "01", title: "Мінігрупи", copy: "Практика", slot: "top", tone: "light" },
    { number: "02", title: "Викладачі", copy: "Підтримка", slot: "feature", tone: "green" },
    { number: "03", title: "CEFR", copy: "Система", slot: "bottom", tone: "lavender" },
  ]);
});

test("validateNewsletter reports blank and malformed email addresses", () => {
  assert.equal(validateNewsletter(""), "Вкажіть email");
  assert.equal(validateNewsletter("hola@"), "Перевірте формат email");
  assert.equal(validateNewsletter("hola@tuprofe.com.ua"), "");
});

test("clampFooterShapePosition keeps a dragged shape inside its stage", () => {
  assert.deepEqual(
    clampFooterShapePosition({ x: -20, y: 190 }, { width: 60, height: 50 }, { width: 220, height: 220 }),
    { x: 0, y: 170 },
  );
});

test("raiseFooterShape moves the grabbed shape to the front", () => {
  const shapes = [{ id: "arc" }, { id: "flower" }, { id: "bubble" }];
  assert.deepEqual(raiseFooterShape(shapes, "flower").map(({ id }) => id), ["arc", "bubble", "flower"]);
});

test("sanitizeStickerPositions keeps finite saved coordinates and falls back per sticker", () => {
  const defaults = { hola: { x: 29, y: 64 }, como: { x: 76, y: 60 } };

  assert.deepEqual(
    sanitizeStickerPositions({ hola: { x: 40, y: 35 }, como: { x: "bad", y: 8 } }, defaults),
    { hola: { x: 40, y: 35 }, como: { x: 76, y: 60 } },
  );
});

test("mergeNavigationItems removes duplicate mobile navigation labels", () => {
  assert.deepEqual(
    uiState.mergeNavigationItems?.(["Курси", "Контакти"], ["Контакти"]),
    ["Курси", "Контакти"],
  );
});

test("detectTranslationSource distinguishes Ukrainian and English input", () => {
  assert.equal(detectTranslationSource("Привіт"), "uk");
  assert.equal(detectTranslationSource("hello"), "en");
});

test("getStickerFontSize scales hero sticker text at exact length thresholds", () => {
  assert.equal(uiState.getStickerFontSize?.("a".repeat(12)), "13px");
  assert.equal(uiState.getStickerFontSize?.("a".repeat(13)), "11px");
  assert.equal(uiState.getStickerFontSize?.("a".repeat(28)), "11px");
  assert.equal(uiState.getStickerFontSize?.("a".repeat(29)), "9px");
});

test("buildTranslationUrl targets Spanish and encodes the source text", () => {
  assert.equal(
    buildTranslationUrl("добрий день"),
    "https://api.mymemory.translated.net/get?q=%D0%B4%D0%BE%D0%B1%D1%80%D0%B8%D0%B9%20%D0%B4%D0%B5%D0%BD%D1%8C&langpair=uk%7Ces",
  );
  assert.equal(
    buildTranslationUrl("good morning"),
    "https://api.mymemory.translated.net/get?q=good%20morning&langpair=en%7Ces",
  );
});

test("translateToSpanish returns the translated MyMemory response", async () => {
  const fetchTranslation = async () => ({
    ok: true,
    json: async () => ({ responseData: { translatedText: "hola" } }),
  });

  assert.equal(await translateToSpanish("hello", fetchTranslation), "hola");
});

test("translateToSpanish rejects unavailable or empty translations", async () => {
  await assert.rejects(
    translateToSpanish("hello", async () => ({ ok: false })),
    /Translation request failed/,
  );
  await assert.rejects(
    translateToSpanish("hello", async () => ({ ok: true, json: async () => ({ responseData: {} }) })),
    /Translation response was empty/,
  );
});
