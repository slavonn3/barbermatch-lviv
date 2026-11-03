const DISTRICTS = ['Сихів', 'Центр', 'Личаківський', 'Франківський', 'Шевченківський', 'Залізничний'];
const PRICES = {
  free: 'Безкоштовно',
  supplies: 'Розхідники · 300 ₴',
  paid: 'Доплата моделі · +200 ₴'
};

const PHOTO_DIR = 'assets/images/barbers/';

const BARBERS = {
  1: {
    name: 'Андрій Коваль', shortName: 'Андрій К.', gender: 'Верифікований', level: 'початківець',
    district: 'Сихів', shop: 'Barbershop «Сихів Cut»', address: 'вул. Хоткевича, 12, Львів', videoId: 'spKKeXbLt3s',
    experience: '1,5 року практики', schedule: 'Пн–Пт · 17:00–21:00', joined: 'червня 2026', cuts: 18, attendance: 100, reliability: 96,
    photos: {
      portrait: `${PHOTO_DIR}andrii-portrait.jpg`, workplace: `${PHOTO_DIR}andrii-workplace.jpg`,
      before: `${PHOTO_DIR}andrii-before.jpg`, after: `${PHOTO_DIR}andrii-after.jpg`,
      focus: '45%', caption: 'текстурна стрижка замість важкого чубчика'
    },
    bio: 'Другий рік у барберингу: закінчив курси у Львові й тепер щотижня практикуюсь на моделях. Найбільше люблю текстурні стрижки на середнє волосся — коли прибираєш зайву вагу, і волосся саме лягає без укладки. Часто працюю з підлітками та студентами, які хочуть піти від «шапки» на голові до живої форми. Працюю у затишному барбершопі на Сихові, інструмент дезінфікую перед кожним клієнтом.',
    specialties: ['Текстурні стрижки', 'Середнє волосся', 'Молодіжні образи', 'Фейд', 'Борода'],
    slots: [
      { price: 'free', district: 'Сихів', time: 'Сьогодні, 18:30', datetime: '2026-10-21T18:30', tags: ['Середнє волосся', 'Текстурна стрижка'] },
      { price: 'free', district: 'Сихів', time: 'Завтра, 19:00', datetime: '2026-10-22T19:00', tags: ['Коротке волосся', 'Фейд'] },
      { price: 'supplies', district: 'Сихів', time: 'П’ятниця, 17:30', datetime: '2026-10-23T17:30', tags: ['Борода'] }
    ],
    works: [
      { title: 'Текстурна стрижка', date: '14 жовтня 2026', datetime: '2026-10-14', tag: 'Середнє волосся', photos: true, description: 'Прибрали важкий чубчик «під горщик», зняли вагу з потилиці та скронь і додали рвану текстуру зверху. Тепер волосся тримає форму без засобів.' },
      { title: 'Низький фейд', date: '2 жовтня 2026', datetime: '2026-10-02', tag: 'Коротке волосся', description: 'Плавний перехід від нуля біля вух, верх ножицями з легкою текстурою.' },
      { title: 'Оформлення бороди', date: '21 вересня 2026', datetime: '2026-09-21', tag: 'Борода', description: 'Вирівняли довжину й зробили чіткий контур щоки та шиї.' },
      { title: 'Кроп із чубчиком', date: '9 вересня 2026', datetime: '2026-09-09', tag: 'Коротке волосся', description: 'Короткий текстурний кроп з рівним чубчиком — одна з перших робіт у портфоліо.' }
    ],
    reviews: [
      { author: 'Максим Т.', date: '16 жовтня 2026', datetime: '2026-10-16', rating: 5, price: 'free', text: 'Прийшов із важкою «шапкою» волосся, пішов з нормальною стрижкою. Андрій показав на фото, що хоче зробити, і результат вийшов саме такий.' },
      { author: 'Денис Р.', date: '5 жовтня 2026', datetime: '2026-10-05', rating: 5, price: 'free', text: 'Прийшов вчасно, все чисто, інструмент продезінфікований. Стрижка тримається вже другий тиждень.' },
      { author: 'Олексій П.', date: '27 вересня 2026', datetime: '2026-09-27', rating: 4, price: 'free', text: 'Результат гарний, але вийшло трохи довше, ніж обіцяли. Для початківця — дуже якісно.' },
      { author: 'Тарас В.', date: '18 вересня 2026', datetime: '2026-09-18', rating: 5, price: 'supplies', text: 'Розхідники оплатив окремо — це чесно. Андрій відповідально підійшов до бороди.' },
      { author: 'Іван С.', date: '8 вересня 2026', datetime: '2026-09-08', rating: 5, price: 'free', text: 'Нагадування прийшло вчасно, майстер на місці. Приємна атмосфера в барбершопі.' },
      { author: 'Роман Г.', date: '29 серпня 2026', datetime: '2026-08-29', rating: 5, price: 'free', text: 'Один з моїх перших візитів через платформу. Все так, як у портфоліо.' }
    ]
  },
  2: {
    name: 'Олег Мельник', shortName: 'Олег М.', gender: 'Верифікований', level: 'початківець',
    district: 'Центр', shop: 'Barbershop «Рівень»', address: 'вул. Дорошенка, 24, Львів', videoId: 'RR8T4kH4tAM', videoQuery: '?si=9CT8mUm0OkWPpQw2',
    experience: '1 рік практики', schedule: 'Вт–Сб · 11:00–19:00', joined: 'липня 2026', cuts: 14, attendance: 93, reliability: 92,
    photos: {
      /* Портрет: Antoni Shkraba / Pexels (Pexels License, безкоштовне використання) */
      portrait: `${PHOTO_DIR}oleh-portrait.jpg`, workplace: `${PHOTO_DIR}oleh-workplace.jpg`,
      before: `${PHOTO_DIR}oleh-before.jpg`, after: `${PHOTO_DIR}oleh-after.jpg`,
      focus: '35%', caption: 'фейд із текстурою замість відрослих кучерів'
    },
    bio: 'Барбер зі Львова, рік практики, фанат важкої музики й чистих переходів. Моя тема — фейди та борода: беру відросле волосся й неохайну бороду і збираю з них цілісний образ, де стрижка й борода працюють разом. Перед роботою показую на фото кілька варіантів довжини, після — пояснюю, як підтримувати форму вдома. Шукаю моделей із густою бородою або відрослим волоссям, які давно хочуть змін. Поки беру символічну плату лише за розхідники.',
    specialties: ['Фейд', 'Густа борода', 'Класичні стрижки', 'Кроп', 'Укладка'],
    slots: [
      { price: 'supplies', district: 'Центр', time: 'Завтра, 12:00', datetime: '2026-10-22T12:00', tags: ['Кучеряве волосся від 10 см', 'Густа борода'] },
      { price: 'supplies', district: 'Центр', time: 'П’ятниця, 14:00', datetime: '2026-10-23T14:00', tags: ['Коротке волосся', 'Фейд'] },
      { price: 'free', district: 'Центр', time: 'Субота, 11:30', datetime: '2026-10-24T11:30', tags: ['Середнє волосся', 'Борода'] }
    ],
    works: [
      { title: 'Фейд із текстурою', date: '12 жовтня 2026', datetime: '2026-10-12', tag: 'Кучеряве волосся від 10 см', photos: true, description: 'Відрослі кучері зібрали в середній фейд із текстурним верхом, бороду вкоротили й зробили чіткий контур на щоках — образ став охайним, а кучері лишилися живими.' },
      { title: 'Стрижка на кучерях', date: '30 вересня 2026', datetime: '2026-09-30', tag: 'Кучеряве волосся від 10 см', description: 'Форма за типом обличчя, знятий зайвий об’єм з боків, збережена природна текстура.' },
      { title: 'Класична стрижка', date: '15 вересня 2026', datetime: '2026-09-15', tag: 'Коротке волосся', description: 'Класика з акуратним переходом і проділом, виконана приблизно за годину.' },
      { title: 'Стрижка + укладка', date: '1 вересня 2026', datetime: '2026-09-01', tag: 'Середнє волосся', description: 'Стрижка та укладка засобом на глиняній основі, пояснив, як повторити вдома.' }
    ],
    reviews: [
      { author: 'Віктор Д.', date: '15 жовтня 2026', datetime: '2026-10-15', rating: 5, price: 'supplies', text: 'Прийшов оброслим, з бородою «як вийде». Олег зробив фейд і контур бороди — тепер не впізнають на роботі, і це комплімент.' },
      { author: 'Назар К.', date: '3 жовтня 2026', datetime: '2026-10-03', rating: 5, price: 'supplies', text: 'Нарешті майстер, який вміє працювати з кучерями. Пояснив, як укладати волосся вдома.' },
      { author: 'Павло С.', date: '19 вересня 2026', datetime: '2026-09-19', rating: 4, price: 'free', text: 'Уважний майстер і приємне місце. Трохи затягнули за часом, але результат хороший.' },
      { author: 'Михайло Б.', date: '2 вересня 2026', datetime: '2026-09-02', rating: 5, price: 'supplies', text: 'Працює акуратно, бороду оформив так, що вперше не хочеться її збривати.' }
    ]
  },
  3: {
    name: 'Марта Лисенко', shortName: 'Марта Л.', gender: 'Верифікована', level: 'початківиця',
    district: 'Личаківський', shop: 'Студія «Лінія»', address: 'вул. Личаківська, 58, Львів', videoId: 'gSQPQR1RKK8',
    experience: '10 місяців практики', schedule: 'Ср–Нд · 12:00–20:00', joined: 'серпня 2026', cuts: 21, attendance: 98, reliability: 98,
    photos: {
      portrait: `${PHOTO_DIR}marta-portrait.jpg`, workplace: `${PHOTO_DIR}marta-workplace.jpg`,
      before: `${PHOTO_DIR}marta-before.jpg`, after: `${PHOTO_DIR}marta-after.jpg`,
      focus: '40%', caption: 'каре зі шторками з відрослого волосся'
    },
    bio: 'Майстриня зі світлої студії на Личакові. Спеціалізуюся на коротких формах: каре, боб, шторки та м’які унісекс-стрижки, які легко носити щодня. Перед роботою завжди обговорюю форму обличчя й те, скільки часу ви готові приділяти укладці. Зараз збираю портфоліо, тому запрошую моделей із волоссям до плечей і нижче — і навіть доплачую за готовність до змін.',
    specialties: ['Каре', 'Шторки', 'Короткі форми', 'Унісекс-стрижки', 'Догляд за волоссям'],
    slots: [
      { price: 'paid', district: 'Личаківський', time: 'П’ятниця, 16:00', datetime: '2026-10-23T16:00', tags: ['Коротке волосся', 'Каре'] },
      { price: 'free', district: 'Личаківський', time: 'Субота, 13:00', datetime: '2026-10-24T13:00', tags: ['Середнє волосся', 'Шторки'] },
      { price: 'paid', district: 'Личаківський', time: 'Неділя, 15:30', datetime: '2026-10-25T15:30', tags: ['Середнє волосся'] }
    ],
    works: [
      { title: 'Каре зі шторками', date: '17 жовтня 2026', datetime: '2026-10-17', tag: 'Середнє волосся', photos: true, description: 'Відросле волосся перетворили на рівне каре до підборіддя з м’якими шторками, які відкривають обличчя.' },
      { title: 'Подовжений боб', date: '4 жовтня 2026', datetime: '2026-10-04', tag: 'Коротке волосся', description: 'Легка асиметрія та філірування кінчиків — форма тримається без фена.' },
      { title: 'Шторки на довге волосся', date: '20 вересня 2026', datetime: '2026-09-20', tag: 'Середнє волосся', description: 'Довжину зберегли, оновили лише обличчя: шторки й легкі пасма біля вилиць.' },
      { title: 'М’яка унісекс-стрижка', date: '6 вересня 2026', datetime: '2026-09-06', tag: 'Коротке волосся', description: 'Плавний перехід і легка текстура зверху для невимушеного образу.' }
    ],
    reviews: [
      { author: 'Софія Т.', date: '18 жовтня 2026', datetime: '2026-10-18', rating: 5, price: 'paid', text: 'Давно хотіла каре, але боялася. Марта підібрала довжину під моє обличчя — тепер укладаюся за п’ять хвилин.' },
      { author: 'Остап М.', date: '8 жовтня 2026', datetime: '2026-10-08', rating: 5, price: 'free', text: 'Охайна робота та приємна атмосфера у світлій студії. Дякую за стрижку!' },
      { author: 'Олена В.', date: '25 вересня 2026', datetime: '2026-09-25', rating: 4, price: 'paid', text: 'Гарний результат, Марта показала кілька варіантів шторок перед початком. Трохи довго, але воно того варте.' }
    ]
  }
};

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

