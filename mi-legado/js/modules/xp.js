/* ============================================================
   MI LEGADO — js/modules/xp.js
   XP, levels, progression system
   ============================================================ */

const MLXP = {
  // XP thresholds per level
  thresholds: [0, 500, 1200, 2500, 4500, 7000, 10000, 14000, 19000, 25000],

  getLevelFromXP(xp) {
    let level = 1;
    for (let i = 0; i < this.thresholds.length; i++) {
      if (xp >= this.thresholds[i]) level = i + 1;
    }
    return level;
  },

  getPctToNextLevel(xp) {
    const level = this.getLevelFromXP(xp);
    const curr = this.thresholds[level - 1] || 0;
    const next = this.thresholds[level] || this.thresholds[this.thresholds.length - 1];
    return Math.round(((xp - curr) / (next - curr)) * 100);
  },

  add(amount) {
    MLState.addXP(amount);
    const pct = this.getPctToNextLevel(MLState.xp);
    const fill = document.getElementById('xpBarFill');
    if (fill) fill.style.setProperty('--xp-pct', pct + '%');
  },
};
