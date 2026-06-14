/* ============================================================
   MI LEGADO — js/screens/misiones.js
   ============================================================ */

const MLScreenMisiones = {
  currentTab: 'hoy',
  _particleRAF: null,   // requestAnimationFrame ID del canvas
  _particleCanvas: null,

  // ── RENDER PRINCIPAL ────────────────────────────────────────
  // Configuración de cada pestaña
  _tabConfig: {
    hoy:        { phrase: 'SISTEMA DE MISIONES ACTIVO', title: 'Misiones', accent: 'Diarias',   desc: 'Completa misiones para ganar XP, mantener tu racha y avanzar en tu evolución personal.' },
    semana:     { phrase: 'CICLO SEMANAL · 7 DÍAS',      title: 'Misiones', accent: 'Semanales', desc: 'Misiones de mayor alcance. Construye hábitos sólidos a lo largo de la semana.' },
    especiales: { phrase: 'LOGROS Y RETOS DE ÉLITE',     title: 'Misiones', accent: 'Especiales',desc: 'Retos únicos, logros de largo plazo y misiones de evento especial.' },
  },

  render() {
    const el = document.getElementById('screen-misiones');
    const cfg = this._tabConfig[this.currentTab];
    el.innerHTML = `
      <div class="hero mb-lg" id="misionesHero">
        <div class="hero__phrase" id="misionesHeroPhrase">${cfg.phrase}</div>
        <div class="hero__title" id="misionesHeroTitle">
          ${cfg.title} <span id="misionesHeroAccent">${cfg.accent}</span>
        </div>
        <div class="hero__desc" id="misionesHeroDesc">${cfg.desc}</div>
      </div>

      <div class="tabs" id="misionesTabs">
        <div class="tab ${this.currentTab==='hoy'?'active':''}"        onclick="MLScreenMisiones.switchTab('hoy')">Hoy</div>
        <div class="tab ${this.currentTab==='semana'?'active':''}"     onclick="MLScreenMisiones.switchTab('semana')">Semana</div>
        <div class="tab ${this.currentTab==='especiales'?'active':''}" onclick="MLScreenMisiones.switchTab('especiales')">Especiales</div>
      </div>

      <div id="tabHoy"        class="tab-pane ${this.currentTab==='hoy'?'':'tab-pane--hidden'}"></div>
      <div id="tabSemana"     class="tab-pane ${this.currentTab==='semana'?'':'tab-pane--hidden'}"></div>
      <div id="tabEspeciales" class="tab-pane ${this.currentTab==='especiales'?'':'tab-pane--hidden'}"></div>
    `;

    this._renderHoy();
    this._renderSemana();
    this._renderEspeciales();
    this.updateCounters();
  },

  // ── CAMBIO DE PESTAÑA ────────────────────────────────────────
  switchTab(tab) {
    this.currentTab = tab;

    // 1. Actualizar título del hero según la pestaña
    const cfg = this._tabConfig[tab];
    const phrase = document.getElementById('misionesHeroPhrase');
    const accent = document.getElementById('misionesHeroAccent');
    const desc   = document.getElementById('misionesHeroDesc');
    if (phrase) phrase.textContent = cfg.phrase;
    if (accent) accent.textContent = cfg.accent;
    if (desc)   desc.textContent   = cfg.desc;

    // 2. Tabs visuales
    document.querySelectorAll('#misionesTabs .tab').forEach((t, i) => {
      t.classList.toggle('active', ['hoy','semana','especiales'][i] === tab);
    });

    // 3. Panes
    ['hoy','semana','especiales'].forEach(id => {
      const pane = document.getElementById('tab' + id.charAt(0).toUpperCase() + id.slice(1));
      if (pane) pane.classList.toggle('tab-pane--hidden', id !== tab);
    });

    // 4. Canvas de partículas: solo activo en "semana"
    if (tab === 'semana') {
      this._startParticles();
    } else {
      this._stopParticles();
    }
  },

  // ════════════════════════════════════════════════════════════
  //  PESTAÑA: HOY
  // ════════════════════════════════════════════════════════════
  _renderHoy() {
    const pane = document.getElementById('tabHoy');
    if (!pane) return;
    const totalXP = MLContent.missions.reduce((a, m) => a + m.xp, 0);

    pane.innerHTML = `
      <div class="grid-2">
        <div>
          <div class="section-head"><div class="section-title">Misiones Activas</div></div>
          <div id="misionesListaMain"></div>
        </div>
        <div>
          <div class="section-head"><div class="section-title">Progreso del Día</div></div>
          <div class="card mb-md">
            <div class="card__label">Misiones completadas</div>
            <div class="card__value card__value--gold" id="misionesDoneCount">0 / ${MLContent.missions.length}</div>
            <div class="prog-bar mt-sm"><div class="prog-fill prog-fill--gold" id="misionesProgFill" style="width:0%"></div></div>
          </div>
          <div class="card card--accent mb-md">
            <div class="card__label">XP ganado hoy</div>
            <div class="card__value card__value--accent" id="misionesXPToday">0</div>
            <div class="card__sub">de ${totalXP} posibles</div>
          </div>
          <div class="card">
            <div class="card__label">Estado de racha</div>
            <div style="font-size:0.8125rem;color:var(--text-secondary);margin-top:8px;line-height:1.7">
              Completa al menos 3 misiones obligatorias para mantener tu racha de
              <strong style="color:var(--gold)">${MLUser.streak} días</strong>.
            </div>
            <div id="misionesAlert" style="margin-top:12px;padding:10px;background:var(--red-soft);border:1px solid rgba(255,51,102,.2);border-radius:var(--radius-sm);font-size:0.6875rem;color:var(--red)">
              Quedan misiones obligatorias pendientes
            </div>
          </div>
        </div>
      </div>`;

    this.renderList();
  },

  renderList() {
    const list = document.getElementById('misionesListaMain');
    if (!list) return;
    list.innerHTML = '';
    MLContent.missions.forEach(m => list.appendChild(this.createMissionEl(m)));
  },

  renderPreview() {
    const preview = document.getElementById('inicioMissions');
    if (!preview) return;
    preview.innerHTML = '';
    MLContent.missions.slice(0, 3).forEach(m => preview.appendChild(this.createMissionEl(m)));
  },

  createMissionEl(mission) {
    const done = MLState.missionsDone.has(mission.id);
    const el = document.createElement('div');
    el.className = 'mission' + (done ? ' mission--done' : '');
    el.dataset.missionId = mission.id;
    el.style.cursor = 'pointer';
    el.innerHTML = `
      <div class="mission__check">${done ? '✓' : ''}</div>
      <div class="mission__body">
        <div class="mission__name">${mission.name}</div>
        <div class="mission__category">${mission.category} · ${mission.type}</div>
      </div>
      <div class="mission__xp">+${mission.xp} XP</div>`;
    el.onclick = () => this.toggle(mission);
    return el;
  },

  toggle(mission) {
    const result = MLState.toggleMission(mission.id);
    if (result === 'marked') {
      MLXP.add(mission.xp);
      MLNotifications.show('✓', 'Misión Completada', `+${mission.xp} XP ganados`);
    } else {
      MLState.xp = Math.max(0, MLState.xp - mission.xp);
      const xpEl = document.getElementById('statXP');
      if (xpEl) xpEl.textContent = MLState.xp.toLocaleString();
      MLNotifications.show('↩', 'Misión Desmarcada', `−${mission.xp} XP revertidos`);
    }
    this.renderList();
    this.renderPreview();
    this.updateCounters();
  },

  updateCounters() {
    const doneMissions = MLContent.missions.filter(m => MLState.missionsDone.has(m.id));
    const done  = doneMissions.length;
    const total = MLContent.missions.length;
    const pct   = Math.round((done / total) * 100);
    const xpEarned = doneMissions.reduce((acc, m) => acc + m.xp, 0);

    const countEl = document.getElementById('misionesDoneCount');
    const fillEl  = document.getElementById('misionesProgFill');
    const xpEl    = document.getElementById('misionesXPToday');
    const alertEl = document.getElementById('misionesAlert');

    if (countEl) countEl.textContent = `${done} / ${total}`;
    if (fillEl)  fillEl.style.width  = pct + '%';
    if (xpEl)    xpEl.textContent    = xpEarned;

    if (alertEl) {
      const obligPending = MLContent.missions.filter(
        m => m.type === 'Obligatoria' && !MLState.missionsDone.has(m.id)
      ).length;
      if (obligPending === 0) {
        alertEl.style.cssText = 'margin-top:12px;padding:10px;background:rgba(77,255,184,.06);border:1px solid rgba(77,255,184,.2);border-radius:var(--radius-sm);font-size:0.6875rem;color:var(--teal)';
        alertEl.textContent = '✓ Todas las misiones obligatorias completadas';
      } else {
        alertEl.style.cssText = 'margin-top:12px;padding:10px;background:var(--red-soft);border:1px solid rgba(255,51,102,.2);border-radius:var(--radius-sm);font-size:0.6875rem;color:var(--red)';
        alertEl.textContent = `Quedan ${obligPending} misión${obligPending>1?'es':''} obligatoria${obligPending>1?'s':''} pendiente${obligPending>1?'s':''}`;
      }
    }
  },

  // ════════════════════════════════════════════════════════════
  //  PESTAÑA: SEMANA
  // ════════════════════════════════════════════════════════════
  _renderSemana() {
    const pane = document.getElementById('tabSemana');
    if (!pane) return;

    const missions   = MLContent.weeklyMissions;
    const totalXP    = missions.reduce((a, m) => a + m.xp, 0);
    const doneList   = missions.filter(m => MLState.weeklyDone.has(m.id));
    const failedList = missions.filter(m => MLState.weeklyFailed.has(m.id));
    const doneXP     = doneList.reduce((a, m) => a + m.xp, 0);
    const donePct    = Math.round((doneList.length / missions.length) * 100);
    const todayIdx   = 4; // Viernes = índice 4
    const daysLeft   = 6 - todayIdx;

    // Agrupa por día
    const days = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
    const dates = ['02 Jun','03 Jun','04 Jun','05 Jun','06 Jun','07 Jun','08 Jun'];
    const dayLabels = ['L','M','X','J','V','S','D'];

    pane.innerHTML = `
      <!-- Canvas partículas: absoluto dentro del tab, z-index:0 -->
      <canvas id="semanaCanvas" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0;transition:opacity 0.7s ease;border-radius:var(--radius-xl);" aria-hidden="true"></canvas>

      <div style="position:relative;z-index:1">

        <!-- ── HEADER SEMANA ── -->
        <div class="semana-header">
          <div class="semana-header__info">
            <div class="semana-header__label">SEMANA ACTUAL</div>
            <div class="semana-header__range">02 Jun – 08 Jun · 2026</div>
          </div>
          <div class="semana-header__days">
            ${dayLabels.map((l, i) => {
              const isDone   = missions.filter(m => m.dayIndex===i).every(m => MLState.weeklyDone.has(m.id));
              const isFailed = i < todayIdx && !isDone;
              const isToday  = i === todayIdx;
              const isFuture = i > todayIdx;
              const cls = isFuture ? 'day-chip day-chip--future'
                        : isToday  ? 'day-chip day-chip--today'
                        : isDone   ? 'day-chip day-chip--done'
                        : isFailed ? 'day-chip day-chip--failed'
                        : 'day-chip day-chip--partial';
              return `<div class="${cls}" title="${days[i]}">${l}</div>`;
            }).join('')}
          </div>
        </div>

        <!-- ── STATS ROW ── -->
        <div class="semana-stats mb-lg">
          <div class="semana-stat">
            <div class="semana-stat__val">${doneList.length}<span>/${missions.length}</span></div>
            <div class="semana-stat__label">MISIONES</div>
          </div>
          <div class="semana-stat">
            <div class="semana-stat__val semana-stat__val--gold">${doneXP.toLocaleString()}<span>XP</span></div>
            <div class="semana-stat__label">GANADOS</div>
          </div>
          <div class="semana-stat">
            <div class="semana-stat__val semana-stat__val--teal">${donePct}%</div>
            <div class="semana-stat__label">COMPLETADO</div>
          </div>
          <div class="semana-stat">
            <div class="semana-stat__val semana-stat__val--accent">${daysLeft}</div>
            <div class="semana-stat__label">DÍAS REST.</div>
          </div>
          <div class="semana-stat semana-stat--xp-total">
            <div class="semana-xp-bar">
              <div class="semana-xp-fill" style="width:${donePct}%"></div>
            </div>
            <div class="semana-xp-labels">
              <span>${doneXP.toLocaleString()} XP</span>
              <span>${totalXP.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        <!-- ── MISIONES POR DÍA ── -->
        <div class="section-head mb-md">
          <div class="section-title">Misiones de la Semana</div>
          <span class="section-action">${totalXP.toLocaleString()} XP en juego</span>
        </div>

        <div class="semana-days-grid" id="semanaDaysGrid"></div>

        <!-- ── HISTORIAL ── -->
        <div class="grid-2 mt-lg">

          <!-- COMPLETADAS -->
          <div>
            <div class="section-head">
              <div class="section-title semana-title--done">Historial Completadas</div>
              <span class="semana-badge semana-badge--done">${doneList.length}</span>
            </div>
            <div id="semanaHistCompleted">
              ${doneList.length === 0 ? `<div class="semana-empty">Aún no has completado misiones semanales.</div>` : ''}
            </div>
          </div>

          <!-- FALLIDAS -->
          <div>
            <div class="section-head">
              <div class="section-title semana-title--failed">Historial Fallidas</div>
              <span class="semana-badge semana-badge--failed">${failedList.length}</span>
            </div>
            <div id="semanaHistFailed">
              ${failedList.length === 0 ? `<div class="semana-empty">Sin misiones fallidas esta semana.</div>` : ''}
            </div>
          </div>

        </div>
      </div>`;

    // Render dinámico de las listas
    this._renderWeeklyDays();
    this._renderWeeklyHistory();

    // Si la pestaña está activa, inicia las partículas
    if (this.currentTab === 'semana') this._startParticles();
  },

  _renderWeeklyDays() {
    const grid = document.getElementById('semanaDaysGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const days    = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
    const dates   = ['02 Jun','03 Jun','04 Jun','05 Jun','06 Jun','07 Jun','08 Jun'];
    const todayIdx = 4;

    days.forEach((day, i) => {
      const dayMissions = MLContent.weeklyMissions.filter(m => m.dayIndex === i);
      const doneMissions = dayMissions.filter(m => MLState.weeklyDone.has(m.id));
      const allDone = dayMissions.length > 0 && doneMissions.length === dayMissions.length;
      const isPast  = i < todayIdx;
      const isToday = i === todayIdx;
      const isFuture = i > todayIdx;
      const delayMs = i * 70;

      const stateClass = isToday ? 'semana-day-card--today'
        : isFuture ? 'semana-day-card--future'
        : allDone  ? 'semana-day-card--done'
        : isPast   ? 'semana-day-card--failed'
        : '';

      const badgeCls = isToday ? 'semana-day__badge--today'
        : isFuture ? 'semana-day__badge--future'
        : allDone  ? 'semana-day__badge--done'
        : 'semana-day__badge--failed';

      const badgeTxt = isToday ? 'HOY'
        : isFuture ? `D${i+1}`
        : allDone  ? '✓'
        : '✗';

      const earnedXP = doneMissions.reduce((a,m)=>a+m.xp,0);
      const totalXP  = dayMissions.reduce((a,m)=>a+m.xp,0);

      const dayCard = document.createElement('div');
      dayCard.className = `semana-day-card ${stateClass}`;
      dayCard.setAttribute('data-daynum', i + 1);
      dayCard.style.setProperty('--card-delay', `${delayMs}ms`);
      dayCard.style.animationDelay = `${delayMs}ms`;

      dayCard.innerHTML = `
        <div class="semana-day__header">
          <div>
            <div class="semana-day__name">${day.slice(0,3).toUpperCase()}</div>
            <div class="semana-day__date">${dates[i]}</div>
          </div>
          <div class="semana-day__badge ${badgeCls}" style="--card-delay:${delayMs}ms">
            ${badgeTxt}
          </div>
        </div>
        <div class="semana-day__missions" id="semana-day-${i}"></div>
        <div class="semana-day__xp">
          <span class="semana-day__xp-earned">${earnedXP} XP</span>
          <span class="semana-day__xp-total">/ ${totalXP}</span>
        </div>`;

      grid.appendChild(dayCard);

      const mList = document.getElementById(`semana-day-${i}`);
      dayMissions.forEach(m => {
        mList.appendChild(this._createWeeklyMissionEl(m, isToday || isFuture));
      });
    });
  },

  _createWeeklyMissionEl(mission, isInteractive) {
    const done   = MLState.weeklyDone.has(mission.id);
    const failed = MLState.weeklyFailed.has(mission.id);
    const isEpic = mission.type === 'Épica';

    const el = document.createElement('div');
    el.className = 'semana-mission'
      + (done   ? ' semana-mission--done'   : '')
      + (failed ? ' semana-mission--failed' : '')
      + (isEpic ? ' semana-mission--epic'   : '');

    el.innerHTML = `
      <div class="semana-mission__header">
        <div class="semana-mission__check">${done ? '✓' : failed ? '✗' : ''}</div>
        <div class="semana-mission__type-pill semana-mission__type-pill--${mission.type === 'Épica' ? 'epic' : mission.type === 'Obligatoria' ? 'oblig' : 'opt'}">
          ${mission.type}
        </div>
      </div>
      <div class="semana-mission__name">${mission.name}</div>
      <div class="semana-mission__xp-row">
        <div class="semana-mission__xp${isEpic ? ' semana-mission__xp--epic' : ''}">
          <span class="semana-mission__xp-plus">+</span>${mission.xp} <span class="semana-mission__xp-label">XP</span>
        </div>
      </div>
      <div class="semana-mission__meta">
        ${mission.category}${mission.related ? ` · <span class="semana-mission__related">↗ ${mission.related}</span>` : ''}
      </div>`;

    if (isInteractive && !failed) {
      el.style.cursor = 'pointer';
      el.title = done ? 'Clic para desmarcar' : 'Clic para completar';
      el.onclick = () => this._toggleWeekly(mission);
    }
    return el;
  },

  _toggleWeekly(mission) {
    const result = MLState.toggleWeeklyMission(mission.id);
    if (result === 'marked') {
      MLXP.add(mission.xp);
      MLNotifications.show('✓', 'Misión Semanal', `+${mission.xp} XP — ${mission.name.slice(0,30)}...`);
    } else {
      MLState.xp = Math.max(0, MLState.xp - mission.xp);
      const el = document.getElementById('statXP');
      if (el) el.textContent = MLState.xp.toLocaleString();
      MLNotifications.show('↩', 'Misión Desmarcada', `−${mission.xp} XP revertidos`);
    }
    // Re-render sección semana
    this._renderSemana();
    if (this.currentTab === 'semana') this._startParticles();
  },

  _renderWeeklyHistory() {
    const doneEl   = document.getElementById('semanaHistCompleted');
    const failedEl = document.getElementById('semanaHistFailed');
    const doneList   = MLContent.weeklyMissions.filter(m => MLState.weeklyDone.has(m.id));
    const failedList = MLContent.weeklyMissions.filter(m => MLState.weeklyFailed.has(m.id));

    const makeItem = (m, type, idx) => {
      const isDone = type === 'done';
      const delay  = idx * 80;
      return `
        <div class="hist-item hist-item--${type}"
             style="animation-delay:${delay}ms">
          <div class="hist-item__icon">${isDone ? '✓' : '✗'}</div>
          <div class="hist-item__body">
            <div class="hist-item__name">${m.name}</div>
            <div class="hist-item__meta-row">
              <span class="hist-item__day-pill">${m.day} · ${m.date}</span>
              <span class="hist-item__cat-pill">${m.category}</span>
            </div>
          </div>
          <div class="hist-item__xp">
            <span class="hist-item__xp-val">${isDone ? '+' : '−'}${m.xp}</span>
            <span class="hist-item__xp-label">XP</span>
          </div>
        </div>`;
    };

    if (doneEl) {
      if (doneList.length === 0) {
        doneEl.innerHTML = `<div class="semana-empty">Aún no hay misiones completadas esta semana.</div>`;
      } else {
        doneEl.innerHTML = `
          <div class="hist-section">
            <div class="hist-timeline">
              ${doneList.map((m, i) => makeItem(m, 'done', i)).join('')}
            </div>
          </div>`;
      }
    }

    if (failedEl) {
      if (failedList.length === 0) {
        failedEl.innerHTML = `<div class="semana-empty semana-empty--good">Sin misiones fallidas esta semana.</div>`;
      } else {
        failedEl.innerHTML = `
          <div class="hist-section">
            <div class="hist-timeline hist-timeline--failed">
              ${failedList.map((m, i) => makeItem(m, 'failed', i)).join('')}
            </div>
          </div>`;
      }
    }
  },

  // ════════════════════════════════════════════════════════════
  //  PARTÍCULAS CANVAS (estilo AetherFlow, tema-adaptable)
  // ════════════════════════════════════════════════════════════
  _getThemeColor() {
    const theme = document.body.getAttribute('data-theme') || 'default';
    const map = {
      'default':      { p: 'rgba(212,175,55,0.85)',  l: 'rgba(212,175,55,', bg: 'rgba(5,5,8,' },
      'solo-leveling':{ p: 'rgba(155,89,182,0.85)',  l: 'rgba(155,89,182,', bg: 'rgba(5,0,16,' },
      'demon-slayer': { p: 'rgba(204,0,0,0.85)',     l: 'rgba(204,0,0,',    bg: 'rgba(10,0,0,' },
      'dragon-ball':  { p: 'rgba(255,215,0,0.85)',   l: 'rgba(255,215,0,',  bg: 'rgba(8,6,0,' },
      'naruto':       { p: 'rgba(255,102,0,0.85)',   l: 'rgba(255,102,0,',  bg: 'rgba(8,4,0,' },
      'one-piece':    { p: 'rgba(0,136,204,0.85)',   l: 'rgba(0,136,204,',  bg: 'rgba(0,10,20,' },
      'aot':          { p: 'rgba(139,115,85,0.85)',  l: 'rgba(139,115,85,', bg: 'rgba(8,8,8,' },
      'espartano':    { p: 'rgba(160,120,32,0.85)',  l: 'rgba(160,120,32,', bg: 'rgba(4,2,3,' },
    };
    return map[theme] || map['default'];
  },

  _startParticles() {
    return; // disabled

    const canvas = document.getElementById('semanaCanvas');
    const container = document.getElementById('tabSemana');
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    // NO guardamos colors aquí — se lee en cada frame para detectar cambios de tema
    let particles = [];
    const mouse = { x: null, y: null, radius: 160 };

    const resize = () => {
      canvas.width  = container.offsetWidth;
      canvas.height = container.offsetHeight || window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r  = Math.random() * 1.8 + 0.6;
      }
      update() {
        if (mouse.x !== null) {
          const dx = mouse.x - this.x, dy = mouse.y - this.y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < mouse.radius) {
            const f = (mouse.radius - d) / mouse.radius;
            this.x -= (dx/d) * f * 4;
            this.y -= (dy/d) * f * 4;
          }
        }
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
      }
      draw(c) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = c.p;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const n = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 120);
      for (let i = 0; i < n; i++) particles.push(new Particle());
    }

    const connect = (c) => {
      const maxDist = (canvas.width / 6) * (canvas.height / 6);
      for (let a = 0; a < particles.length; a++) {
        for (let b = a+1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const d2 = dx*dx + dy*dy;
          if (d2 < maxDist) {
            const op = 1 - d2/maxDist;
            ctx.strokeStyle = c.l + (op * 0.55) + ')';
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      this._particleRAF = requestAnimationFrame(animate);
      // Lee el color del tema CADA FRAME → cambia al instante con el tema
      const c = this._getThemeColor();
      ctx.fillStyle = c.bg + '0.92)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(c); });
      connect(c);
    };

    const onMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onOut  = () => { mouse.x = null; mouse.y = null; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onOut);
    window.addEventListener('resize', resize);
    this._cleanupParticles = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onOut);
      window.removeEventListener('resize', resize);
    };

    resize();
    animate();

    // Fade in
    requestAnimationFrame(() => { canvas.style.opacity = '1'; });
  },

  _stopParticles() {
    if (this._particleRAF) {
      cancelAnimationFrame(this._particleRAF);
      this._particleRAF = null;
    }
    if (this._cleanupParticles) {
      this._cleanupParticles();
      this._cleanupParticles = null;
    }
    const canvas = document.getElementById('semanaCanvas');
    if (canvas) { canvas.style.opacity = '0'; }
  },

  // ════════════════════════════════════════════════════════════
  //  PESTAÑA: ESPECIALES
  // ════════════════════════════════════════════════════════════
  _renderEspeciales() {
    const pane = document.getElementById('tabEspeciales');
    if (!pane) return;
    pane.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-md)"
        ${[
          ['Alcanza el Nivel 30', 'Evolución', 'Niv. 23 / 30', 77],
          ['Completa 200 misiones', 'Disciplina', '128 / 200', 64],
          ['Mantén 30 días de racha', 'Constancia', '14 / 30 días', 47],
          ['Lee 10 libros en Biblioteca', 'Conocimiento', '2 / 10', 20],
          ['Alcanza 15,000 XP total', 'Poder', '6,740 / 15,000', 45],
          ['Publica 20 veces en Comunidad', 'Comunidad', 'Próximamente', 0],
        ].map(([name, cat, progress, pct]) => `
          <div class="card" style="opacity:${pct?1:0.45}">
            <div class="card__label">${cat}</div>
            <div style="font-size:0.875rem;font-weight:600;color:var(--text-primary);margin:8px 0 4px">${name}</div>
            <div class="card__sub">${progress}</div>
            <div class="prog-bar mt-sm"><div class="prog-fill prog-fill--accent" style="width:${pct}%"></div></div>
          </div>`).join('')}
      </div>`;
  },
};
