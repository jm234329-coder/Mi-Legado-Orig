/* ============================================================
   MI LEGADO — js/screens/evolucion.js
   Centro de Evolución — Plan de Trading Binario (Bullex)
   ============================================================ */

const MLScreenEvolucion = {

  /* ── state ───────────────────────────────────────────────── */
  _capital: null,
  _planIdx: null,
  _history: [],
  _plans:   [],
  _shaderRAF: null,
  _bankrupt: false,

  _getBurnCount() {
    return parseInt(localStorage.getItem('ml_burn_count') || '0', 10);
  },
  _incBurnCount() {
    const n = this._getBurnCount() + 1;
    localStorage.setItem('ml_burn_count', n);
    return n;
  },

  /* ── init ────────────────────────────────────────────────── */
  render() {
    const el = document.getElementById('screen-evolucion');
    if (this._bankrupt) {
      this._renderBankrupt(el);
    } else if (this._capital !== null && this._planIdx !== null) {
      this._renderDashboard(el);
    } else if (this._capital !== null) {
      this._renderPlanPicker(el);
    } else {
      this._renderWelcome(el);
    }
  },

  /* ══════════════════════════════════════════════════════════
     STEP 1 — Welcome + Capital input
     ══════════════════════════════════════════════════════════ */
  _renderWelcome(el) {
    el.innerHTML = `
      <div class="evo-welcome" id="evoWelcome">

        <!-- LEFT — hero copy -->
        <div class="evo-welcome__left">
          <div class="evo-welcome__eyebrow">CENTRO DE EVOLUCIÓN · BULLEX</div>
          <h1 class="evo-welcome__title">
            Tu camino hacia<br>
            la <em>libertad</em><br>
            <strong>financiera</strong>
          </h1>
          <p class="evo-welcome__sub">
            Define tu capital, elige tu plan y el sistema construye tu ruta de crecimiento diaria. Disciplina y consistencia son tu única ventaja.
          </p>
          <div class="evo-welcome__features">
            <div class="evo-welcome__feat">
              <div class="evo-welcome__feat-icon evo-welcome__feat-icon--teal">📈</div>
              5 niveles de riesgo adaptados a tu capital
            </div>
            <div class="evo-welcome__feat">
              <div class="evo-welcome__feat-icon evo-welcome__feat-icon--gold">⚡</div>
              Meta diaria calculada automáticamente
            </div>
            <div class="evo-welcome__feat">
              <div class="evo-welcome__feat-icon evo-welcome__feat-icon--purple">🛡</div>
              Stop-loss y gestión de riesgo integrados
            </div>
          </div>
        </div>

        <!-- RIGHT — form -->
        <div class="evo-welcome__right">
          <div class="evo-capital-card" id="evoCapitalCard">
            <div class="evo-capital-card__label">CAPITAL INICIAL (USD)</div>
            <div class="evo-capital-card__input-wrap" id="evoInputWrap">
              <span class="evo-capital-card__dollar">$</span>
              <input type="number" id="evoCapitalInput" class="evo-capital-card__input"
                placeholder="0.00" min="10" step="0.01" autocomplete="off"/>
            </div>
            <div class="evo-capital-card__hint" id="evoCapitalHint">Mínimo $10 USD · Sin límite máximo</div>
            <div class="evo-capital-card__broker-note" id="evoBrokerNote"></div>
            <button class="evo-capital-card__btn" onclick="MLScreenEvolucion._submitCapital()">
              <span class="evo-capital-card__btn-text">GENERAR MI PLAN</span>
              <span class="evo-capital-card__btn-icon">→</span>
            </button>
          </div>
        </div>

      </div>`;
    this._startParticles('evoParticles');
    this._bindCapitalInput();
  },

  _bindCapitalInput() {
    const inp  = document.getElementById('evoCapitalInput');
    const wrap = document.getElementById('evoInputWrap');
    const hint = document.getElementById('evoCapitalHint');
    const note = document.getElementById('evoBrokerNote');
    if (!inp) return;

    inp.addEventListener('input', () => {
      const v = parseFloat(inp.value);
      wrap.classList.remove('evo-capital-card__input-wrap--ok', 'evo-capital-card__input-wrap--err');
      note.innerHTML = '';

      if (inp.value === '' || isNaN(v)) {
        hint.textContent = 'Mínimo $10 USD · Sin límite máximo';
        hint.className   = 'evo-capital-card__hint';
        return;
      }
      if (v < 10) {
        wrap.classList.add('evo-capital-card__input-wrap--err');
        hint.textContent = '⚠ El capital mínimo es $10.00 USD';
        hint.className   = 'evo-capital-card__hint evo-capital-card__hint--err';
        return;
      }

      wrap.classList.add('evo-capital-card__input-wrap--ok');
      hint.textContent = `✓ $${v.toLocaleString('en-US',{minimumFractionDigits:2})} USD registrado`;
      hint.className   = 'evo-capital-card__hint evo-capital-card__hint--ok';

      // Bullex minimum warning
      if (v < 100) {
        note.innerHTML = `<div class="evo-broker-warn">⚠ <strong>Aviso Bullex:</strong> Con capital menor a $100, algunas operaciones al 1% quedan por debajo del mínimo de $1. El sistema ajustará el monto a $1/op cuando sea necesario y te indicará el plan más seguro.</div>`;
      } else if (v < 20) {
        note.innerHTML = `<div class="evo-broker-warn evo-broker-warn--red">🛑 Capital muy bajo. Solo el plan 5% permite operar con $1 mínimo en Bullex.</div>`;
      }
    });

    inp.addEventListener('keydown', e => { if (e.key === 'Enter') this._submitCapital(); });
  },

  _submitCapital() {
    const inp  = document.getElementById('evoCapitalInput');
    if (!inp) return;
    const v = parseFloat(inp.value);
    if (isNaN(v) || v < 10) {
      const wrap = document.getElementById('evoInputWrap');
      wrap?.classList.add('evo-capital-card__input-wrap--err', 'evo-capital-card__input-wrap--shake');
      setTimeout(() => wrap?.classList.remove('evo-capital-card__input-wrap--shake'), 500);
      return;
    }
    this._capital = v;
    this._computePlans();
    const welcome = document.getElementById('evoWelcome');
    if (welcome) {
      welcome.style.transition = 'opacity 400ms, transform 400ms';
      welcome.style.opacity    = '0';
      welcome.style.transform  = 'translateY(-30px) scale(0.97)';
      setTimeout(() => this._renderPlanPicker(document.getElementById('screen-evolucion')), 420);
    }
  },

  /* ══════════════════════════════════════════════════════════
     STEP 2 — Plans (with $1 minimum per op — Bullex rule)
     ══════════════════════════════════════════════════════════ */
  _computePlans() {
    const c = this._capital;
    const DAYS_YEAR = 250, DAYS_MONTH = 21, DAYS_WEEK = 5;

    this._plans = [1,2,3,4,5].map(pct => {
      const perOpRaw     = +(c * pct / 100).toFixed(2);
      const perOp        = Math.max(1.00, perOpRaw);            // Bullex min $1
      const adjusted     = perOpRaw < 1.00;                     // true = capped
      const effectivePct = +(perOp / c * 100).toFixed(1);      // real risk %

      const dailyOps    = 4;
      const payoutMult  = 0.80;
      const daily   = +(perOp * payoutMult * dailyOps).toFixed(2);
      const weekly  = +(daily * DAYS_WEEK).toFixed(2);
      const biweek  = +(daily * 10).toFixed(2);
      const monthly = +(daily * DAYS_MONTH).toFixed(2);
      const annual  = +(daily * DAYS_YEAR).toFixed(2);
      const maxLoss = +(perOp * dailyOps).toFixed(2);

      // Minimum capital required so perOp >= $1 naturally
      const minCapital = +(100 / pct).toFixed(0);

      const meta = [
        { label:'CONSERVADOR',   color:'#4dffd2', bg:'rgba(77,255,184,.08)',   border:'rgba(77,255,184,.3)',   emoji:'🟢',
          rec:'Ideal para principiantes. Preservación de capital como prioridad. Requiere mínimo $100 de capital.' },
        { label:'MODERADO',      color:'#7baaff', bg:'rgba(123,170,255,.08)',  border:'rgba(123,170,255,.3)',  emoji:'🔵',
          rec:'Balance entre crecimiento y protección. Recomendado para traders en desarrollo.' },
        { label:'MODERADO+',    color:'#d4af37', bg:'rgba(212,175,55,.08)',   border:'rgba(212,175,55,.3)',   emoji:'🟡',
          rec:'Mayor exposición. Requiere disciplina sólida y registro diario de operaciones.' },
        { label:'AGRESIVO',     color:'#ff9f43', bg:'rgba(255,159,67,.08)',   border:'rgba(255,159,67,.3)',   emoji:'🟠',
          rec:'Alto rendimiento con alta volatilidad emocional. Solo traders experimentados.' },
        { label:'MUY AGRESIVO', color:'#ff3366', bg:'rgba(255,51,102,.08)',   border:'rgba(255,51,102,.3)',   emoji:'🔴',
          rec:'Riesgo extremo. Una racha negativa puede liquidar hasta el 20% en un día.' },
      ][pct - 1];

      return { pct, perOp, perOpRaw, adjusted, effectivePct, daily, weekly, biweek, monthly, annual, maxLoss, minCapital, ...meta };
    });
  },

  _renderPlanPicker(el) {
    const c = this._capital;
    el.innerHTML = `
      <div class="evo-picker-wrap" id="evoPickerWrap">
        <div class="evo-orb evo-orb--1" style="opacity:.5"></div>
        <div class="evo-orb evo-orb--2" style="opacity:.4"></div>
        <div class="evo-picker__header">
          <button class="evo-picker__back-btn" onclick="MLScreenEvolucion._backToCapital()">← Cambiar capital</button>
          <div class="evo-picker__badge">💎 PLAN GENERADO · BULLEX</div>
          <h2 class="evo-picker__title">Elige tu <span style="color:var(--gold)">nivel de riesgo</span></h2>
          <p class="evo-picker__sub">Capital base: <strong style="color:var(--teal)">$${c.toLocaleString('en-US',{minimumFractionDigits:2})}</strong> · Selecciona el plan que se adapta a tu perfil</p>
          ${c < 100 ? `<div class="evo-picker__micro-warn">⚠ Con menos de $100, algunos planes ajustan el monto a $1/op (mínimo Bullex). El sistema te indica cuándo aplica.</div>` : ''}
        </div>
        <div class="evo-plans-grid" id="evoPlansGrid">
          ${this._plans.map((p,i) => this._planCard(p,i)).join('')}
        </div>
        <p class="evo-picker__note">
          ⚠ Mínimo por operación en Bullex: $1.00 USD. Proyecciones basadas en 4 op/día con 70% ITM y pago del 80%. Las opciones binarias conllevan riesgo de pérdida total del capital invertido por operación.
        </p>
      </div>`;

    setTimeout(() => {
      document.querySelectorAll('.evo-plan-card').forEach((c,i) => {
        c.style.animationDelay = `${i * 80}ms`;
        c.classList.add('evo-plan-card--in');
      });
    }, 50);
  },

  _planCard(p, i) {
    const adjustedHTML = p.adjusted ? `
      <div class="evo-plan-card__adjusted">
        ⚡ Ajustado a $1.00/op (mín. Bullex)<br>
        <span>Riesgo real: <strong>${p.effectivePct}%</strong> · Capital recomendado: $${p.minCapital}</span>
      </div>` : '';

    return `
      <div class="evo-plan-card${p.adjusted?' evo-plan-card--adjusted-flag':''}" id="evoPlan${i}"
        style="--pc:${p.color};--pb:${p.bg};--pbr:${p.border}"
        onclick="MLScreenEvolucion._selectPlan(${i})">
        <div class="evo-plan-card__top">
          <span class="evo-plan-card__emoji">${p.emoji}</span>
          <span class="evo-plan-card__pct">${p.pct}%</span>
          <span class="evo-plan-card__label">${p.label}</span>
        </div>
        <div class="evo-plan-card__op">
          <span class="evo-plan-card__op-val">$${p.perOp.toFixed(2)}</span>
          <span class="evo-plan-card__op-lbl">por operación</span>
        </div>
        ${adjustedHTML}
        <div class="evo-plan-card__projections">
          <div class="evo-plan-card__proj"><span>Diaria</span><strong>$${p.daily.toFixed(2)}</strong></div>
          <div class="evo-plan-card__proj"><span>Semanal</span><strong>$${p.weekly.toFixed(2)}</strong></div>
          <div class="evo-plan-card__proj"><span>Mensual</span><strong>$${p.monthly.toFixed(2)}</strong></div>
          <div class="evo-plan-card__proj"><span>Anual</span><strong>$${p.annual.toLocaleString('en-US',{minimumFractionDigits:2})}</strong></div>
        </div>
        <div class="evo-plan-card__rec">${p.rec}</div>
        <div class="evo-plan-card__loss">🛑 Stop-loss diario: <strong>$${p.maxLoss.toFixed(2)}</strong></div>
        <div class="evo-plan-card__select-btn">ELEGIR ESTE PLAN</div>
      </div>`;
  },

  _selectPlan(idx) {
    this._planIdx = idx;
    document.querySelectorAll('.evo-plan-card').forEach((c,i) => c.classList.toggle('evo-plan-card--selected', i === idx));
    setTimeout(() => this._renderDashboard(document.getElementById('screen-evolucion')), 600);
  },

  /* ══════════════════════════════════════════════════════════
     Effective plan — recalculated from currentCapital
     ══════════════════════════════════════════════════════════ */
  _effectivePlan(currentCapital) {
    const base = this._plans[this._planIdx];
    const pct  = base.pct;
    const DAYS_YEAR = 250, DAYS_MONTH = 21, DAYS_WEEK = 5;

    const perOpRaw    = +(currentCapital * pct / 100).toFixed(2);
    const perOp       = Math.max(1.00, perOpRaw);
    const adjusted    = perOpRaw < 1.00;
    const effectivePct = +(perOp / currentCapital * 100).toFixed(1);

    const daily   = +(perOp * 0.80 * 4).toFixed(2);
    const weekly  = +(daily * DAYS_WEEK).toFixed(2);
    const biweek  = +(daily * 10).toFixed(2);
    const monthly = +(daily * DAYS_MONTH).toFixed(2);
    const annual  = +(daily * DAYS_YEAR).toFixed(2);
    const maxLoss = +(perOp * 4).toFixed(2);

    return { ...base, perOp, perOpRaw, adjusted, effectivePct, daily, weekly, biweek, monthly, annual, maxLoss };
  },

  /* ══════════════════════════════════════════════════════════
     STEP 3 — Dashboard
     ══════════════════════════════════════════════════════════ */
  _renderDashboard(el) {
    const basePlan = this._plans[this._planIdx];
    const cap      = this._capital;
    const stats    = this._computeStats();
    // Use currentCapital for live per-op recalculation
    const plan     = this._effectivePlan(stats.currentCapital);
    const showBullex = plan.adjusted; // only show if currentCapital still below threshold

    const capGrowth = stats.currentCapital >= cap
      ? '+' + ((( stats.currentCapital - cap) / cap) * 100).toFixed(1) + '%'
      : (((stats.currentCapital - cap) / cap) * 100).toFixed(1) + '%';
    const capGrowthPos = stats.currentCapital >= cap;
    const disciplineColor = stats.disciplineScore >= 70 ? '#4dffd2' : stats.disciplineScore >= 40 ? '#d4af37' : '#ff3366';

    el.innerHTML = `
      <div class="evd" id="evoDash">

        <!-- ── TOP BAR ───────────────────────────────────────── -->
        <div class="evd-topbar">
          <div class="evd-topbar__left">
            <div class="evd-topbar__plan-tag">
              <span class="evd-topbar__plan-dot"></span>
              PLAN ACTIVO
            </div>
            <div class="evd-topbar__plan-name">${basePlan.emoji} ${basePlan.label}${showBullex ? ' <span class="evd-topbar__adjusted">⚡ AJUSTADO $1/OP</span>' : ''}</div>
          </div>
          <div class="evd-topbar__right">
            ${this._getBurnCount() > 0 ? `<div class="evd-burn-chip">🔥 ${this._getBurnCount()} ${this._getBurnCount()===1?'quema':'quemas'}</div>` : ''}
            <button class="evd-btn evd-btn--ghost" onclick="MLScreenEvolucion._changePlan()">⚙ Plan</button>
            <button class="evd-btn evd-btn--ghost evd-btn--danger" onclick="MLScreenEvolucion._resetAll()">↺ Reset</button>
          </div>
        </div>

        ${showBullex ? `
        <div class="evd-alert">
          <span class="evd-alert__icon">⚡</span>
          <div><strong>Bullex Mínimo:</strong> $${stats.currentCapital.toFixed(2)} al ${basePlan.pct}% = $${plan.perOpRaw.toFixed(2)}/op (bajo mínimo $1). Ajustado a <strong>$1.00/op</strong> · riesgo real ${plan.effectivePct}%. Necesitas <strong>$${basePlan.minCapital}</strong> para operar en óptimo.</div>
        </div>` : ''}

        <!-- ── HERO METRICS ───────────────────────────────────── -->
        <div class="evd-hero">
          <div class="evd-hero__capital">
            <div class="evd-hero__capital-label">CAPITAL ACTUAL</div>
            <div class="evd-hero__capital-val ${capGrowthPos?'evd-hero__capital-val--up':'evd-hero__capital-val--down'}">
              $${stats.currentCapital.toLocaleString('en-US',{minimumFractionDigits:2})}
            </div>
            <div class="evd-hero__capital-delta ${capGrowthPos?'evd-hero__capital-delta--up':'evd-hero__capital-delta--down'}">
              ${capGrowthPos?'▲':'▼'} ${capGrowth} vs capital base
            </div>
          </div>
          <div class="evd-hero__divider"></div>
          <div class="evd-hero__stats">
            <div class="evd-hero__stat">
              <div class="evd-hero__stat-val" style="color:#4dffd2">$${cap.toLocaleString('en-US',{minimumFractionDigits:2})}</div>
              <div class="evd-hero__stat-label">Capital Base</div>
            </div>
            <div class="evd-hero__stat">
              <div class="evd-hero__stat-val" style="color:#d4af37">$${stats.totalEarned>=0?'+':''}${stats.totalEarned.toLocaleString('en-US',{minimumFractionDigits:2})}</div>
              <div class="evd-hero__stat-label">Ganado Total</div>
            </div>
            <div class="evd-hero__stat">
              <div class="evd-hero__stat-val" style="color:#7b5cff">$${plan.perOp.toFixed(2)}</div>
              <div class="evd-hero__stat-label">Monto / Op</div>
            </div>
            <div class="evd-hero__stat">
              <div class="evd-hero__stat-val" style="color:${disciplineColor}">${stats.disciplineScore}%</div>
              <div class="evd-hero__stat-label">Disciplina</div>
            </div>
          </div>
          <div class="evd-hero__divider"></div>
          <div class="evd-hero__discipline">
            <div class="evd-hero__disc-label">ÍNDICE DE DISCIPLINA</div>
            <div class="evd-hero__disc-track">
              <div class="evd-hero__disc-fill" style="width:${stats.disciplineScore}%;background:${disciplineColor};box-shadow:0 0 12px ${disciplineColor}88"></div>
            </div>
            <div class="evd-hero__disc-sub">${stats.wins}W · ${stats.losses}L · ${stats.disciplineScore>=70?'Excelente consistencia':stats.disciplineScore>=40?'Mejorable':'Revisar estrategia'}</div>
          </div>
        </div>

        <!-- ── MAIN CONTENT ───────────────────────────────────── -->
        <div class="evd-body">

          <!-- LEFT COL -->
          <div class="evd-body__left">

            <!-- Metas -->
            <div class="evd-section-title">
              <span class="evd-section-title__line"></span>
              PROYECCIONES DEL PLAN
              <span class="evd-section-title__line"></span>
            </div>
            <div class="evd-targets">
              ${this._targetRow('HOY',      plan.daily,   stats.todayEarned,  '#4dffd2')}
              ${this._targetRow('SEMANA',   plan.weekly,  stats.weekEarned,   '#d4af37')}
              ${this._targetRow('QUINCENA', plan.biweek,  stats.biweekEarned, '#7b5cff')}
              ${this._targetRow('MES',      plan.monthly, stats.monthEarned,  '#ff9f43')}
              ${this._targetRow('AÑO',      plan.annual,  stats.yearEarned,   '#00d4ff')}
            </div>

            <!-- Chart -->
            <div class="evd-chart-card">
              <div class="evd-chart-card__header">
                <span class="evd-chart-card__title">EVOLUCIÓN DE CAPITAL</span>
                <span class="evd-chart-card__entries">${this._history.length} registros</span>
              </div>
              <canvas id="evoChart" height="150"></canvas>
            </div>

            <!-- Roadmap CTA -->
            <div class="evd-roadmap-cta" onclick="MLScreenEvolucion._renderRoadmap(document.getElementById('screen-evolucion'))">
              <div class="evd-roadmap-cta__left">
                <div class="evd-roadmap-cta__icon">🎯</div>
                <div>
                  <div class="evd-roadmap-cta__title">Hoja de Ruta · Objetivos y Avances</div>
                  <div class="evd-roadmap-cta__sub">Proyecciones completas, hitos y disciplina</div>
                </div>
              </div>
              <span class="evd-roadmap-cta__arrow">→</span>
            </div>

          </div>

          <!-- RIGHT COL -->
          <div class="evd-body__right">

            <!-- Logger -->
            <div class="evd-logger">
              <div class="evd-logger__header">
                <div class="evd-logger__title">Registrar Operación</div>
                <div class="evd-logger__date-wrap">
                  <input type="date" id="evoLogDate" class="evd-logger__date" value="${new Date().toISOString().slice(0,10)}"/>
                </div>
              </div>

              <div class="evd-logger__type-row">
                <button class="evd-type-btn evd-type-btn--win active" id="logToggleWin" onclick="MLScreenEvolucion._setLogType('win')">
                  <span class="evd-type-btn__icon">↑</span> GANANCIA
                </button>
                <button class="evd-type-btn evd-type-btn--loss" id="logToggleLoss" onclick="MLScreenEvolucion._setLogType('loss')">
                  <span class="evd-type-btn__icon">↓</span> PÉRDIDA
                </button>
              </div>

              <div class="evd-logger__input-wrap" id="evoLogWrap">
                <span class="evd-logger__dollar">$</span>
                <input type="number" id="evoLogInput" class="evd-logger__input" placeholder="0.00" step="0.01"/>
              </div>

              <button class="evd-logger__submit" onclick="MLScreenEvolucion._logResult()">
                REGISTRAR RESULTADO
              </button>

              <div class="evd-logger__hint">Meta hoy: <strong style="color:#4dffd2">$${plan.daily.toFixed(2)}</strong> · Stop: <strong style="color:#ff3366">-$${plan.maxLoss.toFixed(2)}</strong></div>
            </div>

            <!-- Reco -->
            <div id="evoRecoArea" class="evd-reco"></div>

            <!-- History -->
            <div class="evd-hist">
              <div class="evd-hist__header">
                <span class="evd-hist__title">HISTORIAL</span>
                <span class="evd-hist__count">${this._history.length} entradas</span>
              </div>
              <div class="evd-hist__list">
                ${this._renderHistory()}
              </div>
            </div>

          </div>
        </div>
      </div>`;


    this._drawChart();
    this._bindLogInput();
    this._renderDefaultReco();
  },

  /* ══════════════════════════════════════════════════════════
     ROADMAP VIEW (vista independiente)
     ══════════════════════════════════════════════════════════ */
  _renderRoadmap(el) {
    const plan  = this._effectivePlan(this._computeStats().currentCapital);
    const stats = this._computeStats();
    el.innerHTML = `
      <div class="evo-roadmap-view">
        <div class="evo-roadmap-view__back" onclick="MLScreenEvolucion._renderDashboard(document.getElementById('screen-evolucion'))">
          ← Volver al Dashboard
        </div>
        ${this._buildObjectivesHTML(plan, stats)}
      </div>`;
    this._startShaderCanvas('evoShaderCanvas');
  },

  /* ══════════════════════════════════════════════════════════
     OBJECTIVES SECTION
     ══════════════════════════════════════════════════════════ */
  _buildObjectivesHTML(plan, stats) {
    const cap = this._capital;
    const milestones = [
      { label:'Primera semana perfecta',   target: plan.weekly,   current: stats.weekEarned,   icon:'🌱', period:'SEMANAL' },
      { label:'Primera quincena completa', target: plan.biweek,   current: stats.biweekEarned, icon:'📈', period:'QUINCENAL' },
      { label:'Primer mes completo',       target: plan.monthly,  current: stats.monthEarned,  icon:'💰', period:'MENSUAL' },
      { label:'Doblar el capital inicial', target: cap,           current: stats.totalEarned,  icon:'🎯', period:'HITO' },
      { label:'Meta anual alcanzada',      target: plan.annual,   current: stats.yearEarned,   icon:'🏆', period:'ANUAL' },
    ];

    const summaryCards = [
      { label:'Ganancia Diaria',    val:'$'+plan.daily.toFixed(2),   sub:'Si sigues el plan al 100%',    color:'#4dffd2' },
      { label:'Ganancia Mensual',   val:'$'+plan.monthly.toFixed(2), sub:plan.pct+'% riesgo · 4 op/día', color:'#d4af37' },
      { label:'Ganancia Anual',     val:'$'+plan.annual.toLocaleString('en-US',{minimumFractionDigits:2}), sub:'250 días de trading',          color:'#7b5cff' },
      { label:'Capital Proyectado', val:'$'+(cap+plan.annual).toLocaleString('en-US',{minimumFractionDigits:2}), sub:'Capital + ganancia anual',  color:'#ff9f43' },
    ];

    return `
      <div class="evo-obj-wrap">
        <!-- Shader background canvas -->
        <canvas id="evoShaderCanvas" class="evo-obj-shader"></canvas>

        <div class="evo-obj-inner">
          <!-- Header -->
          <div class="evo-obj-header">
            <div class="evo-obj-header__badge">🎯 HOJA DE RUTA · OBJETIVOS Y AVANCES</div>
            <h3 class="evo-obj-header__title">Tu camino hacia la <span style="color:var(--gold)">libertad financiera</span></h3>
            <p class="evo-obj-header__sub">Sigue el plan al pie de la letra y estos son los resultados que obtendrás</p>
          </div>

          <!-- Summary cards -->
          <div class="evo-obj-summary">
            ${summaryCards.map(s=>`
              <div class="evo-obj-sum-card" style="--sc:${s.color}">
                <div class="evo-obj-sum-card__val">${s.val}</div>
                <div class="evo-obj-sum-card__label">${s.label}</div>
                <div class="evo-obj-sum-card__sub">${s.sub}</div>
              </div>`).join('')}
          </div>

          <!-- Milestones -->
          <div class="evo-obj-milestones-title">
            <span class="evo-obj-milestones-title__line"></span>
            <span>HITOS A ALCANZAR</span>
            <span class="evo-obj-milestones-title__line"></span>
          </div>

          <div class="evo-obj-milestones">
            ${milestones.map((m,i) => {
              const pct     = m.target > 0 ? Math.min(100, Math.max(0, (m.current / m.target) * 100)) : 0;
              const done    = pct >= 100;
              const neg     = m.current < 0;
              const barColor= done ? '#4dffd2' : neg ? '#ff3366' : '#d4af37';
              return `
              <div class="evo-obj-milestone ${done?'evo-obj-milestone--done':''}" style="--mi:${i}">
                <div class="evo-obj-milestone__left">
                  <div class="evo-obj-milestone__icon ${done?'evo-obj-milestone__icon--done':''}">${done?'✅':m.icon}</div>
                  <div class="evo-obj-milestone__info">
                    <div class="evo-obj-milestone__period">${m.period}</div>
                    <div class="evo-obj-milestone__label">${m.label}</div>
                    <div class="evo-obj-milestone__values">
                      <span style="color:${neg?'#ff3366':done?'#4dffd2':'#d4af37'}">$${m.current.toFixed(2)}</span>
                      <span style="color:rgba(255,255,255,.3)">/ $${m.target.toLocaleString('en-US',{minimumFractionDigits:2})}</span>
                    </div>
                  </div>
                </div>
                <div class="evo-obj-milestone__right">
                  <div class="evo-obj-milestone__pct" style="color:${barColor}">${Math.round(pct)}%</div>
                  <div class="evo-obj-milestone__bar-wrap">
                    <div class="evo-obj-milestone__bar-fill" style="width:${pct}%;background:${barColor};box-shadow:0 0 8px ${barColor}88"></div>
                  </div>
                  ${done ? '<div class="evo-obj-milestone__achieved">🎉 ¡LOGRADO!</div>' : ''}
                </div>
              </div>`;
            }).join('')}
          </div>

          <!-- Discipline gauge -->
          <div class="evo-obj-gauge-wrap">
            <div class="evo-obj-gauge-label">ÍNDICE DE DISCIPLINA DEL PLAN</div>
            <div class="evo-obj-gauge">
              <div class="evo-obj-gauge__track">
                <div class="evo-obj-gauge__fill" style="width:${stats.disciplineScore}%;background:${stats.disciplineScore>=70?'linear-gradient(90deg,#4dffd2,#7b5cff)':stats.disciplineScore>=40?'linear-gradient(90deg,#d4af37,#ff9f43)':'linear-gradient(90deg,#ff3366,#ff9f43)'}"></div>
              </div>
              <div class="evo-obj-gauge__score" style="color:${stats.disciplineScore>=70?'#4dffd2':stats.disciplineScore>=40?'#d4af37':'#ff3366'}">${stats.disciplineScore}%</div>
            </div>
            <div class="evo-obj-gauge__legend">
              <span style="color:#ff3366">0–39% Crítico</span>
              <span style="color:#d4af37">40–69% En desarrollo</span>
              <span style="color:#4dffd2">70–100% Disciplinado</span>
            </div>
            <p class="evo-obj-gauge__tip">${this._disciplineTip(stats.disciplineScore, stats.wins, stats.losses)}</p>
          </div>

        </div>
      </div>`;
  },

  _disciplineTip(score, wins, losses) {
    if (wins + losses === 0) return '📊 Registra tus primeros resultados para ver tu índice de disciplina en tiempo real.';
    if (score >= 90) return '🏆 Disciplina élite. Eres parte del 5% de traders que mantienen este nivel de consistencia.';
    if (score >= 70) return '💪 Excelente disciplina. Sigue así y los resultados se acumularán de forma compuesta.';
    if (score >= 50) return '📈 Vas por buen camino. Enfócate en reducir las operaciones fuera del plan.';
    return '⚠ Tu disciplina necesita atención. Revisa las operaciones perdedoras y detecta el patrón.';
  },

  /* ── shared helpers ───────────────────────────────────────── */
  _kpi(val, label, color) {
    const colors = { teal:'var(--teal)', gold:'var(--gold)', accent:'var(--accent)', red:'var(--red)', orange:'#ff9f43', purple:'#a855f7', blue:'#60a5fa' };
    return `
      <div class="evo-kpi">
        <div class="evo-kpi__val" style="color:${colors[color]||colors.teal}">${val}</div>
        <div class="evo-kpi__label">${label}</div>
      </div>`;
  },

  _targetRow(label, target, done, color) {
    const pct  = target > 0 ? Math.min(100, Math.max(0, (done / target) * 100)) : 0;
    const over = done >= target;
    const neg  = done < 0;
    const barColor = neg ? '#ff3366' : color;
    return `
      <div class="evd-target">
        <div class="evd-target__top">
          <span class="evd-target__label">${label}</span>
          <div class="evd-target__right">
            <span class="evd-target__done" style="color:${neg?'#ff3366':over?color:'rgba(220,215,200,.5)'}">${done>=0?'+':''}$${done.toFixed(2)}</span>
            <span class="evd-target__sep">/</span>
            <span class="evd-target__goal" style="color:${color}">$${target.toFixed(2)}</span>
            <span class="evd-target__pct" style="color:${barColor}">${Math.round(pct)}%${over?' ✓':''}</span>
          </div>
        </div>
        <div class="evd-target__track">
          <div class="evd-target__fill" style="width:${pct}%;background:${barColor};box-shadow:0 0 10px ${barColor}55"></div>
        </div>
      </div>`;
  },

  _goalCard2(label, target, done, fill) {
    const pct  = target>0 ? Math.min(100,Math.max(0,Math.round((done/target)*100))) : 0;
    const over = done>target, neg = done<0;
    const colors = { teal:'#4dffd2', gold:'#d4af37', accent:'#7b5cff', purple:'#a855f7', blue:'#60a5fa' };
    const c = colors[fill]||colors.teal;
    return `
      <div class="card mb-sm evo-goal-card">
        <div class="evo-goal-card__top">
          <span class="evo-goal-card__label">${label}</span>
          <span class="evo-goal-card__target" style="color:${c}">$${target.toLocaleString('en-US',{minimumFractionDigits:2})}</span>
        </div>
        <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;background:${neg?'var(--red)':c};box-shadow:0 0 8px ${neg?'rgba(255,51,102,.4)':c+'66'}"></div></div>
        <div class="evo-goal-card__sub">
          <span style="color:${neg?'var(--red)':over?'var(--teal)':'var(--text-secondary)'}">$${done.toLocaleString('en-US',{minimumFractionDigits:2})} / $${target.toLocaleString('en-US',{minimumFractionDigits:2})}</span>
          <span style="color:${c};font-weight:700">${pct}%${over?' 🎯':''}</span>
        </div>
      </div>`;
  },

  _renderHistory() {
    if (!this._history.length) return `<div style="text-align:center;color:var(--text-secondary);font-size:.75rem;padding:var(--space-md);opacity:.6">Sin registros aún.</div>`;
    return [...this._history].reverse().slice(0,20).map(h => {
      const pos = h.amount >= 0;
      return `
        <div class="evo-hist-item evo-hist-item--${pos?'win':'loss'}">
          <div class="evo-hist-item__left">
            <span class="evo-hist-item__icon">${pos?'✅':'❌'}</span>
            <div>
              <div class="evo-hist-item__date">${h.date}</div>
              ${h.note?`<div class="evo-hist-item__note">${h.note}</div>`:''}
            </div>
          </div>
          <div class="evo-hist-item__amount" style="color:${pos?'var(--teal)':'var(--red)'}">
            ${pos?'+':''}$${Math.abs(h.amount).toFixed(2)}
          </div>
        </div>`;
    }).join('');
  },

  /* ── logging ─────────────────────────────────────────────── */
  _logType: 'win',

  _setLogType(t) {
    this._logType = t;
    document.getElementById('logToggleWin')?.classList.toggle('active',  t==='win');
    document.getElementById('logToggleLoss')?.classList.toggle('active', t==='loss');
  },

  _bindLogInput() {
    const inp  = document.getElementById('evoLogInput');
    const wrap = document.getElementById('evoLogWrap');
    if (!inp) return;
    inp.addEventListener('input', () => {
      const v = parseFloat(inp.value);
      wrap.classList.remove('evo-logger__input-wrap--ok','evo-logger__input-wrap--err');
      if (!isNaN(v) && v!==0) wrap.classList.add(v>0?'evo-logger__input-wrap--ok':'evo-logger__input-wrap--err');
    });
  },

  _logResult() {
    const inp    = document.getElementById('evoLogInput');
    const dateEl = document.getElementById('evoLogDate');
    if (!inp) return;
    let v = parseFloat(inp.value);
    if (isNaN(v)||v===0) {
      document.getElementById('evoLogWrap')?.classList.add('evo-capital-card__input-wrap--shake');
      setTimeout(()=>document.getElementById('evoLogWrap')?.classList.remove('evo-capital-card__input-wrap--shake'),500);
      return;
    }
    if (this._logType==='loss' && v>0) v=-v;
    if (this._logType==='win'  && v<0) v=Math.abs(v);
    this._history.push({ date: dateEl?.value||new Date().toISOString().slice(0,10), amount:v, note:'' });
    inp.value = '';
    document.getElementById('evoLogWrap')?.classList.remove('evo-logger__input-wrap--ok','evo-logger__input-wrap--err');

    this._cancelShader();

    // Check if capital is wiped out
    const stats = this._computeStats();
    if (stats.currentCapital <= 0) {
      this._bankrupt = true;
      this._incBurnCount();
      this._renderBankrupt(document.getElementById('screen-evolucion'));
      return;
    }

    this._renderDashboard(document.getElementById('screen-evolucion'));
    this._showReco(v);
    MLNotifications?.show(v>=0?'✅':'⚠','Resultado registrado', v>=0?`+$${v.toFixed(2)} añadido`:`Pérdida $${Math.abs(v).toFixed(2)} registrada`);
  },

  _renderBankrupt(el) {
    const burnCount = this._getBurnCount();
    const phrases = [
      'El fracaso no es el fin — es la materia prima de los grandes.',
      'Cada leyenda tiene un capítulo donde todo se derrumbó.',
      'Los que no conocen la derrota no saben lo que significa ganar de verdad.',
      'Caíste. Eso significa que estuviste en el campo de batalla.',
      'La adversidad revela lo que la comodidad nunca podría enseñarte.',
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    el.innerHTML = `
      <div class="evo-bankrupt" id="evoBankrupt">
        <div class="evo-bankrupt__bg"></div>
        <div class="evo-bankrupt__content">
          <div class="evo-bankrupt__icon">💀</div>
          <div class="evo-bankrupt__tag">CUENTA LIQUIDADA</div>
          <div class="evo-bankrupt__burn-count">
            🔥 Cuentas quemadas: <strong>${burnCount}</strong>
          </div>
          <h1 class="evo-bankrupt__title">Tu capital<br>llegó a <span>$0.00</span></h1>
          <p class="evo-bankrupt__sub">
            Tu plan de trading ha sido cancelado.<br>
            Todo el progreso ha sido eliminado.
          </p>
          <div class="evo-bankrupt__phrase">"${phrase}"</div>
          <button class="evo-bankrupt__btn" onclick="MLScreenEvolucion._resetAndGoHome()">
            <span class="evo-bankrupt__btn-icon">⚔</span>
            <span>Volveré más preparado que nunca</span>
            <span class="evo-bankrupt__btn-arrow">→</span>
          </button>
        </div>
      </div>`;

    // Animate in
    requestAnimationFrame(() => {
      document.getElementById('evoBankrupt')?.classList.add('evo-bankrupt--visible');
    });
  },

  _resetAndGoHome() {
    this._cancelShader();
    this._capital = null; this._planIdx = null; this._history = []; this._plans = [];
    this._bankrupt = false;
    MLNavigation?.go('inicio');
  },

  /* ── reco ────────────────────────────────────────────────── */
  _renderDefaultReco() {
    const stats=this._computeStats();
    const plan=this._effectivePlan(stats.currentCapital);
    const area=document.getElementById('evoRecoArea'); if(!area) return;
    if (!this._history.length) { area.innerHTML=this._recoCard('🚀','Plan Listo',`Tu plan al ${plan.pct}% está activo con $${plan.perOp.toFixed(2)}/op. Registra tu primer resultado.`,'teal'); return; }
    const pct = plan.daily>0?(stats.todayEarned/plan.daily)*100:0;
    if (pct>=100) area.innerHTML=this._recoCard('🎯','¡Meta Diaria Alcanzada!','Detente aquí. La sobreoperación destruye la consistencia.','teal');
    else if (stats.todayEarned<0&&Math.abs(stats.todayEarned)>=plan.maxLoss*0.8) area.innerHTML=this._recoCard('🛑','Cerca del Stop-Loss',`Límite diario: $${plan.maxLoss.toFixed(2)}. Detén operaciones.`,'red');
    else area.innerHTML=this._recoCard('📊','Seguimiento Activo',`$${stats.todayEarned.toFixed(2)} hoy (${Math.round(pct)}% de la meta de $${plan.daily.toFixed(2)}).`,'gold');
  },

  _showReco(amount) {
    const stats=this._computeStats();
    const plan=this._effectivePlan(stats.currentCapital);
    const area=document.getElementById('evoRecoArea'); if(!area) return;
    if (amount>=0) {
      const pct=plan.daily>0?Math.round((stats.todayEarned/plan.daily)*100):0;
      if (pct>=100) area.innerHTML=this._recoCard('🏆','¡Meta Diaria Superada!',`+$${amount.toFixed(2)}. Llevas ${pct}% de la meta. Cierra operaciones — la codicia es el enemigo N°1.`,'teal');
      else area.innerHTML=this._recoCard('✅','Ganancia Registrada',`+$${amount.toFixed(2)} sumado. Vas al ${pct}% de la meta diaria ($${plan.daily.toFixed(2)}).`,'teal');
    } else {
      const loss=Math.abs(amount), totalDayLoss=Math.abs(Math.min(0,stats.todayEarned));
      const ratio=plan.maxLoss>0?totalDayLoss/plan.maxLoss:0;
      if (ratio>=1) area.innerHTML=this._recoCard('🛑','STOP-LOSS DIARIO ALCANZADO',`Pérdida máxima de $${plan.maxLoss.toFixed(2)} alcanzada. DETÉN TODAS LAS OPERACIONES HOY.`,'red');
      else if (ratio>=0.6) area.innerHTML=this._recoCard('⚠','Alerta de Riesgo',`-$${loss.toFixed(2)}. Has usado ${Math.round(ratio*100)}% del límite diario ($${plan.maxLoss.toFixed(2)}). Evalúa si continuar.`,'orange');
      else area.innerHTML=this._recoCard('📉','Pérdida Registrada',`-$${loss.toFixed(2)}. Stop-loss diario restante: $${(plan.maxLoss-totalDayLoss).toFixed(2)}. Analiza sin revenge trading.`,'gold');
    }
  },

  _recoCard(icon, title, body, type) {
    const c={teal:'rgba(77,255,184,.1)',gold:'rgba(212,175,55,.1)',red:'rgba(255,51,102,.1)',orange:'rgba(255,159,67,.1)',accent:'rgba(123,92,255,.1)'};
    const b={teal:'rgba(77,255,184,.3)',gold:'rgba(212,175,55,.3)',red:'rgba(255,51,102,.3)',orange:'rgba(255,159,67,.3)',accent:'rgba(123,92,255,.3)'};
    const t={teal:'var(--teal)',gold:'var(--gold)',red:'var(--red)',orange:'#ff9f43',accent:'var(--accent)'};
    return `<div class="evo-reco-card mt-md" style="background:${c[type]||c.teal};border-color:${b[type]||b.teal}"><div class="evo-reco-card__header"><span style="font-size:1.2rem">${icon}</span><span class="evo-reco-card__title" style="color:${t[type]||t.teal}">${title}</span></div><p class="evo-reco-card__body">${body}</p></div>`;
  },

  /* ── stats ────────────────────────────────────────────────── */
  _computeStats() {
    const now=new Date(), today=now.toISOString().slice(0,10);
    const year=now.getFullYear(), month=now.getMonth(), day=now.getDate();
    const biweekStart=day<=15?`${year}-${String(month+1).padStart(2,'0')}-01`:`${year}-${String(month+1).padStart(2,'0')}-16`;
    const dow=(now.getDay()+6)%7; const mon=new Date(now); mon.setDate(day-dow);
    const weekStart=mon.toISOString().slice(0,10);
    let todayEarned=0,weekEarned=0,biweekEarned=0,monthEarned=0,yearEarned=0,wins=0,losses=0;
    this._history.forEach(h=>{
      const d=h.date;
      if(d===today) todayEarned+=h.amount;
      if(d>=weekStart) weekEarned+=h.amount;
      if(d>=biweekStart) biweekEarned+=h.amount;
      if(d.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)) monthEarned+=h.amount;
      if(d.startsWith(`${year}`)) yearEarned+=h.amount;
      if(h.amount>=0) wins++; else losses++;
    });
    const total=wins+losses;
    const disciplineScore=total===0?100:Math.round((wins/total)*100);
    const totalEarned=+yearEarned.toFixed(2);
    return { todayEarned:+todayEarned.toFixed(2), weekEarned:+weekEarned.toFixed(2), biweekEarned:+biweekEarned.toFixed(2), monthEarned:+monthEarned.toFixed(2), yearEarned:+yearEarned.toFixed(2), totalEarned, currentCapital:+(this._capital+totalEarned).toFixed(2), disciplineScore, wins, losses };
  },

  /* ── chart ────────────────────────────────────────────────── */
  _drawChart() {
    const canvas = document.getElementById('evoChart'); if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const dpr    = window.devicePixelRatio || 1;
    const W0     = canvas.parentElement?.offsetWidth || 600;
    const H0     = 220;
    canvas.width  = W0 * dpr;
    canvas.height = H0 * dpr;
    canvas.style.width  = W0 + 'px';
    canvas.style.height = H0 + 'px';
    ctx.scale(dpr, dpr);
    const W = W0, H = H0;

    const cap  = this._capital;
    const plan = this._plans[this._planIdx];
    const sorted = [...this._history].sort((a,b) => a.date.localeCompare(b.date));
    const points = [{ label:'Inicio', val:cap, amount:0 }];
    let running = cap;
    sorted.forEach(h => { running += h.amount; points.push({ label:h.date.slice(5), val:+running.toFixed(2), amount:h.amount }); });
    const targetPts = points.map((p,i) => ({ val:+(cap + plan.daily * i).toFixed(2) }));

    const pad = { t:24, r:24, b:44, l:68 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;

    const allVals = [...points.map(p=>p.val), ...targetPts.map(p=>p.val)];
    const rawMin = Math.min(...allVals), rawMax = Math.max(...allVals);
    const margin = (rawMax - rawMin) * 0.15 || cap * 0.1;
    const minV = rawMin - margin, maxV = rawMax + margin;

    const sx = i  => pad.l + (i / Math.max(points.length - 1, 1)) * cW;
    const sy = v  => pad.t + (1 - (v - minV) / (maxV - minV)) * cH;

    // ── background
    ctx.clearRect(0, 0, W, H);

    // ── grid lines + labels
    const GRID = 5;
    for (let i = 0; i <= GRID; i++) {
      const y   = pad.t + (i / GRID) * cH;
      const val = maxV - (i / GRID) * (maxV - minV);
      ctx.beginPath();
      ctx.strokeStyle = i === GRID ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.04)';
      ctx.lineWidth = 1;
      ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y);
      ctx.stroke();
      ctx.fillStyle = 'rgba(220,215,200,.3)';
      ctx.font = `${10 * dpr / dpr}px "Fira Code", monospace`;
      ctx.textAlign = 'right';
      ctx.fillText('$' + (val >= 1000 ? (val/1000).toFixed(1)+'k' : val.toFixed(val<10?2:0)), pad.l - 8, y + 4);
    }

    // ── vertical tick labels (dates)
    const maxTicks = Math.min(points.length, 8);
    const step = Math.ceil(points.length / maxTicks);
    ctx.fillStyle = 'rgba(220,215,200,.25)';
    ctx.font = '9px "Fira Code", monospace';
    ctx.textAlign = 'center';
    points.forEach((p, i) => {
      if (i % step === 0 || i === points.length - 1) {
        ctx.fillText(p.label, sx(i), H - pad.b + 16);
      }
    });

    // ── smooth path helper (cubic bezier)
    function smoothLine(pts, getX, getY) {
      if (pts.length < 2) return;
      ctx.moveTo(getX(0), getY(0));
      for (let i = 1; i < pts.length; i++) {
        const x0 = getX(i-1), y0 = getY(i-1);
        const x1 = getX(i),   y1 = getY(i);
        const cpx = (x0 + x1) / 2;
        ctx.bezierCurveTo(cpx, y0, cpx, y1, x1, y1);
      }
    }

    // ── target line (dashed gold)
    if (sorted.length > 0) {
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(212,175,55,.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      smoothLine(targetPts, (_,i) => sx(i), p => sy(p.val));
      ctx.stroke();
      ctx.restore();
    }

    // ── area fill under capital line
    const areaGrad = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
    const isProfit = points[points.length-1].val >= cap;
    if (isProfit) {
      areaGrad.addColorStop(0,   'rgba(77,255,184,.22)');
      areaGrad.addColorStop(0.6, 'rgba(77,255,184,.06)');
      areaGrad.addColorStop(1,   'rgba(77,255,184,.00)');
    } else {
      areaGrad.addColorStop(0,   'rgba(255,51,102,.18)');
      areaGrad.addColorStop(0.6, 'rgba(255,51,102,.05)');
      areaGrad.addColorStop(1,   'rgba(255,51,102,.00)');
    }
    ctx.beginPath();
    smoothLine(points, (_,i) => sx(i), p => sy(p.val));
    ctx.lineTo(sx(points.length-1), H - pad.b);
    ctx.lineTo(sx(0), H - pad.b);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // ── glow under line
    ctx.save();
    ctx.shadowColor  = isProfit ? '#4dffd2' : '#ff3366';
    ctx.shadowBlur   = 14;
    ctx.strokeStyle  = isProfit ? '#4dffd2' : '#ff3366';
    ctx.lineWidth    = 2.5;
    ctx.lineJoin     = 'round';
    ctx.beginPath();
    smoothLine(points, (_,i) => sx(i), p => sy(p.val));
    ctx.stroke();
    ctx.restore();

    // ── capital baseline
    const baseY = sy(cap);
    ctx.save();
    ctx.setLineDash([3, 6]);
    ctx.strokeStyle = 'rgba(255,255,255,.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.l, baseY); ctx.lineTo(W - pad.r, baseY);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    ctx.font = '8px "Fira Code", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('BASE', pad.l - 4, baseY + 3);

    // ── data points
    points.forEach((p, i) => {
      const x = sx(i), y = sy(p.val);
      const gain  = p.amount > 0;
      const loss  = p.amount < 0;
      const color = loss ? '#ff3366' : p.val >= cap ? '#4dffd2' : '#ff9f43';
      const r     = i === 0 || i === points.length - 1 ? 5 : 3.5;

      // outer glow
      ctx.save();
      ctx.shadowColor = color; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
      ctx.fillStyle = color; ctx.fill();
      ctx.restore();

      // inner white
      ctx.beginPath(); ctx.arc(x, y, r * 0.45, 0, Math.PI*2);
      ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.7; ctx.fill();
      ctx.globalAlpha = 1;
    });

    // ── last point callout
    const last = points[points.length - 1];
    const lx = sx(points.length - 1), ly = sy(last.val);
    const label = '$' + last.val.toLocaleString('en-US', { minimumFractionDigits:2 });
    const lColor = last.val >= cap ? '#4dffd2' : '#ff3366';
    ctx.font = 'bold 11px "Fira Code", monospace';
    const tw = ctx.measureText(label).width;
    const bx = Math.min(lx - tw/2 - 8, W - pad.r - tw - 16);
    const by = ly - 28;
    ctx.fillStyle = 'rgba(7,7,15,.85)';
    ctx.strokeStyle = lColor + '66';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(bx, by, tw + 16, 20, 5);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = lColor;
    ctx.textAlign = 'center';
    ctx.fillText(label, bx + (tw + 16)/2, by + 14);

    // ── legend
    const legendX = pad.l;
    const legendY = H - 10;
    ctx.font = '9px "Fira Code", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#4dffd2';
    ctx.beginPath(); ctx.roundRect(legendX, legendY - 4, 18, 3, 2); ctx.fill();
    ctx.fillStyle = 'rgba(220,215,200,.4)';
    ctx.fillText('Capital real', legendX + 24, legendY);
    ctx.fillStyle = 'rgba(212,175,55,.55)';
    ctx.setLineDash([4,4]);
    ctx.strokeStyle = 'rgba(212,175,55,.55)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(legendX + 110, legendY - 2); ctx.lineTo(legendX + 128, legendY - 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(220,215,200,.4)';
    ctx.fillText('Meta plan', legendX + 134, legendY);

    // ── hover tooltip
    if (this._chartHoverOff) { canvas.removeEventListener('mousemove', this._chartHoverOff); canvas.removeEventListener('mouseleave', this._chartLeaveOff); }
    const tooltip = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left);
      let closest = 0, minDist = Infinity;
      points.forEach((_, i) => { const d = Math.abs(sx(i) - mx); if (d < minDist) { minDist = d; closest = i; }});
      if (minDist > 40) return;
      const p2 = points[closest];
      const x2 = sx(closest), y2 = sy(p2.val);
      // redraw
      this._drawChart();
      // crosshair
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = 1; ctx.setLineDash([3,3]);
      ctx.beginPath(); ctx.moveTo(x2, pad.t); ctx.lineTo(x2, H - pad.b); ctx.stroke();
      ctx.restore();
      // tooltip box
      const tLabel = `${p2.label}  $${p2.val.toFixed(2)}${closest>0?' ('+( p2.amount>=0?'+':'')+p2.amount.toFixed(2)+')':''}`;
      ctx.font = '10px "Fira Code", monospace';
      const tw2 = ctx.measureText(tLabel).width;
      const tx = Math.min(x2 - tw2/2 - 10, W - pad.r - tw2 - 20);
      const ty = y2 - 44;
      const tColor = p2.val >= cap ? '#4dffd2' : '#ff3366';
      ctx.fillStyle = 'rgba(7,7,15,.92)';
      ctx.strokeStyle = tColor + '88';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(Math.max(tx, pad.l), Math.max(ty, 4), tw2 + 20, 26, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = tColor; ctx.textAlign = 'left';
      ctx.fillText(tLabel, Math.max(tx, pad.l) + 10, Math.max(ty, 4) + 17);
      // highlight dot
      ctx.save(); ctx.shadowColor = tColor; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.arc(x2, y2, 6, 0, Math.PI*2);
      ctx.fillStyle = tColor; ctx.fill(); ctx.restore();
    };
    this._chartHoverOff  = tooltip;
    this._chartLeaveOff  = () => this._drawChart();
    canvas.addEventListener('mousemove', tooltip);
    canvas.addEventListener('mouseleave', this._chartLeaveOff);
  },

  /* ── navigation ───────────────────────────────────────────── */
  _backToCapital() {
    this._capital = null;
    this._plans   = [];
    const el = document.getElementById('screen-evolucion');
    el.style.transition = 'opacity 300ms';
    el.style.opacity = '0';
    setTimeout(() => { el.style.opacity = '1'; this._renderWelcome(el); }, 320);
  },
  _changePlan() { this._cancelShader(); this._planIdx=null; this._renderPlanPicker(document.getElementById('screen-evolucion')); },
  _resetAll() {
    if (!confirm('¿Reiniciar todo? Se borrarán el capital, el plan y el historial.')) return;
    this._cancelShader(); this._capital=null; this._planIdx=null; this._history=[]; this._plans=[];
    this._renderWelcome(document.getElementById('screen-evolucion'));
  },
  _cancelShader() { if(this._shaderRAF){cancelAnimationFrame(this._shaderRAF);this._shaderRAF=null;} },

  /* ══════════════════════════════════════════════════════════
     WebGL SHADER — Nebula background for objectives
     ══════════════════════════════════════════════════════════ */
  _startShaderCanvas(id) {
    return; // disabled

    const resize = () => {
      const wrap = canvas.parentElement;
      if (!wrap) return;
      canvas.width  = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
      gl.viewport(0,0,canvas.width,canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const vert = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

    const frag = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(in vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}return t;}
float clouds(vec2 p){float d=1.,t=.0;for(float i=.0;i<3.;i++){float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);t=mix(t,d,a);d=a;p*=2./(i+1.);}return t;}
void main(void){
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.3,-st.y));
  uv*=1.-.3*(sin(T*.15)*.5+.5);
  for(float i=1.;i<10.;i++){
    uv+=.08*cos(i*vec2(.1+.01*i,.8)+i*i+T*.4+.1*uv.x);
    vec2 p=uv;float d=length(p);
    // Gold/teal palette instead of default
    vec3 palette=cos(sin(i)*vec3(0.8,1.4,2.2)+vec3(1.2,0.6,0.0))+0.5;
    col+=.0012/d*(palette);
    float b=noise(i+p+bg*1.731);
    col+=.0015*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.18,bg*.12,bg*.04),d*0.5);
  }
  col*=0.85;
  O=vec4(col,1);
}`;

    const compile = (type, src) => {
      const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); return s;
    };
    const vs=compile(gl.VERTEX_SHADER,vert), fs=compile(gl.FRAGMENT_SHADER,frag);
    const prog=gl.createProgram(); gl.attachShader(prog,vs); gl.attachShader(prog,fs); gl.linkProgram(prog);

    const buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,1,-1,-1,1,1,1,-1]),gl.STATIC_DRAW);
    const pos=gl.getAttribLocation(prog,'position');
    gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    gl.useProgram(prog);
    const uRes=gl.getUniformLocation(prog,'resolution'), uTime=gl.getUniformLocation(prog,'time');

    const loop = (now) => {
      if (!document.getElementById(id)) { this._cancelShader(); return; }
      gl.uniform2f(uRes,canvas.width,canvas.height);
      gl.uniform1f(uTime,now*1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      this._shaderRAF=requestAnimationFrame(loop);
    };
    this._shaderRAF=requestAnimationFrame(loop);
    document.addEventListener('ml-screen-change',()=>{ this._cancelShader(); window.removeEventListener('resize',resize); },{once:true});
  },

  /* ── particle background (welcome) ───────────────────────── */
  _startParticles(id) {
    return; // disabled
    const ctx=canvas.getContext('2d'); let W,H,particles=[],raf;
    const resize=()=>{ W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; };
    resize(); window.addEventListener('resize',resize);
    for(let i=0;i<60;i++) particles.push({x:Math.random()*(W||800),y:Math.random()*(H||600),r:Math.random()*2+0.5,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,alpha:Math.random()*.5+.1,color:Math.random()>.5?'#4dffd2':'#d4af37'});
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.color;ctx.globalAlpha=p.alpha;ctx.fill();});
      ctx.globalAlpha=1; raf=requestAnimationFrame(draw);
    };
    draw();
    document.addEventListener('ml-screen-change',()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',resize); },{once:true});
  },
};
