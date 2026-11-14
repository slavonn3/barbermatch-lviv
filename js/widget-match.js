// v1 «Швидкий підбір» — згенеровано промптом v1 (Happy Path, без розділу про захист).
// Базується на наявній initializeMatchFinder() з js/app.js + нові поля (тип волосся, бюджет, дні).
(() => {
  const root = document.querySelector('[data-widget="match"]');
  const form = root.querySelector('#matchForm');

  const DEMO_TODAY = new Date('2026-10-21T00:00:00');
  const COST = { free: 0, supplies: 300, paid: -200 };

  const steps = [...form.querySelectorAll('[data-step]')];
  const nextButton = root.querySelector('#matchNext');
  const backButton = root.querySelector('#matchBack');
  const countElement = root.querySelector('#matchCount');
  const countLabelElement = root.querySelector('#matchCountLabel');
  const liveCount = root.querySelector('#matchLiveCount');
  const liveLabel = root.querySelector('#matchLiveLabel');
  const progressSteps = [...root.querySelectorAll('.match-progress li')];
  const summary = root.querySelector('#matchSummary');
  const top = root.querySelector('#matchTop');
  const zero = root.querySelector('#matchZero');
  let stepIndex = 0;

  // Усі слоти з BARBERS: тип волосся і борода — з тегів, зсув днів — від демо-«сьогодні»
  const slots = Object.entries(BARBERS).flatMap(([id, barber]) => barber.slots.map((slot) => {
    const tags = slot.tags.join(' ').toLowerCase();
    const hair = tags.includes('кучеряв') ? 'curly' : tags.includes('коротк') ? 'short' : tags.includes('середн') ? 'medium' : tags.includes('стрижка') ? 'short' : '';
    const day = new Date(slot.datetime);
    const offset = Math.round((new Date(day.getFullYear(), day.getMonth(), day.getDate()) - DEMO_TODAY) / 86400000);
    return { id, barber, slot, price: slot.price, district: slot.district, hair, beard: tags.includes('бород'), offset, cost: COST[slot.price] };
  }));

  function readParams() {
    return {
      services: [...form.querySelectorAll('[name="service"]:checked')].map((input) => input.value),
      hair: form.querySelector('[name="matchHair"]:checked').value,
      price: form.querySelector('[name="matchPrice"]:checked')?.value || '',
      districts: [...form.querySelectorAll('[name="matchDistrict"]:checked')].map((input) => input.value),
      budget: parseFloat(form.querySelector('#matchBudget').value),
      days: parseInt(form.querySelector('#matchDays').value)
    };
  }

  function passes(s, p, skip = '') {
    if (skip !== 'services') {
      if (p.services.includes('hair') && !s.hair) return false;
      if (p.services.includes('beard') && !s.beard) return false;
      if (p.services.includes('combo') && (!s.hair || !s.beard)) return false;
    }
    if (skip !== 'price' && p.price && s.price !== p.price) return false;
    if (skip !== 'districts' && p.districts.length && !p.districts.includes(s.district)) return false;
    if (skip !== 'budget' && s.cost > p.budget) return false;
    if (skip !== 'days' && s.offset >= p.days) return false;
    return true;
  }

  function score(s, p) {
    const hairScore = !p.hair || p.hair === s.hair ? 30 : 0;
    const priceScore = s.cost <= 0 ? 25 : 25 * (1 - s.cost / p.budget);
    const timeScore = 25 * (1 - s.offset / p.days);
    const reliabilityScore = 20 * s.barber.reliability / 100;
    return Math.round(hairScore + priceScore + timeScore + reliabilityScore);
  }

  const plural = (n) => ({ one: 'слот', few: 'слоти', many: 'слотів', other: 'слотів' }[new Intl.PluralRules('uk').select(n)]);
  const costText = (cost) => cost === 0 ? 'Безкоштовно' : cost > 0 ? `${cost} ₴ за розхідники` : `+${-cost} ₴ тобі`;

  function update() {
    const p = readParams();
    const found = slots.filter((s) => passes(s, p));
    liveCount.textContent = found.length;
    liveLabel.textContent = plural(found.length);
    countElement.textContent = found.length;
    countLabelElement.textContent = plural(found.length);
    summary.textContent = [p.price ? form.querySelector('[name="matchPrice"]:checked').parentElement.innerText.trim() : '', p.districts.join(', '), `до ${p.budget} ₴`, `${p.days} днів`].filter(Boolean).join(' · ');

    // Топ-3: найкращий слот кожного барбера
    const best = {};
    found.forEach((s) => {
      const value = score(s, p);
      if (!best[s.id] || value > best[s.id].value) best[s.id] = { s, value };
    });
    top.replaceChildren();
    Object.values(best).sort((a, b) => b.value - a.value).slice(0, 3).forEach(({ s, value }) => {
      const li = document.createElement('li');
      const head = document.createElement('div'); head.className = 'match-top-head';
      const name = document.createElement('span'); name.className = 'match-top-name'; name.textContent = s.barber.shortName;
      const sc = document.createElement('span'); sc.className = 'match-top-score'; sc.textContent = `збіг ${value}%`;
      head.append(name, sc);
      const meta = document.createElement('span'); meta.className = 'match-top-meta'; meta.textContent = `${s.district} · ${s.slot.time}`;
      const cost = document.createElement('span'); cost.className = 'match-top-meta'; cost.textContent = costText(s.cost);
      const link = document.createElement('a'); link.href = `barber.html?id=${s.id}`; link.textContent = 'Профіль барбера';
      li.append(head, meta, cost, link);
      top.append(li);
    });

    // 0 результатів: що найбільше обмежує
    zero.hidden = found.length > 0;
    if (found.length === 0) {
      const names = { services: 'послуга', price: 'умови', districts: 'район', budget: 'бюджет', days: 'кількість днів' };
      let bestKey = ''; let bestCount = 0;
      Object.keys(names).forEach((key) => {
        const count = slots.filter((s) => passes(s, p, key)).length;
        if (count > bestCount) { bestCount = count; bestKey = key; }
      });
      zero.textContent = bestKey ? `Нічого не знайшли. Найбільше обмежує: ${names[bestKey]} — без нього знайдеться ще ${bestCount} ${plural(bestCount)}.` : 'Спробуйте інші умови.';
    }
  }

  function updateStep() {
    steps.forEach((step, index) => { step.hidden = index !== stepIndex; });
    progressSteps.forEach((step, index) => {
      step.classList.toggle('is-active', index <= stepIndex);
      if (index === stepIndex) step.setAttribute('aria-current', 'step'); else step.removeAttribute('aria-current');
    });
    backButton.disabled = stepIndex === 0;
    backButton.hidden = stepIndex === 0;
    nextButton.hidden = stepIndex === steps.length - 1;
    update();
  }

  nextButton.addEventListener('click', () => { stepIndex = Math.min(stepIndex + 1, steps.length - 1); updateStep(); });
  backButton.addEventListener('click', () => { stepIndex = Math.max(stepIndex - 1, 0); updateStep(); });
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  document.querySelector('#showMatches').addEventListener('click', () => {
    const slotsForm = document.querySelector('#slotsFilter');
    const p = readParams();
    slotsForm._applyMatchFilters({ price: p.price, districts: p.districts, services: p.services });
    document.querySelector('#slots').scrollIntoView({ behavior: 'smooth' });
  });
  updateStep();
})();