function fillDistrictOptions() {
  document.querySelectorAll('#filterDistrict, #regDistrict').forEach((select) => {
    DISTRICTS.forEach((district) => {
      const option = document.createElement('option');
      option.value = district;
      option.textContent = district;
      select.append(option);
    });
  });
}

function initializeThemeToggle() {
  const themeButton = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="color-scheme"]');
  if (!themeButton || !themeMeta) return;

  const root = document.documentElement;
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('barbermatch-theme'); } catch { /* сховище недоступне */ }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.dataset.theme = isDark ? 'dark' : 'light';
    themeMeta.content = isDark ? 'dark' : 'light';
    themeButton.setAttribute('aria-label', isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');
    themeButton.setAttribute('aria-pressed', String(isDark));
    themeButton.title = isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему';
    themeButton.querySelector('span').textContent = isDark ? '☀️' : '🌙';
  }

  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
  themeButton.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem('barbermatch-theme', nextTheme); } catch { /* сховище недоступне */ }
  });
}

function initializeMobileMenu() {
  const toggle = document.querySelector('#mobileMenuBtn');
  const menu = document.querySelector('#mobileMenu');
  if (!toggle || !menu) return;

  const closeMenu = () => {
    toggle.dataset.mobileMenuOpen = 'false';
    menu.dataset.mobileMenuOpen = 'false';
    menu.classList.remove('pointer-events-auto', 'translate-y-0', 'opacity-100', 'max-h-[32rem]');
    menu.classList.add('pointer-events-none', '-translate-y-2', 'opacity-0', 'max-h-0');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Відкрити меню');
    toggle.querySelector('span').textContent = '☰';
    menu.setAttribute('aria-hidden', 'true');
    menu.inert = true;
  };

  menu.inert = true;
  toggle.addEventListener('click', () => {
    const isOpen = toggle.dataset.mobileMenuOpen === 'true';
    if (isOpen) {
      closeMenu();
      return;
    }

    toggle.dataset.mobileMenuOpen = 'true';
    menu.dataset.mobileMenuOpen = 'true';
    menu.classList.remove('pointer-events-none', '-translate-y-2', 'opacity-0', 'max-h-0');
    menu.classList.add('pointer-events-auto', 'translate-y-0', 'opacity-100', 'max-h-[32rem]');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Закрити меню');
    toggle.querySelector('span').textContent = '✕';
    menu.setAttribute('aria-hidden', 'false');
    menu.inert = false;
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a') || event.target.closest('[data-role]')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  document.querySelectorAll('[data-district-accordion]').forEach((button) => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const list = document.getElementById(button.getAttribute('aria-controls'));
      button.setAttribute('aria-expanded', String(!isExpanded));
      list.classList.toggle('hidden', isExpanded);
    });
  });

  /* Повне меню з’являється з xl (1280px) — на цій ширині бургер закриваємо */
  window.matchMedia('(min-width: 1280px)').addEventListener('change', closeMenu);
}

