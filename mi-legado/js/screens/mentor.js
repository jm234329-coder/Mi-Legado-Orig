/* ============================================================
   MI LEGADO — js/screens/mentor.js
   Mentor IA screen
   ============================================================ */

const MLScreenMentor = {
  render() {
    const el = document.getElementById('screen-mentor');
    el.innerHTML = `
      <div class="hero mb-lg">
        <div class="hero__phrase">🤖 Inteligencia Artificial · 24/7</div>
        <div class="hero__title">Mentor <span>IA</span></div>
        <div class="hero__desc">Tu asistente de evolución personal. Pregunta, aprende, reflexiona. Disponible siempre.</div>
      </div>
      <div class="grid-2">
        <div class="card" style="display:flex;flex-direction:column;gap:var(--space-md)">
          <div class="section-title">Conversación</div>
          <div class="chat-area" id="chatArea"></div>
          <div class="chat-input-row">
            <input class="chat-input" id="chatInput" placeholder="Escribe tu pregunta..." onkeydown="if(event.key==='Enter') MLScreenMentor.send()">
            <button class="btn btn--gold" onclick="MLScreenMentor.send()">ENVIAR</button>
          </div>
        </div>
        <div>
          <div class="section-head"><div class="section-title">Preguntas Sugeridas</div></div>
          ${MLContent.mentorQuickQuestions.map(q => `
            <button class="quick-q" onclick="MLScreenMentor.ask('${q}')">${q}</button>
          `).join('')}
        </div>
      </div>`;

    // Restore chat history
    const area = document.getElementById('chatArea');
    if (MLState.chatHistory.length === 0) {
      this._addAIMsg('¡Bienvenido, Guerrero. Soy tu Mentor IA. Estoy aquí para guiarte en tu proceso de evolución. Puedo ayudarte con disciplina, mentalidad, gestión del conocimiento y análisis de tu progreso. ¿Por dónde comenzamos?');
    } else {
      MLState.chatHistory.forEach(msg => {
        const div = document.createElement('div');
        div.className = `msg msg--${msg.type}`;
        div.textContent = msg.text;
        area.appendChild(div);
      });
    }
  },

  ask(question) {
    const input = document.getElementById('chatInput');
    if (input) input.value = question;
    this.send();
  },

  send() {
    const input = document.getElementById('chatInput');
    const area  = document.getElementById('chatArea');
    const text  = input?.value.trim();
    if (!text || !area) return;

    this._addUserMsg(text);
    input.value = '';

    setTimeout(() => {
      const lower = text.toLowerCase();
      const key = Object.keys(MLContent.mentorResponses).find(k => lower.includes(k));
      const response = MLContent.mentorResponses[key] || MLContent.mentorResponses['default'];
      this._addAIMsg(response);
    }, 700);
  },

  _addUserMsg(text) {
    const area = document.getElementById('chatArea');
    if (!area) return;
    const div = document.createElement('div');
    div.className = 'msg msg--user';
    div.textContent = text;
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
    MLState.chatHistory.push({ type: 'user', text });
  },

  _addAIMsg(text) {
    const area = document.getElementById('chatArea');
    if (!area) return;
    const div = document.createElement('div');
    div.className = 'msg msg--ai';
    div.textContent = text;
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
    MLState.chatHistory.push({ type: 'ai', text });
  },
};
