/* ============================================================
   MI LEGADO — js/screens/diario.js
   Diario del Guerrero — Wave Input (Canvas 2D adaptation of HeroWave)
   ============================================================ */

/* ── WAVE ENGINE ─────────────────────────────────────────────── */
const DiaryWave = {
  canvas: null, ctx: null, raf: null,
  W: 0, H: 0,
  bars: [],
  BAR_W: 9, BAR_GAP: 7,
  mouse: { x: -9999, y: -9999 },

  // Two wave systems (mirrors HeroWave wave1 / wave2)
  w1: { gain: 0.08, freq: 0.9, phase: 0, speed: 0.45 },
  w2: { gain: 0.04, freq: 1.6, phase: Math.PI * 0.7, speed: 0.8 },

  // Typing energy
  energy: 0, targetEnergy: 0,
  lastKeyTime: 0,

  // Glow per bar
  glow: null,

  // ----- Colour map: matches particle canvas -----
  _themeMap: {
    'default':       { bar: [212,175,55],  bg: [5,5,8]    },
    'solo-leveling': { bar: [155,89,182],  bg: [5,0,16]   },
    'demon-slayer':  { bar: [204,0,0],     bg: [10,0,0]   },
    'dragon-ball':   { bar: [255,215,0],   bg: [8,6,0]    },
    'naruto':        { bar: [255,102,0],   bg: [8,4,0]    },
    'one-piece':     { bar: [0,136,204],   bg: [0,10,20]  },
    'aot':           { bar: [139,115,85],  bg: [8,8,8]    },
    'espartano':     { bar: [160,120,32],  bg: [4,2,3]    },
  },

  getTheme() {
    const id = document.body.getAttribute('data-theme') || 'default';
    return this._themeMap[id] || this._themeMap['default'];
  },

  // ----- Animated placeholder -----
  _base: '¿Qué aprendiste hoy?',
  _suggestions: [
    ' ¿Qué victoria obtuviste?',
    ' ¿Qué debes mejorar?',
    ' ¿Qué te desafió?',
    ' ¿Qué dejarás atrás?',
    ' ¿A qué te comprometes mañana?',
  ],
  _ph: { idx: 0, char: 0, del: false, text: '' },
  _phTimer: null,

  _animatePlaceholder(ta) {
    if (!ta || document.activeElement === ta && ta.value) return;
    clearTimeout(this._phTimer);
    const { idx, char, del } = this._ph;
    const sug = this._suggestions[idx % this._suggestions.length];
    if (!del) {
      this._ph.char = char + 1;
      this._ph.text = sug.slice(0, this._ph.char);
      if (this._ph.char >= sug.length) {
        this._phTimer = setTimeout(() => { this._ph.del = true; this._animatePlaceholder(ta); }, 1400);
        return;
      }
      this._phTimer = setTimeout(() => this._animatePlaceholder(ta), 65);
    } else {
      this._ph.char = Math.max(0, char - 1);
      this._ph.text = sug.slice(0, this._ph.char);
      if (this._ph.char <= 0) {
        this._ph.del = false;
        this._ph.idx = idx + 1;
        this._phTimer = setTimeout(() => this._animatePlaceholder(ta), 400);
        return;
      }
      this._phTimer = setTimeout(() => this._animatePlaceholder(ta), 38);
    }
    ta.placeholder = this._base + this._ph.text;
  },

  stopPlaceholder() { clearTimeout(this._phTimer); },

  // ----- Init canvas -----
  init(canvasEl) {
    this.stop();
    this.canvas = canvasEl;
    this.ctx    = canvasEl.getContext('2d');
    this.glow   = null;
    this._resize();
    this._buildBars();
    this._loop();

    // Mouse tracking relative to canvas
    this._onMove = e => {
      const r = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
    };
    this._onOut = () => { this.mouse.x = -9999; };
    this.canvas.addEventListener('mousemove', this._onMove);
    this.canvas.addEventListener('mouseleave', this._onOut);

    // Resize observer
    this._ro = new ResizeObserver(() => { this._resize(); this._buildBars(); });
    this._ro.observe(this.canvas.parentElement);
  },

  // Called every keypress
  onType() {
    this.targetEnergy = Math.min(1, this.targetEnergy + 0.28);
    this.lastKeyTime  = performance.now();
  },

  _resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    this.W = parent.offsetWidth;
    this.H = parent.offsetHeight;
    this.canvas.width  = this.W;
    this.canvas.height = this.H;
  },

  _buildBars() {
    this.bars = [];
    const step = this.BAR_W + this.BAR_GAP;
    const count = Math.ceil(this.W / step) + 2;
    for (let i = 0; i < count; i++) {
      this.bars.push({ x: i * step + this.BAR_W / 2 });
    }
    this.glow = new Float32Array(this.bars.length);
  },

  _loop() {
    this.raf = requestAnimationFrame(ts => this._frame(ts));
  },

  _lastTs: 0,
  _frame(ts) {
    if (!this.canvas) return;
    const dt = Math.min((ts - this._lastTs) / 1000, 0.05);
    this._lastTs = ts;

    // Energy decay: after 400ms of no typing, decay fast
    const idleMs = performance.now() - this.lastKeyTime;
    if (idleMs > 400) {
      this.targetEnergy = Math.max(0, this.targetEnergy - dt * 1.2);
    }
    this.energy += (this.targetEnergy - this.energy) * Math.min(1, dt * 6);

    // Advance wave phases
    const eMul = 0.4 + this.energy * 2.2;
    this.w1.phase += dt * this.w1.speed * eMul;
    this.w2.phase += dt * this.w2.speed * eMul;

    // Glow decay & mouse accumulation
    const mDist = 180;
    for (let i = 0; i < this.bars.length; i++) {
      const dx = Math.abs(this.mouse.x - this.bars[i].x);
      const hit = dx < mDist ? (1 - dx / mDist) * 0.9 : 0;
      this.glow[i] = Math.max(0, this.glow[i] + hit * 0.06 - dt * 1.8 * this.glow[i]);
    }

    this._draw();
    this.raf = requestAnimationFrame(ts2 => this._frame(ts2));
  },

  _draw() {
    const { ctx, W, H, bars, w1, w2, energy, glow } = this;
    const c = this.getTheme();
    const [br, bg, bb] = c.bar;

    // Fade trail (dark semi-transparent fill)
    ctx.fillStyle = `rgba(${c.bg.join(',')},0.88)`;
    ctx.fillRect(0, 0, W, H);

    const baseAmplitude = H * 0.35;
    const gainMul = 0.2 + energy * 0.8;
    const baseY = H;

    for (let i = 0; i < bars.length; i++) {
      const t = bars.length > 1 ? i / (bars.length - 1) : 0;

      // Two sine waves (like HeroWave wave1/wave2)
      const h1 = Math.max(12, (Math.sin(w1.phase + t * w1.freq * Math.PI * 4) * 0.5 + 0.6) * baseAmplitude * gainMul * (w1.gain / 0.08));
      const h2 = Math.max(8,  (Math.sin(w2.phase + t * w2.freq * Math.PI * 4) * 0.5 + 0.6) * baseAmplitude * gainMul * (w2.gain / 0.04));
      // Mix at 50/50
      const h = h1 * 0.55 + h2 * 0.45;

      const glowV = glow[i];
      const energyAlpha = 0.25 + energy * 0.55 + glowV * 0.4;
      const glowIntensity = glowV * 28 + energy * 18;

      // Glow (shadow)
      ctx.shadowColor = `rgba(${br},${bg},${bb},${0.5 + glowV * 0.5})`;
      ctx.shadowBlur  = glowIntensity;

      // Bar as tapered shape (wider at base, narrower at top)
      const bw = this.BAR_W;
      const tipW = bw * 0.18;
      const x = bars[i].x;
      const y0 = baseY;
      const y1 = baseY - h;

      ctx.beginPath();
      ctx.moveTo(x - bw / 2, y0);
      ctx.lineTo(x + bw / 2, y0);
      ctx.lineTo(x + tipW / 2, y1);
      ctx.lineTo(x - tipW / 2, y1);
      ctx.closePath();

      // Gradient: bright tip, faded base
      const grad = ctx.createLinearGradient(x, y1, x, y0);
      grad.addColorStop(0, `rgba(${br},${bg},${bb},${energyAlpha})`);
      grad.addColorStop(0.5, `rgba(${br},${bg},${bb},${energyAlpha * 0.55})`);
      grad.addColorStop(1, `rgba(${br},${bg},${bb},0.04)`);

      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Reset shadow
    ctx.shadowBlur = 0;
  },

  stop() {
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this._onMove);
      this.canvas.removeEventListener('mouseleave', this._onOut);
    }
    this.canvas = null;
    this.ctx    = null;
    this.energy = 0;
    this.targetEnergy = 0;
  },
};

