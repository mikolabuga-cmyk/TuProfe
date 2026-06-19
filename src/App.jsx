import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CaretDown,
  Check,
  EnvelopeSimple,
  InstagramLogo,
  List,
  PaperPlaneTilt,
  TelegramLogo,
  X,
} from "@phosphor-icons/react";
import {
  buildWhyFeatureLayout,
  clampFooterShapePosition,
  filterCourses,
  getPageNotice,
  getStickerFontSize,
  mergeNavigationItems,
  raiseFooterShape,
  sanitizeStickerPositions,
  translateToSpanish,
  validateLead,
  validateNewsletter,
} from "./uiState.js";

const brand = "/brand/";
const heroAssets = "/figma-hero/";
const showDeferredSections = false;
const showFooterNewsletter = false;
const temporaryContact = {
  display: "+34 612 345 678",
  phone: "tel:+34612345678",
  telegram: "tg://resolve?phone=34612345678",
  viber: "viber://chat?number=%2B34612345678",
};

const heroGallery = [
  ["gallery-1.png", "Студентка TuProfe на занятті"],
  ["gallery-2.png", "Студент TuProfe практикує іспанську"],
  ["gallery-3.png", "Онлайн-урок TuProfe"],
  ["gallery-4.png", "Студентка TuProfe вивчає іспанську"],
  ["gallery-5.png", "Спільнота студентів TuProfe"],
];

const heroStickers = [{ id: "hola" }, { id: "como" }];

const heroStickerDefaults = {
  hola: { x: 29, y: 64 },
  como: { x: 76, y: 60 },
};

const proofItems = [
  ["📚", "Програми за CEFR"],
  ["🎯", "7 років на ринку"],
  ["👩‍🏫", "200+ Студентів"],
  ["🎓", "20 Викладачів"],
  ["👥", "Мінігрупи до 6 студентів"],
  ["🇺🇦", "Україномовні викладачі"],
];

const storyCards = [
  {
    title: "Мінігрупи до 6 осіб",
    copy: "Навчаємо в невеликих групах, щоб викладач міг приділити увагу кожному студенту. Ви отримуєте зрозумілий навчальний план, дедлайни, практику з носіями та підтримку на кожному етапі.",
  },
  {
    title: "Онлайн-платформа",
    copy: "Доступ до навчальних матеріалів, завдань і курсу в одному місці — це допомагає рухатися системно.",
  },
  {
    title: "Міжнародні стандарти",
    copy: "Навчання за рівнями CEFR, підсумковий іспит за моделлю DELE та сертифікат після завершення рівня.",
  },
];

const courses = [
  {
    id: "group",
    category: "adult",
    label: "Найпопулярніше",
    title: "Групові курси для дорослих",
    meta: "до 6 студентів · A1–C1",
    copy: "Системне навчання у мінігрупах до 6 студентів: регулярна практика, структура та підтримка групи.",
    cta: "Дізнатися більше",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=900&fit=crop&q=88",
    tone: "violet",
  },
  {
    id: "private",
    category: "adult",
    label: "Гнучкий графік",
    title: "Індивідуальні заняття",
    meta: "ваша ціль · ваш темп",
    copy: "Персональні уроки під вашу ціль, рівень і графік: розмова, робота, переїзд або іспит.",
    cta: "Підібрати викладача",
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1200&h=900&fit=crop&q=88",
    tone: "green",
  },
  {
    id: "intensive",
    category: "adult",
    label: "Швидкий старт",
    title: "Інтенсиви",
    meta: "більше концентрації · менше часу",
    copy: "Формат для швидкого старту, підготовки до поїздки або активного відновлення знань.",
    cta: "Дізнатися про інтенсиви",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=900&fit=crop&q=88",
    tone: "light",
  },
  {
    id: "kids",
    category: "kids",
    label: "7–16 років",
    title: "Іспанська для дітей",
    meta: "адаптація · школа · друзі",
    copy: "Адаптована подача для дітей і підлітків: більше впевненості в навчанні та новому середовищі.",
    cta: "Підібрати курс для дитини",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=900&fit=crop&q=88",
    tone: "light",
  },
  {
    id: "company",
    category: "business",
    label: "Для команд",
    title: "Іспанська для компаній",
    meta: "під бізнес-цілі",
    copy: "Навчання для команд, які працюють з клієнтами, партнерами та іспаномовними ринками.",
    cta: "Обговорити навчання",
    image: "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=1200&h=900&fit=crop&q=88",
    tone: "navy",
  },
];

const steps = [
  ["01", "Проходите тест рівня або залишаєте заявку", "Якщо вже трохи знаєте іспанську — тест визначить рівень. Якщо починаєте з нуля — просто залиште заявку."],
  ["02", "Отримуєте консультацію", "Менеджер уточнює вашу ціль, графік, досвід вивчення мови та бажаний формат навчання."],
  ["03", "Ми підбираємо курс, групу або викладача", "Ви отримуєте рекомендацію: груповий курс, індивідуальні заняття, інтенсив, дитяче або корпоративне навчання."],
  ["04", "Починаєте навчання", "Навчаєтесь онлайн з викладачем, отримуєте матеріали та поступово рухаєтесь за програмою."],
  ["05", "Відстежуєте прогрес", "Після завершення рівня бачите результат, отримуєте фідбек і можете продовжити навчання."],
];

