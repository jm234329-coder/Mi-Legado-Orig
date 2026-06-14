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

  /* ── init ────────────────────────────────────────────────── */
  render() {
    const el = document.getElementById('screen-evolucion');
    if (this._capital !== null && this._planIdx !== null) {
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
        <canvas id="evoParticles" class="evo-particles"></canvas>
        <div class="evo-orb evo-orb--1"></div>
        <div class="evo-orb evo-orb--2"></div>
        <div class="evo-orb evo-orb--3"></div>
        <div class="evo-welcome__inner">
          <div class="evo-welcome__badge">💎 CENTRO DE EVOLUCIÓN · OPCIONES BINARIAS · BULLEX</div>
          <h1 class="evo-welcome__title">
            Bienvenido a tu <span class="evo-welcome__title--accent">punto de partida</span><br>
            hacia el <span class="evo-welcome__title--gold">éxito financiero</span>
          </h1>
          <p class="evo-welcome__sub">
            Define tu capital inicial y el sistema construirá tu plan de trading personalizado.<br>
            Tu disciplina hoy forja tu libertad mañana.
          </p>
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
          <div class="evo-welcome__stats">
            <div class="evo-welcome__stat"><span>5</span> Niveles de riesgo</div>
            <div class="evo-welcome__stat-sep">·</div>
            <div class="evo-welcome__stat"><span>5</span> Temporalidades</div>
            <div class="evo-welcome__stat-sep">·</div>
            <div class="evo-welcome__stat"><span>$1</span> mín. por op. (Bullex)</div>
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

    el.innerHTML = `
      <div class="evo-dash" id="evoDash">
        <div class="evo-orb evo-orb--1" style="opacity:.3"></div>
        <div class="evo-orb evo-orb--2" style="opacity:.25"></div>

        <!-- Header -->
        <div class="evo-dash__header">
          <div>
            <div class="evo-dash__badge">💎 PLAN ACTIVO · ${basePlan.emoji} ${basePlan.label}${showBullex ? ' · ⚡ AJUSTADO A $1/OP' : ''}</div>
            <h2 class="evo-dash__title">Centro de <span style="color:var(--accent)">Evolución</span></h2>
          </div>
          <div class="evo-dash__header-actions">
            <button class="evo-dash__change-btn" onclick="MLScreenEvolucion._changePlan()">⚙ Cambiar Plan</button>
            <button class="evo-dash__reset-btn" onclick="MLScreenEvolucion._resetAll()">↺ Reiniciar</button>
          </div>
        </div>

        ${showBullex ? `
        <div class="evo-adjusted-banner">
          ⚡ <strong>Bullex Mínimo Aplicado:</strong> Tu capital actual de <strong>$${stats.currentCapital.toFixed(2)}</strong> al ${basePlan.pct}% equivale a $${plan.perOpRaw.toFixed(2)}/op — por debajo del mínimo de $1.00 de Bullex. El sistema ajustó a <strong>$1.00/op</strong> (riesgo real: ${plan.effectivePct}%). Incrementa tu capital a <strong>$${basePlan.minCapital}</strong> para operar este plan de forma óptima.
        </div>` : ''}

        <!-- KPIs -->
        <div class="evo-kpis" id="evoKpis">
          ${this._kpi('$'+cap.toLocaleString('en-US',{minimumFractionDigits:2}), 'Capital Base', 'teal')}
          ${this._kpi(basePlan.pct+'%'+(showBullex?` (${plan.effectivePct}% real)`:''), 'Riesgo / Op.', 'gold')}
          ${this._kpi('$'+plan.perOp.toFixed(2), 'Monto / Op.', showBullex?'orange':'accent')}
          ${this._kpi('$'+stats.totalEarned.toLocaleString('en-US',{minimumFractionDigits:2}), 'Ganado Total', stats.totalEarned>=0?'teal':'red')}
          ${this._kpi('$'+stats.currentCapital.toLocaleString('en-US',{minimumFractionDigits:2}), 'Capital Actual', stats.currentCapital>=cap?'gold':'red')}
          ${this._kpi(stats.disciplineScore+'%', 'Disciplina', stats.disciplineScore>=70?'teal':stats.disciplineScore>=40?'gold':'red')}
        </div>

        <!-- Main grid -->
        <div class="evo-main-grid">
          <div class="evo-main-grid__left">
            <div class="section-head"><div class="section-title">Proyecciones del Plan <span style="font-size:.6rem;color:var(--text-secondary);font-weight:400">(basadas en capital actual)</span></div></div>
            ${this._goalCard2('META DIARIA',    plan.daily,   stats.todayEarned,  'teal')}
            ${this._goalCard2('META SEMANAL',   plan.weekly,  stats.weekEarned,   'gold')}
            ${this._goalCard2('META QUINCENAL', plan.biweek,  stats.biweekEarned, 'accent')}
            ${this._goalCard2('META MENSUAL',   plan.monthly, stats.monthEarned,  'purple')}
            ${this._goalCard2('META ANUAL',     plan.annual,  stats.yearEarned,   'blue')}
            <div class="card mt-md">
              <div style="font-size:0.625rem;color:var(--text-secondary);letter-spacing:.15em;margin-bottom:var(--space-md)">EVOLUCIÓN DE CAPITAL</div>
              <canvas id="evoChart" height="160"></canvas>
            </div>
          </div>
          <div class="evo-main-grid__right">
            <div class="evo-logger card">
              <div class="evo-logger__title">📝 Registrar Resultado del Día</div>
              <div class="evo-logger__desc">Ingresa tu ganancia o pérdida de hoy (negativo para pérdida)</div>
              <div class="evo-logger__row">
                <div class="evo-logger__input-wrap" id="evoLogWrap">
                  <span class="evo-logger__dollar">$</span>
                  <input type="number" id="evoLogInput" class="evo-logger__input" placeholder="0.00" step="0.01"/>
                </div>
                <input type="date" id="evoLogDate" class="evo-logger__date" value="${new Date().toISOString().slice(0,10)}"/>
              </div>
              <div class="evo-logger__toggle-row">
                <button class="evo-logger__toggle evo-logger__toggle--win active" id="logToggleWin" onclick="MLScreenEvolucion._setLogType('win')">✅ GANANCIA</button>
                <button class="evo-logger__toggle evo-logger__toggle--loss" id="logToggleLoss" onclick="MLScreenEvolucion._setLogType('loss')">❌ PÉRDIDA</button>
              </div>
              <button class="evo-logger__btn" onclick="MLScreenEvolucion._logResult()">REGISTRAR RESULTADO</button>
            </div>
            <div id="evoRecoArea" class="evo-reco-area"></div>
            <div class="card mt-md" id="evoHistCard">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md)">
                <div style="font-size:0.625rem;color:var(--text-secondary);letter-spacing:.15em">HISTORIAL DE RESULTADOS</div>
                <span style="font-size:0.5625rem;color:var(--text-secondary)">${this._history.length} entradas</span>
              </div>
              ${this._renderHistory()}
            </div>
          </div>
        </div>

        <!-- OBJETIVOS SECTION -->
        <div id="evoObjectivesSection" class="evo-objectives-section mt-lg">
          ${this._buildObjectivesHTML(plan, stats)}
        </div>
      </div>`;

    this._drawChart();
    this._bindLogInput();
    this._renderDefaultReco();
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
    this._renderDashboard(document.getElementById('screen-evolucion'));
    this._showReco(v);
    MLNotifications?.show(v>=0?'✅':'⚠','Resultado registrado', v>=0?`+$${v.toFixed(2)} añadido`:`Pérdida $${Math.abs(v).toFixed(2)} registrada`);
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
    const canvas=document.getElementById('evoChart'); if(!canvas) return;
    const ctx=canvas.getContext('2d');
    canvas.width=canvas.offsetWidth||600; canvas.height=160;
    const cap=this._capital, plan=this._plans[this._planIdx];
    const sorted=[...this._history].sort((a,b)=>a.date.localeCompare(b.date));
    const points=[{label:'Inicio',val:cap}]; let running=cap;
    sorted.forEach(h=>{ running+=h.amount; points.push({label:h.date.slice(5),val:+running.toFixed(2)}); });
    const targetPts=points.map((p,i)=>({label:p.label,val:+(cap+plan.daily*i).toFixed(2)}));
    const W=canvas.width,H=canvas.height,pad={t:20,r:20,b:30,l:60};
    const allVals=[...points.map(p=>p.val),...targetPts.map(p=>p.val)];
    const minV=Math.min(...allVals)*0.98,maxV=Math.max(...allVals)*1.02;
    const scaleX=i=>pad.l+(i/Math.max(points.length-1,1))*(W-pad.l-pad.r);
    const scaleY=v=>pad.t+(1-(v-minV)/(maxV-minV))*(H-pad.t-pad.b);
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='rgba(255,255,255,.05)'; ctx.lineWidth=1;
    for(let i=0;i<=4;i++){
      const y=pad.t+(i/4)*(H-pad.t-pad.b);
      ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.35)';ctx.font='10px Fira Code,monospace';ctx.textAlign='right';
      ctx.fillText('$'+(maxV-(i/4)*(maxV-minV)).toFixed(0),pad.l-4,y+4);
    }
    if(sorted.length>0){
      ctx.setLineDash([4,4]);ctx.strokeStyle='rgba(212,175,55,.35)';ctx.lineWidth=1.5;ctx.beginPath();
      targetPts.forEach((p,i)=>i===0?ctx.moveTo(scaleX(i),scaleY(p.val)):ctx.lineTo(scaleX(i),scaleY(p.val)));
      ctx.stroke();ctx.setLineDash([]);
    }
    const grad=ctx.createLinearGradient(0,pad.t,0,H-pad.b);
    grad.addColorStop(0,'rgba(77,255,184,.25)');grad.addColorStop(1,'rgba(77,255,184,.01)');
    ctx.beginPath();
    points.forEach((p,i)=>i===0?ctx.moveTo(scaleX(i),scaleY(p.val)):ctx.lineTo(scaleX(i),scaleY(p.val)));
    ctx.lineTo(scaleX(points.length-1),H-pad.b);ctx.lineTo(scaleX(0),H-pad.b);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
    ctx.strokeStyle='#4dffd2';ctx.lineWidth=2;ctx.beginPath();
    points.forEach((p,i)=>i===0?ctx.moveTo(scaleX(i),scaleY(p.val)):ctx.lineTo(scaleX(i),scaleY(p.val)));
    ctx.stroke();
    points.forEach((p,i)=>{
      ctx.beginPath();ctx.arc(scaleX(i),scaleY(p.val),4,0,Math.PI*2);
      ctx.fillStyle=p.val>=cap?'#4dffd2':'#ff3366';ctx.fill();ctx.strokeStyle='#0a0a12';ctx.lineWidth=1.5;ctx.stroke();
    });
    ctx.font='9px Fira Code,monospace';ctx.textAlign='left';
    ctx.fillStyle='#4dffd2';ctx.fillRect(W-130,H-22,10,2);ctx.fillText('Capital real',W-116,H-18);
    ctx.fillStyle='rgba(212,175,55,.6)';ctx.fillRect(W-130,H-12,10,2);ctx.fillText('Meta plan',W-116,H-8);
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
