/* ============================================================
   MI LEGADO — js/modules/bookReader.js
   Lector de libro virtual Premium con PDF.js
   ============================================================ */

const MLBookReader = {
  _pdfDoc:      null,
  _totalPages:  0,
  _spread:      1,
  _bookKey:     null,
  _bmarkKey:    null,
  _rendering:   false,
  _scale:       1.2,
  _mode:        'claro',
  _brightness:  100,
  _bookmarks:   [],
  _focusMode:   false,
  _activePanel: 'font',
  _searchQuery: '',        // FIX 4: query activa para highlight

  _initWorker() {
    if (typeof pdfjsLib === 'undefined') return false;
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    return true;
  },

  // ══════════════════════════════════════════════════════════
  //  ABRIR / CERRAR
  // ══════════════════════════════════════════════════════════
  open(bookTitle, bookAuthor) {
    this._bookKey   = 'ml_pdf_' + btoa(encodeURIComponent(bookTitle)).replace(/=/g,'');
    this._bmarkKey  = 'ml_bm_'  + btoa(encodeURIComponent(bookTitle)).replace(/=/g,'');
    this._pdfDoc    = null;
    this._spread    = 1;
    this._bookmarks = JSON.parse(localStorage.getItem(this._bmarkKey) || '[]');
    this._searchQuery = '';

    const titleEl = document.getElementById('brTitle');
    const authEl  = document.getElementById('brAuthor');
    if (titleEl) titleEl.textContent = bookTitle;
    if (authEl)  authEl.textContent  = bookAuthor || '';

    const overlay = document.getElementById('bookReaderOverlay');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('br-overlay--visible');
    document.body.style.overflow = 'hidden';

    // Salir de focus mode si venía de sesión anterior
    if (this._focusMode) {
      this._focusMode = false;
      document.getElementById('brEl')?.classList.remove('br-focus-mode');
    }

    this._applyMode(this._mode);
    this._updateBookmarks();
    this._updateBookmarkBtn();
    this.openPanel(this._activePanel);

    // FIX 2: Sincronizar display de brillo
    this._updateBrightnessDisplay();

    const saved = localStorage.getItem(this._bookKey);
    if (saved) { this._showBook(); this._loadFromDataUrl(saved); }
    else        { this._showEmpty(); }

    overlay.onclick = e => { if (e.target === overlay) this.close(); };
    this._onKey = e => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); this.nextPage(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); this.prevPage(); }
      if (e.key === 'Escape')     this.close();
      if (e.key === 'b' || e.key === 'B') this.toggleBookmark();
      if (e.key === 'f' || e.key === 'F') this.toggleFocus();
    };
    document.addEventListener('keydown', this._onKey);
  },

  close() {
    const overlay = document.getElementById('bookReaderOverlay');
    overlay.classList.remove('br-overlay--visible');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this._onKey);
    if (this._focusMode) { this._focusMode = false; document.getElementById('brEl')?.classList.remove('br-focus-mode'); }
    this._pdfDoc = null;
  },

  // ══════════════════════════════════════════════════════════
  //  CARGAR PDF
  // ══════════════════════════════════════════════════════════
  handleFileInput(input) {
    const file = input.files && input.files[0];
    if (!file || file.type !== 'application/pdf') {
      MLNotifications.show('!', 'Lector', 'Selecciona un archivo PDF válido');
      return;
    }
    if (file.size > 80 * 1024 * 1024) {
      MLNotifications.show('!', 'Lector', 'El PDF supera los 80 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target.result;
      try { localStorage.setItem(this._bookKey, dataUrl); } catch (_) {}
      this._showBook();
      this._loadFromDataUrl(dataUrl);
      MLNotifications.show('✓', 'Lector', `"${file.name}" cargado`);
      if (typeof MLScreenBiblioteca !== 'undefined') MLScreenBiblioteca._renderGrid?.();
    };
    reader.readAsDataURL(file);
  },

  _loadFromDataUrl(dataUrl) {
    if (!this._initWorker()) {
      MLNotifications.show('!', 'Lector', 'PDF.js no disponible. Recarga la página.');
      return;
    }
    const base64 = dataUrl.split(',')[1];
    const binary  = atob(base64);
    const bytes   = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    pdfjsLib.getDocument({ data: bytes }).promise
      .then(pdf => {
        this._pdfDoc     = pdf;
        this._totalPages = pdf.numPages;
        this._spread     = 1;
        const slider = document.getElementById('brPageSlider');
        if (slider) { slider.max = pdf.numPages; slider.step = 2; }
        this._renderSpread();
      })
      .catch(() => { MLNotifications.show('!', 'Lector', 'Error al leer el PDF'); this._showEmpty(); });
  },

  // ══════════════════════════════════════════════════════════
  //  RENDERIZADO
  // ══════════════════════════════════════════════════════════
  _renderSpread() {
    if (!this._pdfDoc || this._rendering) return;
    this._rendering = true;

    const book = document.getElementById('brBook');
    if (book) book.classList.add('br-book--turning');

    const renderPage = (pageNum, canvasId, numElId) => {
      const canvas = document.getElementById(canvasId);
      const numEl  = document.getElementById(numElId);
      if (!canvas) return Promise.resolve();
      const ctx = canvas.getContext('2d');

      if (pageNum < 1 || pageNum > this._totalPages) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
        if (numEl) numEl.textContent = '';
        return Promise.resolve();
      }

      canvas.style.display = 'block';
      canvas.style.opacity = '0';

      return this._pdfDoc.getPage(pageNum).then(page => {
        const container = canvas.parentElement;
        const pageEl    = container.closest ? container.closest('.br-page') : null;
        const maxW = (container.clientWidth  - 8)  || 400;
        const maxH = (pageEl ? pageEl.clientHeight - 64 : 680); // 64 = padding + num
        const vp0  = page.getViewport({ scale: 1 });
        const scByW = (maxW / vp0.width)  * this._scale;
        const scByH =  maxH / vp0.height;
        const sc    = Math.min(scByW, scByH);
        const vp   = page.getViewport({ scale: sc });

        canvas.width  = vp.width;
        canvas.height = vp.height;

        return page.render({ canvasContext: ctx, viewport: vp }).promise.then(async () => {
          canvas.style.opacity = '1';
          this._applyCanvasFilter(canvas);
          if (numEl) numEl.textContent = pageNum;

          // FIX 4: Si hay búsqueda activa, dibujar highlights
          if (this._searchQuery) {
            await this._highlightTextOnCanvas(page, canvas, vp, this._searchQuery);
          }
        });
      });
    };

    setTimeout(() => {
      if (book) book.classList.remove('br-book--turning');
      Promise.all([
        renderPage(this._spread,     'brCanvasLeft',  'brNumLeft'),
        renderPage(this._spread + 1, 'brCanvasRight', 'brNumRight'),
      ]).then(() => {
        this._rendering = false;
        this._updateUI();
        this._updateBookmarkBtn();
      }).catch(() => { this._rendering = false; });
    }, 220);
  },

  // ══════════════════════════════════════════════════════════
  //  FIX 4: HIGHLIGHT DE TEXTO EN CANVAS
  // ══════════════════════════════════════════════════════════
  async _highlightTextOnCanvas(page, canvas, viewport, query) {
    if (!query || query.trim().length < 2) return;
    const q = query.toLowerCase().trim();

    let textContent;
    try { textContent = await page.getTextContent(); }
    catch (_) { return; }

    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    textContent.items.forEach(item => {
      if (!item.str) return;
      const txt = item.str.toLowerCase();
      let idx = txt.indexOf(q);
      if (idx === -1) return;

      // Esquina inferior-izquierda del ítem (origen PDF)
      const ox = item.transform[4];
      const oy = item.transform[5];
      // Altura del ítem en unidades PDF (valor absoluto del scale Y)
      const pdfH = Math.abs(item.transform[3]);

      // Convertir los cuatro puntos clave a coordenadas de canvas
      const [x0, y0] = pdfjsLib.Util.applyTransform([ox,              oy       ], viewport.transform);
      const [x1, y1] = pdfjsLib.Util.applyTransform([ox + item.width, oy + pdfH], viewport.transform);

      // Bounding box del ítem completo en canvas
      const rx = Math.min(x0, x1);
      const ry = Math.min(y0, y1);
      const rw = Math.abs(x1 - x0);
      const rh = Math.abs(y1 - y0) * 1.15; // ligero padding vertical

      // Fracción de ancho por caracter
      const len = item.str.length || 1;

      while (idx !== -1) {
        const startFrac = idx / len;
        const spanFrac  = Math.min(q.length, len - idx) / len;

        const hx = rx + startFrac * rw;
        const hw = spanFrac * rw;

        // Fondo amarillo dorado
        ctx.fillStyle = 'rgba(255, 214, 0, 0.45)';
        ctx.beginPath();
        ctx.roundRect(hx - 1, ry - 1, hw + 2, rh + 2, 3);
        ctx.fill();

        // Borde dorado
        ctx.strokeStyle = 'rgba(200, 150, 0, 0.7)';
        ctx.lineWidth   = 1;
        ctx.stroke();

        idx = txt.indexOf(q, idx + q.length);
      }
    });

    ctx.restore();
  },

  // Navegar a página desde búsqueda CON highlight
  goToPageWithHighlight(pageNum, query) {
    this._searchQuery = query;
    this.goToPage(pageNum);
    MLNotifications.show('✓', 'Búsqueda', `"${query}" encontrado en pág. ${pageNum}`);
  },

  // ══════════════════════════════════════════════════════════
  //  NAVEGACIÓN
  // ══════════════════════════════════════════════════════════
  nextPage() {
    if (!this._pdfDoc || this._spread + 1 >= this._totalPages) return;
    this._spread = Math.min(this._spread + 2, this._totalPages - 1);
    this._renderSpread();
  },

  prevPage() {
    if (!this._pdfDoc || this._spread <= 1) return;
    this._spread = Math.max(this._spread - 2, 1);
    this._renderSpread();
  },

  goToPage(n) {
    if (!this._pdfDoc) return;
    n = Math.max(1, Math.min(n, this._totalPages));
    this._spread = n % 2 === 0 ? n - 1 : n;
    this._renderSpread();
  },

  goToLastBookmark() {
    if (this._bookmarks.length === 0) {
      MLNotifications.show('!', 'Marcadores', 'No tienes marcadores guardados'); return;
    }
    this.goToPage(this._bookmarks[this._bookmarks.length - 1]);
  },

  // ══════════════════════════════════════════════════════════
  //  MARCADORES
  // ══════════════════════════════════════════════════════════
  toggleBookmark() {
    const page = this._spread;
    const idx  = this._bookmarks.indexOf(page);
    if (idx > -1) {
      this._bookmarks.splice(idx, 1);
      MLNotifications.show('✓', 'Marcador eliminado', `Página ${page}`);
    } else {
      this._bookmarks.push(page);
      this._bookmarks.sort((a,b) => a-b);
      MLNotifications.show('✓', 'Marcador guardado', `Página ${page}`);
    }
    localStorage.setItem(this._bmarkKey, JSON.stringify(this._bookmarks));
    this._updateBookmarks();
    this._updateBookmarkBtn();
  },

  _updateBookmarkBtn() {
    const btn = document.getElementById('brBookmarkBtn');
    if (!btn) return;
    const marked = this._bookmarks.includes(this._spread);
    btn.style.color = marked ? 'var(--gold)' : '';
    btn.title = marked ? 'Quitar marcador (B)' : 'Marcar página (B)';
    const path = btn.querySelector('svg path');
    if (path) path.setAttribute('fill', marked ? 'var(--gold)' : 'none');
  },

  _updateBookmarks() {
    const list = document.getElementById('brBookmarksList');
    if (!list) return;
    if (this._bookmarks.length === 0) {
      list.innerHTML = '<div class="br-empty-note">Sin marcadores aún.</div>'; return;
    }
    list.innerHTML = this._bookmarks.map(p => `
      <div class="br-bookmark-item" onclick="MLBookReader.goToPage(${p})">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--gold)" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        Página ${p}
        <button class="br-bm-remove" onclick="event.stopPropagation();MLBookReader._removeBookmark(${p})">✕</button>
      </div>`).join('');
  },

  _removeBookmark(page) {
    this._bookmarks = this._bookmarks.filter(p => p !== page);
    localStorage.setItem(this._bmarkKey, JSON.stringify(this._bookmarks));
    this._updateBookmarks();
    this._updateBookmarkBtn();
  },

  // ══════════════════════════════════════════════════════════
  //  MODOS Y VISUALS
  // ══════════════════════════════════════════════════════════
  setMode(mode, btn) {
    this._mode = mode;
    this._applyMode(mode);
    document.querySelectorAll('.br-mode-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    ['brCanvasLeft','brCanvasRight'].forEach(id => {
      const c = document.getElementById(id);
      if (c) this._applyCanvasFilter(c);
    });
  },

  _applyMode(mode) {
    const el = document.getElementById('brEl');
    if (!el) return;
    ['claro','sepia','verde','oscuro'].forEach(m => el.classList.remove('br-mode-' + m));
    el.classList.add('br-mode-' + mode);
  },

  _applyCanvasFilter(canvas) {
    const f = {
      claro:  '',
      sepia:  'sepia(55%) saturate(110%) brightness(1.05)',
      verde:  'hue-rotate(75deg) saturate(25%) brightness(1.08)',
      oscuro: 'invert(1) hue-rotate(180deg) brightness(0.82) contrast(1.05)',
    };
    const base = f[this._mode] || '';
    canvas.style.filter = [base, `brightness(${this._brightness / 100})`].filter(Boolean).join(' ') || 'none';
  },

  setScale(val) {
    this._scale = val;
    this._renderSpread();
  },

  // FIX 2: Brillo con porcentaje
  setBrightness(val) {
    this._brightness = val;
    this._updateBrightnessDisplay();
    ['brCanvasLeft','brCanvasRight'].forEach(id => {
      const c = document.getElementById(id);
      if (c) this._applyCanvasFilter(c);
    });
  },

  _updateBrightnessDisplay() {
    const el = document.getElementById('brBrightVal');
    if (el) el.textContent = this._brightness + '%';
    const slider = document.getElementById('brBrightSlider');
    if (slider && +slider.value !== this._brightness) slider.value = this._brightness;
  },

  // ══════════════════════════════════════════════════════════
  //  FIX 4: BÚSQUEDA CON HIGHLIGHT
  // ══════════════════════════════════════════════════════════
  searchText(query) {
    const results = document.getElementById('brSearchResults');
    if (!results) return;

    // Limpiar highlight si el query cambia
    if (query !== this._searchQuery) this._searchQuery = '';

    if (!query || query.length < 2) {
      results.innerHTML = '<div class="br-empty-note">Escribe al menos 2 caracteres.</div>';
      return;
    }
    if (!this._pdfDoc) {
      results.innerHTML = '<div class="br-empty-note">Carga un PDF primero.</div>';
      return;
    }

    results.innerHTML = `
      <div class="br-searching">
        <div class="br-searching-dots">
          <span></span><span></span><span></span>
        </div>
        Buscando en ${this._totalPages} páginas...
      </div>`;

    const q = query.toLowerCase().trim();
    const hits = [];

    const searchPage = n => {
      if (n > this._totalPages || hits.length >= 15) {
        if (hits.length > 0) {
          results.innerHTML = `
            <div class="br-search-count">${hits.length} resultado${hits.length > 1 ? 's' : ''} encontrado${hits.length > 1 ? 's' : ''}</div>
            ${hits.map(h => `
              <div class="br-search-hit"
                   onclick="MLBookReader.goToPageWithHighlight(${h.page}, '${q.replace(/'/g,"\\'")}')"
                   title="Ir a página ${h.page}">
                <div class="br-hit-header">
                  <span class="br-hit-page">Página ${h.page}</span>
                  <span class="br-hit-arrow">→</span>
                </div>
                <span class="br-hit-text">${h.ctx}</span>
              </div>`).join('')}`;
        } else {
          results.innerHTML = '<div class="br-empty-note">Sin resultados para esta búsqueda.</div>';
        }
        return;
      }

      this._pdfDoc.getPage(n).then(page =>
        page.getTextContent().then(tc => {
          const txt = tc.items.map(i => i.str).join(' ');
          const idx = txt.toLowerCase().indexOf(q);
          if (idx > -1) {
            const start = Math.max(0, idx - 35);
            const end   = Math.min(txt.length, idx + q.length + 55);
            let ctx = txt.substring(start, end).trim();

            // Marcar la coincidencia en el preview
            const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi');
            ctx = ctx.replace(re, m => `<mark>${m}</mark>`);

            hits.push({ page: n, ctx: (start > 0 ? '...' : '') + ctx + (end < txt.length ? '...' : '') });
          }
          searchPage(n + 1);
        })
      ).catch(() => searchPage(n + 1));
    };

    searchPage(1);
  },

  // ══════════════════════════════════════════════════════════
  //  FIX 1: FOCUS MODE — colapsa paneles realmente
  // ══════════════════════════════════════════════════════════
  toggleFocus() {
    this._focusMode = !this._focusMode;
    const el    = document.getElementById('brEl');
    const label = document.getElementById('brFocusLabel');
    const left  = document.getElementById('brLeftPanel');
    const right = document.getElementById('brRightPanel');

    if (this._focusMode) {
      el.classList.add('br-focus-mode');
      // Colapsar paneles realmente
      if (left)  { left.classList.remove('br-left-panel--open');  }
      if (right) { right.classList.remove('br-right-panel--open'); }
      if (label) label.textContent = 'Salir del modo foco';
      MLNotifications.show('✓', 'Modo Foco', 'Pulsa F o ≡ para volver a las herramientas');
    } else {
      el.classList.remove('br-focus-mode');
      if (label) label.textContent = 'Activar modo foco';
    }
  },

  // ≡ — en focus mode, toggle focus; fuera de focus, toggle panel izq
  toggleLeftPanel() {
    if (this._focusMode) {
      // Salir de focus mode
      this.toggleFocus();
      return;
    }
    const panel = document.getElementById('brLeftPanel');
    if (panel) panel.classList.toggle('br-left-panel--open');
  },

  // ══════════════════════════════════════════════════════════
  //  PANELES
  // ══════════════════════════════════════════════════════════
  openPanel(panelId) {
    this._activePanel = panelId;
    const fontPanel   = document.getElementById('brPanelFont');
    const searchPanel = document.getElementById('brPanelSearch');
    const rightPanel  = document.getElementById('brRightPanel');
    if (!rightPanel) return;

    [fontPanel, searchPanel].forEach(p => { if (p) p.classList.add('br-rpanel-tab--hidden'); });
    const target = panelId === 'font' ? fontPanel : searchPanel;
    if (target) target.classList.remove('br-rpanel-tab--hidden');
    rightPanel.classList.add('br-right-panel--open');

    if (panelId === 'search') {
      setTimeout(() => document.getElementById('brSearchInput')?.focus(), 100);
    }
  },

  // ══════════════════════════════════════════════════════════
  //  UI STATE
  // ══════════════════════════════════════════════════════════
  _updateUI() {
    const total = this._totalPages;
    const right = Math.min(this._spread + 1, total);

    const slider = document.getElementById('brPageSlider');
    if (slider) slider.value = this._spread;

    const info = document.getElementById('brPageInfo');
    if (info) {
      info.textContent = right < total
        ? `PÁGINA ${this._spread}–${right} DE ${total}`
        : `PÁGINA ${this._spread} DE ${total}`;
    }

    const prev = document.getElementById('brPrevBtn');
    const next = document.getElementById('brNextBtn');
    if (prev) prev.disabled = this._spread <= 1;
    if (next) next.disabled = this._spread + 1 >= total;

    const gotoInp = document.getElementById('brGotoInput');
    if (gotoInp) gotoInp.max = total;
  },

  _showEmpty() {
    document.getElementById('brBook')?.style.setProperty('display','none');
    const e = document.getElementById('brEmpty');
    if (e) e.style.display = 'flex';
  },

  _showBook() {
    const e = document.getElementById('brEmpty');
    if (e) e.style.display = 'none';
    document.getElementById('brBook')?.style.setProperty('display','flex');
  },
};