const trustFacts = [
  ["2019", "навчаємо іспанської онлайн", "dark"],
  ["≈20", "україномовних викладачів та носіїв", "green"],
  ["до 6", "студентів у мінігрупі", "violet"],
  ["CEFR", "програми за міжнародними рівнями", "light"],
  ["Записи", "щоб повторити матеріал", "light"],
  ["Сертифікат", "після завершення рівня", "navy"],
];

const whyBenefits = [
  ["01", "Мінігрупи до 6 студентів", "Достатньо людей для живої практики й достатньо уваги викладача для кожного."],
  ["02", "Україномовні викладачі та носії", "Складні теми пояснюємо зрозуміло, а потім практикуємо живу іспанську з носіями."],
  ["03", "Програми за рівнями CEFR", "Навчання побудоване від базового старту до впевненого володіння мовою."],
  ["04", "Власна платформа та матеріали", "Завдання, матеріали й навчальний процес зібрані в одному зручному місці."],
];

const footerShapeDefaults = [
  { id: "como", src: "como_estas_bubble.svg", label: "¿Cómo estás?", x: 2, y: 22, size: 188, rotation: -7 },
  { id: "exclamation", src: "exclamation_mark.svg", label: "Знак оклику", x: 22, y: 4, size: 72, rotation: 6 },
  { id: "flower", src: "flower_emblem.svg", label: "Квітка TuProfe", x: 31, y: 34, size: 96, rotation: -9 },
  { id: "vamos", src: "vamos_bubble.svg", label: "¡Vamos!", x: 42, y: 4, size: 170, rotation: 5 },
  { id: "arc", src: "curved_arc.svg", label: "Фіолетова дуга", x: 56, y: 36, size: 108, rotation: 12 },
  { id: "question", src: "inverted_question_mark.svg", label: "Знак питання", x: 68, y: 1, size: 70, rotation: -5 },
  { id: "navy", src: "navy_speech_bubble.svg", label: "Синя мовна булька", x: 77, y: 27, size: 180, rotation: 8 },
  { id: "wave", src: "wave_tilde.svg", label: "Хвиля TuProfe", x: 38, y: 64, size: 128, rotation: -4 },
];

