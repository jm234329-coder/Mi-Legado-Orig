/* ============================================================
   MI LEGADO — js/modules/profile.js
   Profile photo management via localStorage
   ============================================================ */

const MLProfile = {
  STORAGE_KEY: 'ml_avatar',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) this._applyImage(saved);
  },

  onAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      localStorage.setItem(this.STORAGE_KEY, dataUrl);
      this._applyImage(dataUrl);
      MLNotifications.show('✓', 'Perfil Actualizado', 'Foto de perfil guardada correctamente');
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be re-selected
    event.target.value = '';
  },

  _applyImage(dataUrl) {
    const img = document.getElementById('avatarImg');
    const initials = document.getElementById('avatarInitials');
    if (!img || !initials) return;
    img.src = dataUrl;
    img.style.display = 'block';
    initials.style.display = 'none';
  },
};
