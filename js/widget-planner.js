// v1 «Планувальник практики» — згенеровано промптом v1 (Happy Path, без розділу про захист).
(() => {
  const root = document.querySelector('[data-widget="planner"]');
  const goal = root.querySelector('#planGoal');
  const done = root.querySelector('#planDone');
  const perWeek = root.querySelector('#planPerWeek');
  const supplies = root.querySelector('#planSupplies');
  const pay = root.querySelector('#planPay');
  const out = (name) => root.querySelector(`[data-plan-out="${name}"]`);

  const DEMO_TODAY = new Date('2026-10-21T00:00:00');
  const money = new Intl.NumberFormat('uk-UA');
  const dateFormat = new Intl.DateTimeFormat('uk', { day: 'numeric', month: 'long', year: 'numeric' });
  const weeksWord = (n) => ({ one: 'тиждень', few: 'тижні', many: 'тижнів', other: 'тижня' }[new Intl.PluralRules('uk').select(n)]);

  function calculate() {
    const price = root.querySelector('[name="planPrice"]:checked').value;
    root.querySelector('[data-plan-cost="supplies"]').hidden = price !== 'supplies';
    root.querySelector('[data-plan-cost="paid"]').hidden = price !== 'paid';

    const remaining = Number(goal.value) - Number(done.value);
    const weeks = Math.ceil(remaining / Number(perWeek.value));
    const perCut = price === 'free' ? 0 : price === 'supplies' ? Number(supplies.value) : Number(pay.value);
    const cost = remaining * perCut;
    const finish = new Date(DEMO_TODAY.getTime() + weeks * 7 * 86400000);

    if (remaining === 0) {
      out('weeks').textContent = 'Мету вже досягнуто';
      out('finish').textContent = 'Пора до наступного рівня';
      out('remaining').textContent = '0';
      out('cost').textContent = '0 ₴';
      out('costNote').textContent = '';
      out('tip').hidden = true;
      return;
    }

    out('weeks').textContent = `${weeks} ${weeksWord(weeks)}`;
    out('finish').textContent = `Фініш ≈ ${dateFormat.format(finish)}`;
    out('remaining').textContent = remaining;
    out('cost').textContent = `${money.format(cost)} ₴`;
    out('costNote').textContent = price === 'free' ? '0 ₴ — модель стрижеться безкоштовно'
      : price === 'supplies' ? `${perCut} ₴ на стрижку — розхідники` : `Ви доплатите моделям ${money.format(cost)} ₴`;

    const faster = Number(perWeek.value) + 2;
    const fasterWeeks = Math.ceil(remaining / faster);
    out('tip').hidden = !(faster <= 20 && fasterWeeks < weeks);
    out('tip').querySelector('span').textContent = `Якщо брати ${faster} моделей на тиждень, дійдеш на ${weeks - fasterWeeks} ${weeksWord(weeks - fasterWeeks)} швидше.`;
  }

  root.addEventListener('input', calculate);
  root.addEventListener('change', calculate);
  calculate();
})();