function initializeDistrictNavigation() {
  document.addEventListener('click', (event) => {
    /* Лише посилання районів: картки слотів теж мають data-district, і клік по слайдеру
       чи «Профіль барбера» раніше вмикав фільтр та скасовував перехід */
    const link = event.target.closest('a[data-district]');
    if (!link) return;
    const district = link.dataset.district;
    const filter = document.querySelector('#filterDistrict');
    if (filter) {
      event.preventDefault();
      filter.value = district;
      filter.dispatchEvent(new Event('change', { bubbles: true }));
      const dropdown = link.closest('[data-district-dropdown]');
      if (dropdown) {
        dropdown.querySelector('button').setAttribute('aria-expanded', 'false');
        dropdown.dataset.dropdownOpen = 'false';
      }
      document.querySelector('#slots').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    event.preventDefault();
    const destination = new URL('index.html', window.location.href);
    destination.searchParams.set('district', district);
    destination.hash = 'slots';
    window.location.assign(destination);
  });

  const dropdown = document.querySelector('[data-district-dropdown]');
  if (!dropdown) return;
  const button = dropdown.querySelector('button');
  dropdown.dataset.dropdownOpen = 'false';

  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    dropdown.dataset.dropdownOpen = String(!isExpanded);
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) {
      button.setAttribute('aria-expanded', 'false');
      dropdown.dataset.dropdownOpen = 'false';
    }
  });

  dropdown.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      button.setAttribute('aria-expanded', 'false');
      dropdown.dataset.dropdownOpen = 'false';
      button.focus();
      return;
    }
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const links = [...dropdown.querySelectorAll('a')];
    const focusedIndex = links.indexOf(target.closest('a'));
    if ((target.closest('button') === button && event.key === 'ArrowDown') || (focusedIndex === -1 && event.key === 'ArrowDown')) {
      event.preventDefault();
      button.setAttribute('aria-expanded', 'true');
      dropdown.dataset.dropdownOpen = 'true';
      window.setTimeout(() => {
        if (button.getAttribute('aria-expanded') === 'true') links[0].focus();
      }, 50);
    } else if (focusedIndex >= 0 && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      const offset = event.key === 'ArrowDown' ? 1 : -1;
      links[(focusedIndex + offset + links.length) % links.length].focus();
    }
  });
}

