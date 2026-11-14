/* ==========================================================================
   widget-match.js — «Швидкий підбір» для моделей (ЛР №11)
   Кроки: послуга і тип волосся → умови, район, бюджет, дні → результат-топ-3.
   Живий лічильник, бал збігу 0–100, підказка при нулі результатів.
   Захист: нормалізація введення, діапазони, Number.isFinite, перевірка DOM,
   вивід лише через textContent. Демо-дані — з BARBERS і PRICES (js/app.js).
   ========================================================================== */
(() => {
  'use strict';

  const DEMO_TODAY = { year: 2026, month: 9, day: 21 }; // 21.10.2026 — від нього app.js рахує «Сьогодні»
  const LIMITS = {
    budget: { min: 0, max: 2000 },
    days: { min: 1, max: 14 }
  };
  const SCORE = { hair: 30, price: 25, time: 25, reliability: 20 };
  const FILTER_NAMES = { services: 'послуга', price: 'умови', districts: 'район', budget: 'бюджет', days: 'кількість днів' };

  /* ---------- Чисті функції ---------- */

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const pluralize = (n, forms) => forms[new Intl.PluralRules('uk').select(n)] || forms.many;
  const SLOT_FORMS = { one: 'слот', few: 'слоти', many: 'слотів', other: 'слотів' };
  const DAY_FORMS = { one: 'день', few: 'дні', many: 'днів', other: 'дня' };

  // Сума з PRICES: «Розхідники · 300 ₴» → 300; для доплати модель отримує гроші → від’ємна вартість
  function priceAmount(key) {
    const text = typeof PRICES === 'object' && PRICES ? String(PRICES[key] || '') : '';
    const amount = Number((text.match(/\d+/) || ['0'])[0]);
    return key === 'paid' ? -amount : key === 'supplies' ? amount : 0;
  }

  /**
   * Розбір числового поля без «сюрпризів» parseFloat ('5abc' → 5) і Number ('1e3' → 1000).
   * Повертає { ok, value, message, note }.
   */
  function readNumber(input, { min, max, integer, emptyMessage, rangeMessage, integerMessage }) {
    if (!input) return { ok: false, message: 'Поле недоступне' };
    if (input.validity && input.validity.badInput) return { ok: false, message: 'Це не схоже на число — введіть лише цифри' };
    const raw = String(input.value).trim().replace(',', '.');
    if (raw === '') return { ok: false, message: emptyMessage };
    if (!/^[+-]?\d+(\.\d+)?$/.test(raw)) return { ok: false, message: 'Введіть число звичайними цифрами, наприклад 300' };
    let value = Number(raw);
    let note = '';
    if (!Number.isFinite(value) || value < min || value > max) return { ok: false, message: rangeMessage };
    if (!Number.isInteger(value)) {
      if (integer) return { ok: false, message: integerMessage };
      value = Math.round(value);
      note = `Округлили до ${value} ₴`;
    }
    return { ok: true, value, note };
  }

  // Слоти з BARBERS у вигляді, зручному для фільтрів (те саме правило тегів, що й slotCardTemplate)
  function buildSlots() {
    if (typeof BARBERS !== 'object' || !BARBERS) return [];
    const today = Date.UTC(DEMO_TODAY.year, DEMO_TODAY.month, DEMO_TODAY.day);
    return Object.entries(BARBERS).flatMap(([id, barber]) => (Array.isArray(barber.slots) ? barber.slots : []).map((slot) => {
      const tags = (slot.tags || []).join(' ').toLowerCase();
      const hair = tags.includes('кучеряв') ? 'curly' : tags.includes('коротк') ? 'short'
        : tags.includes('середн') ? 'medium' : tags.includes('стрижка') ? 'short' : '';
      const [y, m, d] = String(slot.datetime || '').slice(0, 10).split('-').map(Number);
      const offset = Math.round((Date.UTC(y, m - 1, d) - today) / 86400000);
      return {
        id, slot, barber, hair,
        beard: tags.includes('бород'),
        price: slot.price,
        district: slot.district,
        offset: Number.isFinite(offset) ? offset : Infinity,
        cost: priceAmount(slot.price),
        reliability: clamp(Number(barber.reliability) || 0, 0, 100)
      };
    }));
  }

  function passes(slot, params, skip = '') {
    if (skip !== 'services') {
      if (params.services.includes('hair') && !slot.hair) return false;
      if (params.services.includes('beard') && !slot.beard) return false;
      if (params.services.includes('combo') && (!slot.hair || !slot.beard)) return false;
    }
    if (skip !== 'price' && params.price && slot.price !== params.price) return false;
    if (skip !== 'districts' && params.districts.length && !params.districts.includes(slot.district)) return false;
    if (skip !== 'budget' && slot.cost > params.budget) return false;
    if (skip !== 'days' && !(slot.offset >= 0 && slot.offset < params.days)) return false;
    return true;
  }

  function scoreSlot(slot, params) {
    const hair = !params.hair || params.hair === slot.hair ? SCORE.hair : 0;
    const price = slot.cost <= 0 ? SCORE.price : clamp(SCORE.price * (1 - slot.cost / Math.max(params.budget, 1)), 0, SCORE.price);
    const time = clamp(SCORE.time * (1 - slot.offset / params.days), 0, SCORE.time);
    const reliability = SCORE.reliability * slot.reliability / 100;
    const total = Math.round(hair + price + time + reliability);
    return Number.isFinite(total) ? clamp(total, 0, 100) : 0;
  }

  // Витрати для моделі — ніколи не «−200 ₴»
  function costText(cost) {
    if (cost === 0) return 'Безкоштовно';
    return cost > 0 ? `${cost} ₴ за розхідники` : `+${Math.abs(cost)} ₴ тобі`;
  }

  /* ---------- Віджет ---------- */

  function createMatchWidget(root) {
    const form = root.querySelector('form');
    if (!form) return;
    const $ = (selector) => root.querySelector(selector);
    const field = (name) => form.querySelector(`[name="${name}"]`);

    const steps = [...form.querySelectorAll('[data-step]')];
    const nextButton = $('#matchNext');
    const backButton = $('#matchBack');
    const progressSteps = [...root.querySelectorAll('.match-progress li')];
    const budgetInput = field('matchBudget');
    const daysInput = field('matchDays');
    const budgetHint = budgetInput && document.getElementById(`${budgetInput.id}Hint`);
    const budgetHintText = budgetHint ? budgetHint.textContent : '';
    const slots = buildSlots();
    let stepIndex = 0;
    let lastValid = null; // останні коректні параметри — їх показуємо, поки поле з помилкою

    const setText = (selector, text) => { const el = $(selector); if (el) el.textContent = text; };

    function showFieldError(input, message) {
      if (!input) return;
      const error = document.getElementById(`${input.id}Error`);
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (error) { error.textContent = message; error.hidden = !message; }
    }

    function readParams() {
      const budget = readNumber(budgetInput, {
        ...LIMITS.budget, integer: false,
        emptyMessage: 'Вкажіть суму від 0 до 2000 ₴',
        rangeMessage: 'Сума від 0 до 2000 ₴'
      });
      const days = readNumber(daysInput, {
        ...LIMITS.days, integer: true,
        emptyMessage: 'Вкажіть, протягом скількох днів зручно (1–14)',
        rangeMessage: 'Цілі дні від 1 до 14',
        integerMessage: 'Цілі дні від 1 до 14'
      });
      showFieldError(budgetInput, budget.ok ? '' : budget.message);
      showFieldError(daysInput, days.ok ? '' : days.message);
      if (budgetHint) budgetHint.textContent = budget.ok && budget.note ? budget.note : budgetHintText;

      const checkedValue = (name, allowed) => {
        const value = form.querySelector(`[name="${name}"]:checked`)?.value || '';
        return allowed.includes(value) ? value : '';
      };
      return {
        valid: budget.ok && days.ok,
        services: [...form.querySelectorAll('[name="service"]:checked')].map((i) => i.value).filter((v) => ['hair', 'beard', 'combo'].includes(v)),
        hair: checkedValue('matchHair', ['', 'short', 'medium', 'curly']),
        price: checkedValue('matchPrice', ['', 'free', 'supplies', 'paid']),
        districts: [...form.querySelectorAll('[name="matchDistrict"]:checked')].map((i) => i.value),
        budget: budget.ok ? budget.value : NaN,
        days: days.ok ? days.value : NaN
      };
    }

    function renderTop(found, params) {
      const list = $('#matchTop');
      if (!list) return;
      const best = new Map();
      found.forEach((slot) => {
        const score = scoreSlot(slot, params);
        if (!best.has(slot.id) || score > best.get(slot.id).score) best.set(slot.id, { slot, score });
      });
      const items = [...best.values()].sort((a, b) => b.score - a.score).slice(0, 3).map(({ slot, score }) => {
        const li = document.createElement('li');
        const head = document.createElement('div');
        head.className = 'match-top-head';
        const name = document.createElement('span');
        name.className = 'match-top-name';
        name.textContent = slot.barber.shortName || slot.barber.name || 'Барбер';
        const value = document.createElement('span');
        value.className = 'match-top-score';
        value.textContent = `збіг ${score}%`;
        head.append(name, value);
        const meta = document.createElement('span');
        meta.className = 'match-top-meta';
        meta.textContent = `${slot.district} · ${slot.slot.time}`;
        const cost = document.createElement('span');
        cost.className = 'match-top-meta';
        cost.textContent = costText(slot.cost);
        const link = document.createElement('a');
        link.href = `barber.html?id=${encodeURIComponent(slot.id)}`;
        link.textContent = 'Профіль барбера';
        li.append(head, meta, cost, link);
        return li;
      });
      list.replaceChildren(...items);
    }

    function renderZero(found, params) {
      const zero = $('#matchZero');
      if (!zero) return;
      zero.hidden = found.length > 0;
      if (found.length > 0) return;
      const active = Object.keys(FILTER_NAMES).filter((key) => key === 'budget' || key === 'days'
        || (key === 'services' && params.services.length) || (key === 'price' && params.price)
        || (key === 'districts' && params.districts.length));
      let bestKey = '';
      let bestCount = 0;
      active.forEach((key) => {
        const count = slots.filter((slot) => passes(slot, params, key)).length;
        if (count > bestCount) { bestKey = key; bestCount = count; }
      });
      zero.textContent = bestKey
        ? `Нічого не знайшли. Найбільше обмежує фільтр «${FILTER_NAMES[bestKey]}» — без нього знайдеться ще ${bestCount} ${pluralize(bestCount, SLOT_FORMS)}.`
        : 'Нічого не знайшли. Спробуйте інші умови.';
    }

    function update() {
      const params = readParams();
      // Аудит (a11y): не disabled, а aria-disabled — кнопка лишається у фокусі, а клік веде до поля з помилкою
      if (nextButton) nextButton.setAttribute('aria-disabled', String(stepIndex === 1 && !params.valid));
      if (params.valid) lastValid = params;
      // Поки поле з помилкою, лічильник і результат — останній коректний розрахунок, приглушений
      root.querySelector('#matchLive')?.classList.toggle('is-stale', !params.valid);
      root.querySelector('.match-result')?.classList.toggle('is-stale', !params.valid);
      const used = lastValid; // невалідне поле → показуємо останній коректний розрахунок
      if (!used) return;
      const found = slots.filter((slot) => passes(slot, used));
      const count = found.length;
      setText('#matchLiveCount', String(count));
      setText('#matchLiveLabel', pluralize(count, SLOT_FORMS));
      setText('#matchCount', String(count));
      setText('#matchCountLabel', pluralize(count, SLOT_FORMS));
      const priceLabel = used.price ? form.querySelector(`[name="matchPrice"][value="${used.price}"]`)?.parentElement?.textContent.trim() : '';
      setText('#matchSummary', [
        priceLabel,
        used.districts.join(', '),
        `до ${used.budget} ₴`,
        `${used.days} ${pluralize(used.days, DAY_FORMS)}`
      ].filter(Boolean).join(' · '));
      renderTop(found, used);
      renderZero(found, used);
    }

    function updateStep() {
      steps.forEach((step, index) => { step.hidden = index !== stepIndex; });
      progressSteps.forEach((step, index) => {
        step.classList.toggle('is-active', index <= stepIndex);
        if (index === stepIndex) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
      if (backButton) { backButton.disabled = stepIndex === 0; backButton.hidden = stepIndex === 0; }
      if (nextButton) nextButton.hidden = stepIndex === steps.length - 1;
      update();
    }

    nextButton?.addEventListener('click', () => {
      if (stepIndex === 1 && !readParams().valid) {
        const invalid = form.querySelector('[aria-invalid="true"]');
        if (invalid) invalid.focus(); // скрінрідер одразу зачитає текст помилки (aria-describedby)
        return;
      }
      stepIndex = Math.min(stepIndex + 1, steps.length - 1);
      updateStep();
    });
    backButton?.addEventListener('click', () => {
      stepIndex = Math.max(stepIndex - 1, 0);
      updateStep();
    });

    [budgetInput, daysInput].filter(Boolean).forEach((input) => {
      // Кома → крапка ще під час введення: інакше Chromium мовчки робить з «2,5» число 25
      input.addEventListener('beforeinput', (event) => {
        if (!event.data || !event.data.includes(',')) return;
        event.preventDefault();
        // type="number" не має setRangeText; insertText імітує звичайне введення і запускає input
        document.execCommand('insertText', false, event.data.replace(/,/g, '.'));
      });
      // Коліщатко над полем у фокусі не змінює значення непомітно
      input.addEventListener('wheel', () => { if (document.activeElement === input) input.blur(); }, { passive: true });
    });

    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', (event) => event.preventDefault());

    $('#showMatches')?.addEventListener('click', () => {
      const params = lastValid;
      const slotsForm = document.querySelector('#slotsFilter');
      if (params && slotsForm && typeof slotsForm._applyMatchFilters === 'function') {
        // Фільтр слотів підтримує лише послугу, умови й райони — бюджет і дні лишаються у віджеті
        slotsForm._applyMatchFilters({ price: params.price, districts: params.districts, services: params.services });
      }
      document.querySelector('#slots')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });

    updateStep();
  }

  document.querySelectorAll('[data-widget="match"]').forEach(createMatchWidget);
})();
