/* ============================================================
   MI LEGADO — js/screens/responsabilidad.js
   Tu Responsabilidad screen
   ============================================================ */

const MLScreenResponsabilidad = {
  render() {
    const el = document.getElementById('screen-responsabilidad');
    el.innerHTML = `
      <div class="hero mb-lg">
        <div class="hero__phrase">👁 Sin filtros. Sin excusas.</div>
        <div class="hero__title">Tu <span>Responsabilidad</span></div>
        <div class="hero__desc">Este módulo refleja tu realidad. No lo que quieres ver — lo que realmente has hecho.</div>
      </div>
      <div class="grid-4 mb-lg">
        <div class="card"><div class="card__label">Hábitos cumplidos</div><div class="card__value card__value--gold">18</div><div class="card__sub">este mes</div><div class="card__icon">✅</div></div>
        <div class="card"><div class="card__label">Hábitos fallados</div><div class="card__value card__value--red">7</div><div class="card__sub">este mes</div><div class="card__icon">❌</div></div>
        <div class="card card--teal"><div class="card__label">Consistencia</div><div class="card__value card__value--teal">72%</div><div class="card__sub">últimos 30 días</div><div class="card__icon">📊</div></div>
        <div class="card card--accent"><div class="card__label">Tiempo invertido</div><div class="card__value card__value--accent">43h</div><div class="card__sub">este mes</div><div class="card__icon">⏱</div></div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="section-title mb-md">Hábitos — Semana actual</div>
          ${MLContent.habits.map(h => {
            const allDone = h.days.every(d => d === 1);
            const dots = h.days.map(v =>
              `<div style="width:10px;height:10px;border-radius:2px;flex-shrink:0;background:${v ? 'var(--gold)' : 'rgba(255,255,255,.07)'}"></div>`
            ).join('');
            const icon = allDone
              ? `<span style="color:var(--teal)">✓</span>`
              : `<span style="color:var(--red)">✗</span>`;
            return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-subtle)">
              ${icon}
              <span style="flex:1;font-size:0.8125rem">${h.name}</span>
              <div style="display:flex;gap:3px">${dots}</div>
            </div>`;
          }).join('')}
        </div>
        <div class="card">
          <div class="section-title mb-md">Diagnóstico Real</div>
          ${MLContent.diagnoses.map(d => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-subtle);font-size:0.75rem">
              <span>${d.icon}</span>
              <span style="color:${d.color}">${d.text}</span>
            </div>`).join('')}
        </div>
      </div>`;
  },
};
