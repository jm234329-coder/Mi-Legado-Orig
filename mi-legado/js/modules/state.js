/* ============================================================
   MI LEGADO — js/modules/state.js
   Central state management. All runtime state lives here.
   ============================================================ */

const MLState = {
  // ── Current screen ──
  currentScreen: 'inicio',

  // ── XP / Progression ──
  xp:     6740,
  level:  23,
  streak: 14,

  // ── Missions runtime state ──
  missionsDone: new Set(['m5']),

  // ── Weekly missions state ──
  // Pre-poblamos: algunas completadas, otras fallidas (días pasados sin completar)
  weeklyDone:   new Set(['w1', 'w2', 'w3', 'w5', 'w7']),
  weeklyFailed: new Set(['w4', 'w6', 'w8']),

  toggleWeeklyMission(id) {
    if (this.weeklyDone.has(id)) {
      this.weeklyDone.delete(id);
      return 'unmarked';
    } else {
      this.weeklyFailed.delete(id); // si estaba en fallidas, la quita
      this.weeklyDone.add(id);
      return 'marked';
    }
  },

  // ── Diary entries (runtime) ──
  diaryEntries: [],

  // ── Current mood for diary ──
  currentMood: { emoji: '🔥', label: 'Motivado' },

  // ── Current theme ──
  theme: 'default',

  // ── Chat history ──
  chatHistory: [],

  // ── Mutable methods ──
  addXP(amount) {
    this.xp += amount;
    document.getElementById('statXP').textContent = this.xp.toLocaleString();
    MLNotifications.show('⚡', 'XP Ganado', `+${amount} XP`);
  },

  completeMission(id) {
    if (this.missionsDone.has(id)) return false;
    this.missionsDone.add(id);
    return true;
  },

  // Toggle: marca si estaba pendiente, desmarca si estaba completada
  toggleMission(id) {
    if (this.missionsDone.has(id)) {
      this.missionsDone.delete(id);
      return 'unmarked';
    } else {
      this.missionsDone.add(id);
      return 'marked';
    }
  },

  setTheme(id) {
    this.theme = id;
    document.body.setAttribute('data-theme', id);
    localStorage.setItem('ml_theme', id);
  },

  loadSavedState() {
    const savedTheme = localStorage.getItem('ml_theme');
    if (savedTheme) this.setTheme(savedTheme);
  },
};
