/* ============================================================
   MI LEGADO — js/screens/biblioteca.js
   Biblioteca de Sabiduría — con lector virtual de libros
   ============================================================ */

const MLScreenBiblioteca = {
  _activeTab: 'all',

  render() {
    const el = document.getElementById('screen-biblioteca');
    el.innerHTML = `
      <div class="hero mb-lg">
        <div class="hero__phrase">REPOSITORIO DEL CONOCIMIENTO</div>
        <div class="hero__title">Biblioteca de <span>Sabiduría</span></div>
        <div class="hero__desc">Libros, audiolibros, resúmenes y artículos de crecimiento personal. Aprende a tu ritmo.</div>
      </div>

      <div class="tabs" id="bibTabs">
        <div class="tab active"      onclick="MLScreenBiblioteca.setTab('all')">Todos</div>
        <div class="tab"             onclick="MLScreenBiblioteca.setTab('progress')">En progreso</div>
        <div class="tab"             onclick="MLScreenBiblioteca.setTab('done')">Completados</div>
        <div class="tab"             onclick="MLScreenBiblioteca.setTab('fav')">Favoritos</div>
      </div>

      <div class="bib-hint">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="flex-shrink:0">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Haz clic en cualquier libro para abrirlo en el lector virtual. Puedes cargar su PDF para leer dentro de la app.
      </div>

      <div class="bib-grid" id="bibGrid"></div>`;

    this._renderGrid();
  },

  setTab(tab) {
    this._activeTab = tab;
    document.querySelectorAll('#bibTabs .tab').forEach((t, i) => {
      t.classList.toggle('active', ['all','progress','done','fav'][i] === tab);
    });
    this._renderGrid();
  },

  _filterBooks() {
    const books = MLContent.books;
    switch (this._activeTab) {
      case 'progress': return books.filter(b => b.status === 'EN PROGRESO');
      case 'done':     return books.filter(b => b.status === 'COMPLETADO');
      case 'fav':      return books.filter(b => b.fav);
      default:         return books;
    }
  },

  _hasPDF(title) {
    const key = 'ml_pdf_' + btoa(encodeURIComponent(title)).replace(/=/g,'');
    return !!localStorage.getItem(key);
  },

  _renderGrid() {
    const grid = document.getElementById('bibGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const books = this._filterBooks();

    if (books.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:var(--space-2xl);font-size:0.875rem">
        No hay libros en esta categoría.
      </div>`;
      return;
    }

    books.forEach((b, i) => {
      const hasPdf = this._hasPDF(b.title);
      const card = document.createElement('div');
      card.className = 'bib-card';
      card.style.animationDelay = `${i * 60}ms`;
      card.setAttribute('title', `Abrir "${b.title}" en el lector`);

      card.innerHTML = `
        <div class="bib-card__status" style="color:${b.statusColor}">${b.status}</div>
        <div class="bib-card__title">${b.title}</div>
        <div class="bib-card__author">${b.author}</div>

        <div class="prog-bar mt-md">
          <div class="prog-fill ${b.fill}" style="width:${b.pct}%"></div>
        </div>
        <div class="bib-card__label" style="color:${b.pctColor}">${b.pctLabel}</div>

        <div class="bib-card__footer">
          <div class="bib-card__pdf-badge ${hasPdf ? 'bib-card__pdf-badge--has' : ''}">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            ${hasPdf ? 'PDF listo' : 'Sin PDF'}
          </div>
          <div class="bib-card__open">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Abrir lector
          </div>
        </div>`;

      card.onclick = () => MLBookReader.open(b.title, b.author);
      grid.appendChild(card);
    });
  },
};
