/* ============================================================
   MI LEGADO — js/modules/charts.js
   Bar chart renderer for weekly progress
   ============================================================ */

const MLCharts = {
  _days: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],

  renderWeekBars(containerId, data, highlightIndex = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const max  = Math.max(...data) || 1;
    const today = new Date().getDay(); // 0=Sun
    const todayIdx = today === 0 ? 6 : today - 1;

    container.innerHTML = `
      <div class="wc-wrap">
        <div class="wc-grid">
          ${[25,50,75,100].map(v => `
            <div class="wc-gridline" style="bottom:${v}%">
              <span class="wc-gridline__label">${v}%</span>
            </div>`).join('')}
        </div>
        <div class="wc-bars">
          ${data.map((val, i) => {
            const pct   = Math.round((val / max) * 100);
            const isToday = i === todayIdx;
            const isHigh  = i === highlightIndex;
            return `
              <div class="wc-col">
                <div class="wc-val">${val}%</div>
                <div class="wc-bar-track">
                  <div class="wc-bar${isToday ? ' wc-bar--today' : isHigh ? ' wc-bar--high' : ''}"
                       style="--h:${pct}%;animation-delay:${i*0.07}s"
                       title="${this._days[i]}: ${val}%">
                    <div class="wc-bar__fill"></div>
                  </div>
                </div>
                <div class="wc-day${isToday ? ' wc-day--today' : ''}">${this._days[i]}</div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  },
};