const teachers = [
  ["Анна", "A1–B1 · переїзд", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&h=900&fit=crop&q=88"],
  ["Diego", "носій · розмовна", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&h=900&fit=crop&q=88"],
  ["Марія", "DELE · SIELE", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=700&h=900&fit=crop&q=88"],
  ["Sofía", "діти · підлітки", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&h=900&fit=crop&q=88"],
];

const stories = [
  ["Марина", "переїзд до Іспанії", "Мені було важливо не просто вчити слова, а розуміти, як говорити в реальному житті. Саме це я отримала на заняттях.", "Переїзд"],
  ["Олена", "іспанська для себе", "Я думала, що буде складно, але мені все пояснили дуже зрозуміло. Найцінніше — я перестала боятися помилятися.", "Для себе"],
  ["Ірина", "мама студента", "Для мене було важливо, щоб дитині було не страшно. Викладач знайшов підхід, і тепер заняття проходять спокійно та з інтересом.", "Для дитини"],
];

const faqs = [
  ["Чи можна почати з нуля?", "Так. У TuProfe є формати для початківців. Допоможемо почати з бази та поступово рухатися за програмою."],
  ["Як зрозуміти мій рівень?", "Пройдіть тест рівня або залиште заявку на консультацію. Ми визначимо, з якого етапу краще почати."],
  ["Що робити, якщо я не знаю, який формат мені потрібен?", "Це нормально. На консультації уточнимо ціль, графік і досвід, а потім порадимо найкращий формат."],
  ["Скільки людей у групі?", "У групових курсах навчається до 6 студентів — для практики й достатньої уваги викладача."],
  ["Хто викладає — українці чи носії мови?", "У школі працюють україномовні викладачі та носії іспанської. Викладача підбираємо під рівень і ціль."],
  ["Чи є записи занять?", "Так, записи доступні для повторення матеріалу, пояснень і закріплення тем."],
  ["Чи підійде курс для переїзду до Іспанії?", "Так. Працюємо з реальними ситуаціями: побут, документи, лікарі, школа, робота та щоденне спілкування."],
  ["Чи є навчання для дітей?", "Так, є заняття для дітей і підлітків з урахуванням віку, рівня та цілі навчання."],
  ["Чи готуєте до іспитів?", "Так, готуємо до DELE / SIELE. Програма залежить від поточного рівня та бажаного терміну."],
  ["Як записатися на навчання?", "Залиште заявку або пройдіть тест рівня. Ми зв’яжемося з вами й допоможемо підібрати формат."],
];

function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal ${className}`} style={{ "--delay": `${delay}ms` }}>{children}</Tag>;
}

function ArrowButton({ children, href = "#lead", variant = "primary", onClick }) {
  return (
    <a className={`island-button ${variant}`} href={href} onClick={onClick}>
      <span>{children}</span>
      <span className="button-orbit"><ArrowUpRight size={17} weight="light" /></span>
    </a>
  );
}

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

function Header({ menuOpen, setMenuOpen, showPageNotice }) {
  const contactRef = useRef(null);
  const [contactOpen, setContactOpen] = useState(false);
  const pages = ["Курси", "Для компаній", "Про нас", "Матеріали", "Контакти"];
  const mobilePages = mergeNavigationItems(pages, ["Контакти"]);

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

  return (
    <>
      <header className="nav-island" aria-label="Головна навігація">
        <div className="nav-primary">
          <a className="figma-logo" href="#top" aria-label="TuProfe, на головну"><img src={`${heroAssets}logo.png`} alt="" /></a>
          <nav className="desktop-links">
            {pages.map((label, index) => <button key={label} onClick={() => showPageNotice(label)}>{label}{index < 2 && <CaretDown size={15} weight="bold" />}</button>)}
          </nav>
        </div>
        <div className="nav-actions">
          <div className="nav-utilities" aria-label="Налаштування сайту">
            <div className="header-contact-area" ref={contactRef}>
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
              {contactOpen && (
                <div id="header-contact-popover" role="dialog" aria-label="Контакти TuProfe">
                  <ContactCard onClose={() => setContactOpen(false)} />
                </div>
              )}
            </div>
            <button type="button" className="language-button" aria-label="Змінити мову" onClick={() => showPageNotice("Мова")}><img src="/header/language-ua.svg" alt="" /><CaretDown size={14} weight="bold" /></button>
            <button type="button" className="header-icon-button cabinet-button" aria-label="Кабінет студента" onClick={() => showPageNotice("Кабінет")}><img src="/header/cabinet.svg" alt="" /></button>
          </div>
          <a className="nav-cta" href="#lead">Підібрати навчання</a>
        </div>
        <button className={`menu-trigger ${menuOpen ? "open" : ""}`} aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} weight="light" /> : <List size={24} weight="light" />}
        </button>
      </header>
      <div className={`menu-overlay ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <nav>{mobilePages.map((label, index) => <button key={label} style={{ "--menu-delay": `${100 + index * 70}ms` }} onClick={() => { setMenuOpen(false); showPageNotice(label); }}>{label}</button>)}</nav>
        <div className="mobile-header-tools" aria-label="Швидкі дії">
          <a className="mobile-header-tool" href={temporaryContact.phone} aria-label="Зателефонувати TuProfe"><img src="/header/phone.svg" alt="" /></a>
          <button type="button" className="mobile-header-tool" aria-label="Змінити мову" onClick={() => { setMenuOpen(false); showPageNotice("Мова"); }}><img src="/header/language-ua.svg" alt="" /></button>
          <button type="button" className="mobile-header-tool" aria-label="Кабінет студента" onClick={() => { setMenuOpen(false); showPageNotice("Кабінет"); }}><img src="/header/cabinet.svg" alt="" /></button>
        </div>
        <ContactCard className="mobile-contact-card" />
        <ArrowButton href="#lead" onClick={() => setMenuOpen(false)}>Записатися</ArrowButton>
      </div>
    </>
  );
}

function useSpanishStickerTranslations(initialValues) {
  const [texts, setTexts] = useState(initialValues);
  const [statuses, setStatuses] = useState({});
  const timersRef = useRef({});
  const controllersRef = useRef({});

  useEffect(() => () => {
    Object.values(timersRef.current).forEach((timer) => window.clearTimeout(timer));
    Object.values(controllersRef.current).forEach((controller) => controller.abort());
  }, []);

  function update(id, value) {
    setTexts((current) => ({ ...current, [id]: value }));
    window.clearTimeout(timersRef.current[id]);
    controllersRef.current[id]?.abort();

    const text = value.trim();
    if (!text) {
      setStatuses((current) => ({ ...current, [id]: "" }));
      return;
    }

    timersRef.current[id] = window.setTimeout(async () => {
      const controller = new AbortController();
      controllersRef.current[id] = controller;
      setStatuses((current) => ({ ...current, [id]: "translating" }));
      try {
        const translatedText = await translateToSpanish(text, globalThis.fetch, { signal: controller.signal });
        if (controller.signal.aborted) return;
        setTexts((current) => ({ ...current, [id]: translatedText }));
        setStatuses((current) => ({ ...current, [id]: "ready" }));
      } catch (error) {
        if (error.name === "AbortError") return;
        setStatuses((current) => ({ ...current, [id]: "error" }));
      }
    }, 650);
  }

  return { texts, statuses, update };
}

function Hero() {
  const heroRef = useRef(null);
  const dragRef = useRef(null);
  const { texts: stickerTexts, statuses: translationStatuses, update: updateStickerText } = useSpanishStickerTranslations({ hola: "¡Hola!", como: "¿Cómo estás?" });
  const [activeSticker, setActiveSticker] = useState("");
  const [heroReady, setHeroReady] = useState(false);
  const [stickerOrder, setStickerOrder] = useState(heroStickers);
  const [stickerPositions, setStickerPositions] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("tuprofe-hero-stickers-v2") || "null");
      return sanitizeStickerPositions(saved, heroStickerDefaults);
    } catch {
      return sanitizeStickerPositions(null, heroStickerDefaults);
    }
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHeroReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("tuprofe-hero-stickers-v2", JSON.stringify(stickerPositions));
  }, [stickerPositions]);

  useEffect(() => {
    const stopDragging = () => {
      dragRef.current = null;
      setActiveSticker("");
    };
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("blur", stopDragging);
    return () => {
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("blur", stopDragging);
    };
  }, []);

  function beginStickerDrag(event, id) {
    const stage = heroRef.current;
    if (!stage) return;
    const itemRect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id,
      pointerId: event.pointerId,
      offsetX: event.clientX - itemRect.left,
      offsetY: event.clientY - itemRect.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setStickerOrder((current) => raiseFooterShape(current, id));
    setActiveSticker(id);
  }

  function moveSticker(event, id) {
    const drag = dragRef.current;
    const stage = heroRef.current;
    if (!drag || drag.id !== id || !stage) return;
    const stageRect = stage.getBoundingClientRect();
    const itemRect = event.currentTarget.getBoundingClientRect();
    const next = clampFooterShapePosition(
      { x: event.clientX - stageRect.left - drag.offsetX, y: event.clientY - stageRect.top - drag.offsetY },
      { width: itemRect.width, height: itemRect.height },
      { width: stageRect.width, height: stageRect.height },
    );
    setStickerPositions((current) => ({
      ...current,
      [id]: { x: (next.x / stageRect.width) * 100, y: (next.y / stageRect.height) * 100 },
    }));
  }

  function endStickerDrag(event, id) {
    if (dragRef.current?.id !== id) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
    setActiveSticker("");
  }

  function nudgeSticker(event, id) {
    const offsets = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
    const stage = heroRef.current;
    if (!offsets[event.key] || !stage) return;
    event.preventDefault();
    const [dx, dy] = offsets[event.key];
    const stageRect = stage.getBoundingClientRect();
    const itemRect = event.currentTarget.getBoundingClientRect();
    const position = stickerPositions[id];
    const next = clampFooterShapePosition(
      { x: (position.x / 100) * stageRect.width + dx, y: (position.y / 100) * stageRect.height + dy },
      { width: itemRect.width, height: itemRect.height },
      { width: stageRect.width, height: stageRect.height },
    );
    setStickerPositions((current) => ({
      ...current,
      [id]: { x: (next.x / stageRect.width) * 100, y: (next.y / stageRect.height) * 100 },
    }));
    setStickerOrder((current) => raiseFooterShape(current, id));
  }

  return (
    <section className={`hero hero-load ${heroReady ? "is-ready" : ""} ${activeSticker ? "is-sticker-dragging" : ""}`} id="top" ref={heroRef}>
      <div className="figma-hero-panel">
        <div className="figma-hero-copy">
          <div className="student-proof hero-enter-copy" style={{ "--hero-delay": "40ms" }}>
            <span className="student-avatars">{[1, 2, 3, 4].map((number) => <img key={number} src={`${heroAssets}student-${number}.png`} alt="" />)}</span>
            <span><strong>200+</strong> Студентів</span>
          </div>
          <h1 className="hero-enter-copy" style={{ "--hero-delay": "95ms" }}>Іспанська онлайн для життя, роботи й адаптації в Іспанії</h1>
          <p className="figma-hero-subtitle hero-enter-copy" style={{ "--hero-delay": "150ms" }}>Мінігрупи, індивідуальні заняття, україномовні викладачі та носії мови, програми за міжнародними рівнями CEFR.</p>
          <div className="hero-enter-copy" style={{ "--hero-delay": "205ms" }}><a className="figma-hero-cta" href="#lead">Записатися на пробний урок</a></div>
        </div>
        <img className="figma-hero-arc hero-enter-decoration" src={`${brand}curved_arc.svg`} alt="" />
        <img className="figma-hero-flower hero-enter-decoration" src={`${brand}flower_emblem.svg`} alt="" />
      </div>
      <div className="hero-gallery-stage">
        <div className="hero-gallery" aria-label="Студенти та заняття TuProfe">
          {heroGallery.map(([src, alt], index) => <div className={`hero-gallery-item item-${index + 1}`} tabIndex="0" key={src}><img src={`${heroAssets}${src}`} alt={alt} /></div>)}
        </div>
      </div>
      <div className="hero-sticker-layer" aria-label="Рухомі стікери TuProfe">
        {heroStickers.map(({ id }) => {
            const label = id === "hola" ? "¡Hola!" : "¿Cómo estás?";
            const position = stickerPositions[id];
            const statusId = `hero-translation-status-${id}`;
            const status = translationStatuses[id] === "translating"
              ? "Перекладаю…"
              : translationStatuses[id] === "ready"
                ? "Іспанською"
                : translationStatuses[id] === "error"
                  ? "Не вдалося перекласти"
                  : "";
            return (
              <div
                className={`hero-sticker hero-sticker-${id} ${activeSticker === id ? "is-dragging" : ""}`}
                style={{ "--sticker-x": `${position.x}%`, "--sticker-y": `${position.y}%`, zIndex: stickerOrder.findIndex(({ id: orderId }) => orderId === id) + 1 }}
                aria-label={`Перемістити або редагувати стікер ${label}`}
                tabIndex="0"
                key={id}
                onPointerDown={(event) => beginStickerDrag(event, id)}
                onPointerMove={(event) => moveSticker(event, id)}
                onPointerUp={(event) => endStickerDrag(event, id)}
                onPointerCancel={(event) => endStickerDrag(event, id)}
                onKeyDown={(event) => nudgeSticker(event, id)}
              >
                <img src={`${heroAssets}speech-sticker.png`} alt="" />
                <textarea
                  className="hero-sticker-input"
                  value={stickerTexts[id]}
                  rows={3}
                  maxLength={80}
                  style={{ "--sticker-font-size": getStickerFontSize(stickerTexts[id]) }}
                  aria-label={`Перекласти текст у стікері ${label}`}
                  aria-describedby={statusId}
                  onChange={(event) => updateStickerText(id, event.target.value)}
                  onFocus={(event) => event.target.select()}
                  onPointerDown={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                />
                <span className="hero-translation-status" id={statusId} aria-live="polite">{status}</span>
              </div>
            );
          })}
      </div>
    </section>
  );
}