function initializeRoleSwitches() {
  const roleButtons = document.querySelectorAll('[data-role]');
  const roleInputs = document.querySelectorAll('input[name="accountRole"]');
  const hairSelect = document.querySelector('#regHair');
  const hairLabel = document.querySelector('#regHairLabel');

  function setRole(role) {
    roleButtons.forEach((button) => {
      const active = button.dataset.role === role;
      button.classList.toggle('is-active', active);
      button.classList.toggle('bg-primary', active);
      button.classList.toggle('text-cream', active);
      if (button.closest('header')) {
        /* Світла шапка: неактивна кнопка лишається темним текстом на кремовому */
        button.classList.toggle('text-textMain', !active);
        button.classList.toggle('hover:bg-creamMuted', !active);
      } else {
        /* Темна панель «Швидкий підбір» */
        button.classList.toggle('text-[#E2D9C8]', !active);
        button.classList.toggle('border-white/20', !active);
        button.classList.toggle('hover:bg-white/10', !active);
      }
      button.setAttribute('aria-pressed', String(active));
    });
    roleInputs.forEach((input) => {
      input.checked = input.value === role;
    });
    if (hairSelect && hairLabel) {
      const options = role === 'barber'
        ? [
            ['beginner', 'Початківець (до 1 року)'],
            ['practicing', 'Практикуючий (1–2 роки)'],
            ['advanced', 'Підвищення кваліфікації']
          ]
        : [
            ['short', 'Коротке'],
            ['medium', 'Середнє'],
            ['long', 'Довге'],
            ['curly', 'Кучеряве'],
            ['beard', 'Густа борода']
          ];
      hairLabel.textContent = role === 'barber' ? 'Рівень практики барбера' : 'Тип волосся';
      hairSelect.replaceChildren(new Option('Оберіть варіант', ''));
      options.forEach(([value, label]) => hairSelect.add(new Option(label, value)));
      hairSelect.value = '';
      hairSelect.classList.remove('is-valid', 'is-invalid');
      hairSelect.removeAttribute('aria-invalid');
      document.querySelector('#hairMessage').textContent = '';
    }
  }

  roleButtons.forEach((button) => {
    button.addEventListener('click', () => setRole(button.dataset.role));
  });
  roleInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (input.checked) setRole(input.value);
    });
  });
  const defaultRole = document.body.dataset.page === 'create' ? 'barber' : 'model';
  setRole(document.querySelector('input[name="accountRole"]:checked')?.value || defaultRole);
}

function initializeSlotFilters() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.request-button');
    if (!button || button.disabled) return;
    button.textContent = 'Запит надіслано';
    button.classList.add('is-sent');
    button.disabled = true;
    button.setAttribute('aria-label', 'Запит на слот надіслано');
  });

  const form = document.querySelector('#slotsFilter');
  if (!form) return;

  const slotContainer = document.querySelector('#slotCards');
  if (!slotContainer) return;
  const homeSlots = Object.entries(BARBERS).flatMap(([id, barber]) =>
    barber.slots.slice(0, 1).map((slot) => ({ id, barber, slot }))
  );
  slotContainer.innerHTML = homeSlots.map(({ id, barber, slot }) => slotCardTemplate(slot, id, barber)).join('');
  const cards = [...slotContainer.querySelectorAll('.slot-card')];

  const emptyMessage = document.querySelector('#slotsEmpty');
  const fields = {
    price: form.querySelector('[name="price"]:checked')?.value || '',
    district: '',
    date: '',
    hair: '',
    beard: '',
    level: ''
  };
  let selectedDistricts = null;
  let selectedServices = null;

  function applyFilters() {
    let visibleCount = 0;
    cards.forEach((card) => {
      const districtMatches = selectedDistricts
        ? selectedDistricts.length === 0 || selectedDistricts.includes(card.dataset.district)
        : !fields.district || card.dataset.district === fields.district;
      const serviceMatches = !selectedServices || selectedServices.every((service) => {
        if (service === 'hair') return Boolean(card.dataset.hair);
        if (service === 'beard') return Boolean(card.dataset.beard);
        if (service === 'combo') return Boolean(card.dataset.hair && card.dataset.beard);
        return true;
      });
      const matches = districtMatches && serviceMatches && Object.entries(fields)
        .filter(([key]) => key !== 'district')
        .every(([key, value]) => !value || card.dataset[key] === value);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    emptyMessage.hidden = visibleCount !== 0;
  }

  form.addEventListener('change', (event) => {
    selectedDistricts = null;
    selectedServices = null;
    if (event.target.name === 'price') {
      fields.price = event.target.value;
    } else if (Object.hasOwn(fields, event.target.name)) {
      fields[event.target.name] = event.target.value;
      if (event.target.name === 'district') selectedDistricts = null;
    }
    applyFilters();
  });
  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      Object.keys(fields).forEach((key) => { fields[key] = ''; });
      selectedDistricts = null;
      selectedServices = null;
      applyFilters();
    });
  });

  form._applyMatchFilters = (values) => {
    const price = form.querySelector(`[name="price"][value="${CSS.escape(values.price || '')}"]`);
    if (price) price.checked = true;
    fields.price = values.price || '';
    fields.district = '';
    fields.date = '';
    fields.hair = '';
    fields.beard = '';
    fields.level = '';
    selectedDistricts = values.districts?.length ? values.districts : null;
    selectedServices = values.services?.length ? values.services : null;
    form.querySelectorAll('select').forEach((select) => { select.value = ''; });
    applyFilters();
  };
  const requestedDistrict = new URLSearchParams(window.location.search).get('district');
  if (requestedDistrict && DISTRICTS.includes(requestedDistrict)) {
    form.querySelector('#filterDistrict').value = requestedDistrict;
    fields.district = requestedDistrict;
  }
  applyFilters();
}

