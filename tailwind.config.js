/** Tailwind CSS 3.4.17 — та сама версія, що віддавав Play CDN (cdn.tailwindcss.com → /3.4.17).
 *  Конфіг зведено з inline-конфігів чотирьох сторінок: index/barber/create однакові,
 *  support.html додає 5 токенів станів форми (ЛР №9) — їх використовує лише support.html. */
module.exports = {
  content: ['./*.html', './js/**/*.js', './*.js'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: '#1D442F',
        darkSurface: '#14261C',
        accent: '#C87D32',
        accentHover: '#DF8E3C',
        cream: '#F9F3E8',
        creamMuted: '#EFE6D5',
        borderWarm: '#D6CBB8',
        textMain: '#18221D',
        textMuted: '#5A655E',
        success: '#2E7D32',
        warning: '#ED6C02',
        danger: '#D32F2F',
        /* ЛР №9: токени тексту станів форми (WCAG 2.2 AA, 4.5:1) */
        borderField: '#948A7A',
        dangerText: '#A63828',
        successText: '#2A7048',
        dangerSoft: '#F4A492',
        successSoft: '#8FD3A8'
      },
      fontFamily: {
        heading: ['"Crimson Text"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
};
