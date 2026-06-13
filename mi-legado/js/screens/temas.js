/* ============================================================
   MI LEGADO — js/screens/temas.js
   Temas Inmersivos screen
   ============================================================ */

const MLScreenTemas = {
  render() {
    const el = document.getElementById('screen-temas');
    el.innerHTML = `
      <div class="hero mb-lg">
        <div class="hero__phrase">PERSONALIZACIÓN</div>
        <div class="hero__title">Temas <span>Inmersivos</span></div>
        <div class="hero__desc">Cada tema transforma completamente tu experiencia. Fondos, efectos, partículas, tipografía, iconografía.</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-md)" id="themesGrid"></div>`;

    this.renderCards();
  },

  renderCards() {
    const grid = document.getElementById('themesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    MLContent.themes.forEach(t => {
      const isSelected = MLState.theme === t.id;
      const el = document.createElement('div');
      el.className = 'theme-card' + (isSelected ? ' theme-card--selected' : '');
      el.style.cssText = `background:${t.bg};border-color:${t.border}`;
      el.innerHTML = `
        <div class="theme-card__name" style="color:${t.colors[1]}">${t.name}</div>
        <div class="theme-card__desc">${t.desc}</div>
        <div class="theme-dots">
          ${t.colors.map(c => `<div class="theme-dot" style="background:${c}"></div>`).join('')}
        </div>
        ${isSelected ? `<div style="margin-top:var(--space-sm);font-size:0.5625rem;color:var(--gold);letter-spacing:0.15em">✓ ACTIVO</div>` : ''}`;
      el.onclick = () => {
        MLThemes.apply(t.id);
        this.renderCards();
      };
      grid.appendChild(el);
    });
  },
};
