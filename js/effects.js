/* ==========================================================================
   effects.js — мікроанімації та підказки довіри (ЛР №10)
   Бібліотеки (jsDelivr CDN): AOS 2.3.4, anime.js 3.2.2, CountUp.js 2.8.0,
   Popper 2.11.8 + Tippy.js 6.3.7. Підключається ПІСЛЯ js/app.js: картки слотів,
   бейджі й метрики профілю рендерить app.js.
   Прогресивне покращення: якщо бібліотека не завантажилась або увімкнено
   prefers-reduced-motion — контент одразу видимий і у фінальному стані.
   ========================================================================== */
(() => {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const has = (name) => typeof window[name] !== 'undefined';

  /* ---------- Об’єкти конфігурації (підібрані значення — див. Prompt Log) ---------- */

  // П. 3 — виринання блоків (AOS)
  const REVEAL = {
    duration: 600,           // 0,5–0,7 с
    easing: 'ease-out-cubic',
    offset: 60,              // спрацьовує трохи раніше, ніж блок повністю в кадрі
    shift: 14                // px; стандартні 100 px у fade-up — перевизначено в custom-styles.css
  };
  const REVEAL_TARGETS = [
    // Головна
    '#match .match-panel', '#slotCards', '#barbers > div', '#join .join-layout',
    // Профіль барбера
    '#about .container', '#portfolio .container', '#video > div', '#reviews .container',
    '#bslots .container', '#location > div', '#others .container'
  ];

  // П. 1 — текст «Чому BarberMatch» / «Чому ми» (anime.js)
  const WHY_TEXT = {
    easing: 'easeOutCubic',
    wordDuration: 500,
    wordStagger: 40,         // мс між словами
    lift: 8,                 // px
    textDuration: 450,
    textOverlap: 250,        // опис стартує за 250 мс до кінця слів
    cardStagger: 100,        // мс між картками
    threshold: 0.3
  };

  // П. 2 — хвиля повзунків «До/Після» (anime.js)
  const WAVE = {
    // центр → ліво → право → центр; тривалість сегмента пропорційна відстані (40 / 80 / 40)
    keyframes: [{ pos: 10, duration: 475 }, { pos: 90, duration: 950 }, { pos: 50, duration: 475 }],
    easing: 'easeInOutSine',
    stagger: 150,            // мс між картками → рух одночасний, але хвилею
    threshold: 0.4
  };

  // П. 4 — лічильники профілю (CountUp.js)
  const COUNTERS = {
    targets: ['#cutsMetric', '#attendanceMetric', '#reviewsMetric', '#reliabilityValue'],
    options: { duration: 1.2, useEasing: true, separator: ' ' }
  };

  // П. 5 — підказки довіри (Tippy.js)
  const TOOLTIPS = {
    reliability: 'Частка записів, які барбер провів вчасно й без скасувань. Чим вище — тим менше ризик, що запис зірветься.',
    verified: 'Особу барбера і його робоче місце перевірила команда BarberMatch.',
    level: 'Барбер навчається або має небагато практики. Тому стрижка безкоштовна чи дешева, а робота може тривати трохи довше.',
    attendance: 'Як часто барбер приходить на заплановані записи.',
    free: 'Стрижка безкоштовна — ви допомагаєте барберу практикуватися.',
    supplies: 'Ви платите лише за засоби (віск, гель, леза). Саму стрижку — ні.',
    paid: 'Складна або довга робота: барбер доплачує вам за витрачений час. Сума вказана до запису.'
  };
  const TIP_LABELS = {
    reliability: 'Що означає «Рейтинг надійності»?',
    verified: 'Що означає «Верифікований»?',
    level: 'Що означає рівень барбера?',
    attendance: 'Що означає «явок на запис»?',
    free: 'Що означає «Безкоштовно»?',
    supplies: 'Що означає «Розхідники»?',
    paid: 'Що означає «Доплата моделі»?'
  };
  const TIPPY_BASE = {
    theme: 'barbermatch',
    placement: 'top',
    maxWidth: 260,
    trigger: 'mouseenter focus click',  // курсор, клавіатура, тап
    interactive: true,                   // на саму підказку можна навести (WCAG 1.4.13)
    appendTo: () => document.body,
    aria: { content: 'describedby' },
    delay: [150, 0],
    duration: [180, 120],
    animation: REDUCED ? false : 'fade',
    touch: true
  };

  /* ---------- Допоміжне ---------- */

  // Один раз виконати callback, коли елемент з’явиться в полі зору
  function onceVisible(element, threshold, callback) {
    if (!('IntersectionObserver' in window)) { callback(); return; }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      callback();
    }, { threshold });
    observer.observe(element);
  }

  const inViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  /* ---------- П. 3: виринання блоків (AOS) ---------- */

  function initRevealOnScroll() {
    if (REDUCED || !has('AOS')) return;
    const blocks = REVEAL_TARGETS.flatMap((selector) => [...document.querySelectorAll(selector)]);
    if (blocks.length === 0) return;

    blocks.forEach((block) => {
      // Що вже видно при завантаженні — показуємо одразу, без анімації
      if (inViewport(block)) return;
      block.dataset.aos = 'fade-up';
    });
    document.documentElement.style.setProperty('--fx-reveal-shift', `${REVEAL.shift}px`);

    AOS.init({
      once: true,
      duration: REVEAL.duration,
      easing: REVEAL.easing,
      offset: REVEAL.offset,
      disable: () => REDUCED,
      startEvent: 'DOMContentLoaded'
    });
    // Позиції рахуються до завантаження зображень і карт — перерахувати після load
    window.addEventListener('load', () => AOS.refresh(), { once: true });
  }

  /* ---------- П. 1: текст «Чому BarberMatch» / «Чому ми» (anime.js) ---------- */

  // Заголовок → повний текст для скрінрідера + слова для анімації (aria-hidden)
  function splitWords(heading) {
    const text = heading.textContent.trim();
    const hidden = document.createElement('span');
    hidden.className = 'visually-hidden';
    hidden.textContent = text;
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    text.split(/\s+/).forEach((word, index) => {
      if (index > 0) visual.append(' ');
      const span = document.createElement('span');
      span.className = 'fx-word';
      span.textContent = word;
      visual.append(span);
    });
    heading.replaceChildren(hidden, visual);
    return [...visual.querySelectorAll('.fx-word')];
  }

  function animateCards(grid, cardSelector, headingSelector) {
    const cards = [...grid.querySelectorAll(cardSelector)];
    if (cards.length === 0) return;
    const items = cards.map((card) => ({
      words: splitWords(card.querySelector(headingSelector)),
      text: card.querySelector(':scope > p')
    }));
    grid.classList.add('fx-why-pending'); // початковий стан (CSS) — лише після розбиття

    onceVisible(grid, WHY_TEXT.threshold, () => {
      const timeline = anime.timeline({ easing: WHY_TEXT.easing });
      items.forEach(({ words, text }, index) => {
        const start = index * WHY_TEXT.cardStagger;
        const wordsEnd = start + WHY_TEXT.wordDuration + WHY_TEXT.wordStagger * (words.length - 1);
        timeline.add({
          targets: words,
          opacity: [0, 1],
          translateY: [WHY_TEXT.lift, 0],
          duration: WHY_TEXT.wordDuration,
          delay: anime.stagger(WHY_TEXT.wordStagger)
        }, start);
        if (text) {
          timeline.add({ targets: text, opacity: [0, 1], duration: WHY_TEXT.textDuration }, wordsEnd - WHY_TEXT.textOverlap);
        }
      });
      timeline.finished.then(() => grid.classList.remove('fx-why-pending'));
    });
  }

  function initWhyTextAnimation() {
    if (REDUCED || !has('anime')) return;
    const featureGrid = document.querySelector('#why .feature-grid');
    const audienceGrid = document.querySelector('#why .audience-grid');
    if (featureGrid) animateCards(featureGrid, '.feature-card', 'h3');
    if (audienceGrid) animateCards(audienceGrid, '.audience-card', 'h4');
  }

  /* ---------- П. 2: хвиля повзунків «До/Після» (anime.js) ---------- */

  // Запустити callback, коли AOS показав контейнер (або одразу, якщо AOS його не анімує)
  function afterReveal(element, callback) {
    if (!element.dataset.aos || element.classList.contains('aos-animate')) {
      window.setTimeout(callback, element.dataset.aos ? REVEAL.duration : 0);
      return;
    }
    const observer = new MutationObserver(() => {
      if (!element.classList.contains('aos-animate')) return;
      observer.disconnect();
      window.setTimeout(callback, REVEAL.duration);
    });
    observer.observe(element, { attributes: true, attributeFilter: ['class'] });
  }

  function initBeforeAfterWave() {
    if (REDUCED || !has('anime')) return;
    const grid = document.querySelector('#slotCards');
    if (!grid || !grid.querySelector('.ba-compare.has-photos')) return;

    // Якщо користувач змінив фільтри (картки сховано/показано) до запуску — хвилі не буде
    let filtersTouched = false;
    const filterObserver = new MutationObserver(() => { filtersTouched = true; });
    filterObserver.observe(grid, { subtree: true, attributes: true, attributeFilter: ['hidden'] });

    // Аудит: поріг 40 % від усієї сітки на телефоні (3 картки в колонку ≈1730 px) не досягався
    // на екрані 375×667 — хвиля не стартувала ніколи. Тепер спостерігаємо перший віджет «До/Після».
    const trigger = grid.querySelector('.slot-card:not([hidden]) .ba-compare') || grid;
    onceVisible(trigger, WAVE.threshold, () => afterReveal(grid, () => {
      filterObserver.disconnect();
      if (filtersTouched) return;

      // Лише видимі картки першого рядка сітки, у яких є фото
      const visibleCards = [...grid.querySelectorAll('.slot-card:not([hidden])')];
      if (visibleCards.length === 0) return;
      const firstRowTop = visibleCards[0].offsetTop;
      const compares = visibleCards
        .filter((card) => card.offsetTop === firstRowTop)
        .map((card) => card.querySelector('.ba-compare.has-photos'))
        .filter(Boolean);

      compares.forEach((compare, index) => {
        const range = compare.querySelector('.ba-range');
        if (!range) return;
        const state = { pos: Number(range.value) || 50 };
        const animation = anime({
          targets: state,
          keyframes: WAVE.keyframes,
          easing: WAVE.easing,
          delay: index * WAVE.stagger,
          update: () => {
            const value = Math.round(state.pos);
            compare.style.setProperty('--pos', `${value}%`); // те саме, що робить app.js на input
            range.value = String(value);
          }
        });
        // Користувач торкнувся повзунка — зупиняємо лише цю картку, повзунок у його руках
        const stop = () => animation.pause();
        ['pointerdown', 'keydown', 'input'].forEach((type) => compare.addEventListener(type, stop, { once: true }));
      });
    }));
  }

  /* ---------- П. 4: лічильники профілю (CountUp.js) ---------- */

  function initProfileCounters() {
    if (REDUCED || !has('countUp') || typeof countUp.CountUp !== 'function') return;
    const elements = COUNTERS.targets.map((selector) => document.querySelector(selector)).filter(Boolean);
    if (elements.length === 0) return;

    const run = () => elements.forEach((element) => {
      const finalText = element.textContent.trim();
      const value = Number.parseInt(finalText, 10);
      if (!Number.isFinite(value)) return;
      const suffix = finalText.endsWith('%') ? '%' : '';
      // Скрінрідер одразу читає фінальне значення; анімоване число — aria-hidden
      const label = document.createElement('span');
      label.className = 'visually-hidden';
      label.textContent = finalText;
      const visual = document.createElement('span');
      visual.className = 'fx-count';
      visual.setAttribute('aria-hidden', 'true');
      visual.textContent = finalText;
      element.replaceChildren(label, visual);

      const counter = new countUp.CountUp(visual, value, { ...COUNTERS.options, suffix });
      if (counter.error) { visual.textContent = finalText; return; }
      counter.start();
    });

    // Шкала надійності заповнюється синхронно з числом (лише transform)
    const meter = document.querySelector('#reliabilityMeter > span');
    const fillMeter = () => {
      if (!meter) return;
      meter.classList.add('fx-meter');
      meter.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
        { duration: COUNTERS.options.duration * 1000, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    };

    const block = document.querySelector('.profile-statistics') || elements[0];
    // Метрики у першому екрані — запускаємо одразу, щоб не блимнуло фінальне значення
    if (inViewport(block)) { run(); fillMeter(); } else onceVisible(block, 0.3, () => { run(); fillMeter(); });
  }

  /* ---------- П. 5: підказки довіри (Tippy.js) ---------- */

  function hintButton(key) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'fx-hint';
    button.dataset.tip = key;
    button.setAttribute('aria-label', TIP_LABELS[key]);
    button.textContent = 'ⓘ';
    return button;
  }

  function addHint(target, key) {
    if (!target || target.querySelector(':scope > .fx-hint')) return;
    target.append(hintButton(key));
  }

  function initTrustTooltips() {
    if (!has('tippy') || !has('Popper') || typeof tippy.delegate !== 'function') return;

    // Профіль барбера
    addHint(document.querySelector('.reliability-title'), 'reliability');
    addHint(document.querySelector('.portrait-verified'), 'verified');
    document.querySelectorAll('#barberBadges .status-badge').forEach((badge) => {
      const text = badge.textContent;
      if (/^\s*Верифіков/.test(text)) addHint(badge, 'verified');
      else if (text.includes('Рівень')) addHint(badge, 'level');
    });
    const attendance = document.querySelector('#attendanceMetric');
    if (attendance) addHint(attendance.previousElementSibling, 'attendance');

    // Бейджі ціни в картках слотів (головна й профіль)
    document.querySelectorAll('.price-badge').forEach((badge) => {
      const key = ['free', 'supplies', 'paid'].find((name) => badge.classList.contains(`price-${name}`));
      if (key) addHint(badge, key);
    });

    if (!document.querySelector('.fx-hint')) return;

    // Делегування: картки, що перемальовуються фільтрами, отримують підказки без повторної ініціалізації
    tippy.delegate(document.body, {
      ...TIPPY_BASE,
      target: '.fx-hint[data-tip]',
      content: (reference) => TOOLTIPS[reference.dataset.tip] || ''
    });

    // Esc закриває всі відкриті підказки (Tippy 6 не робить цього сам)
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') tippy.hideAll({ duration: 0 });
    });
  }

  /* ---------- Старт ---------- */

  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('fx-ready'); // лише тепер CSS може ховати елементи
    initRevealOnScroll();      // AOS        — п. 3
    initWhyTextAnimation();    // anime.js   — п. 1
    initBeforeAfterWave();     // anime.js   — п. 2
    initProfileCounters();     // CountUp.js — п. 4
    initTrustTooltips();       // Tippy.js   — п. 5
  });
})();
