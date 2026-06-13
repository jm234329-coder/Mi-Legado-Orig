/* ============================================================
   MI LEGADO — js/app.js
   Application bootstrap. Initializes all modules and screens.
   ============================================================ */

(function () {
  'use strict';

  // ── SCREEN REGISTRY ──────────────────────────────────────────
  // Maps screen IDs to their render functions.
  // Add new screens here when you create them.
  const SCREENS = {
    inicio:          () => MLScreenInicio.render(),
    misiones:        () => MLScreenMisiones.render(),
    responsabilidad: () => MLScreenResponsabilidad.render(),
    diario:          () => MLScreenDiario.render(),
    academia:        () => MLScreenAcademia.render(),
    biblioteca:      () => MLScreenBiblioteca.render(),
    mentor:          () => MLScreenMentor.render(),
    evolucion:       () => MLScreenEvolucion.render(),
    guerrero:        () => MLScreenGuerrero.render(),
    ranking:         () => MLScreenRanking.render(),
    comunidad:       () => MLScreenComunidad.render(),
    hall:            () => MLScreenHall.render(),
    temas:           () => MLScreenTemas.render(),
  };

  // ── CREATE SCREEN CONTAINERS ─────────────────────────────────
  function createScreenContainers() {
    const container = document.getElementById('screenContainer');
    Object.keys(SCREENS).forEach(id => {
      const div = document.createElement('div');
      div.id = 'screen-' + id;
      div.className = 'screen';
      container.appendChild(div);
    });
  }

  // ── RENDER ALL SCREENS ───────────────────────────────────────
  function renderAllScreens() {
    Object.entries(SCREENS).forEach(([id, renderFn]) => {
      try {
        renderFn();
      } catch (e) {
        console.warn(`[MI LEGADO] Screen "${id}" render failed:`, e);
      }
    });
  }

  // ── BOOTSTRAP ────────────────────────────────────────────────
  function init() {
    // Restore saved preferences
    MLState.loadSavedState();

    // Build DOM structure
    createScreenContainers();

    // Initialize modules
    MLNotifications.init();
    MLParticles.init();
    MLProfile.init();

    // Render all screen HTML
    renderAllScreens();

    // Initialize navigation (shows first screen)
    MLNavigation.init();

    // Welcome notifications
    setTimeout(() => MLNotifications.show('⚔', 'MI LEGADO', 'Sistema de Evolución Personal activado'), 800);
    setTimeout(() => MLNotifications.show('⚡', 'Misiones', 'Tienes 3 misiones pendientes hoy'), 3000);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
