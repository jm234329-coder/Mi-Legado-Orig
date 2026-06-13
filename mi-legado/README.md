# MI LEGADO — Sistema de Evolución Personal
> Ecosistema digital de desarrollo humano, disciplina y crecimiento personal.

---

## 🚀 Cómo abrir el proyecto

1. Abre la carpeta `mi-legado/` en VS Code
2. Abre `index.html` directamente en tu navegador (doble clic)
3. O instala la extensión **Live Server** en VS Code y haz clic en "Go Live"

> No requiere Node.js, npm, ni ningún build step. Es HTML/CSS/JS puro.

---

## 📁 Estructura del Proyecto

```
mi-legado/
│
├── index.html              ← Punto de entrada principal
│
├── css/
│   ├── variables.css       ← Tokens de diseño (colores, fuentes, espaciados)
│   ├── base.css            ← Reset, tipografía, utilidades globales
│   ├── layout.css          ← Sidebar, topbar, main, content
│   ├── components.css      ← Componentes reutilizables (cards, buttons, etc.)
│   ├── screens.css         ← Estilos específicos por pantalla
│   ├── animations.css      ← Keyframes y animaciones
│   └── themes.css          ← Overrides por tema inmersivo
│
├── js/
│   ├── app.js              ← Bootstrap de la aplicación
│   │
│   ├── modules/            ← Módulos core del sistema
│   │   ├── state.js        ← Estado global de la app
│   │   ├── navigation.js   ← Sistema de navegación
│   │   ├── notifications.js← Toast notifications
│   │   ├── particles.js    ← Partículas de fondo
│   │   ├── themes.js       ← Gestión de temas
│   │   ├── xp.js           ← Sistema XP y niveles
│   │   └── charts.js       ← Renderizado de gráficas
│   │
│   └── screens/            ← Una pantalla = un archivo
│       ├── inicio.js
│       ├── misiones.js
│       ├── responsabilidad.js
│       ├── diario.js
│       ├── academia.js
│       ├── biblioteca.js
│       ├── mentor.js
│       ├── evolucion.js
│       ├── guerrero.js
│       ├── ranking.js
│       ├── comunidad.js
│       ├── hall.js
│       └── temas.js
│
├── data/
│   ├── user.js             ← Perfil y datos del usuario
│   └── content.js          ← Contenido: misiones, cursos, posts, etc.
│
└── assets/
    └── icons/              ← Íconos SVG personalizados (añadir aquí)
```

---

## 🔧 Cómo agregar una nueva pantalla

1. Crea `js/screens/mi-nueva-pantalla.js` con esta estructura:

```js
const MLScreenMiPantalla = {
  render() {
    const el = document.getElementById('screen-mi-pantalla');
    el.innerHTML = `
      <div class="hero mb-lg">
        <div class="hero__title">Mi <span>Pantalla</span></div>
      </div>
      <!-- Tu contenido aquí -->
    `;
  },
};
```

2. Agrega el `<script>` en `index.html` antes de `app.js`
3. Registra la pantalla en `js/app.js` en el objeto `SCREENS`:
```js
'mi-pantalla': () => MLScreenMiPantalla.render(),
```
4. Agrega el ítem de navegación en `data/content.js` dentro del array `nav`

---

## 🎨 Sistema de Temas

Agrega un nuevo tema en `data/content.js` → array `themes`:
```js
{
  id: 'mi-tema',
  name: 'MI TEMA',
  desc: 'Descripción del tema',
  colors: ['#color1', '#color2', '#color3'],
  bg: 'linear-gradient(...)',
  border: 'rgba(...)',
}
```

Luego define las variables CSS en `css/variables.css`:
```css
[data-theme="mi-tema"] {
  --gold: #tucolor;
  --bg-void: #tufondo;
  /* etc */
}
```

---

## 📊 Datos y Estado

- **`data/user.js`** → Cambia datos del usuario (nivel, XP, stats)
- **`data/content.js`** → Modifica misiones, cursos, libros, posts, ranking
- **`js/modules/state.js`** → Estado runtime (cambios durante la sesión)
- El tema seleccionado se guarda en `localStorage` automáticamente

---

## 🛠 Próximas Integraciones Recomendadas

- [ ] Backend con Node.js + Express + MongoDB
- [ ] Autenticación con JWT
- [ ] API del Mentor IA con Claude API (Anthropic)
- [ ] Sistema de notificaciones push
- [ ] Modo oscuro/claro toggle
- [ ] PWA (Progressive Web App) para móvil
- [ ] Dashboard de administrador
- [ ] Sistema de pagos (suscripciones)

---

## 👨‍💻 Créditos del Proyecto

- **Proyecto:** Titanes del Trader / MI LEGADO
- **Administrador:** José Tineo
- **Desarrolladores:** Julian Adrian Martinez Perdomo, Kevin Leonardo Ruiz Lazo, Diego Fernando Rondon Penagos
- **Stack:** HTML5 · CSS3 · JavaScript Vanilla · Google Fonts

---

> *"Cada acción que realizas hoy construye el legado que dejarás mañana."*
