/* ============================================================
   MI LEGADO — js/screens/inicio.js
   Centro de Mando screen
   ============================================================ */

const MLScreenInicio = {
  render() {
    const el = document.getElementById('screen-inicio');
    el.innerHTML = `
      <div class="hero mb-lg">
        <div class="hero__phrase">FILOSOFÍA DEL DÍA</div>
        <div class="hero__title">Cada acción construye<br>tu <span>LEGADO</span></div>
        <div class="hero__desc">Sistema de evolución activo. 3 misiones en curso — 2 módulos en progreso — 1 alerta del plan de evolución.</div>
      </div>

      <div class="grid-4 mb-lg">
        ${this._statCard('Nivel Actual', MLUser.level, 'gold', 'Centinela III', 67, 'gold')}
        ${this._statCard('XP Total', MLUser.xp.toLocaleString(), 'accent', '+340 hoy', 45, 'accent')}
        <div class="card mb-md">
          <div class="card__label">Racha Actual</div>
          <div class="card__value card__value--gold">${MLUser.streak}</div>
          <div class="card__sub">días consecutivos</div>
          <div class="streak-days">
            ${MLUser.streakDays.map(d => `<div class="day-dot day-dot--${d.state}">${d.label}</div>`).join('')}
          </div>
        </div>
        ${this._statCard('Disciplina', MLUser.discipline + '%', 'teal', 'Este mes', MLUser.discipline, 'teal')}
      </div>

      <div class="grid-2 mb-lg">
        <div>
          <div class="section-head">
            <div class="section-title">Progreso Semanal</div>
            <span class="section-action">Ver completo →</span>
          </div>
          <div class="card wc-card" id="weekChartBars"></div>
        </div>
        <div>
          <div class="section-head">
            <div class="section-title">Misiones Activas</div>
            <span class="section-action" onclick="MLNavigation.go('misiones')">Ver todas →</span>
          </div>
          <div id="inicioMissions"></div>
        </div>
      </div>

      <div class="section-head"><div class="section-title">Accesos Rápidos</div></div>
      <div class="qa-grid">

        <div class="qa-card qa-card--gold" onclick="MLNavigation.go('misiones')">
          <div class="qa-card__glow"></div>
          <div class="qa-card__icon">⚡</div>
          <div class="qa-card__body">
            <div class="qa-card__tag">MISIONES</div>
            <div class="qa-card__name">Misiones Diarias</div>
            <div class="qa-card__meta">
              <span class="qa-card__dot"></span>3 pendientes
            </div>
          </div>
          <div class="qa-card__arrow">›</div>
          <div class="qa-card__bar"></div>
        </div>

        <div class="qa-card qa-card--purple" onclick="MLNavigation.go('academia')">
          <div class="qa-card__glow"></div>
          <div class="qa-card__icon">🎓</div>
          <div class="qa-card__body">
            <div class="qa-card__tag">CONOCIMIENTO</div>
            <div class="qa-card__name">Academia</div>
            <div class="qa-card__meta">
              <span class="qa-card__dot"></span>67% progreso
            </div>
          </div>
          <div class="qa-card__arrow">›</div>
          <div class="qa-card__bar"></div>
        </div>

        <div class="qa-card qa-card--teal" onclick="MLNavigation.go('evolucion')">
          <div class="qa-card__glow"></div>
          <div class="qa-card__icon">💎</div>
          <div class="qa-card__body">
            <div class="qa-card__tag">EVOLUCIÓN</div>
            <div class="qa-card__name">Centro Evolución</div>
            <div class="qa-card__meta">
              <span class="qa-card__dot"></span>Plan activo
            </div>
          </div>
          <div class="qa-card__arrow">›</div>
          <div class="qa-card__bar"></div>
        </div>

        <div class="qa-card qa-card--blue" onclick="MLNavigation.go('mentor')">
          <div class="qa-card__glow"></div>
          <div class="qa-card__icon">🤖</div>
          <div class="qa-card__body">
            <div class="qa-card__tag">INTELIGENCIA</div>
            <div class="qa-card__name">Mentor IA</div>
            <div class="qa-card__meta">
              <span class="qa-card__dot qa-card__dot--pulse"></span>24/7 disponible
            </div>
          </div>
          <div class="qa-card__arrow">›</div>
          <div class="qa-card__bar"></div>
        </div>

      </div>
    `;

    // Render chart
    MLCharts.renderWeekBars('weekChartBars', MLUser.weekProgress);

    // Render missions preview — usa renderPreview() para sincronizar estado
    MLScreenMisiones.renderPreview();
  },

  _statCard(label, value, valueClass, sub, pct, fillClass) {
    return `
      <div class="card card--${valueClass}">
        <div class="card__label">${label}</div>
        <div class="card__value card__value--${valueClass}">${value}</div>
        <div class="card__sub">${sub}</div>
        <div class="prog-bar mt-sm"><div class="prog-fill prog-fill--${fillClass}" style="width:${pct}%"></div></div>
      </div>`;
  },
};