function initializeMatchFinder() {
  const form = document.querySelector('#matchForm');
  if (!form) return;

  const steps = [...form.querySelectorAll('[data-step]')];
  const nextButton = document.querySelector('#matchNext');
  const backButton = document.querySelector('#matchBack');
  const countElement = document.querySelector('#matchCount');
  const countLabelElement = document.querySelector('#matchCountLabel');
  const progressSteps = [...document.querySelectorAll('.match-progress li')];
  const summary = document.querySelector('#matchSummary');
  let stepIndex = 0;

  function matchingSlots() {
    const price = form.querySelector('[name="matchPrice"]:checked')?.value || '';
    const districts = [...form.querySelectorAll('[name="matchDistrict"]:checked')].map((input) => input.value);
    const checkedServices = [...form.querySelectorAll('[name="service"]:checked')].map((input) => input.value);
    return [...document.querySelectorAll('#slotCards .slot-card')].filter((card) => {
      if (price && card.dataset.price !== price) return false;
      if (districts.length && !districts.includes(card.dataset.district)) return false;
      if (checkedServices.includes('beard') && !card.dataset.beard) return false;
      if (checkedServices.includes('hair') && !card.dataset.hair) return false;
      if (checkedServices.includes('combo') && (!card.dataset.hair || !card.dataset.beard)) return false;
      return true;
    });
  }

  function updateMatchCount() {
    const count = matchingSlots().length;
    const pluralCategory = new Intl.PluralRules('uk').select(count);
    countElement.textContent = count;
    countLabelElement.textContent = {
      one: 'слот',
      few: 'слоти',
      many: 'слотів',
      other: 'слотів'
    }[pluralCategory];
    const chosenDistricts = [...form.querySelectorAll('[name="matchDistrict"]:checked')].map((input) => input.value);
    const chosenPrice = form.querySelector('[name="matchPrice"]:checked')?.parentElement.innerText.trim();
    summary.textContent = [
      chosenPrice && form.querySelector('[name="matchPrice"]:checked').value ? chosenPrice : '',
      chosenDistricts.join(', ')
    ].filter(Boolean).join(' · ') || 'Усі райони та будь-які фінансові умови';
  }

  function updateStep() {
    steps.forEach((step, index) => { step.hidden = index !== stepIndex; });
    progressSteps.forEach((step, index) => {
      const isActive = index <= stepIndex;
      step.classList.toggle('is-active', isActive);
      if (isActive) {
        if (index === stepIndex) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      } else {
        step.removeAttribute('aria-current');
      }
    });
    backButton.disabled = stepIndex === 0;
    backButton.hidden = stepIndex === 0;
    nextButton.hidden = stepIndex === steps.length - 1;
    if (stepIndex === steps.length - 1) updateMatchCount();
  }

  nextButton.addEventListener('click', () => {
    stepIndex = Math.min(stepIndex + 1, steps.length - 1);
    updateStep();
  });
  backButton.addEventListener('click', () => {
    stepIndex = Math.max(stepIndex - 1, 0);
    updateStep();
  });
  form.querySelectorAll('input').forEach((control) => {
    control.addEventListener('change', () => {
      if (stepIndex === steps.length - 1) updateMatchCount();
    });
  });
  document.querySelector('#showMatches').addEventListener('click', () => {
    const slotsForm = document.querySelector('#slotsFilter');
    const districts = [...form.querySelectorAll('[name="matchDistrict"]:checked')].map((input) => input.value);
    const price = form.querySelector('[name="matchPrice"]:checked')?.value || '';
    const services = [...form.querySelectorAll('[name="service"]:checked')].map((input) => input.value);
    slotsForm._applyMatchFilters({ price, districts, services });
    document.querySelector('#slots').scrollIntoView({ behavior: 'smooth' });
  });
  updateStep();
}

