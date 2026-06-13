/* ============================================================
   MI LEGADO — js/screens/hall.js
   Hall de Leyendas screen
   ============================================================ */

const MLScreenHall = {
  render() {
    const el = document.getElementById('screen-hall');
    el.innerHTML = `
      <div class="hero mb-lg">
        <div class="hero__phrase">✨ Los más grandes de todos los tiempos</div>
        <div class="hero__title">Hall de <span>Leyendas</span></div>
        <div class="hero__desc">Aquí viven los guerreros que construyeron algo extraordinario. ¿Serás uno de ellos?</div>
      </div>
      <div class="grid-3">
        ${MLContent.hall.map(l => `
          <div class="legend-card">
            <div class="legend__avatar" style="background:${l.bg};color:${l.col}">${l.icon}</div>
            <div class="legend__name">${l.name}</div>
            <div class="legend__rank">${l.rank}</div>
            <div class="legend__score">${l.score}</div>
            <div class="legend__label">puntos de legado</div>
          </div>`).join('')}
      </div>`;
  },
};
