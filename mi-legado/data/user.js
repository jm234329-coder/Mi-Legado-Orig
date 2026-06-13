/* ============================================================
   MI LEGADO — data/user.js
   User profile data. Replace with API/localStorage in production.
   ============================================================ */

const MLUser = {
  name:     'Guerrero',
  avatar:   '⚔',
  level:    23,
  rank:     'Centinela III',
  xp:       6740,
  xpNext:   10000,
  streak:   14,
  discipline: 87,

  stats: {
    missions:    128,
    achievements: 47,
    hoursStudied: 43,
    consistency:  72,
  },

  weekProgress: [45, 78, 62, 90, 55, 85, 40], // Mon–Sun %

  evolution: {
    capital:    2400,
    riskPct:    2,
    dailyGoal:  48,
    weekGoal:   240,
    monthGoal:  960,
    dailyDone:  31.20,
    weekDone:   108,
    monthDone:  268,
    planScore:  78,
  },

  streakDays: [
    { label: 'L', state: 'done'  },
    { label: 'M', state: 'done'  },
    { label: 'X', state: 'done'  },
    { label: 'J', state: 'done'  },
    { label: 'V', state: 'today' },
    { label: 'S', state: 'miss'  },
    { label: 'D', state: 'miss'  },
  ],
};
