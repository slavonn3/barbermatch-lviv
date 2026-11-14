/* ==========================================================================
   widget-planner.js — «Планувальник практики» для барберів (ЛР №11)
   За скільки тижнів барбер набере потрібну кількість стрижок і скільки це коштуватиме.
   Захист: readInt() для кожного поля, жодних розрахунків з невалідними даними,
   останній коректний результат + примітка, вивід лише через textContent.
   Кожен [data-widget="planner"] — незалежний екземпляр (без глобальних змінних).
   ========================================================================== */
(() => {
  'use strict';

  const DEMO_TODAY = { year: 2026, month: 9, day: 21 }; // 21.10.2026 — демо-«сьогодні» сайту
  const MAX_PER_WEEK = 20;
  const PRICE_TYPES = ['free', 'supplies', 'paid'];
  const money = new Intl.NumberFormat('uk-UA');
  const dateFormat = new Intl.DateTimeFormat('uk', { day: 'numeric', month: 'long' });
  const pluralize = (n, forms) => forms[new Intl.PluralRules('uk').select(n)] || forms.many;
  const WEEK_FORMS = { one: 'тиждень', few: 'тижні', many: 'тижнів', other: 'тижня' };
  const MODEL_FORMS = { one: 'модель', few: 'моделі', many: 'моделей', other: 'моделі' };

  /**
   * Ціле число з поля: { ok, value, message }.
   * Без parseFloat/parseInt: '5abc', '1e3', '2.5', '' — помилки з поясненням.
   */
  function readInt(input, { min, max, emptyMessage, rangeMessage }) {
    if (!input) return { ok: false, message: 'Поле недоступне' };
    if (input.validity && input.validity.badInput) return { ok: false, message: 'Це не схоже на число — введіть лише цифри' };
    const raw = String(input.value).trim().replace(',', '.');
    if (raw === '') return { ok: false, message: emptyMessage };
    if (!/^[+-]?\d+(\.\d+)?$/.test(raw)) return { ok: false, message: 'Введіть число звичайними цифрами, наприклад 30' };
    const value = Number(raw);
    if (!Number.isInteger(value)) return { ok: false, message: 'Лише ціле число' };
    if (!Number.isSafeInteger(value) || value < min || value > max) return { ok: false, message: rangeMessage };
    return { ok: true, value };
  }

  // Чиста функція розрахунку — без DOM; вхід уже перевірений
  function calculatePlan({ goal, done, perWeek, priceType, perCutCost }) {
    const remaining = goal - done;
    if (remaining <= 0) return { reached: true, remaining: 0 };
    const weeks = Math.ceil(remaining / perWeek);
    // Дата через календар, а не через мілісекунди: перехід на зимовий час 25.10 не зсуває день
    const finish = new Date(DEMO_TODAY.year, DEMO_TODAY.month, DEMO_TODAY.day + weeks * 7);
    const perCut = priceType === 'free' ? 0 : Math.max(0, perCutCost);
    const cost = remaining * perCut;
    const faster = perWeek + 2;
    const fasterWeeks = Math.ceil(remaining / faster);
    const tip = faster <= MAX_PER_WEEK && fasterWeeks < weeks ? { models: faster, saved: weeks - fasterWeeks } : null;
    return { reached: false, remaining, weeks, finish, perCut, cost, tip };
  }

  function createPracticePlanner(root) {
    const form = root.querySelector('form');
    const field = (name) => root.querySelector(`[name="${name}"]`);
    const out = (name) => root.querySelector(`[data-plan-out="${name}"]`);
    const setText = (name, text) => { const el = out(name); if (el) el.textContent = text; };
    const setHidden = (name, hidden) => { const el = out(name); if (el) el.hidden = hidden; };
    const inputs = {
      goal: field('goal'), done: field('done'), perWeek: field('perWeek'),
      supplies: field('supplies'), pay: field('pay')
    };

    function showError(input, message) {
      if (!input) return;
      const error = document.getElementById(`${input.id}Error`);
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (error) { error.textContent = message; error.hidden = !message; }
    }

    function readPriceType() {
      const value = root.querySelector('[name="planPrice"]:checked')?.value;
      return PRICE_TYPES.includes(value) ? value : 'supplies';
    }

    function read() {
      const priceType = readPriceType();
      root.querySelectorAll('[data-plan-cost]').forEach((box) => { box.hidden = box.dataset.planCost !== priceType; });

      const goal = readInt(inputs.goal, { min: 1, max: 200, emptyMessage: 'Вкажіть мету — від 1 до 200 стрижок', rangeMessage: 'Від 1 до 200 стрижок' });
      const done = readInt(inputs.done, { min: 0, max: 200, emptyMessage: 'Вкажіть, скільки вже зроблено (0, якщо ще нічого)', rangeMessage: 'Від 0 до 200 стрижок' });
      const perWeek = readInt(inputs.perWeek, { min: 1, max: MAX_PER_WEEK, emptyMessage: 'Вкажіть від 1 до 20 моделей на тиждень', rangeMessage: 'Від 1 до 20 моделей на тиждень' });
      const costInput = priceType === 'supplies' ? inputs.supplies : priceType === 'paid' ? inputs.pay : null;
      const cost = costInput
        ? readInt(costInput, { min: 0, max: 2000, emptyMessage: 'Вкажіть суму від 0 до 2000 ₴', rangeMessage: 'Сума від 0 до 2000 ₴' })
        : { ok: true, value: 0 };
      if (goal.ok && done.ok && done.value > goal.value) {
        done.ok = false;
        done.message = `Не більше, ніж мета (${goal.value})`;
      }

      showError(inputs.goal, goal.ok ? '' : goal.message);
      showError(inputs.done, done.ok ? '' : done.message);
      showError(inputs.perWeek, perWeek.ok ? '' : perWeek.message);
      [inputs.supplies, inputs.pay].forEach((input) => { if (input !== costInput) showError(input, ''); });
      if (costInput) showError(costInput, cost.ok ? '' : cost.message);

      const valid = goal.ok && done.ok && perWeek.ok && cost.ok;
      return valid ? { goal: goal.value, done: done.value, perWeek: perWeek.value, priceType, perCutCost: cost.value } : null;
    }

    function render(plan, priceType) {
      if (plan.reached) {
        setText('weeks', 'Мету вже досягнуто');
        setText('finish', 'Пора до наступного рівня');
        setText('remaining', '0');
        setText('cost', '0 ₴');
        setText('costNote', 'Нових витрат не потрібно');
        setHidden('tip', true);
        return;
      }
      setText('weeks', `${plan.weeks} ${pluralize(plan.weeks, WEEK_FORMS)}`);
      setText('finish', `Фініш ≈ ${dateFormat.format(plan.finish)} ${plan.finish.getFullYear()}`);
      setText('remaining', money.format(plan.remaining));
      setText('cost', `${money.format(plan.cost)} ₴`);
      setText('costNote', priceType === 'free' ? '0 ₴ — модель стрижеться безкоштовно'
        : priceType === 'supplies' ? `${money.format(plan.perCut)} ₴ на стрижку — розхідники`
          : `Ви доплатите моделям ${money.format(plan.cost)} ₴`);
      const tip = out('tip');
      if (tip) {
        tip.hidden = !plan.tip;
        const span = tip.querySelector('span');
        if (plan.tip && span) {
          span.textContent = `Якщо брати ${plan.tip.models} ${pluralize(plan.tip.models, MODEL_FORMS)} на тиждень, дійдеш на ${plan.tip.saved} ${pluralize(plan.tip.saved, WEEK_FORMS)} швидше.`;
        }
      }
    }

    function update() {
      const values = read();
      setHidden('stale', Boolean(values)); // помилка → лишаємо останній коректний результат із приміткою
      // Останній коректний стан міг бути проміжним значенням під час набору — приглушуємо його
      root.querySelector('[data-plan-result]')?.classList.toggle('opacity-60', !values);
      if (!values) return;
      render(calculatePlan(values), values.priceType);
    }

    Object.values(inputs).filter(Boolean).forEach((input) => {
      input.addEventListener('beforeinput', (event) => {
        if (!event.data || !event.data.includes(',')) return;
        event.preventDefault(); // Chromium інакше мовчки робить з «2,5» число 25
        document.execCommand('insertText', false, event.data.replace(/,/g, '.'));
      });
      input.addEventListener('wheel', () => { if (document.activeElement === input) input.blur(); }, { passive: true });
    });

    root.addEventListener('input', update);
    root.addEventListener('change', update);
    form?.addEventListener('submit', (event) => event.preventDefault());
    update();
  }

  document.querySelectorAll('[data-widget="planner"]').forEach(createPracticePlanner);
})();