function ProofMarquee() {
  return (
    <section className="proof-marquee" aria-label="Переваги TuProfe">
      <div className="proof-marquee-track">
        {[false, true].map((duplicate) => (
          <div className="proof-marquee-group" aria-hidden={duplicate || undefined} key={duplicate ? "duplicate" : "primary"}>
            {proofItems.map(([mark, label]) => (
              <span className="proof-pill" key={`${duplicate ? "duplicate" : "primary"}-${label}`}>
                <strong aria-hidden="true">{mark}</strong>
                <span>{label}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function SchoolStory() {
  const stackRef = useRef(null);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const node = stackRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="school-story" aria-labelledby="school-story-title">
      <div className="school-story-layout">
        <Reveal className="school-story-copy">
          <h2 id="school-story-title">Ми починали як школа іспанської в Києві, а сьогодні навчаємо українців онлайн де б вони не були</h2>
          <p>Ми допомагаємо студентам вивчати іспанську з нуля, продовжувати свій рівень, готуватися до переїзду, роботи, подорожей, навчання дітей або офіційних іспитів.</p>
          <div className="school-team" aria-label="Команда викладачів TuProfe">
            {[1, 2, 3, 4].map((number) => <img src={`${heroAssets}student-${number}.png`} alt="" key={number} />)}
            <img className="school-team-mark" src={`${brand}flower_emblem.svg`} alt="" />
          </div>
          <dl className="school-metrics">
            <div><dt>200+</dt><dd>Студентів</dd></div>
            <div><dt>20</dt><dd>Викладачів у команді</dd></div>
            <div><dt>7</dt><dd>Років на ринку</dd></div>
          </dl>
        </Reveal>
        <div ref={stackRef} className={`story-card-stack ${cardsVisible ? "is-visible" : ""}`} aria-label="Переваги навчання">
          {storyCards.map(({ title, copy }, index) => (
            <article className={`story-benefit-card story-card-${index + 1}`} key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SensumPlaceholder() {
  function moveSensumBadge(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--badge-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--badge-y", `${event.clientY - rect.top}px`);
  }

  return (
    <section className="sensum-placeholder" aria-labelledby="sensum-placeholder-title">
      <div className="sensum-placeholder-card" tabIndex="0" onPointerMove={moveSensumBadge}>
        <div className="sensum-placeholder-message">
          <span aria-hidden="true">🪄</span>
          <h2 id="sensum-placeholder-title">Далі буде ще більше магії</h2>
        </div>
        <span className="sensum-contact-badge">Contact Sensum Studio</span>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="section trust" aria-labelledby="trust-title">
      <Reveal className="section-intro"><span className="eyebrow">Блок довіри</span><h2 id="trust-title">TuProfe — школа іспанської,<br />якій довіряють <em>з 2019 року.</em></h2></Reveal>
      <div className="trust-grid">
        {trustFacts.map(([value, label, tone], index) => <Reveal className={`metric-card shell metric-${index + 1}`} delay={index * 45} key={value}><div className={`core ${tone}`}><strong>{value}</strong><span>{label}</span>{index === 0 && <img src={`${brand}flower_emblem.svg`} alt="" />}{index === 2 && <img src={`${brand}wave_tilde.svg`} alt="" />}</div></Reveal>)}
      </div>
    </section>
  );
}

function WhyTuProfe() {
  const featureCards = buildWhyFeatureLayout(whyBenefits);

  return (
    <section className="section why" id="why" aria-labelledby="why-title">
      <div className="why-layout">
        <Reveal className="why-story">
          <span className="eyebrow">01 · Чому TuProfe</span>
          <h2 id="why-title">Чому студенти<br />обирають <em>TuProfe.</em></h2>
          <p>Ми поєднуємо структурне навчання, живу практику та підтримку викладача, щоб ви не просто знали правила, а впевнено говорили.</p>
          <div className="why-platform-line">
            <img src={`${brand}wave_tilde.svg`} alt="" />
            <div><strong>{whyBenefits[3][1]}</strong><span>{whyBenefits[3][2]}</span></div>
          </div>
          <div className="why-proof" aria-label="Ключові переваги TuProfe">
            <div><strong>до 6</strong><span>студентів у групі</span></div>
            <div><strong>CEFR</strong><span>система рівнів</span></div>
            <div><strong>1</strong><span>зручна платформа</span></div>
          </div>
          <img className="why-story-mark" src={`${brand}flower_emblem.svg`} alt="" />
        </Reveal>

        <div className="why-stack">
          {featureCards.map(({ number, title, copy, slot, tone }, index) => (
            <Reveal className={`why-card shell why-card-${slot}`} delay={100 + index * 110} key={number}>
              <article className={`core why-card-core ${tone}`}>
                <span className="why-card-number">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            </Reveal>
          ))}
          <img className="why-stack-accent" src={`${brand}curved_arc.svg`} alt="" />
        </div>
      </div>
    </section>
  );
}

function CourseSection() {
  const [filter, setFilter] = useState("all");
  const shown = useMemo(() => filterCourses(courses, filter), [filter]);
  return (
    <section className="section courses" id="courses" aria-labelledby="courses-title">
      <Reveal className="section-intro split"><div><span className="eyebrow">Формати навчання</span><h2 id="courses-title">Оберіть формат навчання<br /><em>під свою ціль.</em></h2></div><p>Не знаєте, що краще: група, індивідуальні заняття чи інтенсив? Визначимо рівень і підберемо комфортний старт.</p></Reveal>
      <Reveal className="filter-row">
        {[["all", "Усі"], ["adult", "Дорослим"], ["kids", "Дітям"], ["business", "Компаніям"]].map(([value, label]) => <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{label}</button>)}
      </Reveal>
      <div className="course-grid">
        {shown.map((course, index) => (
          <Reveal className={`course-card shell ${index === 0 && shown.length > 2 ? "featured" : ""}`} key={course.id} delay={index * 70}>
            <article className={`core ${course.tone}`}>
              <div className="course-media"><img src={course.image} alt="" /><span>{course.label}</span></div>
              <div className="course-content"><p className="micro">{course.meta}</p><h3>{course.title}</h3><p>{course.copy}</p><a href="#lead" aria-label={`${course.cta}: ${course.title}`} title={course.cta}><ArrowUpRight size={20} weight="light" /></a></div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const [active, setActive] = useState(0);
  return (
    <section className="section process" id="process" aria-labelledby="process-title">
      <Reveal className="section-intro split"><div><span className="eyebrow">Як проходить навчання</span><h2 id="process-title">Не знаєте, з чого почати?<br /><em>Ми проведемо вас по кроках.</em></h2></div><p>Вам не потрібно самостійно визначати рівень чи програму. Допоможемо зрозуміти, який варіант підходить саме вам.</p></Reveal>
      <Reveal className="process-shell shell"><div className="process-core core">
        <div className="step-tabs" role="tablist">{steps.map(([number], index) => <button key={number} className={active === index ? "active" : ""} onClick={() => setActive(index)} role="tab" aria-selected={active === index}><span>{number}</span></button>)}</div>
        <div className="step-content" key={active}><span className="step-number">{steps[active][0]}</span><div><p className="micro">Ваш шлях</p><h3>{steps[active][1]}</h3><p>{steps[active][2]}</p></div><img src={`${brand}${active % 2 ? "squiggle_asterisk.svg" : "inverted_question_mark.svg"}`} alt="" /></div>
        <div className="step-controls"><button onClick={() => setActive((active + steps.length - 1) % steps.length)} aria-label="Попередній крок"><ArrowLeft size={21} weight="light" /></button><button onClick={() => setActive((active + 1) % steps.length)} aria-label="Наступний крок"><ArrowRight size={21} weight="light" /></button></div>
      </div></Reveal>
      <Reveal className="process-cta"><ArrowButton>Пройти тест і підібрати курс</ArrowButton></Reveal>
    </section>
  );
}

function Teachers() {
  return (
    <section className="section teachers" id="teachers" aria-labelledby="teachers-title">
      <Reveal className="section-intro split"><div><span className="eyebrow">Люди TuProfe</span><h2 id="teachers-title">Викладачі, які допоможуть<br /><em>заговорити іспанською.</em></h2></div><p>У TuProfe працюють україномовні викладачі та носії. Підбираємо викладача з урахуванням рівня, цілі та формату.</p></Reveal>
      <div className="teacher-grid">
        {teachers.map(([name, role, image], index) => <Reveal key={name} className={`teacher-card shell teacher-${index + 1}`} delay={index * 70}><article className="core"><img src={image} alt={`Викладач ${name}`} /><div><h3>{name}</h3><p>{role}</p></div><a href="#lead" aria-label={`Познайомитися: ${name}`}><ArrowUpRight size={20} weight="light" /></a></article></Reveal>)}
        <Reveal className="teacher-quote shell"><div className="core"><img src={`${brand}vamos_bubble.svg`} alt="¡Vamos!" /><p>«Помилки — це не стоп. Це момент, коли мова починає ставати вашою.»</p><span>Команда TuProfe</span></div></Reveal>
      </div>
    </section>
  );
}

function Stories() {
  const [story, setStory] = useState(0);
  return (
    <section className="section stories" id="stories" aria-labelledby="stories-title">
      <Reveal className="section-intro split"><div><span className="eyebrow">Відгуки та історії</span><h2 id="stories-title">Історії студентів, які вже<br /><em>почали говорити.</em></h2></div><p>Наші студенти вчать іспанську для переїзду, роботи, подорожей, навчання дітей та особистого розвитку.</p></Reveal>
      <Reveal className="story-shell shell"><div className="story-core core">
        <div className="story-portrait"><span>{stories[story][3]}</span><img src={["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&h=1100&fit=crop&q=88", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&h=1100&fit=crop&q=88", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&h=1100&fit=crop&q=88"][story]} alt={stories[story][0]} /></div>
        <div className="story-copy" key={story}><span className="quote-mark">“</span><blockquote>{stories[story][2]}</blockquote><p><strong>{stories[story][0]}</strong><br />{stories[story][1]}</p><div className="story-dots">{stories.map((item, index) => <button key={item[0]} className={story === index ? "active" : ""} onClick={() => setStory(index)} aria-label={`Історія ${item[0]}`} />)}</div></div>
      </div></Reveal>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <Reveal className="section-intro split"><div><span className="eyebrow">FAQ</span><h2 id="faq-title">Питання, які часто виникають<br /><em>перед стартом.</em></h2></div><p>Закриваємо головні запитання до того, як ви залишите заявку.</p></Reveal>
      <div className="faq-list">{faqs.map(([question, answer], index) => <Reveal key={question} delay={index * 40}><article className={`faq-item ${open === index ? "open" : ""}`}><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>{String(index + 1).padStart(2, "0")}</span><strong>{question}</strong><i>{open === index ? <X size={20} weight="light" /> : <ArrowDown size={20} weight="light" />}</i></button><div className="faq-answer"><p>{answer}</p></div></article></Reveal>)}</div>
    </section>
  );
}

function Lead() {
  const [values, setValues] = useState({ name: "", contact: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  function submit(event) {
    event.preventDefault();
    const nextErrors = validateLead(values);
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) setSent(true);
  }
  return (
    <section className="section lead" id="lead" aria-labelledby="lead-title">
      <div className="lead-shell shell"><div className="lead-core core">
        <Reveal className="lead-copy"><span className="eyebrow">Фінальний крок</span><h2 id="lead-title">Не знаєте, з чого почати?<br /><em>Ми допоможемо підібрати формат навчання під вашу ціль.</em></h2><p>Залиште заявку або пройдіть короткий тест рівня — визначимо ваш рівень, зрозуміємо ціль і підберемо курс, викладача або групу.</p><p className="lead-tagline">Іспанська з собою — у навчанні, роботі, подорожах і новому житті.</p><img src={`${brand}lavender_speech_bubble_wide.svg`} alt="" /></Reveal>
        <Reveal className="form-shell shell" delay={100}><form className="core" onSubmit={submit} noValidate>
          {sent ? <div className="success-state"><span><Check size={28} weight="light" /></span><h3>¡Gracias, {values.name}!</h3><p>Зв’яжемося з вами найближчим часом і допоможемо обрати формат.</p><button type="button" onClick={() => setSent(false)}>Надіслати ще раз</button></div> : <>
            <div className="form-head"><span>Безкоштовна консультація</span><strong>≈ 15 хвилин</strong></div>
            <label>Ім’я<input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} aria-invalid={Boolean(errors.name)} placeholder="Ваше ім’я" />{errors.name && <small>{errors.name}</small>}</label>
            <label>Телефон або Telegram<input value={values.contact} onChange={(e) => setValues({ ...values, contact: e.target.value })} aria-invalid={Boolean(errors.contact)} placeholder="Вкажіть номер або нік у Telegram" />{errors.contact && <small>{errors.contact}</small>}</label>
            <button className="submit-button" type="submit"><span>Залишити заявку</span><i><PaperPlaneTilt size={18} weight="light" /></i></button>
            <p className="consent">Натискаючи кнопку, ви погоджуєтесь на обробку персональних даних. Ми зв’яжемося з вами, щоб уточнити ціль і допомогти обрати формат.</p>
          </>}
        </form></Reveal>
      </div></div>
    </section>
  );
}

function Footer() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [shapes, setShapes] = useState(footerShapeDefaults);
  const [activeShape, setActiveShape] = useState("");
  const collageRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    const stopDragging = () => {
      dragRef.current = null;
      setActiveShape("");
    };
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("blur", stopDragging);
    return () => {
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("blur", stopDragging);
    };
  }, []);

  function submitNewsletter(event) {
    event.preventDefault();
    const error = validateNewsletter(email);
    setEmailError(error);
    if (!error) setSubscribed(true);
  }

  function beginShapeDrag(event, id) {
    const stage = collageRef.current;
    if (!stage) return;
    const itemRect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id,
      pointerId: event.pointerId,
      offsetX: event.clientX - itemRect.left,
      offsetY: event.clientY - itemRect.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setShapes((current) => raiseFooterShape(current, id));
    setActiveShape(id);
  }

  function moveShape(event, id) {
    const drag = dragRef.current;
    const stage = collageRef.current;
    if (!drag || drag.id !== id || !stage) return;
    const stageRect = stage.getBoundingClientRect();
    const itemRect = event.currentTarget.getBoundingClientRect();
    const next = clampFooterShapePosition(
      {
        x: event.clientX - stageRect.left - drag.offsetX,
        y: event.clientY - stageRect.top - drag.offsetY,
      },
      { width: itemRect.width, height: itemRect.height },
      { width: stageRect.width, height: stageRect.height },
    );
    setShapes((current) => current.map((shape) => (
      shape.id === id
        ? { ...shape, x: (next.x / stageRect.width) * 100, y: (next.y / stageRect.height) * 100 }
        : shape
    )));
  }

  function endShapeDrag(event, id) {
    if (dragRef.current?.id !== id) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
    setActiveShape("");
  }

  function clearShapeDrag(id) {
    if (dragRef.current?.id !== id) return;
    dragRef.current = null;
    setActiveShape("");
  }

  function nudgeShape(event, id) {
    const offsets = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
    if (!offsets[event.key] || !collageRef.current) return;
    event.preventDefault();
    const stageRect = collageRef.current.getBoundingClientRect();
    const itemRect = event.currentTarget.getBoundingClientRect();
    const shape = shapes.find((item) => item.id === id);
    const [dx, dy] = offsets[event.key];
    const next = clampFooterShapePosition(
      { x: (shape.x / 100) * stageRect.width + dx, y: (shape.y / 100) * stageRect.height + dy },
      { width: itemRect.width, height: itemRect.height },
      { width: stageRect.width, height: stageRect.height },
    );
    setShapes((current) => raiseFooterShape(current.map((item) => (
      item.id === id ? { ...item, x: (next.x / stageRect.width) * 100, y: (next.y / stageRect.height) * 100 } : item
    )), id));
  }

  return (
    <footer className="site-footer" id="footer">
      {showFooterNewsletter && <Reveal className="footer-newsletter">
        <span className="eyebrow">Листи з Іспанії</span>
        <h2>Корисна іспанська<br /><em>без зайвого шуму.</em></h2>
        <p>Раз на місяць — слова для життя, мініпоради викладачів і новини TuProfe.</p>
        {subscribed ? (
          <div className="newsletter-success" role="status">
            <span><Check size={24} weight="light" /></span>
            <div><strong>¡Gracias!</strong><p>Наступний лист надійде на {email}.</p></div>
            <button type="button" onClick={() => { setSubscribed(false); setEmail(""); }}>Інший email</button>
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={submitNewsletter} noValidate>
            <label htmlFor="newsletter-email">Email</label>
            <div className="newsletter-field">
              <input id="newsletter-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setEmailError(""); }} placeholder="ваш@email.com" aria-invalid={Boolean(emailError)} aria-describedby={emailError ? "newsletter-error" : undefined} />
              <button type="submit"><span>Підписатися</span><i><ArrowUpRight size={18} weight="light" /></i></button>
            </div>
            {emailError && <small id="newsletter-error">{emailError}</small>}
          </form>
        )}
      </Reveal>}

      <Reveal className="footer-statement" delay={80}>Іспанська<br /><em>з собою.</em></Reveal>

      <div className="footer-directory">
        <Reveal className="footer-socials">
          <a href="https://instagram.com/tuprofe.esp" aria-label="Instagram TuProfe"><InstagramLogo size={21} weight="light" /></a>
          <a href="https://t.me/TuProfe" aria-label="Telegram TuProfe"><TelegramLogo size={21} weight="light" /></a>
          <a href="mailto:hola@tuprofe.com.ua" aria-label="Email TuProfe"><EnvelopeSimple size={21} weight="light" /></a>
        </Reveal>
        <Reveal className="footer-link-group" delay={60}><strong>Навчання</strong><a href="#courses">Курси</a><a href="#process">Як проходить</a><a href="#teachers">Викладачі</a></Reveal>
        <Reveal className="footer-link-group" delay={100}><strong>TuProfe</strong><a href="#why">Чому ми</a><a href="#stories">Історії студентів</a><a href="#faq">FAQ</a></Reveal>
        <Reveal className="footer-link-group" delay={140}><strong>Почати</strong><a href="#lead">Пробний урок</a><a href="#lead">Тест рівня</a><a href="mailto:hola@tuprofe.com.ua">Контакти</a></Reveal>
      </div>

      <Reveal className="footer-collage-wrap" delay={120}>
        <p>Спробуйте: ці форми можна перетягувати</p>
        <div className="footer-collage" ref={collageRef}>
          {shapes.map((shape, index) => (
              <button
                className={`footer-shape ${activeShape === shape.id ? "is-dragging" : ""}`}
                data-shape={shape.id}
                key={shape.id}
                type="button"
                aria-label={`Перемістити: ${shape.label}`}
                style={{ "--shape-x": `${shape.x}%`, "--shape-y": `${shape.y}%`, "--shape-size": `${shape.size}px`, "--shape-rotation": `${shape.rotation}deg`, zIndex: index + 1 }}
                onPointerDown={(event) => beginShapeDrag(event, shape.id)}
                onPointerMove={(event) => moveShape(event, shape.id)}
                onPointerUp={(event) => endShapeDrag(event, shape.id)}
                onPointerCancel={(event) => endShapeDrag(event, shape.id)}
                onLostPointerCapture={() => clearShapeDrag(shape.id)}
                onKeyDown={(event) => nudgeShape(event, shape.id)}
                onFocus={() => setShapes((current) => raiseFooterShape(current, shape.id))}
              >
                <img src={`${brand}${shape.src}`} alt="" draggable="false" />
              </button>
          ))}
        </div>
      </Reveal>

      <div className="footer-legal">
        <a className="wordmark" href="#top" aria-label="TuProfe, на головну"><span>Tu</span>Profe</a>
        <div><a href="#footer">Політика конфіденційності</a><a href="#footer">Умови використання</a></div>
        <span>© 2026 TuProfe de español</span>
      </div>
    </footer>
  );
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageNotice, setPageNotice] = useState("");
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);
  useEffect(() => {
    if (!pageNotice) return undefined;
    const timer = window.setTimeout(() => setPageNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [pageNotice]);
  const showPageNotice = (pageName) => setPageNotice(getPageNotice(pageName));
  return (
    <>
      <div className="noise" aria-hidden="true" />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} showPageNotice={showPageNotice} />
      <main><Hero /><ProofMarquee /><SchoolStory /><SensumPlaceholder />{showDeferredSections && <><CourseSection /><Process /><Teachers /><Stories /><FAQ /><Lead /></>}</main>
      <div className={`page-notice ${pageNotice ? "show" : ""}`} role="status" aria-live="polite"><span>{pageNotice}</span><button onClick={() => setPageNotice("")} aria-label="Закрити повідомлення"><X size={17} weight="light" /></button></div>
      <Footer />
    </>
  );
}
