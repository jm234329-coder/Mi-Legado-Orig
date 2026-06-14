/*============================================================
   MI LEGADO — js/modules/particles.js
   Animated background particles
   ============================================================*/

const MLParticles = {
  container: null,
  count: 45,

  init() {
    this.container = document.getElementById('particles');
    if (!this.container) return;
    this.spawn();
  },
  
  spawn() {
    const colors = [
      'rgba(212,175,55,',
      'rgba(123,92,255,',
      'rgba(77,255,184,',
      'rgba(0,212,255,',
      'rgba(255,107,53,',
    ];

    for (let i = 0; i < this.count; i++) {
      const p = document.createElement('div');
      const size   = Math.random() * 2.5 + 0.8;
      const color  = colors[Math.floor(Math.random() * colors.length)];
      const drift  = (Math.random() - 0.5) * 220;
      const dur    = Math.random() * 18 + 10;
      const delay  = Math.random() * 12;

      p.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        background: ${color}0.5);
        left: ${Math.random() * 100}%;
        --drift: ${drift}px;
        animation: particleFloat ${dur}s linear ${delay}s infinite;
        opacity: 0;
      `;
      this.container.appendChild(p);
    }
  },
};
