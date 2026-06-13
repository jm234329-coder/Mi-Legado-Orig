/* ============================================================
   MI LEGADO — js/screens/academia.js
   Academia de Mentalidad — Sistema de Juego por Niveles
   ============================================================ */

const MLScreenAcademia = {
  _STATE_KEY: 'ml_acad_v2',
  _view:            'levels',  // 'levels' | 'courses' | 'lesson'
  _selectedLevelId: null,
  _selectedCourseId: null,
  _lessonIdx:       0,
  _state:           null,

  // ══════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════
  _loadState() {
    const raw = localStorage.getItem(this._STATE_KEY);
    if (raw) { try { this._state = JSON.parse(raw); } catch(_) {} }
    if (!this._state) {
      this._state = {
        unlockedLevels:   ['psicologia'],
        completedLessons: [],
        completedCourses: [],
        completedLevels:  [],
        earnedXP:         0,
      };
      this._saveState();
    }
  },

  _saveState() {
    localStorage.setItem(this._STATE_KEY, JSON.stringify(this._state));
  },

  _isLevelUnlocked(levelId) {
    return this._state.unlockedLevels.includes(levelId);
  },
  _isLevelCompleted(levelId) {
    return this._state.completedLevels.includes(levelId);
  },
  _isCourseCompleted(courseId) {
    return this._state.completedCourses.includes(courseId);
  },
  _isLessonCompleted(lessonId) {
    return this._state.completedLessons.includes(lessonId);
  },

  _levelProgress(level) {
    const total   = level.courses.reduce((s, c) => s + c.lessons.length, 0);
    const done    = level.courses.reduce((s, c) =>
      s + c.lessons.filter(l => this._isLessonCompleted(l.id)).length, 0);
    return total === 0 ? 0 : Math.round((done / total) * 100);
  },

  _courseProgress(course) {
    const done = course.lessons.filter(l => this._isLessonCompleted(l.id)).length;
    return course.lessons.length === 0 ? 0 : Math.round((done / course.lessons.length) * 100);
  },

  // ══════════════════════════════════════════════════════════
  //  COMPLETAR LECCIÓN
  // ══════════════════════════════════════════════════════════
  completeLesson(levelId, courseId, lessonId) {
    if (this._isLessonCompleted(lessonId)) return;

    this._state.completedLessons.push(lessonId);
    this._state.earnedXP += 50;
    MLNotifications.show('✓', '+50 XP', 'Lección completada');

    const level  = MLContent.academiaLevels.find(l => l.id === levelId);
    const course = level?.courses.find(c => c.id === courseId);

    // ¿Se completó el curso?
    if (course && course.lessons.every(l => this._isLessonCompleted(l.id))) {
      if (!this._isCourseCompleted(courseId)) {
        this._state.completedCourses.push(courseId);
        this._state.earnedXP += course.xp;
        setTimeout(() => {
          MLNotifications.show('🏆', `+${course.xp} XP`, `Curso completado: ${course.name}`);
        }, 800);

        // ¿Se completó el nivel?
        if (level && level.courses.every(c => this._isCourseCompleted(c.id))) {
          if (!this._isLevelCompleted(levelId)) {
            this._state.completedLevels.push(levelId);

            // Desbloquear siguiente nivel
            const levels = MLContent.academiaLevels;
            const idx    = levels.findIndex(l => l.id === levelId);
            if (idx < levels.length - 1) {
              const next = levels[idx + 1];
              if (!this._isLevelUnlocked(next.id)) {
                this._state.unlockedLevels.push(next.id);
                setTimeout(() => {
                  MLNotifications.show('🔓', 'Nivel Desbloqueado', `${next.icon} ${next.label} — Nivel ${next.level}`);
                }, 1600);
              }
            }
            setTimeout(() => this._showLevelComplete(level), 1200);
          }
        }
      }
    }

    this._saveState();
  },

  _showLevelComplete(level) {
    const el = document.getElementById('screen-academia');
    const overlay = document.createElement('div');
    overlay.className = 'acad-complete-overlay';
    overlay.innerHTML = `
      <div class="acad-complete-card">
        <div class="acad-complete-icon">${level.icon}</div>
        <div class="acad-complete-badge">NIVEL ${level.level} COMPLETADO</div>
        <div class="acad-complete-name">${level.label}</div>
        <div class="acad-complete-xp">+${level.xpTotal} XP Total</div>
        <button class="acad-complete-btn" onclick="this.closest('.acad-complete-overlay').remove(); MLScreenAcademia._view='levels'; MLScreenAcademia.render();">
          Ver Todos los Niveles
        </button>
      </div>`;
    el.appendChild(overlay);
    setTimeout(() => overlay.classList.add('acad-complete-overlay--in'), 50);
  },

  // ══════════════════════════════════════════════════════════
  //  RENDER PRINCIPAL
  // ══════════════════════════════════════════════════════════
  render() {
    this._loadState();
    const el = document.getElementById('screen-academia');
    if (!el) return;

    if (this._view === 'lesson') {
      this._renderLesson(el);
    } else if (this._view === 'courses') {
      this._renderCourses(el);
    } else {
      this._renderLevels(el);
    }
  },

  // ══════════════════════════════════════════════════════════
  //  VISTA 1 — MAPA DE NIVELES
  // ══════════════════════════════════════════════════════════
  _renderLevels(el) {
    const levels   = MLContent.academiaLevels;
    const totalXP  = this._state.earnedXP;
    const lvlDone  = this._state.completedLevels.length;
    const lvlTotal = levels.length;

    el.innerHTML = `
      <div class="acad-hero">
        <div class="acad-hero__left">
          <div class="acad-hero__tag">🎓 CENTRO EDUCATIVO DE ÉLITE</div>
          <h1 class="acad-hero__title">Academia de <span>Mentalidad</span></h1>
          <p class="acad-hero__desc">Domina los 8 niveles en orden. Cada nivel desbloquea el siguiente.</p>
          <div class="acad-hero__stats">
            <div class="acad-stat"><span class="acad-stat__val">${lvlDone}</span><span class="acad-stat__lbl">/ ${lvlTotal} Niveles</span></div>
            <div class="acad-stat__sep"></div>
            <div class="acad-stat"><span class="acad-stat__val acad-stat__val--gold">${totalXP.toLocaleString()}</span><span class="acad-stat__lbl">XP Ganado</span></div>
          </div>
        </div>
        <div class="acad-hero__right">
          <div class="acad-overall-ring">
            <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="6"/><circle cx="40" cy="40" r="34" fill="none" stroke="var(--gold)" stroke-width="6" stroke-dasharray="${Math.round(213.6 * lvlDone / lvlTotal)} 213.6" stroke-linecap="round" transform="rotate(-90 40 40)"/></svg>
            <div class="acad-overall-ring__label">${Math.round(lvlDone/lvlTotal*100)}%</div>
          </div>
        </div>
      </div>

      <div class="acad-levels-grid">
        ${levels.map(level => this._levelCard(level)).join('')}
      </div>`;
  },

  _levelCard(level) {
    const unlocked  = this._isLevelUnlocked(level.id);
    const completed = this._isLevelCompleted(level.id);
    const pct       = this._levelProgress(level);
    const courses   = level.courses.length;
    const lessons   = level.courses.reduce((s,c) => s + c.lessons.length, 0);

    const stateClass = completed ? 'acad-lcard--done'
                     : unlocked  ? 'acad-lcard--active'
                     :             'acad-lcard--locked';
    const clickFn    = unlocked
      ? `MLScreenAcademia._openLevel('${level.id}')`
      : `MLNotifications.show('🔒','Bloqueado','Completa el nivel anterior para desbloquear ${level.label}')`;

    return `
      <div class="acad-lcard ${stateClass}" onclick="${clickFn}" style="--lc:${level.color};--lg:${level.gradient}">
        <div class="acad-lcard__glow"></div>
        <div class="acad-lcard__num">NIVEL ${level.level}</div>
        <div class="acad-lcard__icon">${completed ? '✅' : unlocked ? level.icon : '🔒'}</div>
        <div class="acad-lcard__label">${level.label}</div>
        <div class="acad-lcard__tagline">${level.tagline}</div>
        <div class="acad-lcard__meta">${courses} cursos · ${lessons} lecciones · ${level.xpTotal} XP</div>
        <div class="acad-lcard__progbar">
          <div class="acad-lcard__progfill" style="width:${pct}%"></div>
        </div>
        <div class="acad-lcard__pct">${completed ? '✓ Completado' : unlocked ? pct + '%' : 'Bloqueado'}</div>
        ${!unlocked ? '<div class="acad-lcard__lock-overlay"></div>' : ''}
      </div>`;
  },

  // ══════════════════════════════════════════════════════════
  //  VISTA 2 — CURSOS DEL NIVEL
  // ══════════════════════════════════════════════════════════
  _openLevel(levelId) {
    this._selectedLevelId = levelId;
    this._view = 'courses';
    this.render();
  },

  _renderCourses(el) {
    const level = MLContent.academiaLevels.find(l => l.id === this._selectedLevelId);
    if (!level) { this._view = 'levels'; this.render(); return; }

    const pct = this._levelProgress(level);

    el.innerHTML = `
      <div class="acad-breadcrumb">
        <button class="acad-back-btn" onclick="MLScreenAcademia._view='levels';MLScreenAcademia.render()">← Mapa de Niveles</button>
        <span class="acad-breadcrumb__sep">›</span>
        <span class="acad-breadcrumb__cur">${level.icon} ${level.label}</span>
      </div>

      <div class="acad-level-header" style="--lg:${level.gradient}">
        <div class="acad-level-header__left">
          <div class="acad-level-header__num">NIVEL ${level.level}</div>
          <div class="acad-level-header__name">${level.label}</div>
          <div class="acad-level-header__tagline">${level.tagline}</div>
          <div class="acad-level-header__desc">${level.desc}</div>
        </div>
        <div class="acad-level-header__right">
          <div class="acad-level-header__pct">${pct}%</div>
          <div class="acad-level-header__xp">${level.xpTotal} XP</div>
        </div>
      </div>

      <div class="acad-courses-grid">
        ${level.courses.map((course, ci) => this._courseCard(level, course, ci)).join('')}
      </div>`;
  },

  _courseCard(level, course, courseIndex) {
    const pct       = this._courseProgress(course);
    const completed = this._isCourseCompleted(course.id);

    // Un curso se puede acceder si es el primero del nivel o el anterior está completo
    const prevCompleted = courseIndex === 0 || this._isCourseCompleted(level.courses[courseIndex - 1].id);
    const locked        = !prevCompleted;

    const clickFn = locked
      ? `MLNotifications.show('🔒','Bloqueado','Completa el curso anterior primero')`
      : `MLScreenAcademia._openCourse('${level.id}','${course.id}')`;

    return `
      <div class="acad-ccard ${completed ? 'acad-ccard--done' : locked ? 'acad-ccard--locked' : 'acad-ccard--open'}" onclick="${clickFn}" style="--lc:${level.color}">
        <div class="acad-ccard__top">
          <div class="acad-ccard__icon">${locked ? '🔒' : course.icon}</div>
          <div class="acad-ccard__info">
            <div class="acad-ccard__name">${course.name}</div>
            <div class="acad-ccard__meta">${course.lessons.length} lecciones · ${course.duration} · ${course.xp} XP</div>
          </div>
          ${completed ? '<div class="acad-ccard__check">✓</div>' : ''}
        </div>
        <div class="acad-ccard__desc">${course.desc}</div>
        <div class="acad-ccard__lessons">
          ${course.lessons.map((l, li) => `
            <div class="acad-ccard__lesson ${this._isLessonCompleted(l.id) ? 'acad-ccard__lesson--done' : ''}">
              <span class="acad-ccard__lesson-num">${this._isLessonCompleted(l.id) ? '✓' : li + 1}</span>
              <span class="acad-ccard__lesson-title">${l.title}</span>
            </div>`).join('')}
        </div>
        <div class="acad-ccard__bar">
          <div class="acad-ccard__barfill" style="width:${pct}%"></div>
        </div>
      </div>`;
  },

  // ══════════════════════════════════════════════════════════
  //  VISTA 3 — LECCIÓN
  // ══════════════════════════════════════════════════════════
  _openCourse(levelId, courseId) {
    this._selectedLevelId  = levelId;
    this._selectedCourseId = courseId;
    const course = MLContent.academiaLevels
      .find(l => l.id === levelId)?.courses
      .find(c => c.id === courseId);
    if (!course) return;

    // Ir a la primera lección no completada, o la primera si todas están hechas
    const firstPending = course.lessons.findIndex(l => !this._isLessonCompleted(l.id));
    this._lessonIdx = firstPending === -1 ? 0 : firstPending;
    this._view = 'lesson';
    this.render();
  },

  _renderLesson(el) {
    const level  = MLContent.academiaLevels.find(l => l.id === this._selectedLevelId);
    const course = level?.courses.find(c => c.id === this._selectedCourseId);
    if (!level || !course) { this._view = 'courses'; this.render(); return; }

    const lesson   = course.lessons[this._lessonIdx];
    const total    = course.lessons.length;
    const isLast   = this._lessonIdx === total - 1;
    const isDone   = this._isLessonCompleted(lesson.id);

    const lessonPct = Math.round(((this._lessonIdx + 1) / total) * 100);

    el.innerHTML = `
      <div class="acad-breadcrumb">
        <button class="acad-back-btn" onclick="MLScreenAcademia._view='courses';MLScreenAcademia.render()">← ${level.icon} ${level.label}</button>
        <span class="acad-breadcrumb__sep">›</span>
        <span class="acad-breadcrumb__cur">${course.name}</span>
      </div>

      <div class="acad-lesson-wrap">
        <!-- Barra lateral de lecciones -->
        <div class="acad-lesson-sidebar">
          <div class="acad-lesson-sidebar__title">${course.icon} ${course.name}</div>
          ${course.lessons.map((l, i) => `
            <div class="acad-lesson-sidebar__item ${i === this._lessonIdx ? 'acad-lesson-sidebar__item--active' : ''} ${this._isLessonCompleted(l.id) ? 'acad-lesson-sidebar__item--done' : ''}"
                 onclick="MLScreenAcademia._lessonIdx=${i};MLScreenAcademia.render()" style="--lc:${level.color}">
              <span class="acad-lesson-sidebar__check">${this._isLessonCompleted(l.id) ? '✓' : i + 1}</span>
              <span class="acad-lesson-sidebar__name">${l.title}</span>
            </div>`).join('')}
          <div class="acad-lesson-sidebar__prog">
            <div class="acad-lesson-sidebar__progbar">
              <div class="acad-lesson-sidebar__progfill" style="width:${this._courseProgress(course)}%;background:${level.color}"></div>
            </div>
            <span>${this._courseProgress(course)}% completado</span>
          </div>
        </div>

        <!-- Contenido de la lección -->
        <div class="acad-lesson-main">
          <div class="acad-lesson-header" style="--lc:${level.color}">
            <div class="acad-lesson-header__tag">${level.icon} ${level.label} · Lección ${this._lessonIdx + 1} de ${total}</div>
            <h2 class="acad-lesson-header__title">${lesson.title}</h2>
            <div class="acad-lesson-header__prog">
              <div class="acad-lesson-header__progbar">
                <div class="acad-lesson-header__progfill" style="width:${lessonPct}%"></div>
              </div>
            </div>
          </div>

          <div class="acad-lesson-content">
            ${lesson.content}
          </div>

          <div class="acad-lesson-actions">
            <button class="acad-btn acad-btn--ghost"
              ${this._lessonIdx === 0 ? 'disabled' : ''}
              onclick="MLScreenAcademia._lessonIdx--;MLScreenAcademia.render()">
              ← Anterior
            </button>

            ${isDone
              ? `<div class="acad-lesson-done-badge">✓ Lección completada</div>`
              : `<button class="acad-btn acad-btn--primary" style="--lc:${level.color}"
                  onclick="MLScreenAcademia.completeLesson('${level.id}','${course.id}','${lesson.id}');MLScreenAcademia.render()">
                  Marcar como completada +50 XP
                </button>`
            }

            ${!isLast
              ? `<button class="acad-btn acad-btn--ghost"
                  onclick="MLScreenAcademia._lessonIdx++;MLScreenAcademia.render()">
                  Siguiente →
                </button>`
              : `<button class="acad-btn acad-btn--ghost"
                  onclick="MLScreenAcademia._view='courses';MLScreenAcademia.render()">
                  Ver Cursos →
                </button>`
            }
          </div>
        </div>
      </div>`;
  },
};
