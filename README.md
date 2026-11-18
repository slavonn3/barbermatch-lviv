# BarberMatch Lviv

Локальний двосторонній P2P-маркетплейс у Львові: клієнти-моделі знаходять барберів для безкоштовних стрижок, барбери — моделей для практики й портфоліо.

Навчальний проєкт (курс «Технології веб розробки та дизайну», ПП-26).

## Сторінки

- `index.html` — лендинг (воронка до створення акаунта)
- `barber.html?id=1..3` — профіль барбера
- `create.html` — створення акаунта

## Стек

HTML5, Tailwind CSS 3.4 (зібраний), JavaScript (дані барберів у `js/app.js`).

## Інтерактивні віджети (ЛР №11)

- `js/widget-match.js` — «Швидкий підбір» на головній: послуга, тип волосся, умови, район, бюджет і дні → топ-3 барберів із балом збігу; підказка, який фільтр найбільше обмежує.
- `js/widget-planner.js` — «Планувальник практики» на `create.html`: за скільки тижнів барбер набере потрібну кількість стрижок, дата фінішу, витрати й порада.

Кожен віджет — окремий файл (IIFE, без глобальних змінних), ініціалізація від `[data-widget="…"]`, вивід лише через `textContent`. Дані — демонстраційні (`BARBERS`, `PRICES` з `js/app.js`).

## Збірка й перевірки (ЛР №12)

Сайт статичний: зібраний `css/tailwind.css` комітиться в репозиторій, хостинги нічого не збирають.

```bash
npm ci
npm run build:css   # Tailwind 3.4.17 → css/tailwind.css
npm run lint:html   # html-validate
npm run lhci        # Lighthouse CI: A11y / Best Practices / SEO ≥ 90, Performance ≥ 80 (попередження)
npm run check       # усе разом — те саме робить GitHub Actions
```

Продакшн: https://barbermatch-lviv.vercel.app — оновлюється лише через GitHub Actions (`.github/workflows/deploy.yml`) після зелених перевірок. Автодеплой Vercel для `main` вимкнено у `vercel.json`.

## Запуск локально

Відкрити папку у VS Code → Live Server → `index.html`.

## Демо

- Vercel (основний): https://barbermatch-lviv.vercel.app
- GitHub Pages: https://slavonn3.github.io/barbermatch-lviv/
- Netlify: https://psui-barbermatch-lab6.netlify.app/

> Усі адреси барбершопів і дані барберів — демонстраційні.
