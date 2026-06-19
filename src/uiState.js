export function filterCourses(courses, category) {
  if (category === "all") return courses;
  return courses.filter((course) => course.category === category);
}

export function mergeNavigationItems(primary, secondary = []) {
  return [...new Set([...primary, ...secondary])];
}

export function validateLead({ name, contact }) {
  const errors = {};
  if (!name.trim()) errors.name = "Вкажіть, будь ласка, ім’я";
  if (!contact.trim()) errors.contact = "Додайте телефон або Telegram";
  return errors;
}

export function getPageNotice(pageName) {
  return `Сторінка «${pageName}» буде доступна в наступній версії`;
}

export function buildWhyFeatureLayout(benefits) {
  const slots = [
    ["top", "light"],
    ["feature", "green"],
    ["bottom", "lavender"],
  ];

  return benefits.slice(0, slots.length).map(([number, title, copy], index) => ({
    number,
    title,
    copy,
    slot: slots[index][0],
    tone: slots[index][1],
  }));
}

export function validateNewsletter(email) {
  const value = email.trim();
  if (!value) return "Вкажіть email";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Перевірте формат email";
  return "";
}

export function clampFooterShapePosition(position, size, bounds) {
  return {
    x: Math.min(Math.max(position.x, 0), Math.max(bounds.width - size.width, 0)),
    y: Math.min(Math.max(position.y, 0), Math.max(bounds.height - size.height, 0)),
  };
}

export function raiseFooterShape(shapes, id) {
  const active = shapes.find((shape) => shape.id === id);
  if (!active) return shapes;
  return [...shapes.filter((shape) => shape.id !== id), active];
}

export function sanitizeStickerPositions(value, defaults) {
  const saved = value && typeof value === "object" ? value : {};
  return Object.fromEntries(Object.entries(defaults).map(([id, fallback]) => {
    const position = saved[id];
    const valid = Number.isFinite(position?.x) && Number.isFinite(position?.y);
    return [id, valid ? { x: position.x, y: position.y } : { ...fallback }];
  }));
}

export function detectTranslationSource(text) {
  return /[А-Яа-яІіЇїЄєҐґ]/u.test(text) ? "uk" : "en";
}

export function getStickerFontSize(text) {
  const length = text.trim().length;
  if (length <= 12) return "13px";
  if (length <= 28) return "11px";
  return "9px";
}

export function buildTranslationUrl(text) {
  const value = text.trim();
  const source = detectTranslationSource(value);
  return `https://api.mymemory.translated.net/get?q=${encodeURIComponent(value)}&langpair=${encodeURIComponent(`${source}|es`)}`;
}

export async function translateToSpanish(text, fetchImpl = globalThis.fetch, options = {}) {
  const response = await fetchImpl(buildTranslationUrl(text), { signal: options.signal });
  if (!response.ok) throw new Error("Translation request failed");
  const data = await response.json();
  const translatedText = data?.responseData?.translatedText?.trim();
  if (!translatedText) throw new Error("Translation response was empty");
  return translatedText;
}