function initializeRegistration() {
  const form = document.querySelector('#regForm');
  if (!form) return;

  const validators = {
    regName: (value) => value.trim().length >= 2 || 'Вкажіть ім’я (мінімум 2 символи).',
    regPhone: (value) => /^\+380\d{9}$/.test(value.replace(/\s/g, '')) || 'Формат: +380 XX XXX XX XX.',
    regOtp: (value) => /^\d{4}$/.test(value.trim()) || 'Введіть 4 цифри коду підтвердження.',
    regDistrict: (value) => Boolean(value) || 'Оберіть район Львова.',
    regHair: (value) => Boolean(value) || (document.querySelector('input[name="accountRole"]:checked')?.value === 'barber'
      ? 'Оберіть рівень практики барбера.'
      : 'Оберіть тип волосся.')
  };
  const controls = Object.keys(validators).map((id) => document.getElementById(id));
  const status = document.querySelector('#formStatus');
  let otpRequested = false;
  let otpPhone = '';

  function validateControl(control) {
    const result = validators[control.id](control.value);
    const message = document.getElementById(`${control.id.replace('reg', '').toLowerCase()}Message`);
    const valid = result === true;
    control.classList.toggle('is-valid', valid);
    control.classList.toggle('is-invalid', !valid);
    control.setAttribute('aria-invalid', String(!valid));
    message.textContent = valid ? 'Виглядає добре.' : result;
    message.classList.toggle('is-success', valid);
    return valid;
  }

  controls.forEach((control) => {
    control.addEventListener('blur', () => validateControl(control));
    control.addEventListener('change', () => validateControl(control));
    control.addEventListener('input', () => {
      if (control.getAttribute('aria-invalid') === 'true') validateControl(control);
      if (control.id === 'regPhone' && control.value.replace(/\s/g, '') !== otpPhone) {
        otpRequested = false;
        otpPhone = '';
      }
    });
  });

  document.querySelector('#sendOtp').addEventListener('click', () => {
    const phone = document.querySelector('#regPhone');
    if (!validateControl(phone)) {
      phone.focus();
      return;
    }
    otpRequested = true;
    otpPhone = phone.value.replace(/\s/g, '');
    status.textContent = 'Демо-режим: SMS не надсилається. Для перевірки форми введіть будь-які 4 цифри.';
    status.classList.remove('is-error');
  });

  document.querySelector('#regConsent').addEventListener('change', (event) => {
    const message = document.querySelector('#consentMessage');
    event.target.setAttribute('aria-invalid', String(!event.target.checked));
    message.textContent = event.target.checked ? '' : 'Потрібна згода з правилами платформи.';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const validFields = controls.map(validateControl).every(Boolean);
    const consent = document.querySelector('#regConsent');
    const consentValid = consent.checked;
    consent.setAttribute('aria-invalid', String(!consentValid));
    document.querySelector('#consentMessage').textContent = consentValid ? '' : 'Потрібна згода з правилами платформи.';

    if (!otpRequested || document.querySelector('#regPhone').value.replace(/\s/g, '') !== otpPhone) {
      status.textContent = 'Спочатку запросіть демонстраційне підтвердження для цього номера.';
      status.classList.add('is-error');
      return;
    }
    if (!validFields || !consentValid) {
      status.textContent = 'Перевірте, будь ласка, позначені поля.';
      status.classList.add('is-error');
      return;
    }
    status.textContent = 'Демо-режим: дані перевірено. Для створення акаунта потрібне підключення до сервера.';
    status.classList.remove('is-error');
  });
}

/* photos — { before, after, focus, caption } з BARBERS; без них лишаються стилізовані панелі */
function beforeAfterMarkup(label, photos = null) {
  const image = (src, stage) => photos
    ? `<img class="ba-img" src="${escapeHtml(src)}" alt="${stage}: ${escapeHtml(photos.caption)}" loading="lazy" decoding="async" width="640" height="640">`
    : '';
  const focus = photos?.focus ? ` --focus: ${escapeHtml(photos.focus)};` : '';
  return `
    <div class="ba-compare${photos ? ' has-photos' : ''}" style="--pos: 50%;${focus}" role="group" aria-label="${escapeHtml(label)}">
      <div class="ba-layer ba-after">${image(photos?.after, 'Після')}<span class="tag ba-badge-after">Після</span></div>
      <div class="ba-layer ba-before">${image(photos?.before, 'До')}<span class="tag ba-badge-before">До</span></div>
      <div class="ba-divider" aria-hidden="true"><span class="ba-handle"><svg class="icon" aria-hidden="true"><use href="#n-swap"/></svg></span></div>
      <input type="range" class="ba-range" min="10" max="90" value="50" aria-label="Порівняння До і Після · ${escapeHtml(label)}">
    </div>`;
}

/* compact — картка без віджета «До/Після» (слоти на сторінці профілю) */
function slotCardTemplate(slot, barberId, barber, { compact = false } = {}) {
  const priceClass = { free: 'price-free', supplies: 'price-supplies', paid: 'price-paid' }[slot.price];
  const tags = slot.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('');
  const normalizedTags = slot.tags.join(' ').toLowerCase();
  const hair = normalizedTags.includes('кучеряв') ? 'curly'
    : normalizedTags.includes('коротк') ? 'short'
      : normalizedTags.includes('середн') ? 'medium'
        : normalizedTags.includes('стрижка') ? 'short' : '';
  const beard = normalizedTags.includes('бород') ? 'dense' : '';
  const day = new Date(slot.datetime);
  const dateOffset = Math.round((Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()) - Date.UTC(2026, 9, 21)) / 86400000);
  const date = dateOffset === 0 ? '0' : dateOffset === 1 ? '1' : dateOffset === 2 ? '2' : String(dateOffset);
  return `
    <article class="slot-card${compact ? ' slot-card-compact' : ''}" data-price="${escapeHtml(slot.price)}" data-district="${escapeHtml(slot.district)}" data-date="${date}" data-hair="${hair}" data-beard="${beard}" data-level="beginner" data-barber-id="${barberId}">
      ${compact ? '' : `<figure class="slot-before-after">${beforeAfterMarkup(`Робота барбера ${barber.shortName}`, barber.photos?.before ? barber.photos : null)}</figure>`}
      <div class="slot-card-content">
        <div class="slot-title-row">
          <div><h3><a href="barber.html?id=${barberId}">${escapeHtml(barber.shortName)}</a></h3><p class="verified-label"><svg class="icon" aria-hidden="true"><use href="#n-shield"/></svg>${escapeHtml(barber.gender)} · ${escapeHtml(barber.level)}</p></div>
          <span class="price-badge ${priceClass}">${escapeHtml(PRICES[slot.price])}</span>
        </div>
        <p class="reliability"><svg class="icon" aria-hidden="true"><use href="#n-star"/></svg>Рейтинг надійності <strong>${barber.reliability}%</strong></p>
        <dl class="slot-meta">
          <div><dt><span class="icon i-pin" aria-hidden="true"></span>Район</dt><dd>${escapeHtml(slot.district)}</dd></div>
          <div><dt><span class="icon i-cal" aria-hidden="true"></span>Час</dt><dd><time datetime="${escapeHtml(slot.datetime)}">${escapeHtml(slot.time)}</time></dd></div>
        </dl>
        <ul class="tag-list">${tags}</ul>
        <div class="card-actions"><button class="button button-primary request-button" type="button">Відгукнутися</button>${compact ? '' : `<a class="button button-outline" href="barber.html?id=${barberId}">Профіль барбера</a>`}</div>
      </div>
    </article>`;
}

