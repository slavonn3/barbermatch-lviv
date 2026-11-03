'use strict';
/* BarberMatch Lviv — конструктор заявки на модель (create.html).
   Майстер на 4 кроки: валідація кожного кроку, календар, чипи часу,
   живе прев’ю картки слоту, чернетка в localStorage. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const form = $('#request-form');
  if (!form) return;
  const f = form.elements;
  const steps = $$('.cr-step', form);
  const stepButtons = $$('#stepper [data-goto]');
  const STEP_NAMES = ['Послуга', 'Дата й час', 'Місце й умови', 'Контакти'];
  const DRAFT_KEY = 'bm_create_draft';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stepIndex = 0;
  let maxReached = 0;

  /* ---------- Дати ---------- */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + 60);
  const selected = new Set();
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  let focusIso = null;

  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fromIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const fmt = (d, o) => d.toLocaleDateString('uk-UA', o);
  const inRange = (d) => d >= today && d <= maxDate;
  const plural = (n, [one, few, many]) => {
    const a = n % 10, b = n % 100;
    return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? few : many;
  };
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const durationLabel = (min) => {
    const h = Math.floor(min / 60), m = min % 60;
    return [h && `${h} год`, m && `${m} хв`].filter(Boolean).join(' ');
  };

  /* ---------- Значення форми ---------- */
  const radio = (name) => form.querySelector(`[name="${name}"]:checked`)?.value ?? '';
  const checkedValues = (name) => $$(`[name="${name}"]:checked`, form).map((el) => el.value);
  const times = () => checkedValues('times').sort();
  const slotsTotal = () => selected.size * times().length;

  /* ---------- Валідація ---------- */
  const rules = {
    serviceType: () => radio('serviceType') ? '' : 'Оберіть тип послуги.',
    service: () => f.service.value ? '' : 'Оберіть, що саме відпрацьовуєте.',
    desc: () => f.desc.value.trim().length >= 20 ? '' : 'Опишіть роботу хоча б у 20 символах, щоб модель розуміла, що на неї чекає.',
    ref: () => !f.ref.value.trim() || /^https?:\/\/\S+\.\S+/.test(f.ref.value.trim()) ? '' : 'Посилання має починатися з https://',
    days: () => selected.size ? '' : 'Оберіть хоча б один день у календарі.',
    duration: () => f.duration.value ? '' : 'Вкажіть тривалість одного запису.',
    times: () => {
      const list = times();
      if (!list.length) return 'Оберіть хоча б одну годину початку запису.';
      const dur = Number(f.duration.value);
      if (!dur) return '';
      for (let i = 1; i < list.length; i += 1) {
        if (toMin(list[i]) - toMin(list[i - 1]) < dur) {
          return `Слоти ${list[i - 1]} і ${list[i]} перетинаються: один запис триває ${durationLabel(dur)}. Приберіть один із них або зменште тривалість.`;
        }
      }
      return '';
    },
    district: () => f.district.value ? '' : 'Оберіть район Львова.',
    address: () => f.address.value.trim().length >= 5 ? '' : 'Вкажіть адресу або назву салону.',
    price: () => {
      if (radio('priceType') === 'free') return '';
      const v = Number(f.price.value);
      return v >= 50 && v <= 1000 ? '' : 'Вкажіть суму від 50 до 1000 ₴.';
    },
    name: () => f.name.value.trim().length >= 2 ? '' : 'Вкажіть ім’я, яке побачить модель.',
    phone: () => /^\+?380\d{9}$/.test(f.phone.value.replace(/[\s()-]/g, '')) ? '' : 'Введіть номер у форматі +380 67 123 45 67.',
    consent: () => f.consent.checked ? '' : 'Підтвердьте умови, щоб опублікувати слот.'
  };
  const STEP_FIELDS = [
    ['serviceType', 'service', 'desc', 'ref'],
    ['days', 'duration', 'times'],
    ['district', 'address', 'price'],
    ['name', 'phone', 'consent']
  ];
  /* Обов’язкові пункти для індикатора заповнення */
  const PROGRESS_FIELDS = ['serviceType', 'service', 'desc', 'days', 'duration', 'times', 'district', 'address', 'name', 'phone', 'consent'];

  function invalidTarget(key) {
    if (key === 'serviceType') return $('#err-serviceType').closest('fieldset');
    if (key === 'times') return $('#err-times').closest('fieldset');
    if (key === 'days') return $('.cr-calendar');
    return f[key];
  }

  function focusTarget(key) {
    if (key === 'serviceType') return form.querySelector('[name="serviceType"]');
    if (key === 'times') return form.querySelector('[name="times"]');
    if (key === 'days') return $('#cal-grid [tabindex="0"]') || $('#cal-next');
    return f[key];
  }

  function showError(key, message) {
    const box = $(`#err-${key}`);
    if (!box) return;
    box.textContent = message;
    box.hidden = !message;
    const target = invalidTarget(key);
    if (!target) return;
    if (message) target.setAttribute('aria-invalid', 'true');
    else target.removeAttribute('aria-invalid');
  }

  function validateStep(index) {
    let first = null;
    STEP_FIELDS[index].forEach((key) => {
      const message = rules[key]();
      showError(key, message);
      if (message && !first) first = key;
    });
    return first;
  }

  const isErrorShown = (key) => $(`#err-${key}`) && !$(`#err-${key}`).hidden;
  const recheck = (key) => { if (isErrorShown(key)) showError(key, rules[key]()); };

  /* ---------- Кроки ---------- */
  function goTo(index, { focus = true } = {}) {
    stepIndex = Math.max(0, Math.min(index, steps.length - 1));
    maxReached = Math.max(maxReached, stepIndex);
    steps.forEach((section, i) => { section.hidden = i !== stepIndex; });
    stepButtons.forEach((button, i) => {
      button.classList.toggle('is-done', i < stepIndex || (i <= maxReached && i !== stepIndex));
      if (i === stepIndex) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
      button.setAttribute('aria-label', `Крок ${i + 1}: ${STEP_NAMES[i]}${i === stepIndex ? ' (поточний)' : i <= maxReached ? '' : ' (ще недоступний)'}`);
      button.setAttribute('aria-disabled', String(i > maxReached));
    });
    $('#step-num').textContent = stepIndex + 1;
    $('#step-name').textContent = STEP_NAMES[stepIndex];
    $('#btn-back').disabled = stepIndex === 0;
    $('#btn-next').hidden = stepIndex === steps.length - 1;
    $('#btn-submit').hidden = stepIndex !== steps.length - 1;
    if (stepIndex === 3) renderReview();

    if (focus) {
      const top = form.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.6) form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      steps[stepIndex].querySelector('h2').focus({ preventScroll: true });
      saveDraft();
    }
  }

  function tryAdvanceTo(target) {
    for (let i = stepIndex; i < target; i += 1) {
      const first = validateStep(i);
      if (first) {
        if (i !== stepIndex) goTo(i, { focus: false });
        focusTarget(first)?.focus();
        return;
      }
    }
    goTo(target);
  }

  $('#btn-next').addEventListener('click', () => tryAdvanceTo(stepIndex + 1));
  $('#btn-back').addEventListener('click', () => goTo(stepIndex - 1));
  stepButtons.forEach((button) => button.addEventListener('click', () => {
    const target = Number(button.dataset.goto);
    if (target === stepIndex || target > maxReached) return;
    if (target < stepIndex) goTo(target);
    else tryAdvanceTo(target);
  }));

  /* Enter у текстовому полі переходить до наступного кроку, а не надсилає форму */
  form.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.target.matches('textarea, button, [type="checkbox"], [type="radio"]')) return;
    if (stepIndex < steps.length - 1) { event.preventDefault(); tryAdvanceTo(stepIndex + 1); }
  });

  /* ---------- Календар ---------- */
  const grid = $('#cal-grid');

  function defaultFocus() {
    const inView = (d) => d.getFullYear() === view.getFullYear() && d.getMonth() === view.getMonth();
    const firstSelected = [...selected].sort().map(fromIso).find(inView);
    if (firstSelected) return iso(firstSelected);
    if (inView(today)) return iso(today);
    for (let n = 1; n <= 31; n += 1) {
      const d = new Date(view.getFullYear(), view.getMonth(), n);
      if (d.getMonth() !== view.getMonth()) break;
      if (inRange(d)) return iso(d);
    }
    return null;
  }

  function renderCalendar() {
    const y = view.getFullYear(), m = view.getMonth();
    const month = fmt(view, { month: 'long', year: 'numeric' });
    $('#cal-month').textContent = month.charAt(0).toUpperCase() + month.slice(1);
    $('#cal-prev').disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
    $('#cal-next').disabled = new Date(y, m + 1, 1) > maxDate;
    if (!focusIso || fromIso(focusIso).getMonth() !== m || fromIso(focusIso).getFullYear() !== y) focusIso = defaultFocus();

    grid.replaceChildren();
    const offset = (new Date(y, m, 1).getDay() + 6) % 7;
    for (let i = 0; i < offset; i += 1) {
      const blank = document.createElement('span');
      blank.setAttribute('aria-hidden', 'true');
      grid.append(blank);
    }
    const count = new Date(y, m + 1, 0).getDate();
    for (let n = 1; n <= count; n += 1) {
      const d = new Date(y, m, n), id = iso(d);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cr-day';
      button.dataset.d = id;
      button.textContent = n;
      button.disabled = !inRange(d);
      button.tabIndex = id === focusIso ? 0 : -1;
      button.setAttribute('aria-pressed', String(selected.has(id)));
      button.setAttribute('aria-label', `${fmt(d, { weekday: 'long', day: 'numeric', month: 'long' })}${+d === +today ? ', сьогодні' : ''}`);
      if (d.getDay() === 0 || d.getDay() === 6) button.classList.add('is-weekend');
      if (+d === +today) button.classList.add('is-today');
      grid.append(button);
    }
  }

  function setDay(id, on) {
    if (on === selected.has(id)) return;
    if (on) selected.add(id); else selected.delete(id);
    const button = grid.querySelector(`[data-d="${id}"]`);
    if (button) button.setAttribute('aria-pressed', String(on));
    recheck('days');
    refresh();
    saveDraft();
  }

  function moveFocus(id) {
    const d = fromIso(id);
    if (!inRange(d)) return;
    focusIso = id;
    if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) {
      view = new Date(d.getFullYear(), d.getMonth(), 1);
    }
    renderCalendar();
    grid.querySelector(`[data-d="${id}"]`)?.focus();
  }

  /* Протягування мишею для швидкого вибору кількох днів; на тачі — звичайні тапи,
     тому скрол сторінки пальцем по календарю не блокується. */
  let dragging = false, dragOn = true, suppressClick = false;
  grid.addEventListener('pointerdown', (event) => {
    const button = event.target.closest('.cr-day:not(:disabled)');
    if (!button || event.pointerType !== 'mouse' || event.button !== 0) return;
    dragging = true;
    suppressClick = true;
    dragOn = !selected.has(button.dataset.d);
    focusIso = button.dataset.d;
    setDay(button.dataset.d, dragOn);
  });
  grid.addEventListener('pointerover', (event) => {
    if (!dragging) return;
    const button = event.target.closest('.cr-day:not(:disabled)');
    if (button) setDay(button.dataset.d, dragOn);
  });
  document.addEventListener('pointerup', () => { dragging = false; });
  grid.addEventListener('click', (event) => {
    const button = event.target.closest('.cr-day:not(:disabled)');
    if (!button) return;
    if (suppressClick) { suppressClick = false; return; }
    focusIso = button.dataset.d;
    setDay(button.dataset.d, !selected.has(button.dataset.d));
  });
  grid.addEventListener('keydown', (event) => {
    const button = event.target.closest('.cr-day');
    if (!button) return;
    const d = fromIso(button.dataset.d);
    const shift = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
    let next = null;
    if (shift) next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + shift);
    else if (event.key === 'Home') next = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
    else if (event.key === 'End') next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (6 - ((d.getDay() + 6) % 7)));
    else if (event.key === 'PageUp' || event.key === 'PageDown') next = new Date(d.getFullYear(), d.getMonth() + (event.key === 'PageUp' ? -1 : 1), d.getDate());
    if (!next) return;
    event.preventDefault();
    if (next < today) next = new Date(today);
    if (next > maxDate) next = new Date(maxDate);
    moveFocus(iso(next));
  });

  $('#cal-prev').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderCalendar(); });
  $('#cal-next').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCalendar(); });

  $$('[data-preset]').forEach((button) => button.addEventListener('click', () => {
    const preset = button.dataset.preset;
    if (preset === 'clear') selected.clear();
    else {
      $$('.cr-day:not(:disabled)', grid).forEach((day) => {
        const wd = fromIso(day.dataset.d).getDay(), weekend = wd === 0 || wd === 6;
        if ((preset === 'weekends') === weekend) selected.add(day.dataset.d);
      });
    }
    renderCalendar();
    recheck('days');
    refresh();
    saveDraft();
  }));

  function renderDayChips() {
    const list = $('#day-chips');
    list.replaceChildren();
    const days = [...selected].sort();
    if (!days.length) {
      const empty = document.createElement('li');
      empty.className = 'text-sm text-textMuted dark:text-white/60';
      empty.textContent = 'Поки жодного дня не обрано.';
      list.append(empty);
      return;
    }
    days.forEach((id) => {
      const d = fromIso(id);
      const item = document.createElement('li');
      item.className = 'cr-day-chip';
      item.append(fmt(d, { weekday: 'short', day: 'numeric', month: 'short' }));
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Прибрати ${fmt(d, { day: 'numeric', month: 'long' })}`);
      remove.addEventListener('click', () => {
        const next = item.nextElementSibling?.querySelector('button') || item.previousElementSibling?.querySelector('button');
        setDay(id, false);
        (next && document.contains(next) ? next : grid.querySelector('[tabindex="0"]'))?.focus();
      });
      item.append(remove);
      list.append(item);
    });
  }

  /* ---------- Прев’ю ---------- */
  const PRICE_CLASS = { free: 'price-free', supplies: 'price-supplies', paid: 'price-paid' };
  const priceLabel = () => {
    const type = radio('priceType'), sum = Number(f.price.value) || 0;
    if (type === 'supplies') return `Розхідники · ${sum} ₴`;
    if (type === 'paid') return `Доплата моделі · +${sum} ₴`;
    return 'Безкоштовно';
  };
  const shortName = (full) => {
    const [first, last] = full.trim().split(/\s+/);
    return last ? `${first} ${last[0].toUpperCase()}.` : first;
  };
  const districtLabel = () => f.district.selectedOptions[0]?.value ? f.district.selectedOptions[0].textContent : '';

  function nearestSlot() {
    const days = [...selected].sort(), list = times();
    if (!days.length) return 'Дата не обрана';
    const d = fromIso(days[0]);
    const diff = Math.round((d - today) / 86400000);
    const day = diff === 0 ? 'Сьогодні' : diff === 1 ? 'Завтра' : fmt(d, { weekday: 'short', day: 'numeric', month: 'short' });
    return list.length ? `${day}, ${list[0]}` : day;
  }

  function previewTags() {
    const tags = [radio('hair'), radio('beard'), ...checkedValues('ask')].filter(Boolean);
    return tags.length ? tags : ['Без особливих вимог'];
  }

  let pulseTimer;
  function pulsePreview() {
    if (reduceMotion) return;
    const card = $('.cr-preview-card');
    clearTimeout(pulseTimer);
    card.classList.remove('is-updated');
    void card.offsetWidth;
    card.classList.add('is-updated');
    pulseTimer = setTimeout(() => card.classList.remove('is-updated'), 500);
  }

  function refresh() {
    const name = f.name.value.trim();
    $('#pv-name').textContent = name ? shortName(name) : 'Ваше ім’я';
    $('#pv-exp').textContent = `Новий барбер · ${f.exp.value.toLowerCase()}`;
    const badge = $('#pv-price');
    badge.textContent = priceLabel();
    badge.className = `price-badge shrink-0 ${PRICE_CLASS[radio('priceType')] || 'price-free'}`;
    $('#pv-service').textContent = f.service.value || radio('serviceType') || 'Оберіть послугу';
    $('#pv-district').textContent = f.district.value || '—';
    $('#pv-when').textContent = nearestSlot();
    const tags = previewTags();
    $('#pv-tags').replaceChildren(...tags.slice(0, 4).map((text) => Object.assign(document.createElement('li'), { textContent: text })));
    if (tags.length > 4) $('#pv-tags').append(Object.assign(document.createElement('li'), { textContent: `+${tags.length - 4}` }));
    $('#pv-days').textContent = selected.size;
    $('#pv-slots').textContent = slotsTotal();
    $('#pv-models').textContent = f.models.value || 0;

    /* Зведення під календарем */
    const n = selected.size, t = times().length;
    $('#slot-summary span').textContent = n && t
      ? `${n} ${plural(n, ['день', 'дні', 'днів'])} × ${t} ${plural(t, ['слот', 'слоти', 'слотів'])} = ${slotsTotal()} ${plural(slotsTotal(), ['запис', 'записи', 'записів'])} для моделей.`
      : n ? `Обрано ${n} ${plural(n, ['день', 'дні', 'днів'])}. Тепер позначте години початку записів.`
        : 'Оберіть дні в календарі та години початку записів.';
    renderDayChips();

    /* Умови оплати */
    const type = radio('priceType');
    $('#price-box').hidden = type === 'free';
    $('#price-label').textContent = type === 'paid' ? 'Доплата моделі, ₴' : 'Сума за розхідники, ₴';

    /* Лічильник опису й прогрес */
    $('#desc-count').textContent = f.desc.value.length;
    const done = PROGRESS_FIELDS.filter((key) => !rules[key]()).length;
    $('#progress-done').textContent = done;
    $('#progress-total').textContent = PROGRESS_FIELDS.length;
    $('#progress').setAttribute('aria-valuenow', String(done));
    $('#progress-bar').style.width = `${(done / PROGRESS_FIELDS.length) * 100}%`;

    if (stepIndex === 3) renderReview();
  }

  /* Підсумок на останньому кроці */
  function renderReview() {
    const rows = [
      ['Послуга', [radio('serviceType'), f.service.value].filter(Boolean).join(' · ') || '—', 0],
      ['Вимоги', previewTags().join(', '), 0],
      ['Дні', selected.size ? [...selected].sort().map((id) => fmt(fromIso(id), { day: 'numeric', month: 'short' })).join(', ') : '—', 1],
      ['Час', times().length ? `${times().join(', ')} · ${f.duration.value ? durationLabel(Number(f.duration.value)) : 'тривалість не вказана'}` : '—', 1],
      ['Місце', [districtLabel(), f.address.value.trim()].filter(Boolean).join(', ') || '—', 2],
      ['Умови', `${priceLabel()} · ${f.models.value} ${plural(Number(f.models.value), ['модель', 'моделі', 'моделей'])}`, 2]
    ];
    const list = $('#review-list');
    list.replaceChildren();
    rows.forEach(([term, value, step]) => {
      const wrap = document.createElement('div');
      wrap.className = 'min-w-0';
      const dt = document.createElement('dt');
      dt.className = 'flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-textMuted dark:text-white/60';
      dt.textContent = term;
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'min-h-[32px] px-2 text-xs font-semibold normal-case tracking-normal text-[#805018] rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-[#E9B879]';
      edit.textContent = 'Змінити';
      edit.setAttribute('aria-label', `Змінити: ${term.toLowerCase()}`);
      edit.addEventListener('click', () => goTo(step));
      dt.append(edit);
      const dd = document.createElement('dd');
      dd.className = 'mt-0.5 text-textMain break-words dark:text-cream';
      dd.textContent = value;
      wrap.append(dt, dd);
      list.append(wrap);
    });
  }

  /* ---------- Події полів ---------- */
  let priceTouched = false;
  form.addEventListener('input', (event) => {
    const key = event.target.name;
    if (key === 'price') priceTouched = true;
    if (rules[key]) recheck(key);
    if (key === 'duration') recheck('times');
    refresh();
    pulsePreview();
    saveDraft();
  });
  form.addEventListener('change', (event) => {
    const key = event.target.name;
    if (key === 'priceType' && !priceTouched) f.price.value = event.target.value === 'paid' ? 200 : 300;
    if (key === 'priceType') recheck('price');
    if (rules[key]) recheck(key);
    if (key === 'duration') recheck('times');
    /* Перетин слотів показуємо одразу, не чекаючи кнопки «Далі» */
    if (key === 'times' || key === 'duration') {
      const message = rules.times();
      if (message.startsWith('Слоти')) showError('times', message);
    }
    refresh();
    saveDraft();
  });
  /* Перевірка поля після виходу з нього, якщо користувач уже щось ввів */
  form.addEventListener('focusout', (event) => {
    const key = event.target.name;
    if (['desc', 'ref', 'address', 'name', 'phone', 'price'].includes(key) && event.target.value) showError(key, rules[key]());
  });

  $$('[data-step-models]').forEach((button) => button.addEventListener('click', () => {
    const next = Math.min(20, Math.max(1, (Number(f.models.value) || 1) + Number(button.dataset.stepModels)));
    f.models.value = next;
    refresh();
    saveDraft();
  }));

  /* ---------- Чернетка ---------- */
  let draftTimer;
  function saveDraft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      try {
        const data = {};
        $$('[name]', form).forEach((el) => {
          if (el.type === 'radio') { if (el.checked) data[el.name] = el.value; }
          else if (el.type === 'checkbox') { (data[el.name] ||= []); if (el.checked) data[el.name].push(el.value); }
          else data[el.name] = el.value;
        });
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, days: [...selected], step: stepIndex, maxReached }));
        $('#draft-status').textContent = `Чернетку збережено о ${new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}`;
      } catch { /* сховище недоступне — працюємо без чернетки */ }
    }, 400);
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const { data, days, step, maxReached: reached } = JSON.parse(raw);
      $$('[name]', form).forEach((el) => {
        if (!(el.name in data)) return;
        if (el.type === 'radio') el.checked = el.value === data[el.name];
        else if (el.type === 'checkbox') el.checked = Array.isArray(data[el.name]) ? data[el.name].includes(el.value) : !!data[el.name];
        else el.value = data[el.name];
      });
      (days || []).filter((d) => inRange(fromIso(d))).forEach((d) => selected.add(d));
      maxReached = Math.min(Number(reached) || 0, steps.length - 1);
      stepIndex = Math.min(Number(step) || 0, maxReached);
      priceTouched = true;
      $('#draft-status').textContent = 'Відновлено збережену чернетку';
    } catch { /* пошкоджена чернетка ігнорується */ }
  }

  function clearForm() {
    form.reset();
    selected.clear();
    maxReached = 0;
    priceTouched = false;
    view = new Date(today.getFullYear(), today.getMonth(), 1);
    focusIso = null;
    Object.keys(rules).forEach((key) => showError(key, ''));
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ігноруємо */ }
    renderCalendar();
    refresh();
    goTo(0);
    $('#draft-status').textContent = '';
  }

  $('#reset-btn').addEventListener('click', () => {
    if (window.confirm('Очистити всі поля заявки? Чернетку буде видалено.')) clearForm();
  });

  /* ---------- Публікація ---------- */
  const dialog = $('#done');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    for (let i = 0; i < steps.length; i += 1) {
      const first = validateStep(i);
      if (first) {
        goTo(i, { focus: false });
        focusTarget(first)?.focus();
        return;
      }
    }
    const record = {
      id: Date.now(),
      serviceType: radio('serviceType'),
      service: f.service.value,
      description: f.desc.value.trim(),
      reference: f.ref.value.trim(),
      requirements: previewTags(),
      days: [...selected].sort(),
      times: times(),
      duration: Number(f.duration.value),
      district: f.district.value,
      address: f.address.value.trim(),
      landmark: f.landmark.value.trim(),
      price: { type: radio('priceType'), amount: radio('priceType') === 'free' ? 0 : Number(f.price.value) },
      models: Number(f.models.value),
      barber: { name: f.name.value.trim(), exp: f.exp.value, phone: f.phone.value.trim(), social: f.social.value.trim() },
      slots: slotsTotal()
    };
    try {
      const all = JSON.parse(localStorage.getItem('bm_requests') || '[]');
      all.push(record);
      localStorage.setItem('bm_requests', JSON.stringify(all));
      localStorage.removeItem(DRAFT_KEY);
    } catch { /* без сховища заявка лише показується */ }
    const n = record.days.length;
    $('#done-text').textContent = `«${record.service}» — ${n} ${plural(n, ['день', 'дні', 'днів'])}, ${record.slots} ${plural(record.slots, ['слот', 'слоти', 'слотів'])}, ${priceLabel().toLowerCase()}. Моделі побачать картку в каталозі й запишуться напряму, а ми нагадаємо про візит за 24 і 2 години.`;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else window.alert($('#done-text').textContent);
  });
  $('#done-close').addEventListener('click', () => { dialog.close(); clearForm(); });

  /* ---------- Старт ---------- */
  loadDraft();
  renderCalendar();
  refresh();
  goTo(stepIndex, { focus: false });
})();
