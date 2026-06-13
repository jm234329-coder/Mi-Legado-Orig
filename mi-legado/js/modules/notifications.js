/* ============================================================
   MI LEGADO — js/modules/notifications.js
   Toast notification system
   ============================================================ */

const MLNotifications = {
  container: null,

  init() {
    this.container = document.getElementById('notifyContainer');
  },

  show(icon, title, text, duration = 4000) {
    const el = document.createElement('div');
    el.className = 'notif';
    el.innerHTML = `
      <span class="notif__icon">${icon}</span>
      <div class="notif__body">
        <div class="notif__title">${title}</div>
        <div class="notif__text">${text}</div>
      </div>`;
    this.container.appendChild(el);

    setTimeout(() => {
      el.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }, duration);
  },
};
