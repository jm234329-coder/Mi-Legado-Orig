/* ============================================================
   MI LEGADO — js/screens/comunidad.js
   Comunidad screen
   ============================================================ */

const MLScreenComunidad = {
  render() {
    const el = document.getElementById('screen-comunidad');
    el.innerHTML = `
      <div class="hero mb-lg">
        <div class="hero__phrase">👥 Red de Guerreros</div>
        <div class="hero__title">La <span>Comunidad</span></div>
        <div class="hero__desc">Comparte tu progreso, inspira a otros y aprende de los que van más adelante que tú.</div>
      </div>
      <div class="grid-2">
        <div>
          <div class="section-head"><div class="section-title">Feed de la Comunidad</div></div>
          ${MLContent.communityPosts.map(p => `
            <div class="post">
              <div class="post__header">
                <div class="post__avatar" style="background:${p.bg};color:${p.badgeColor}">${p.user[0]}</div>
                <div class="post__meta">
                  <div class="post__user">${p.user}</div>
                  <div class="post__time">${p.time}</div>
                </div>
                <div class="post__badge" style="color:${p.badgeColor};border-color:${p.badgeColor}">${p.badge}</div>
              </div>
              <div class="post__content">${p.text}</div>
              <div class="post__actions">
                <div class="post__action" onclick="this.style.color='var(--gold)'">❤ ${p.likes}</div>
                <div class="post__action" onclick="this.style.color='var(--accent)'">💬 ${p.comments}</div>
                <div class="post__action" onclick="MLNotifications.show('⚡','XP','¡+20 XP por interactuar!')">⚡ XP</div>
              </div>
            </div>`).join('')}
        </div>
        <div>
          <div class="section-head"><div class="section-title">Nueva Publicación</div></div>
          <div class="card">
            <textarea id="communityPost" style="width:100%;height:100px;font-size:0.8125rem;line-height:1.7" placeholder="Comparte tu logro, reflexión o aprendizaje del día..."></textarea>
            <button class="btn btn--gold mt-md" onclick="MLScreenComunidad.publish()">PUBLICAR &nbsp;+100 XP</button>
          </div>
        </div>
      </div>`;
  },

  publish() {
    const input = document.getElementById('communityPost');
    if (!input?.value.trim()) {
      MLNotifications.show('⚠', 'Comunidad', 'Escribe algo primero');
      return;
    }
    input.value = '';
    MLXP.add(100);
    MLNotifications.show('👥', 'Comunidad', '¡Publicación compartida! +100 XP');
  },
};