function initializeBarberProfile() {
  if (document.body.dataset.page !== 'barber') return;

  const id = new URLSearchParams(window.location.search).get('id') || '1';
  const barber = BARBERS[id] || BARBERS[1];
  const fullName = barber.name;
  document.title = `${fullName} — барбер у Львові | BarberMatch`;
  document.querySelector('#breadcrumbName').textContent = fullName;
  document.querySelector('#barberName').textContent = fullName;
  document.querySelector('#portraitVerified').textContent = barber.gender;
  document.querySelector('#barberBadges').innerHTML = `
    <span class="status-badge"><svg class="icon" aria-hidden="true"><use href="#n-shield"/></svg>${escapeHtml(barber.gender)}</span>
    <span class="status-badge">Рівень: ${escapeHtml(barber.level)}</span>
    <span class="status-badge">На платформі з ${escapeHtml(barber.joined)}</span>`;
  document.querySelector('#reliabilityValue').textContent = `${barber.reliability}%`;
  document.querySelector('#reliabilityMeter').setAttribute('aria-valuenow', String(barber.reliability));
  document.querySelector('#reliabilityMeter > span').style.width = `${barber.reliability}%`;
  document.querySelector('#cutsMetric').textContent = barber.cuts;
  document.querySelector('#attendanceMetric').textContent = `${barber.attendance}%`;
  document.querySelector('#reviewsMetric').textContent = barber.reviews.length;
  document.querySelector('#profileShop').textContent = barber.shop;
  document.querySelector('#profileLocation').textContent = `${barber.district}, ${barber.address}`;
  document.querySelector('#profileExperience').textContent = barber.experience;
  document.querySelector('#profileSchedule').textContent = barber.schedule;
  const videoSection = document.querySelector('#video');
  if (barber.videoId) {
    const video = document.querySelector('#workVideo');
    video.src = `https://www.youtube-nocookie.com/embed/${barber.videoId}${barber.videoQuery || ''}`;
    video.title = `Відео роботи барбера: ${fullName}`;
    document.querySelector('#workVideoLink').href = `https://www.youtube.com/watch?v=${barber.videoId}`;
  } else {
    videoSection.hidden = true;
  }
  const mapQuery = encodeURIComponent(barber.address);
  document.querySelector('#locShop').textContent = barber.shop;
  document.querySelector('#locAddress').textContent = barber.address;
  document.querySelector('#locDistrict').textContent = barber.district;
  document.querySelector('#locSchedule').textContent = barber.schedule;
  document.querySelector('#locPhoto').src = barber.photos.workplace;
  document.querySelector('#locPhoto').alt = `Робоче місце: ${barber.shop}`;
  document.querySelector('#locMap').title = `Мапа: ${barber.shop}, ${barber.address}`;
  document.querySelector('#locMap').src = `https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`;
  document.querySelector('#locRoute').href = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  document.querySelector('#bBio').textContent = barber.bio;
  document.querySelector('#bTags').innerHTML = barber.specialties.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('');

  const initials = escapeHtml(barber.shortName.split(' ').map((part) => part[0]).join(''));
  const photos = barber.photos || {};
  /* Якщо фото немає (портрет Олега) — лишається стилізована панель з ініціалами або іконкою */
  const portraitModes = [
    { name: 'Портрет', icon: '', photo: photos.portrait, className: 'portrait-view-1' },
    { name: 'Робоче місце', icon: 'i-cut', photo: photos.workplace, className: 'portrait-view-2' },
    { name: 'Роботи', icon: 'i-beard', photo: photos.works || photos.after, className: 'portrait-view-3' }
  ];
  const thumbs = document.querySelector('#thumbs');
  thumbs.innerHTML = portraitModes.map((mode, index) => `
    <li><button type="button" class="thumb${index === 0 ? ' on' : ''}${mode.photo ? ' has-photo' : ''}" data-view="${index}" aria-pressed="${index === 0}">
      ${mode.photo ? `<img src="${escapeHtml(mode.photo)}" alt="" loading="lazy" decoding="async">`
        : mode.icon ? `<span class="icon ${mode.icon}" aria-hidden="true"></span>` : `<span class="thumb-initials" aria-hidden="true">${initials}</span>`}
      <span>${mode.name}</span>
    </button></li>`).join('');

  function renderPortrait(index) {
    const mode = portraitModes[index];
    const portrait = document.querySelector('#portraitView');
    portrait.className = `portrait-illustration ${mode.className}${mode.photo ? ' has-photo' : ''}`;
    if (mode.photo) portrait.innerHTML = `<img src="${escapeHtml(mode.photo)}" alt="" decoding="async">`;
    else if (index === 0) portrait.innerHTML = `<span aria-hidden="true">${initials}</span><small>ПОРТРЕТ</small>`;
    else portrait.innerHTML = `<span class="icon ${mode.icon}" aria-hidden="true"></span><small>${mode.name}</small>`;
    portrait.setAttribute('aria-label', `${mode.name} барбера ${fullName}`);
    document.querySelector('#portraitCaption').textContent = `${mode.name} · ${fullName}`;
  }

  thumbs.addEventListener('click', (event) => {
    const button = event.target.closest('[data-view]');
    if (!button) return;
    thumbs.querySelectorAll('.thumb').forEach((thumb) => {
      thumb.classList.toggle('on', thumb === button);
      thumb.setAttribute('aria-pressed', String(thumb === button));
    });
    renderPortrait(Number(button.dataset.view));
  });
  renderPortrait(0);

  let shownWorks = 2;
  const workContainer = document.querySelector('#works');
  const moreWorks = document.querySelector('#moreW');
  function renderWorks() {
    workContainer.innerHTML = barber.works.slice(0, shownWorks).map((work) => `
      <article class="work-card">
        <figure class="work-comparison">${beforeAfterMarkup(`${work.title} · ${fullName}`, work.photos && barber.photos?.before ? barber.photos : null)}</figure>
        <div class="work-card-content">
          <div class="work-card-heading"><h3>${escapeHtml(work.title)}</h3><time datetime="${escapeHtml(work.datetime)}">${escapeHtml(work.date)}</time></div>
          <ul class="tag-list"><li>${escapeHtml(work.tag)}</li></ul>
          <p>${escapeHtml(work.description)}</p>
        </div>
      </article>`).join('');
    moreWorks.hidden = shownWorks >= barber.works.length;
  }
  moreWorks.addEventListener('click', () => {
    shownWorks = barber.works.length;
    renderWorks();
  });
  renderWorks();

  const reviews = barber.reviews;
  const reviewCards = document.querySelector('#reviewsList');
  const ratingFilter = document.querySelector('#rStar');
  const sortFilter = document.querySelector('#rSort');
  const moreReviews = document.querySelector('#moreR');
  const average = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
  const averageText = average.toLocaleString('uk-UA', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  document.querySelector('#avgRating').textContent = averageText;
  document.querySelector('#profileAverage').textContent = averageText;
  document.querySelector('#profileReviewCount').textContent = `${reviews.length} відгуків`;
  const averageStars = document.querySelector('#avgStars');
  averageStars.textContent = `${'★'.repeat(Math.round(average))}${'☆'.repeat(5 - Math.round(average))}`;
  averageStars.setAttribute('aria-label', `Середня оцінка ${averageText} з 5`);
  document.querySelector('#profileStars').setAttribute('aria-label', `Середня оцінка ${averageText} з 5`);
  document.querySelector('#avgN').textContent = `на основі ${reviews.length} відгуків`;
  document.querySelector('#ratingDistribution').innerHTML = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((review) => review.rating === rating).length;
    const percentage = count / reviews.length * 100;
    return `<li><span>${rating} <span aria-hidden="true">★</span></span><span class="rating-track"><span style="width:${percentage}%"></span></span><span>${count}</span></li>`;
  }).join('');

  let shownReviews = 3;
  function renderReviews() {
    let filtered = reviews.filter((review) => !ratingFilter.value || review.rating === Number(ratingFilter.value));
    filtered = filtered.slice().sort((first, second) => {
      const order = first.datetime.localeCompare(second.datetime);
      return sortFilter.value === 'old' ? order : -order;
    });
    reviewCards.innerHTML = filtered.slice(0, shownReviews).map((review) => `
      <article class="review-card">
        <header class="review-card-header">
          <span class="review-avatar" aria-hidden="true">${escapeHtml(review.author.trim()[0])}</span>
          <div class="review-author"><h3>${escapeHtml(review.author)}</h3><p><time datetime="${escapeHtml(review.datetime)}">${escapeHtml(review.date)}</time><span class="visit-verified"><svg class="icon" aria-hidden="true"><use href="#n-shield"/></svg>Підтверджений візит</span></p></div>
          <p class="review-card-stars" role="img" aria-label="Оцінка ${review.rating} з 5">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
        </header>
        <p class="review-price ${review.price === 'free' ? 'price-free' : 'price-supplies'}">${escapeHtml(PRICES[review.price])}</p>
        <p>${escapeHtml(review.text)}</p>
      </article>`).join('');
    document.querySelector('#revEmpty').hidden = filtered.length !== 0;
    moreReviews.hidden = filtered.length <= shownReviews;
  }
  ratingFilter.addEventListener('change', () => { shownReviews = 3; renderReviews(); });
  sortFilter.addEventListener('change', renderReviews);
  moreReviews.addEventListener('click', () => { shownReviews = reviews.length; renderReviews(); });
  renderReviews();

  document.querySelector('#sl').innerHTML = barber.slots.map((slot) => slotCardTemplate(slot, id, barber, { compact: true })).join('');
  document.querySelector('#otherBarbers').innerHTML = Object.entries(BARBERS)
    .filter(([otherId]) => otherId !== id)
    .map(([otherId, other]) => `
      <article class="other-barber-card">
        <div class="other-barber-avatar${other.photos?.portrait ? ' has-photo' : ''}" aria-hidden="true">${other.photos?.portrait
          ? `<img src="${escapeHtml(other.photos.portrait)}" alt="" loading="lazy" decoding="async">`
          : escapeHtml(other.shortName.split(' ').map((part) => part[0]).join(''))}</div>
        <div><h3>${escapeHtml(other.name)}</h3><p>${escapeHtml(other.district)} · ${other.reliability}% надійності</p></div>
        <a class="text-link" href="barber.html?id=${otherId}">Профіль <span aria-hidden="true">→</span></a>
      </article>`).join('');

  document.querySelector('#complain').addEventListener('click', (event) => {
    event.currentTarget.disabled = true;
    document.querySelector('#complainMsg').textContent = 'Дякуємо. Скаргу передано модераторам, вони розглянуть її протягом доби.';
  });
}

function initializeComparisonSliders() {
  document.addEventListener('input', (event) => {
    if (!event.target.matches('.ba-range')) return;
    event.target.closest('.ba-compare').style.setProperty('--pos', `${event.target.value}%`);
  });
}

fillDistrictOptions();
initializeThemeToggle();
initializeMobileMenu();
initializeDistrictNavigation();
initializeRoleSwitches();
initializeSlotFilters();
initializeMatchFinder();
initializeRegistration();
initializeBarberProfile();
initializeComparisonSliders();
