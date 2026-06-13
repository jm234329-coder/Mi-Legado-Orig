/* ============================================================
   MI LEGADO — js/screens/ranking.js
   Ranking Global screen
   ============================================================ */

const MLScreenRanking = {
  render() {
    const el = document.getElementById('screen-ranking');
    el.innerHTML = `
      <div class="hero mb-lg">
        <div class="hero__phrase">🏆 Clasificación Global</div>
        <div class="hero__title">Ranking <span>Guerrero</span></div>
        <div class="hero__desc">Los más disciplinados. Los más constantes. Los que están construyendo su legado.</div>
      </div>
      <div class="grid-2">
        <div>
          <div class="section-head"><div class="section-title">Top Global</div></div>
          ${MLContent.ranking.map((r, i) => {
            const pos = i + 1;
            const numClass = pos === 1 ? 'rank__num--gold' : pos === 2 ? 'rank__num--silver' : pos === 3 ? 'rank__num--bronze' : '';
            const rowClass  = pos === 1 ? 'rank-row--1st' : pos === 2 ? 'rank-row--2nd' : pos === 3 ? 'rank-row--3rd' : '';
            return `
              <div class="rank-row ${rowClass}">
                <div class="rank__num ${numClass}">${pos}</div>
                <div class="rank__avatar" style="background:${r.bg};color:${r.col}">${r.name[0]}</div>
                <div class="rank__info">
                  <div class="rank__name">${r.name}</div>
                  <div class="rank__title">${r.rank}</div>
                </div>
                <div class="rank__score">${r.score.toLocaleString()}</div>
              </div>`;
          }).join('')}
        </div>
        <div>
          <div class="section-head"><div class="section-title">Tu Posición</div></div>
          <div class="card mb-md">
            <div class="card__label">Posición global</div>
            <div class="card__value card__value--gold">#47</div>
            <div class="card__sub">de 2,841 guerreros activos</div>
          </div>
          <div class="card card--accent">
            <div class="card__label">Puntuación</div>
            <div class="card__value card__value--accent">8,940</div>
            <div class="card__sub">+340 esta semana</div>
          </div>
        </div>
      </div>`;
  },
};