/* ── SCREEN ──────────────────────────────────────────────────── */
const MLScreenDiario = {
  moods: [
    { icon: '🔥', label: 'Motivado'   },
    { icon: '💪', label: 'Fuerte'     },
    { icon: '😔', label: 'Reflexivo'  },
    { icon: '🎯', label: 'Enfocado'   },
    { icon: '⚡', label: 'Energético' },
    { icon: '😤', label: 'Determinado'},
  ],
  entryColors: ['var(--gold)', 'var(--accent)', 'var(--teal)', 'var(--red)', 'var(--blue)'],

  render() {
    const el = document.getElementById('screen-diario');
    el.innerHTML = `
      <div class="hero mb-lg">
        <div class="hero__phrase">ESPACIO PRIVADO</div>
        <div class="hero__title">Diario del <span>Guerrero</span></div>
        <div class="hero__desc">Registra tus reflexiones, victorias, aprendizajes y errores. Tu evolución documentada.</div>
      </div>

      <div class="grid-2">

        <!-- ── NUEVA ENTRADA ── -->
        <div>
          <div class="section-head">
            <div class="section-title">Nueva Entrada</div>
            <span class="diary-char-count" id="diaryCharCount">0 / 800</span>
          </div>

          <!-- Wave container -->
          <div class="diary-wave-wrap" id="diaryWaveWrap">
            <canvas id="diaryWaveCanvas" aria-hidden="true"></canvas>

            <!-- Glass form overlay -->
            <div class="diary-form">
              <div class="diary-form__label" id="diaryDateLabel"></div>

              <textarea
                id="diaryInput"
                class="diary-textarea"
                maxlength="800"
                placeholder="¿Qué aprendiste hoy?"
                rows="6"
              ></textarea>

              <!-- Mood selector -->
              <div class="diary-mood-row">
                <span class="diary-mood-label">ESTADO</span>
                <div class="diary-mood-pills" id="diaryMoodPills"></div>
                <span class="diary-mood-selected" id="moodSelected">
                  ${MLState.currentMood.emoji || '🔥'} ${MLState.currentMood.label || 'Motivado'}
                </span>
              </div>

              <!-- Save button -->
              <button class="diary-save-btn" id="diarySaveBtn" onclick="MLScreenDiario.save()">
                <span class="diary-save-btn__text">GUARDAR ENTRADA</span>
                <span class="diary-save-btn__xp">+80 XP</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ── ENTRADAS RECIENTES ── -->
        <div>
          <div class="section-head">
            <div class="section-title">Entradas Recientes</div>
            <span class="section-action" id="diaryEntryCount"></span>
          </div>
          <div id="diaryEntriesList" class="diary-entries-list"></div>
        </div>
      </div>`;

    // Inject date
    const dateLabel = document.getElementById('diaryDateLabel');
    if (dateLabel) {
      dateLabel.textContent = new Date().toLocaleDateString('es-ES', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
      }).toUpperCase();
    }

    // Build mood pills
    this._buildMoodPills();

    // Wave disabled
    const canvas = document.getElementById('diaryWaveCanvas');
    if (canvas) canvas.style.display = 'none';

    // Wire up textarea
    const ta = document.getElementById('diaryInput');
    if (ta) {
      ta.addEventListener('input', () => {
        DiaryWave.onType();
        const len = ta.value.length;
        const cc = document.getElementById('diaryCharCount');
        if (cc) cc.textContent = `${len} / 800`;
      });
      ta.addEventListener('focus', () => DiaryWave.stopPlaceholder());
      ta.addEventListener('blur', () => {
        if (!ta.value) DiaryWave._animatePlaceholder(ta);
      });
      // Start animated placeholder
      DiaryWave._ph = { idx: 0, char: 0, del: false, text: '' };
      setTimeout(() => DiaryWave._animatePlaceholder(ta), 800);
    }

    this.renderEntries();
  },

  _buildMoodPills() {
    const container = document.getElementById('diaryMoodPills');
    if (!container) return;
    container.innerHTML = '';
    this.moods.forEach(m => {
      const btn = document.createElement('button');
      btn.className = 'diary-mood-pill';
      btn.textContent = m.icon;
      btn.title = m.label;
      btn.setAttribute('aria-label', m.label);
      if (MLState.currentMood.label === m.label) btn.classList.add('active');
      btn.onclick = () => {
        document.querySelectorAll('.diary-mood-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        MLState.currentMood = { emoji: m.icon, label: m.label };
        const sel = document.getElementById('moodSelected');
        if (sel) sel.textContent = `${m.icon} ${m.label}`;
      };
      container.appendChild(btn);
    });
  },

  setMood(emoji, label) {
    MLState.currentMood = { emoji, label };
    const sel = document.getElementById('moodSelected');
    if (sel) sel.textContent = emoji + ' ' + label;
  },

  save() {
    const input = document.getElementById('diaryInput');
    const text  = input ? input.value.trim() : '';
    if (!text) { MLNotifications.show('!', 'Diario', 'Escribe algo primero'); return; }

    const btn = document.getElementById('diarySaveBtn');
    if (btn) { btn.disabled = true; btn.classList.add('diary-save-btn--loading'); }

    setTimeout(() => {
      const entry = {
        date:      new Date().toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' }),
        mood:      MLState.currentMood.emoji,
        moodLabel: MLState.currentMood.label,
        text:      `"${text}"`,
        color:     this.entryColors[Math.floor(Math.random() * this.entryColors.length)],
      };

      MLState.diaryEntries.unshift(entry);
      if (input) { input.value = ''; }
      const cc = document.getElementById('diaryCharCount');
      if (cc) cc.textContent = '0 / 800';
      DiaryWave.targetEnergy = 0;

      this.renderEntries();
      MLXP.add(80);
      MLNotifications.show('✓', 'Diario del Guerrero', 'Entrada guardada. +80 XP');

      if (btn) { btn.disabled = false; btn.classList.remove('diary-save-btn--loading'); }

      // Restart placeholder
      const ta = document.getElementById('diaryInput');
      if (ta) setTimeout(() => DiaryWave._animatePlaceholder(ta), 600);
    }, 320);
  },

  renderEntries() {
    const list = document.getElementById('diaryEntriesList');
    if (!list) return;
    list.innerHTML = '';

    const all = [...MLState.diaryEntries, ...MLContent.diaryEntries];

    const countEl = document.getElementById('diaryEntryCount');
    if (countEl) countEl.textContent = `${all.length} entradas`;

    all.forEach((e, i) => {
      const div = document.createElement('div');
      div.className = 'diary-entry-card';
      div.style.animationDelay = `${i * 60}ms`;
      div.style.setProperty('--entry-color', e.color);
      div.innerHTML = `
        <div class="diary-entry-card__bar"></div>
        <div class="diary-entry-card__body">
          <div class="diary-entry-card__header">
            <div class="diary-entry-card__date">${e.date}</div>
            <div class="diary-entry-card__mood">${e.mood} <span>${e.moodLabel.toUpperCase()}</span></div>
          </div>
          <div class="diary-entry-card__text">${e.text}</div>
        </div>`;
      list.appendChild(div);
    });
  },
};
