/* ============================================================
   MI LEGADO — js/modules/themes.js
   Theme application and management
   ============================================================ */

const MLThemes = {
  apply(themeId) {
    MLState.setTheme(themeId);
    MLNotifications.show('🎨', 'Tema Aplicado', `¡${themeId.replace(/-/g,' ').toUpperCase()} activado!`);

    // Re-render themes screen to show selection
    if (MLState.currentScreen === 'temas') {
      MLScreenTemas.render();
    }
  },
};
