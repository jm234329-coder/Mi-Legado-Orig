/* ============================================================
   MI LEGADO — js/screens/guerrero.js
   Modo Guerrero RPG screen
   ============================================================ */

const MLScreenGuerrero = {
  render() {
    const el = document.getElementById('screen-guerrero');
    el.innerHTML = `
      <div class="grid-2 mb-lg">
        <div class="warrior-card">
          <div style="font-size:0.5625rem;letter-spacing:0.3em;color:var(--text-secondary);margin-bottom:var(--space-md)">NIVEL DE EVOLUCIÓN</div>
          <div class="warrior__level">${MLUser.level}</div>
          <div class="warrior__class">CENTINELA DE LA SOMBRA</div>
          <div style="font-size:0.6875rem;color:var(--text-secondary);margin-bottom:var(--space-md)">${MLUser.xp.toLocaleString()} / ${MLUser.xpNext.toLocaleString()} XP para Nivel ${MLUser.level + 1}</div>
          <div class="warrior-xp-bar"><div class="warrior-xp-fill"></div></div>
          <div class="warrior-stats-row">
            <div><div class="warrior-stat__val text-gold">${MLUser.stats.achievements}</div><div class="warrior-stat__key">Logros</div></div>
            <div><div class="warrior-stat__val text-accent">${MLUser.stats.missions}</div><div class="warrior-stat__key">Misiones</div></div>
            <div><div class="warrior-stat__val text-teal">${MLUser.streak}</div><div class="warrior-stat__key">Racha</div></div>
          </div>
        </div>
        <div class="card">
          <div class="section-title mb-md">Insignias Ganadas</div>
          <div class="badges-grid">
            ${MLContent.badges.map(b => `
              <div class="badge-item badge-item--${b.earned ? 'earned' : 'locked'}" title="${b.name}">
                <span>${b.icon}</span>
                <span class="badge__name">${b.name}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  },
};
