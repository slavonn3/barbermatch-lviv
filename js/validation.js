/* ==========================================================================
   validation.js — клієнтська валідація форми «Підтримка та скарги» (ЛР №9)
   Сторінка: support.html. Стек: Vanilla JS, без бібліотек.
   Форма демонстраційна: дані нікуди не надсилаються і ніде не зберігаються.
   ========================================================================== */
(() => {
  'use strict';

  const form = document.getElementById('feedbackForm');
  if (!form) return; // на інших сторінках скрипт нічого не робить

  /* ---------- 1. Правила: регулярні вирази й межі довжини ---------- */

  // Літери: латиниця + українська абетка (без ъ, ы, э, ё)
  const LETTERS = 'A-Za-zА-ЩЬЮЯҐЄІЇа-щьюяґєії';
  // Ім’я: слова з літер, розділені одним апострофом (' ’ ʼ), дефісом або пробілом
  const REGEX_NAME = new RegExp(`^[${LETTERS}]+(?:['’ʼ\\- ][${LETTERS}]+)*$`);
  // Дозволені символи імені — щоб відрізнити «цифри/емоджі» від «неправильної будови»
  const REGEX_NAME_CHARS = new RegExp(`^[${LETTERS}'’ʼ\\- ]*$`);
  // Email: локальна частина без крапки на початку/кінці і без «..», домен із зоною 2–24 літери
  const REGEX_EMAIL = /^[A-Za-z0-9_%+-]+(?:\.[A-Za-z0-9_%+-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;
  // Телефон: строго +380 і рівно 9 цифр
  const REGEX_PHONE = /^\+380\d{9}$/;

  const NAME_MIN = 2;
  const NAME_MAX = 50;
  const MESSAGE_MIN = 10;
  const MESSAGE_MAX = 1000;
  const PHONE_LENGTH = 13; // «+380» + 9 цифр
  const TOPICS = ['booking', 'complaint', 'partnership', 'technical', 'other'];
  const NOTE_TIMEOUT = 4000; // скільки показувати пояснення нормалізації телефону, мс
  const SUBMIT_DELAY = 600;  // імітація перевірки перед модалкою, мс

  // Усі тексти помилок в одному місці
  const MESSAGES = {
    nameEmpty: 'Вкажіть ім’я.',
    nameShape: 'Мінімум 2 літери; можна апостроф, дефіс і пробіл.',
    nameChars: 'Ім’я не може містити цифри чи інші символи.',
    emailEmpty: 'Вкажіть email.',
    emailFormat: 'Перевірте формат: name@gmail.com.',
    phoneEmpty: 'Вкажіть номер телефону.',
    phoneFormat: 'Формат: +380 і 9 цифр, наприклад +380501234567.',
    topicEmpty: 'Оберіть тему звернення.',
    messageEmpty: 'Опишіть ваше питання.',
    messageShort: (count) => `Ще трохи деталей: мінімум ${MESSAGE_MIN} символів (зараз ${count}).`,
    agreement: 'Підтвердьте згоду з політикою конфіденційності.'
  };

  // Пояснення до кожної зміни, яку робить normalizePhone()
  const PHONE_NOTES = {
    separators: 'Прибрали пробіли, дужки й дефіси.',
    letters: 'У номері можуть бути лише цифри.',
    country: 'Додали код України +38.',
    plus: 'Додали “+” на початку.',
    trimmed: 'Номер обрізано до 13 символів.'
  };

  /* ---------- 2. DOM ---------- */

  const fields = {
    name: form.elements.namedItem('name'),
    email: form.elements.namedItem('email'),
    phone: form.elements.namedItem('phone'),
    topic: form.elements.namedItem('topic'),
    message: form.elements.namedItem('message'),
    agreement: form.elements.namedItem('agreement')
  };
  const fieldList = Object.values(fields);
  const submitButton = document.getElementById('fbSubmit');
  const statusBox = document.getElementById('fbStatus');
  const counter = document.getElementById('fbMessageCounter');
  const phoneHint = document.getElementById('fbPhoneHint');
  const phoneHintText = phoneHint ? phoneHint.textContent : '';
  const modal = document.getElementById('successModal');
  const modalName = document.getElementById('successName');
  const modalClose = document.getElementById('successClose');
  const complaintContext = document.getElementById('complaintContext');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Стан взаємодії: touched — поле вже «перевіряється»; dirty — у полі щось вводили
  const touched = new WeakSet();
  const dirty = new WeakSet();

  // «1 поле», «2 поля», «5 полів» — українська множина
  function pluralFields(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return 'поле';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'поля';
    return 'полів';
  }

  /* ---------- 3. Валідатори: повертають true або рядок помилки ---------- */

  function validateName(value) {
    const name = value.trim().normalize('NFC');
    if (name === '') return MESSAGES.nameEmpty;
    if (!REGEX_NAME_CHARS.test(name)) return MESSAGES.nameChars;
    if (name.length < NAME_MIN || name.length > NAME_MAX || !REGEX_NAME.test(name)) return MESSAGES.nameShape;
    return true;
  }

  function validateEmail(value) {
    const email = value.trim();
    if (email === '') return MESSAGES.emailEmpty;
    return REGEX_EMAIL.test(email) || MESSAGES.emailFormat;
  }

  function validatePhone(value) {
    const phone = value.trim();
    if (phone === '') return MESSAGES.phoneEmpty;
    return REGEX_PHONE.test(phone) || MESSAGES.phoneFormat;
  }

  function validateTopic(value) {
    return TOPICS.includes(value) || MESSAGES.topicEmpty;
  }

  let prefillText = ''; // текст, підставлений з URL (скарга на барбера)

  function validateMessage(value) {
    let text = value.trim();
    // Аудит: передзаповнений рядок сам по собі вже мав > 10 символів, і форму можна було
    // «надіслати», нічого не описавши. Рахуємо лише те, що дописав користувач.
    if (prefillText && text.startsWith(prefillText)) text = text.slice(prefillText.length).trim();
    if (text === '') return MESSAGES.messageEmpty;
    const length = [...text].length; // кодові точки: емоджі рахується як 1 символ
    return length >= MESSAGE_MIN || MESSAGES.messageShort(length);
  }

  function validateAgreement(checked) {
    return checked || MESSAGES.agreement;
  }

  // Який валідатор відповідає якому полю
  const validators = new Map([
    [fields.name, () => validateName(fields.name.value)],
    [fields.email, () => validateEmail(fields.email.value)],
    [fields.phone, () => validatePhone(fields.phone.value)],
    [fields.topic, () => validateTopic(fields.topic.value)],
    [fields.message, () => validateMessage(fields.message.value)],
    [fields.agreement, () => validateAgreement(fields.agreement.checked)]
  ]);

  /* ---------- 4. UI-функції: лише змінюють вигляд і ARIA ---------- */

  // Набори класів Tailwind для станів (повні рядки — щоб Tailwind CDN їх згенерував)
  const STATE_CLASSES = {
    // hover-рамка лише в normal: інакше при наведенні червона/зелена рамка ставала сірою
    normal: ['border', 'px-3', 'border-borderField', 'bg-white', 'hover:border-textMuted', 'dark:border-white/45', 'dark:hover:border-white/70'],
    error: ['border-2', 'px-[11px]', 'border-danger', 'bg-[#FDF4F2]', 'dark:border-dangerSoft'],
    success: ['border', 'px-3', 'border-success', 'bg-white', 'dark:border-successSoft']
  };
  const CHECK_CLASSES = {
    error: ['outline', 'outline-2', 'outline-offset-2', 'outline-danger', 'dark:outline-dangerSoft']
  };
  const ALL_STATE_CLASSES = [...new Set(Object.values(STATE_CLASSES).flat())];

  const errorElement = (field) => document.getElementById(`${field.id}Error`);
  const iconElement = (field) => field.parentElement.querySelector('.fb-icon');

  function setState(field, state) {
    if (field.type === 'checkbox') {
      CHECK_CLASSES.error.forEach((name) => field.classList.toggle(name, state === 'error'));
      return;
    }
    field.classList.remove(...ALL_STATE_CLASSES);
    field.classList.add(...STATE_CLASSES[state]);
    const icon = iconElement(field);
    if (icon) icon.classList.toggle('hidden', state !== 'success');
  }

  function showError(field, message) {
    setState(field, 'error');
    field.setAttribute('aria-invalid', 'true');
    const box = errorElement(field);
    const mark = document.createElement('span');
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '✕ ';
    box.replaceChildren(mark, document.createTextNode(message)); // лише текстові вузли, без innerHTML
  }

  function showSuccess(field) {
    setState(field, 'success');
    field.setAttribute('aria-invalid', 'false');
    errorElement(field).replaceChildren();
  }

  function clearError(field) {
    setState(field, 'normal');
    field.setAttribute('aria-invalid', 'false');
    errorElement(field).replaceChildren();
  }

  /* ---------- 5. Телефон: нормалізація введення (UX-шар, правило RegEx не змінюється) ---------- */

  /**
   * Чиста функція без DOM. Повертає { value, changes[] }.
   * options.deleting — користувач видаляє символи: тоді нічого не підставляємо.
   */
  function normalizePhone(raw, options = {}) {
    const changes = [];
    let value = String(raw);
    if (value === '') return { value, changes };

    // 1) Пробіли (включно з нерозривними), дужки й дефіси
    const withoutSeparators = value.replace(/[\s()-]/g, '');
    if (withoutSeparators !== value) changes.push('separators');
    value = withoutSeparators;

    // 2) «+» дозволений лише першим символом, далі — тільки цифри
    const hasPlus = value.startsWith('+');
    const cleaned = (hasPlus ? '+' : '') + value.replace(/\D/g, '');
    if (cleaned !== value) changes.push('letters');
    value = cleaned;

    // 3) Код країни — тільки коли користувач друкує або вставляє, а не видаляє
    if (!options.deleting && !hasPlus) {
      if (value.startsWith('0')) {
        value = `+38${value}`;
        changes.push('country');
      } else if (value.startsWith('380')) {
        value = `+${value}`;
        changes.push('plus');
      }
    }

    // 4) Довжина: «+380» + 9 цифр
    if (value.length > PHONE_LENGTH) {
      value = value.slice(0, PHONE_LENGTH);
      changes.push('trimmed');
    }
    return { value, changes };
  }

  /* maxlength="13" у HTML лишається для роботи без JS. Але браузер обрізає вставлений
     текст ДО події input: «+380 50 123 45 67» перетворювався на «+380 50 123 4».
     Тому з JS дозволяємо до 20 символів (вистачає на «+38 (050) 123-45-67»),
     а до 13 обрізає normalizePhone() — з поясненням користувачу. */
  const PHONE_RAW_MAX = 20;
  fields.phone.maxLength = PHONE_RAW_MAX;

  let noteTimer = 0;
  function showPhoneNote(changes) {
    if (!phoneHint || changes.length === 0) return;
    phoneHint.textContent = changes.map((change) => PHONE_NOTES[change]).join(' ');
    window.clearTimeout(noteTimer);
    noteTimer = window.setTimeout(restorePhoneHint, NOTE_TIMEOUT);
  }

  function restorePhoneHint() {
    if (!phoneHint) return;
    window.clearTimeout(noteTimer);
    // Повернення стандартної підказки не озвучуємо: на мить вимикаємо live-регіон
    phoneHint.setAttribute('aria-live', 'off');
    phoneHint.textContent = phoneHintText;
    window.setTimeout(() => phoneHint.setAttribute('aria-live', 'polite'), 100);
  }

  function applyPhoneNormalization(event) {
    const input = fields.phone;
    const before = input.value;
    const caret = input.selectionStart ?? before.length;
    const deleting = Boolean(event && event.inputType && event.inputType.startsWith('delete'));
    const { value, changes } = normalizePhone(before, { deleting });
    if (value === before) return; // переписуємо поле, лише якщо значення реально змінилося

    input.value = value;
    // Курсор: у кінець, якщо друкували в кінці; інакше — та сама позиція з поправкою
    const nextCaret = caret >= before.length
      ? value.length
      : Math.min(normalizePhone(before.slice(0, caret), { deleting }).value.length, value.length);
    input.setSelectionRange(nextCaret, nextCaret);
    showPhoneNote(changes);
  }

  /* ---------- 6. Перевірка полів ---------- */

  // Викликає валідатор поля і оновлює UI; повертає boolean
  function validateField(field) {
    const result = validators.get(field)();
    if (result === true) showSuccess(field);
    else showError(field, result);
    refreshStatus();
    return result === true;
  }

  // Аудит: після невдалого submit підсумок «Перевірте N полів» лишався застарілим,
  // навіть коли все виправлено. Тепер лічильник оновлюється, а при 0 — зникає.
  let statusActive = false;
  function refreshStatus() {
    if (!statusActive) return;
    const count = fieldList.filter((item) => item.getAttribute('aria-invalid') === 'true').length;
    statusBox.textContent = count > 0 ? `Перевірте ${count} ${pluralFields(count)} з помилками.` : '';
    if (count === 0) statusActive = false;
  }

  // Перевіряє всі поля; повертає масив невалідних у порядку форми
  function validateAll() {
    return fieldList.filter((field) => !validateField(field));
  }

  const isEmpty = (field) => (field.type === 'checkbox' ? !field.checked : field.value.trim() === '');

  function updateCounter() {
    counter.textContent = `${fields.message.value.length} / ${MESSAGE_MAX}`;
  }

  /* ---------- 7. Передзаповнення з URL (скарга з профілю барбера) ---------- */

  function prefillFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get('topic');
    if (!topic || !TOPICS.includes(topic)) return; // білий список тем

    fields.topic.value = topic;
    if (topic !== 'complaint') return;

    // barber — лише ціле число, що є ключем BARBERS з js/app.js
    const barberId = params.get('barber');
    const barbers = typeof BARBERS === 'object' && BARBERS !== null ? BARBERS : null;
    if (!barbers || !barberId || !/^\d{1,3}$/.test(barberId)
      || !Object.prototype.hasOwnProperty.call(barbers, barberId)) return;

    const barber = barbers[barberId];
    fields.message.value = `Скарга на барбера: ${barber.name} (${barber.shop}).\n\n`;
    prefillText = fields.message.value.trim();
    updateCounter();

    if (complaintContext) {
      document.getElementById('complaintBarber').textContent = barber.name;
      document.getElementById('complaintBack').href = `barber.html?id=${barberId}`;
      complaintContext.classList.remove('hidden');
    }

    // Курсор у кінець передзаповненого тексту при першому фокусі
    fields.message.addEventListener('focus', () => {
      const end = fields.message.value.length;
      fields.message.setSelectionRange(end, end);
    }, { once: true });
  }

  /* ---------- 8. Модальне вікно ---------- */

  function openModal(name) {
    if (!modal || typeof modal.showModal !== 'function') {
      // Запасний варіант без <dialog>: повідомлення в live-регіоні, без alert()
      statusBox.textContent = `Дякуємо, ${name}! Форма успішно пройшла клієнтську валідацію. Демонстрація успішного надсилання.`;
      submitButton.focus();
      return;
    }
    modalName.textContent = name; // лише textContent — ім’я ніколи не рендериться як HTML
    document.body.classList.add('overflow-hidden');
    modal.showModal();
    modalClose.focus();
  }

  if (modal) {
    modalClose.addEventListener('click', () => modal.close());
    // Клік по затемненому фону: target — сам <dialog>; клік по картці має target усередині
    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal.close();
    });
    // Escape закриває нативно (подія cancel → close)
    modal.addEventListener('close', () => {
      document.body.classList.remove('overflow-hidden');
      submitButton.focus();
    });
  }

  /* ---------- 9. Обробники подій ---------- */

  fieldList.forEach((field) => {
    const isChoice = field.tagName === 'SELECT' || field.type === 'checkbox';

    if (!isChoice) {
      field.addEventListener('input', (event) => {
        if (field === fields.phone) applyPhoneNormalization(event);
        if (field === fields.message) updateCounter();
        dirty.add(field);
        // До першого blur помилок не показуємо; після — живе оновлення
        if (touched.has(field)) validateField(field);
      });
    }

    field.addEventListener(isChoice ? 'change' : 'blur', () => {
      // Порожнє поле, яке лише пройшли Tab-ом, не підсвічуємо червоним
      if (!isChoice && isEmpty(field) && !dirty.has(field)) return;
      touched.add(field);
      validateField(field);
    });

    if (field.tagName === 'SELECT') {
      field.addEventListener('blur', () => {
        if (touched.has(field)) validateField(field);
      });
    }
  });

  let isSubmitting = false;

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // без бекенду: сторінка не перезавантажується
    if (isSubmitting) return; // захист від подвійного натискання

    fieldList.forEach((field) => { touched.add(field); dirty.add(field); });
    statusActive = false; // validateAll() не чіпає підсумок — формуємо його нижче
    const invalid = validateAll();

    if (invalid.length > 0) {
      statusActive = true;
      statusBox.textContent = `Перевірте ${invalid.length} ${pluralFields(invalid.length)} з помилками.`;
      const first = invalid[0];
      first.focus({ preventScroll: true });
      first.scrollIntoView({ block: 'center', behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
      return;
    }

    isSubmitting = true;
    statusBox.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'Перевіряємо…';
    const name = fields.name.value.trim();

    window.setTimeout(() => {
      form.reset();
      fieldList.forEach((field) => {
        clearError(field);
        touched.delete(field);
        dirty.delete(field);
      });
      updateCounter();
      restorePhoneHint();
      prefillText = '';
      if (complaintContext) complaintContext.classList.add('hidden');
      submitButton.disabled = false;
      submitButton.textContent = 'Надіслати';
      isSubmitting = false;
      openModal(name);
    }, SUBMIT_DELAY);
  });

  prefillFromUrl();
  updateCounter();
})();
