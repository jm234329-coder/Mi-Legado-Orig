/* ============================================================
   MI LEGADO — js/modules/navigation.js
   Sidebar nav rendering and screen switching
   ============================================================ */

const MLNavigation = {
  init() {
    this.renderNav();
    this.go('inicio');
  },

  renderNav() {
    const nav = document.getElementById('sidebarNav');
    nav.innerHTML = '';

    MLContent.nav.forEach(section => {
      const sec = document.createElement('div');
      sec.className = 'nav__section';

      const lbl = document.createElement('div');
      lbl.className = 'nav__label';
      lbl.textContent = section.label;
      sec.appendChild(lbl);

      section.items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'nav__item';
        el.dataset.screen = item.id;
        el.onclick = () => this.go(item.id);

        let badge = '';
        if (item.badge) {
          badge = `<span class="nav__badge">${item.badge}</span>`;
        }

        el.innerHTML = `
          <span class="nav__icon">${item.icon}</span>
          <span>${item.label}</span>
          ${badge}`;

        sec.appendChild(el);
      });

      nav.appendChild(sec);
    });
  },

  go(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav__item').forEach(n => n.classList.remove('active'));

    // Show target screen
    const screen = document.getElementById('screen-' + screenId);
    if (screen) screen.classList.add('active');

    // Highlight nav item
    const navItem = document.querySelector(`.nav__item[data-screen="${screenId}"]`);
    if (navItem) navItem.classList.add('active');

    // Update topbar
    const allItems = MLContent.nav.flatMap(s => s.items);
    const item = allItems.find(i => i.id === screenId);
    if (item) {
      document.getElementById('pageTitle').textContent = item.label;
      document.getElementById('stageTag').textContent  = item.stage;
    }

    MLState.currentScreen = screenId;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Stop diary wave canvas when leaving diario
    if (screenId !== 'diario' && typeof DiaryWave !== 'undefined') {
      DiaryWave.stop();
    }
    // Re-init wave when entering diario (re-render is already done at boot)
    if (screenId === 'diario') {
      setTimeout(() => {
        const canvas = document.getElementById('diaryWaveCanvas');
        if (canvas && !DiaryWave.raf) DiaryWave.init(canvas);
        const ta = document.getElementById('diaryInput');
        if (ta && !ta.value) {
          DiaryWave._ph = { idx: 0, char: 0, del: false, text: '' };
          setTimeout(() => DiaryWave._animatePlaceholder(ta), 400);
        }
      }, 50);
    }
  },
};
