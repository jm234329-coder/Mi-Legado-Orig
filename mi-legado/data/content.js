/* ============================================================
   MI LEGADO — data/content.js
   Static content data. Replace with API calls in production.
   ============================================================ */

const MLContent = {

  // ── NAVIGATION ──────────────────────────────────────────────
  nav: [
    {
      label: '◈ El Despertar',
      items: [
        { id: 'inicio',          icon: '🏠', label: 'Centro de Mando',    stage: '⚡ EL DESPERTAR' },
        { id: 'misiones',        icon: '⚡', label: 'Misiones Diarias',   stage: '⚡ EL DESPERTAR', badge: 3 },
        { id: 'responsabilidad', icon: '👁', label: 'Tu Responsabilidad', stage: '⚡ EL DESPERTAR' },
        { id: 'diario',          icon: '📖', label: 'Diario del Guerrero', stage: '⚡ EL DESPERTAR' },
      ]
    },
    {
      label: '◈ El Conocimiento',
      items: [
        { id: 'academia',   icon: '🎓', label: 'Academia',         stage: '📚 EL CONOCIMIENTO' },
        { id: 'biblioteca', icon: '📚', label: 'Biblioteca',       stage: '📚 EL CONOCIMIENTO' },
        { id: 'mentor',     icon: '🤖', label: 'Mentor IA',        stage: '📚 EL CONOCIMIENTO' },
      ]
    },
    {
      label: '◈ La Evolución',
      items: [
        { id: 'evolucion', icon: '💎', label: 'Centro Evolución', stage: '💎 LA EVOLUCIÓN' },
      ]
    },
    {
      label: '◈ La Leyenda',
      items: [
        { id: 'guerrero',  icon: '🗡',  label: 'Modo Guerrero',    stage: '🗡 LA LEYENDA' },
        { id: 'ranking',   icon: '🏆', label: 'Ranking Global',   stage: '🗡 LA LEYENDA' },
        { id: 'comunidad', icon: '👥', label: 'Comunidad',        stage: '🗡 LA LEYENDA' },
        { id: 'hall',      icon: '✨', label: 'Hall de Leyendas', stage: '🗡 LA LEYENDA' },
      ]
    },
  ],

  // ── MISSIONS ────────────────────────────────────────────────
  missions: [
    { id: 'm1', name: 'Completa 1 lección de Academia', category: '📚 Conocimiento', type: 'Obligatoria', xp: 150, done: false },
    { id: 'm2', name: 'Analiza tu plan de evolución',   category: '💎 Evolución',    type: 'Obligatoria', xp: 200, done: false },
    { id: 'm3', name: 'Publica en la Comunidad',        category: '👥 Comunidad',    type: 'Opcional',    xp: 100, done: false },
    { id: 'm4', name: 'Lee 20 minutos en la Biblioteca', category: '📚 Lectura',     type: 'Opcional',    xp: 120, done: false },
    { id: 'm5', name: 'Registra en tu Diario del Guerrero', category: '📖 Reflexión', type: 'Obligatoria', xp: 80,  done: true  },
  ],

  // ── WEEKLY MISSIONS ─────────────────────────────────────────
  // dayIndex: 0=Lun, 1=Mar, 2=Mié, 3=Jue, 4=Vie, 5=Sáb, 6=Dom
  // isPast: true = día ya pasó (para historial de fallidas)
  weeklyMissions: [
    // LUNES
    { id: 'w1', dayIndex: 0, day: 'Lunes',    date: '02 Jun',
      name: 'Completa las 3 misiones obligatorias del día',
      category: 'Disciplina Diaria', type: 'Obligatoria',
      xp: 250, related: 'diarias', isPast: true },
    { id: 'w2', dayIndex: 0, day: 'Lunes',    date: '02 Jun',
      name: 'Estudia al menos 1 lección completa en Academia',
      category: 'Conocimiento', type: 'Obligatoria',
      xp: 200, related: 'academia', isPast: true },

    // MARTES
    { id: 'w3', dayIndex: 1, day: 'Martes',   date: '03 Jun',
      name: 'Registra una reflexión profunda en el Diario',
      category: 'Reflexión', type: 'Obligatoria',
      xp: 150, related: 'diario', isPast: true },
    { id: 'w4', dayIndex: 1, day: 'Martes',   date: '03 Jun',
      name: 'Revisa y actualiza tu plan de evolución completo',
      category: 'Evolución', type: 'Obligatoria',
      xp: 300, related: 'evolucion', isPast: true },

    // MIÉRCOLES
    { id: 'w5', dayIndex: 2, day: 'Miércoles',date: '04 Jun',
      name: 'Completa las 3 misiones obligatorias del día',
      category: 'Disciplina Diaria', type: 'Obligatoria',
      xp: 250, related: 'diarias', isPast: true },
    { id: 'w6', dayIndex: 2, day: 'Miércoles',date: '04 Jun',
      name: 'Publica tu progreso semanal en la Comunidad',
      category: 'Comunidad', type: 'Opcional',
      xp: 150, related: 'comunidad', isPast: true },

    // JUEVES
    { id: 'w7', dayIndex: 3, day: 'Jueves',   date: '05 Jun',
      name: 'Lee 30 minutos continuos en la Biblioteca',
      category: 'Lectura', type: 'Obligatoria',
      xp: 200, related: 'biblioteca', isPast: true },
    { id: 'w8', dayIndex: 3, day: 'Jueves',   date: '05 Jun',
      name: 'Consulta al Mentor IA sobre tu evolución personal',
      category: 'Mentoría', type: 'Opcional',
      xp: 150, related: 'mentor', isPast: true },

    // VIERNES (hoy)
    { id: 'w9', dayIndex: 4, day: 'Viernes',  date: '06 Jun',
      name: 'Completa 4 misiones en un solo día',
      category: 'Reto del Día', type: 'Obligatoria',
      xp: 350, related: 'diarias', isPast: false },
    { id: 'w10', dayIndex: 4, day: 'Viernes', date: '06 Jun',
      name: 'Escribe tu reflexión de mitad de semana',
      category: 'Reflexión', type: 'Opcional',
      xp: 200, related: 'diario', isPast: false },

    // SÁBADO
    { id: 'w11', dayIndex: 5, day: 'Sábado',  date: '07 Jun',
      name: 'Repasa todos los módulos visitados esta semana',
      category: 'Revisión Semanal', type: 'Obligatoria',
      xp: 300, related: null, isPast: false },
    { id: 'w12', dayIndex: 5, day: 'Sábado',  date: '07 Jun',
      name: 'Comparte un logro de la semana en la Comunidad',
      category: 'Comunidad', type: 'Opcional',
      xp: 150, related: 'comunidad', isPast: false },

    // DOMINGO — MISIÓN ÉPICA
    { id: 'w13', dayIndex: 6, day: 'Domingo', date: '08 Jun',
      name: 'MISIÓN ÉPICA: Completa la semana sin ningún día fallado',
      category: 'Legado', type: 'Épica',
      xp: 600, related: 'all', isPast: false },
    { id: 'w14', dayIndex: 6, day: 'Domingo', date: '08 Jun',
      name: 'Planifica y escribe las metas de la próxima semana',
      category: 'Estrategia', type: 'Obligatoria',
      xp: 200, related: 'evolucion', isPast: false },
  ],

  // ── HABITS ──────────────────────────────────────────────────
  habits: [
    { name: 'Estudiar Academia',    days: [1,1,1,1,1,0,1] },
    { name: 'Registrar Diario',     days: [1,1,0,1,1,1,1] },
    { name: 'Plan de Evolución',    days: [1,1,1,0,1,0,0] },
    { name: 'Lectura 20 min',       days: [0,1,1,1,1,0,1] },
    { name: 'Reflexión Nocturna',   days: [1,0,1,1,0,0,1] },
  ],

  // ── DIAGNOSES ───────────────────────────────────────────────
  diagnoses: [
    { icon: '🔥', text: 'Consistencia sólida esta semana',       color: 'var(--teal)' },
    { icon: '⚠',  text: '2 hábitos sin completar (46%)',          color: 'var(--gold)' },
    { icon: '📈', text: 'Tendencia positiva vs semana anterior',  color: 'var(--teal)' },
    { icon: '🎯', text: 'Meta mensual: 72% de cumplimiento',      color: 'var(--gold)' },
    { icon: '❌', text: 'Reflexión nocturna: área de mejora',     color: 'var(--red)'  },
  ],

  // ── DIARY (sample) ──────────────────────────────────────────
  diaryEntries: [
    {
      date: '03 Jun 2026', mood: '🔥', moodLabel: 'Motivado',
      text: '"Hoy completé el módulo de psicología del trading. Me doy cuenta de que mi mayor enemigo soy yo mismo. La disciplina no es lo que haces cuando tienes ganas — es lo que haces cuando no las tienes."',
      color: 'var(--gold)'
    },
    {
      date: '02 Jun 2026', mood: '💪', moodLabel: 'Fuerte',
      text: '"Primera semana de racha completada. 7 días sin fallar una sola misión. El sistema funciona. La consistencia es el verdadero superpoder."',
      color: 'var(--accent)'
    },
    {
      date: '01 Jun 2026', mood: '🎯', moodLabel: 'Enfocado',
      text: '"Definí mis 3 metas del mes. Claridad absoluta. El plan de evolución me ayudó a ver con objetividad qué estoy construyendo y hacia dónde voy."',
      color: 'var(--teal)'
    },
  ],

  // ── ACADEMIA LEVELS (game progression) ──────────────────────
  academiaLevels: [
    // ═══ NIVEL 1 — PSICOLOGÍA ═══════════════════════════════════
    {
      id: 'psicologia', level: 1,
      icon: '🧠', label: 'Psicología',
      color: '#7B5CFF', gradient: 'linear-gradient(135deg,#7B5CFF,#9B7FFF)',
      tagline: 'Todo comienza en la mente',
      desc: 'Sin el sistema operativo correcto, ninguna habilidad funciona.',
      xpTotal: 525,
      courses: [
        {
          id: 'psi-c1', name: 'Mentalidad de Crecimiento', icon: '🌱',
          duration: '30 min', xp: 150,
          desc: 'La diferencia entre una mente que se expande y una que se limita.',
          lessons: [
            { id: 'psi-c1-l1', title: 'El Cerebro es Plástico',
              content: `<p>Durante siglos creímos que el cerebro nacía formado y ya no cambiaba. La neurociencia moderna demostró lo contrario: el cerebro se reorganiza físicamente en respuesta a tus pensamientos, acciones y experiencias. Esto se llama <strong>neuroplasticidad</strong>.</p><p>Cada vez que aprendes algo nuevo, practicas una habilidad o cambias un hábito, estás literalmente recableando circuitos neuronales. La inteligencia no es fija — es entrenable. El talento no es un límite — es un punto de partida.</p><p><strong>Acción de hoy:</strong> Identifica una creencia limitante que tienes sobre ti mismo. Escríbela y añade la palabra <em>"aún"</em> al final. "No soy disciplinado <em>aún</em>." Ese "aún" es la puerta de entrada.</p>` },
            { id: 'psi-c1-l2', title: 'Mentalidad Fija vs Mentalidad de Crecimiento',
              content: `<p>La psicóloga Carol Dweck identificó dos tipos de mentalidad. La <strong>mentalidad fija</strong> cree que las capacidades son innatas — o eres inteligente o no lo eres. Evita los desafíos para no quedar expuesto. Toma el fracaso como identidad.</p><p>La <strong>mentalidad de crecimiento</strong> cree que las capacidades se desarrollan con esfuerzo y estrategia. Busca los desafíos porque sabe que en ellos crece. Toma el fracaso como información, no como veredicto.</p><p><strong>El test real:</strong> ¿Cómo reaccionas cuando alguien es mejor que tú en algo? ¿Amenaza o curiosidad? La envidia es señal de mentalidad fija. Hoy, transforma cualquier envidia en la pregunta: <em>"¿Qué puedo aprender de esta persona?"</em></p>` },
            { id: 'psi-c1-l3', title: 'Reprogramar tu Diálogo Interno',
              content: `<p>Tienes entre 60,000 y 80,000 pensamientos al día. El 80% son repetitivos. Si no los supervisas, tu mente repite por defecto los patrones aprendidos en la infancia — muchos de ellos limitantes. El diálogo interno que no controlas, te controla a ti.</p><p>La reprogramación no se hace con afirmaciones vacías. Se hace con <strong>preguntas de poder</strong>. En lugar de "soy un fracasado" → "¿Qué puedo aprender de esto para mejorar?". En lugar de "no puedo" → "¿Qué necesitaría para poder?".</p><p><strong>Protocolo de 7 días:</strong> Cada noche escribe: (1) Un desafío de hoy. (2) Cómo respondiste mentalmente. (3) Cómo respondería tu mejor versión. En 7 días notarás un cambio real en tu voz interior.</p>` },
          ]
        },
        {
          id: 'psi-c2', name: 'Control Emocional', icon: '⚖️',
          duration: '35 min', xp: 175,
          desc: 'Las emociones no son tus enemigas. Son información que debes aprender a leer.',
          lessons: [
            { id: 'psi-c2-l1', title: 'Las Emociones como Información',
              content: `<p>La mayoría intenta suprimir las emociones negativas. Ese es el error. Las emociones son señales del sistema nervioso que te informan sobre tu entorno y tus necesidades. Suprimirlas es como apagar el indicador de aceite del motor — el problema no desaparece, se agrava.</p><p>El miedo te informa de un peligro percibido. La rabia te informa de que un límite fue cruzado. La tristeza te informa de una pérdida. Cada emoción tiene un mensaje. Tu trabajo no es eliminar la emoción — es <strong>leer su mensaje y actuar con intención</strong>, no con impulso.</p><p><strong>Práctica:</strong> La próxima vez que sientas una emoción intensa, pausa 10 segundos y pregúntate: "¿Qué me está intentando decir esta emoción?" Escríbelo. No actúes todavía. Solo observa.</p>` },
            { id: 'psi-c2-l2', title: 'El Espacio entre Estímulo y Respuesta',
              content: `<p>Viktor Frankl, sobreviviente del Holocausto, lo dijo con precisión: <em>"Entre el estímulo y la respuesta hay un espacio. En ese espacio está nuestro poder para elegir nuestra respuesta. En nuestra respuesta yace nuestra libertad."</em></p><p>La reactividad emocional ocurre cuando ese espacio es cero — cuando el estímulo y la respuesta son casi simultáneos. <strong>Alargar ese espacio</strong> es el objetivo del control emocional. No eliminar sentimientos, sino crear una fracción de segundo entre sentir y actuar.</p><p><strong>Técnica STOP:</strong> S — Detente. T — Respira profundo. O — Observa qué sientes y piensas. P — Actúa con intención. Practica este protocolo una vez hoy en cualquier situación de tensión menor.</p>` },
            { id: 'psi-c2-l3', title: 'Técnicas de Regulación Emocional',
              content: `<p>La regulación emocional es una habilidad muscular. Se entrena. Estas son las tres técnicas más validadas por la ciencia:</p><p><strong>1. Reencuadre cognitivo:</strong> Cambia la interpretación del evento. "Perdí un cliente" → "Aprendí qué tipo de cliente no quiero." <strong>2. Nombre la emoción:</strong> Estudios de neuroimagen muestran que decir "siento rabia" activa la corteza prefrontal y reduce la amígdala. Nombrar calma. <strong>3. Respiración 4-7-8:</strong> Inhala 4s, mantén 7s, exhala 8s. Activa el sistema nervioso parasimpático en menos de 90 segundos.</p><p><strong>Tarea:</strong> Elige una técnica y úsala hoy en cualquier momento de estrés. La práctica en situaciones pequeñas construye la capacidad para situaciones grandes.</p>` },
          ]
        },
        {
          id: 'psi-c3', name: 'Sesgos que te Sabotean', icon: '🔍',
          duration: '40 min', xp: 200,
          desc: 'Tu cerebro te engaña constantemente. Aprende a detectarlo antes de que sea tarde.',
          lessons: [
            { id: 'psi-c3-l1', title: 'Cómo el Cerebro te Engaña',
              content: `<p>Tu cerebro procesa 11 millones de bits por segundo, pero tu consciencia solo maneja 50. El 99.99% de tu procesamiento mental es <strong>automático e inconsciente</strong>. La mayoría de tus decisiones no son tan racionales como crees.</p><p>Los <strong>sesgos cognitivos</strong> son atajos mentales que tu cerebro usa para procesar rápido. Funcionaron en la sabana africana. En el mundo moderno, muchos te llevan a decisiones subóptimas: en inversiones, relaciones, negocios y en tu evolución personal.</p><p>El primer paso para combatirlos no es eliminarlos — es saber que existen. A continuación aprenderás los cinco que más daño hacen a personas ambiciosas.</p>` },
            { id: 'psi-c3-l2', title: 'Los 5 Sesgos que más Dañan tu Éxito',
              content: `<p><strong>1. Sesgo de confirmación:</strong> Buscas información que confirma lo que ya crees. Solución: busca activamente argumentos contrarios a tus creencias.</p><p><strong>2. Sesgo del superviviente:</strong> Solo ves los casos de éxito, no los fracasos. "Fulano se hizo rico" — no ves los miles que perdieron todo. <strong>3. Descuento hiperbólico:</strong> Prefieres recompensa pequeña ahora a una grande después. Enemigo de la inversión y el estudio. <strong>4. Costo hundido:</strong> Sigues en algo malo porque ya invertiste mucho. <strong>5. Efecto Dunning-Kruger:</strong> Cuanto menos sabes, más confianza tienes.</p><p><strong>Pregunta de hoy:</strong> ¿En qué área de tu vida estás actuando bajo el sesgo de costo hundido? ¿Qué abandonarías si no hubieras invertido ya tiempo en ello?</p>` },
            { id: 'psi-c3-l3', title: 'Decisiones sin Sesgo',
              content: `<p>No puedes eliminar los sesgos — están cableados en tu biología. Pero sí puedes crear <strong>sistemas de decisión</strong> que los neutralizan.</p><p>Tres herramientas probadas: <strong>(1) Test del periodista:</strong> Antes de decidir, imagina que alguien publicará tu razonamiento. ¿Aguantaría el escrutinio? <strong>(2) Pre-mortem:</strong> Antes de lanzar algo, imagina que fracasó. ¿Por qué? Esta técnica obliga al cerebro a buscar debilidades en lugar de solo confirmar el optimismo. <strong>(3) Criterios escritos antes de ver las opciones:</strong> Define qué es éxito antes de evaluar alternativas. Bloquea el sesgo de confirmación.</p><p><strong>Nivel 1 completado.</strong> Tienes el sistema operativo mental base. Todo lo que construyas sobre esta base será sólido.</p>` },
          ]
        },
      ]
    },

    // ═══ NIVEL 2 — DISCIPLINA ════════════════════════════════════
    {
      id: 'disciplina', level: 2,
      icon: '🛡', label: 'Disciplina',
      color: '#D4AF37', gradient: 'linear-gradient(135deg,#8B6914,#F5D462)',
      tagline: 'El puente entre metas y logros',
      desc: 'Con la mente entrenada, construyes el sistema de acción diaria.',
      xpTotal: 550,
      courses: [
        {
          id: 'dis-c1', name: 'Fundamentos de Autodisciplina', icon: '⚔️',
          duration: '35 min', xp: 175,
          desc: 'La disciplina no es motivación. Es un sistema.',
          lessons: [
            { id: 'dis-c1-l1', title: 'Disciplina no es Motivación',
              content: `<p>La motivación es un estado de ánimo — aparece y desaparece. Esperar estar motivado para actuar es una estrategia de perdedores. Los campeones actúan cuando no tienen ganas. Eso es lo que los diferencia.</p><p>La <strong>autodisciplina</strong> es la capacidad de hacer lo que tienes que hacer, cuando tienes que hacerlo, sintiéndote como te sientas. No depende de emoción, energía ni circunstancias externas. Depende de decisiones previas y sistemas instalados.</p><p><strong>La pregunta que cambia todo:</strong> Deja de preguntarte "¿Tengo ganas?" y empieza a preguntar "¿Está en mi plan?" Si está en el plan, se ejecuta. Si no está en el plan, se evalúa. La disciplina vive en el sistema, no en el estado de ánimo.</p>` },
            { id: 'dis-c1-l2', title: 'El Músculo de la Voluntad',
              content: `<p>La investigación de Roy Baumeister demostró que la voluntad funciona como un músculo: se agota con el uso a lo largo del día. Esto se llama <strong>ego depletion</strong>. Cada decisión que tomas consume un pequeño recurso cognitivo.</p><p>Las personas más disciplinadas no tienen "más" fuerza de voluntad — tienen mejores estrategias para conservarla. Toman las decisiones importantes por la mañana. Automatizan decisiones triviales (comer lo mismo, vestir lo mismo). Eliminan opciones para preservar energía cognitiva.</p><p><strong>Acción:</strong> Identifica la decisión más importante que debes tomar cada día. Muévela a las primeras horas de la mañana, antes de que el día consuma tu capacidad de decisión.</p>` },
            { id: 'dis-c1-l3', title: 'Construir un Sistema de Disciplina',
              content: `<p>Un sistema de disciplina tiene tres componentes: <strong>horario fijo, ambiente diseñado e identidad alineada</strong>. Sin los tres, la disciplina es frágil.</p><p><strong>Horario fijo:</strong> Mis actividades críticas ocurren a la misma hora todos los días. El cerebro ama la previsibilidad — reduce la resistencia. <strong>Ambiente diseñado:</strong> Elimina las distracciones del entorno antes de necesitar disciplina para ignorarlas. <strong>Identidad alineada:</strong> No "intento ser disciplinado" — "soy una persona disciplinada". La identidad dirige el comportamiento más que cualquier técnica.</p><p><strong>Esta semana:</strong> Elige UNA actividad crítica. Asígnale una hora fija. Diseña el ambiente para hacerla fácil. Repite 7 días. Luego añade otra.</p>` },
          ]
        },
        {
          id: 'dis-c2', name: 'La Ciencia del Autocontrol', icon: '🔬',
          duration: '30 min', xp: 175,
          desc: 'Por qué fallamos y cómo crear entornos que nos hagan ganar.',
          lessons: [
            { id: 'dis-c2-l1', title: 'Por qué Fallamos en el Autocontrol',
              content: `<p>Fallamos en el autocontrol por tres razones principales. Primera: <strong>fricción insuficiente</strong> — el mal hábito es demasiado fácil. Segunda: <strong>recompensa diferida</strong> — los beneficios del buen comportamiento están en el futuro, pero el placer del mal comportamiento es inmediato. Tercera: <strong>fatiga de decisión</strong> — tomamos miles de micro-decisiones antes de llegar al momento crítico.</p><p>Entender el mecanismo del fallo es el primer paso para diseñar la solución. No es falta de carácter — es arquitectura del entorno y del tiempo que no está optimizada.</p><p><strong>Audit de hoy:</strong> Elige un área donde fallas consistentemente. ¿Cuál de las tres razones la explica mejor? La solución depende del diagnóstico correcto.</p>` },
            { id: 'dis-c2-l2', title: 'Entornos que Potencian el Autocontrol',
              content: `<p>La psicóloga Wendy Wood estudió la formación de hábitos durante 30 años. Su conclusión: <strong>el 43% de nuestras acciones diarias son hábitos automáticos gatillados por señales del entorno</strong>. Cambiar el entorno es más efectivo que cambiar la motivación.</p><p>Principio: Haz que los buenos comportamientos sean más fáciles que los malos. Quita el teléfono del cuarto para dormir mejor. Deja las zapatillas a la vista para ejercitarte. Prepara la comida saludable el domingo. <strong>Diseña para el yo cansado de las 10 pm, no para el yo motivado de las 9 am.</strong></p><p><strong>Rediseña un entorno esta semana:</strong> Elige el espacio donde más fallas y modifícalo para que la acción correcta sea el camino de menor resistencia.</p>` },
            { id: 'dis-c2-l3', title: 'La Regla del 40%',
              content: `<p>Los Navy SEALs tienen un principio: cuando tu mente dice que ya no puedes más, solo estás al <strong>40% de tu capacidad real</strong>. La voz que dice "para" es un mecanismo de seguridad prematuro, no el límite real.</p><p>Esto no significa ignorar el dolor real o el agotamiento genuino — significa que la mayoría de veces que quieres rendirte, todavía tienes reserva. El entrenamiento de la disciplina consiste en aprender a reconocer la diferencia entre señal de parada falsa y señal de parada real.</p><p><strong>Test esta semana:</strong> La próxima vez que quieras parar — en ejercicio, en estudio, en trabajo — haz 20% más. Solo eso. No el doble. Solo 20% más. Registra cómo te sientes después. Esto entrena el límite real.</p>` },
          ]
        },
        {
          id: 'dis-c3', name: 'Disciplina en la Adversidad', icon: '🔥',
          duration: '35 min', xp: 200,
          desc: 'Cualquiera es disciplinado cuando todo va bien. Esto es para cuando no.',
          lessons: [
            { id: 'dis-c3-l1', title: 'El Dolor como Herramienta',
              content: `<p>La cultura moderna trata el dolor como un error del sistema. La mentalidad de élite lo trata como <strong>información y entrenamiento</strong>. El dolor físico, emocional y mental es el mecanismo de adaptación más poderoso que tienes.</p><p>Sin incomodidad, no hay crecimiento. La zona de confort es confort — no crecimiento. Cada vez que deliberadamente te pones en una situación incómoda y la atraviesas, estás construyendo no solo la habilidad específica sino también la <strong>identidad de alguien que puede con lo que otros no pueden</strong>.</p><p><strong>Práctica:</strong> Esta semana, haz una cosa cada día que te genere incomodidad deliberada. Puede ser pequeña: una ducha fría, una conversación difícil, estudiar cuando tienes sueño. El punto es el patrón, no el tamaño.</p>` },
            { id: 'dis-c3-l2', title: 'Sistemas de Recuperación',
              content: `<p>La disciplina perfecta no existe. Todos fallan. La diferencia entre quien avanza y quien no es la <strong>velocidad de recuperación</strong>. Un día fallado no destruye nada. Tres semanas de "ya qué importa" sí.</p><p>Necesitas un sistema de recuperación predefinido para cuando falles: (1) <strong>No te castigues</strong> — la autocrítica excesiva activa el sistema de amenaza y reduce la probabilidad de volver. (2) <strong>Analiza brevemente</strong> — ¿qué falló? ¿entorno, energía, plan? (3) <strong>Vuelve mañana sin drama</strong> — el próximo día es un borrador limpio.</p><p><strong>Regla clave:</strong> Nunca dos días seguidos fallando. Uno puede pasarle a cualquiera. Dos consecutivos es el inicio de un patrón. Esta regla es tu red de seguridad.</p>` },
            { id: 'dis-c3-l3', title: 'Identidad del Guerrero Disciplinado',
              content: `<p>Después de estos tres cursos, tienes el fundamento completo de la disciplina. Pero hay un último nivel: la <strong>identidad</strong>. Las técnicas y sistemas son herramientas. La identidad es el suelo en que crecen.</p><p>Una persona que "intenta ser disciplinada" fallará cuando la presión sea suficiente. Una persona que <strong>es</strong> disciplinada por identidad — que ha decidido que ese es su carácter — fallará menos y se recuperará más rápido. La identidad no se declara, se construye acción por acción.</p><p><strong>Cada acción disciplinada es un voto por la persona que estás construyendo.</strong> Cada vez que actúas en contra de tus miedos, en contra de la comodidad, en contra del impulso de rendirte — estás votando. Vota bien. El Nivel 2 está completado.</p>` },
          ]
        },
      ]
    },

    // ═══ NIVEL 3 — HÁBITOS ══════════════════════════════════════
    {
      id: 'habitos', level: 3,
      icon: '🏃', label: 'Hábitos',
      color: '#4DFFB8', gradient: 'linear-gradient(135deg,#00AA88,#4DFFB8)',
      tagline: 'La disciplina convertida en identidad',
      desc: 'Lo que haces todos los días define quién eres.',
      xpTotal: 525,
      courses: [
        {
          id: 'hab-c1', name: 'El Loop del Hábito', icon: '🔄',
          duration: '30 min', xp: 150,
          desc: 'Señal, rutina, recompensa. El ciclo que gobierna el 45% de tu día.',
          lessons: [
            { id: 'hab-c1-l1', title: 'Señal, Rutina, Recompensa',
              content: `<p>Charles Duhigg, en <em>El Poder del Hábito</em>, identificó el mecanismo central: todo hábito sigue un loop de tres pasos. <strong>Señal</strong> (trigger que activa el comportamiento), <strong>Rutina</strong> (el comportamiento en sí) y <strong>Recompensa</strong> (el beneficio que recibe el cerebro y que hace que quiera repetirlo).</p><p>El 45% de tus acciones diarias son hábitos automáticos — no decisiones conscientes. El cerebro los automatiza para conservar energía cognitiva. Una vez instalado, un hábito nunca desaparece del todo; solo puede ser reemplazado.</p><p><strong>Audit:</strong> Elige un hábito que quieras cambiar. Identifica la señal (¿cuándo ocurre?), la rutina (¿qué haces?) y la recompensa (¿qué obtienes del cerebro?). Sin entender el loop, no puedes modificarlo.</p>` },
            { id: 'hab-c1-l2', title: 'Cómo Instalar un Nuevo Hábito',
              content: `<p>Para instalar un hábito nuevo necesitas los tres elementos del loop. BJ Fogg añadió una clave: <strong>el hábito debe ser tan pequeño que sea imposible fallar</strong>. Si quieres meditar 20 minutos, empieza con 2. Si quieres ejercitar 1 hora, empieza con 5 minutos.</p><p>La estrategia más efectiva es el <strong>apilamiento de hábitos</strong> (habit stacking): anclar el nuevo hábito a uno que ya existe. Fórmula: "Después de [hábito existente], haré [nuevo hábito]." "Después de hacer el café, meditaré 2 minutos." El hábito existente se convierte en la señal automática.</p><p><strong>Define tu primer hábito apilado hoy:</strong> Escribe la fórmula completa. El acto de escribirlo duplica la probabilidad de implementación según la investigación de Peter Gollwitzer.</p>` },
            { id: 'hab-c1-l3', title: 'La Regla de los Dos Minutos',
              content: `<p>James Clear propone en <em>Hábitos Atómicos</em> la Regla de los 2 Minutos: cualquier hábito que quieras construir debe poder hacerse en 2 minutos al inicio. No porque 2 minutos sea el objetivo — sino porque 2 minutos te quita la resistencia de empezar.</p><p>Empezar es el 90% de la batalla. Una vez que estás en movimiento, continuar es fácil. "Voy a correr" → "Voy a ponerme las zapatillas y salir por la puerta". "Voy a estudiar" → "Voy a abrir el libro". La versión de 2 minutos es la rampa de lanzamiento.</p><p><strong>Aplicación esta semana:</strong> Toma el hábito que definiste en la lección anterior y escribe la versión de 2 minutos. Comprométete solo con esa versión durante 14 días. La consistencia primero, la intensidad después.</p>` },
          ]
        },
        {
          id: 'hab-c2', name: 'Identidad y Hábitos', icon: '🪞',
          duration: '30 min', xp: 175,
          desc: 'No eres tus resultados. Eres tus hábitos. Y tus hábitos son tu identidad.',
          lessons: [
            { id: 'hab-c2-l1', title: 'Quién Eres Determina lo que Haces',
              content: `<p>Hay tres niveles de cambio: cambiar los resultados (el más superficial), cambiar los procesos, y cambiar la identidad (el más profundo). La mayoría intenta cambiar resultados sin tocar la identidad — y por eso falla.</p><p>Si intentas dejar de fumar y te ofrecen un cigarrillo, hay dos respuestas posibles: "Estoy intentando dejarlo" (identidad de fumador que lucha) vs. "No fumo" (identidad de no fumador). La segunda respuesta viene de alguien que <strong>ya resolvió el conflicto a nivel de identidad</strong>. El comportamiento sigue a la identidad, no al revés.</p><p><strong>Pregunta de identidad:</strong> ¿Qué tipo de persona quieres ser? Escribe tres frases que empiecen con "Soy una persona que..." Esas frases son tu nueva brújula de comportamiento.</p>` },
            { id: 'hab-c2-l2', title: 'Cada Acción es un Voto',
              content: `<p>James Clear introduce el concepto de <strong>"voting for your identity"</strong>: cada acción que realizas es un voto para el tipo de persona que estás convirtiéndote. No necesitas ganar todas las votaciones. Necesitas ganar la mayoría.</p><p>Cuando vas al gimnasio, votas por ser una persona activa. Cuando estudias cuando tienes sueño, votas por ser disciplinado. Cuando dices que no a algo que no está en tu plan, votas por tener integridad contigo mismo. Con el tiempo, el acumulado de votos construye evidencia. Y la evidencia construye confianza en la identidad.</p><p><strong>Crea evidencia hoy:</strong> Haz una acción pequeña que esté alineada con quien quieres ser. No por el resultado — por el voto. Escríbelo en tu diario del guerrero.</p>` },
            { id: 'hab-c2-l3', title: 'El Sistema de Identidad-Hábito',
              content: `<p>El sistema completo funciona así: defines la identidad → diseñas hábitos coherentes con esa identidad → los hábitos producen resultados → los resultados refuerzan la identidad. Es un ciclo virtuoso.</p><p>El problema con fijar metas solo en resultados es que son finitas. "Quiero perder 10 kilos" — ¿y después? Si tu identidad no cambió, el peso vuelve. "Soy una persona que cuida su cuerpo" — eso no tiene fecha de vencimiento.</p><p><strong>Ejercicio de integración:</strong> Toma las tres frases de identidad que escribiste y diseña un hábito específico para cada una. Pequeño, apilado a algo existente, versión de 2 minutos. Tienes los tres cursos de Hábitos. Ahora diseña tu sistema completo.</p>` },
          ]
        },
        {
          id: 'hab-c3', name: 'Eliminar Hábitos Destructivos', icon: '✂️',
          duration: '35 min', xp: 200,
          desc: 'Construir es importante. Destruir lo que te daña es urgente.',
          lessons: [
            { id: 'hab-c3-l1', title: 'Anatomía de un Mal Hábito',
              content: `<p>Los malos hábitos existen por una razón: resuelven un problema real, aunque sea de forma subóptima. El alcohol reduce el estrés. Las redes sociales dan estimulación. Los atracones de comida dan confort. Ningún mal hábito es irracional — todos sirven a una necesidad.</p><p>Para eliminar un mal hábito no basta con "tener más fuerza de voluntad". Necesitas <strong>entender qué necesidad satisface</strong> y encontrar una alternativa que satisfaga la misma necesidad de forma más sana. Si eliminas el comportamiento sin reemplazar la recompensa, la presión se acumula hasta que el hábito regresa.</p><p><strong>Audit profundo:</strong> Elige tu mal hábito más relevante. Pregunta: "¿Qué necesidad estoy satisfaciendo con esto?" Sé honesto. La respuesta es el punto de partida real.</p>` },
            { id: 'hab-c3-l2', title: 'Invertir el Loop',
              content: `<p>Charles Duhigg propone que para cambiar un hábito debes mantener la misma señal y la misma recompensa, pero cambiar la rutina. Esta es la estrategia del <strong>loop invertido</strong>.</p><p>Si la señal es "estrés del trabajo" y la recompensa es "desconexión y alivio", la rutina de redes sociales puede ser reemplazada por 10 minutos de respiración, una caminata corta o escuchar música. Misma señal, mismo tipo de recompensa, rutina diferente. <strong>La clave es que la alternativa debe entregar la misma categoría de recompensa</strong> — no una recompensa diferente.</p><p><strong>Diseña tu sustitución:</strong> Señal → [mantén] → Nueva rutina → [misma] Recompensa. Escríbelo como un protocolo. Lo que no está escrito no es un plan — es una intención.</p>` },
            { id: 'hab-c3-l3', title: 'El Plan de Recaída',
              content: `<p>Los malos hábitos no se eliminan en línea recta. Habrá recaídas. La pregunta no es si volverás a caer — es qué harás cuando caigas. Sin un plan predefinido para la recaída, la mayoría abandona el intento completamente.</p><p>Tu plan de recaída tiene tres pasos: <strong>(1) Observar sin juicio</strong> — "Caí. Es parte del proceso." <strong>(2) Identificar el trigger</strong> — ¿Qué señal lo activó? ¿Puedes modificarla? <strong>(3) Volver al plan mañana</strong> — sin dramas, sin extensión del castigo, sin "ya qué importa". Un día malo no define el sistema.</p><p><strong>Escribe tu plan de recaída esta semana</strong> para el hábito que estás trabajando. Tener el plan escrito antes de la recaída multiplica por 3 la probabilidad de recuperación según estudios de formación de hábitos. Nivel 3 completado.</p>` },
          ]
        },
      ]
    },

    // ═══ NIVEL 4 — PRODUCTIVIDAD ════════════════════════════════
    {
      id: 'productividad', level: 4,
      icon: '🎯', label: 'Productividad',
      color: '#00D4FF', gradient: 'linear-gradient(135deg,#0088AA,#00D4FF)',
      tagline: 'Haz menos. Logra más',
      desc: 'Con hábitos sólidos, aprendes a dirigir tu energía hacia lo que importa.',
      xpTotal: 525,
      courses: [
        {
          id: 'pro-c1', name: 'Deep Work', icon: '🔱',
          duration: '35 min', xp: 175,
          desc: 'La habilidad más valiosa del siglo XXI y la más ignorada.',
          lessons: [
            { id: 'pro-c1-l1', title: 'Trabajo Profundo vs Trabajo Superficial',
              content: `<p>Cal Newport define el <strong>Deep Work</strong> como actividades cognitivas exigentes realizadas en estado de concentración máxima, sin distracciones. Estas actividades empujan tus capacidades al límite y producen valor real, difícil de replicar.</p><p>El <strong>trabajo superficial</strong> son tareas de baja demanda cognitiva — emails, reuniones, notificaciones, tareas administrativas. Se pueden hacer distraído. Generan poco valor. El problema: la mayoría de la gente pasa el 80% de su jornada en trabajo superficial y llama a eso "estar ocupado".</p><p><strong>Pregunta de impacto:</strong> Si solo pudieras hacer 3 horas de trabajo real mañana, ¿qué harías? Esas son tus tareas de Deep Work. Lo demás es trabajo superficial que puede reducirse, delegarse o eliminarse.</p>` },
            { id: 'pro-c1-l2', title: 'Crear tu Ritual de Deep Work',
              content: `<p>El Deep Work no ocurre espontáneamente — requiere un <strong>ritual prediseñado</strong>. Newport identifica cuatro filosofías: Monástico (te aislas del mundo completamente), Bimodal (días completos de Deep Work alternados con días normales), Rítmico (bloques fijos diarios), Periodístico (robas momentos de concentración cuando aparecen).</p><p>Para la mayoría de las personas, la filosofía <strong>Rítmica</strong> es la más sostenible: misma hora cada día, misma duración, mismo lugar. El cerebro, con la práctica, entra más rápido en el estado de concentración profunda porque asocia el ritual con el estado.</p><p><strong>Diseña tu ritual:</strong> Hora fija de inicio, duración (empieza con 60-90 min), lugar específico, reglas claras (teléfono apagado, notificaciones desactivadas). Escríbelo. Esta semana, ejecuta el ritual 5 días consecutivos.</p>` },
            { id: 'pro-c1-l3', title: 'Eliminar Distracciones de Raíz',
              content: `<p>La investigación de Gloria Mark (UC Irvine) muestra que después de una interrupción, el cerebro tarda en promedio <strong>23 minutos</strong> en volver al nivel de concentración previo. Si revisas el teléfono cada 10 minutos, nunca alcanzas concentración profunda.</p><p>Las distracciones modernas están diseñadas por equipos de ingenieros para capturar tu atención. No puedes combatirlas con "fuerza de voluntad" — necesitas <strong>ingeniería inversa del entorno</strong>: teléfono en modo avión o en otra habitación, bloqueo de sitios web, notificaciones desactivadas a nivel de sistema operativo, y comunicar a tu entorno tus bloques de concentración.</p><p><strong>Acción crítica:</strong> Activa el modo No Molestar durante tus bloques de Deep Work. No "intenta" ignorar el teléfono — elimina la posibilidad de distracción. Lo que no está presente no puede distraer.</p>` },
          ]
        },
        {
          id: 'pro-c2', name: 'Sistemas de Productividad', icon: '⚙️',
          duration: '30 min', xp: 175,
          desc: 'GTD, time blocking y la regla 80/20. Los tres sistemas que necesitas.',
          lessons: [
            { id: 'pro-c2-l1', title: 'El Sistema GTD',
              content: `<p>Getting Things Done (GTD) de David Allen parte de un principio: <strong>tu mente está hecha para tener ideas, no para guardarlas</strong>. Cada tarea pendiente que guardas en la memoria consume energía cognitiva y genera ansiedad de fondo.</p><p>GTD tiene 5 pasos: <strong>Capturar</strong> (todo lo que te preocupa va a un inbox, no a tu cabeza), <strong>Clarificar</strong> (¿requiere acción? ¿cuál es el siguiente paso específico?), <strong>Organizar</strong> (en listas por contexto), <strong>Reflexionar</strong> (revisión semanal del sistema) y <strong>Hacer</strong>. El resultado: la mente vacía de ruido y disponible para pensar.</p><p><strong>Primer paso GTD:</strong> Hoy, pasa 20 minutos capturando absolutamente todo lo que tienes pendiente — trabajo, personal, proyectos, compromisos. Sácalo todo de la cabeza a papel o app. Siente la diferencia inmediata.</p>` },
            { id: 'pro-c2-l2', title: 'Time Blocking',
              content: `<p>Time Blocking es reservar bloques de tiempo específicos en el calendario para tareas específicas, igual que una reunión. Cal Newport y Elon Musk lo usan. La razón: <strong>lo que no está en el calendario no existe</strong>.</p><p>Sin time blocking, el día se llena de reactivo — emails, interrupciones, tareas urgentes pero no importantes. Con time blocking, el día está diseñado proactivamente. Tienes un bloque de Deep Work (mañana temprano), un bloque de comunicación (después del almuerzo) y un bloque de revisión/planificación (final del día).</p><p><strong>Esta semana:</strong> El domingo por la noche o el lunes temprano, bloquea tu semana en el calendario. Asigna bloques específicos a tus prioridades. No dejes espacios vacíos — si no lo planeas tú, alguien más llenará ese tiempo.</p>` },
            { id: 'pro-c2-l3', title: 'La Regla 80/20',
              content: `<p>El economista Vilfredo Pareto observó que el 80% de los resultados viene del 20% de las causas. En productividad: el 20% de tus actividades produce el 80% de tu valor. El 80% restante de actividades produce solo el 20% del valor.</p><p>La pregunta que cambia todo no es "¿Cómo puedo hacer más?" sino <strong>"¿Cuáles son las actividades del 20% y cómo puedo hacer más de ellas?"</strong> La mayoría trabaja más horas en el 80%. Los de élite identifican el 20% y concentran su energía ahí.</p><p><strong>Análisis de tu 20%:</strong> Lista tus 10 actividades principales. Marca las 2 que generan el mayor impacto real. Esas son tu 20%. Esta semana, reorganiza tu agenda para que esas dos actividades tengan los mejores bloques de energía del día.</p>` },
          ]
        },
        {
          id: 'pro-c3', name: 'Gestión de Energía', icon: '⚡',
          duration: '30 min', xp: 175,
          desc: 'No gestiones el tiempo. Gestiona la energía que tienes para usarlo.',
          lessons: [
            { id: 'pro-c3-l1', title: 'Energía, no Tiempo',
              content: `<p>Tony Schwartz y Jim Loehr proponen en <em>El Poder del Pleno Compromiso</em> un cambio de paradigma: <strong>el recurso escaso no es el tiempo — es la energía</strong>. Tienes 24 horas iguales que todos. Pero no tienes 24 horas de igual calidad de energía.</p><p>Una hora de trabajo con energía al 100% produce más que cuatro horas al 25%. Gestionar el tiempo sin gestionar la energía es como tener el calendario perfecto pero ejecutarlo con el tanque vacío.</p><p><strong>Pregunta de diagnóstico:</strong> ¿En qué momento del día tienes la energía más alta? ¿Qué actividades están en ese momento ahora? Si tus actividades de mayor demanda cognitiva no están en tu pico de energía, tienes un problema de arquitectura del día.</p>` },
            { id: 'pro-c3-l2', title: 'Los 4 Tipos de Energía',
              content: `<p>Schwartz identifica cuatro dimensiones de energía que deben gestionarse: <strong>Física</strong> (sueño, nutrición, ejercicio — el fundamento de todo lo demás), <strong>Emocional</strong> (estados que potencian o drenan), <strong>Mental</strong> (concentración, claridad, creatividad) y <strong>Espiritual</strong> (propósito, significado, valores).</p><p>Si tu energía física es baja (malo sueño, sedentarismo, comida procesada), las otras tres dimensiones colapsan. No hay técnica de productividad que compense 6 horas de sueño y cero ejercicio. <strong>El cuerpo es la plataforma sobre la que opera la mente.</strong></p><p><strong>Audit energético:</strong> Califica del 1 al 10 cada una de las 4 dimensiones hoy. ¿Cuál es tu cuello de botella? La inversión en esa dimensión produce el mayor retorno inmediato.</p>` },
            { id: 'pro-c3-l3', title: 'Tu Ciclo de Alto Rendimiento',
              content: `<p>El cuerpo humano opera en ciclos ultradianos de 90-120 minutos. Después de un ciclo de alta concentración, el sistema nervioso necesita 15-20 minutos de recuperación. Ignorar este ciclo y "empujar" continuamente genera fatiga acumulativa que reduce el rendimiento total del día.</p><p>El protocolo de alto rendimiento: <strong>90 minutos de Deep Work → 15-20 minutos de recuperación activa</strong> (caminar, respiración, algo no cognitivo) → siguiente ciclo. 3-4 ciclos al día son el límite sostenible para la mayoría de las personas. Más no es productividad — es desgaste.</p><p><strong>Diseña tu día de alto rendimiento:</strong> Ciclos de 90 min de Deep Work + recuperaciones planificadas. No intentes trabajar 10 horas seguidas. Trabaja 4-5 horas en alta intensidad y el rendimiento total superará las 10 horas de trabajo mediocre. Nivel 4 completado.</p>` },
          ]
        },
      ]
    },

    // ═══ NIVEL 5 — DESARROLLO PERSONAL ══════════════════════════
    {
      id: 'desarrollo', level: 5,
      icon: '💡', label: 'Des. Personal',
      color: '#FF6B35', gradient: 'linear-gradient(135deg,#CC4400,#FF6B35)',
      tagline: 'Conocerte es la primera victoria',
      desc: 'Con base mental y sistemas activos, trabajas tus metas, propósito y visión de vida.',
      xpTotal: 525,
      courses: [
        {
          id: 'dev-c1', name: 'Autoconocimiento', icon: '🪩',
          duration: '35 min', xp: 175,
          desc: 'No puedes construir una vida extraordinaria sin conocer los cimientos.',
          lessons: [
            { id: 'dev-c1-l1', title: 'Conocerse es la Primera Victoria',
              content: `<p>Sócrates lo dijo hace 2,400 años: <em>"Conócete a ti mismo."</em> No era filosofía abstracta — era una instrucción práctica. Sin autoconocimiento, tomas decisiones basadas en quién crees que eres, no en quién realmente eres. Y la diferencia puede costarte años.</p><p>El autoconocimiento tiene tres capas: <strong>valores</strong> (qué importa realmente), <strong>fortalezas</strong> (dónde produces máximo valor) y <strong>patrones</strong> (cómo reaccionas bajo presión, qué te sabotea). La mayoría conoce vagamente la primera capa y casi nada de las otras dos.</p><p><strong>Hoy:</strong> Escribe las 5 experiencias de tu vida donde te sentiste más vivo, más en tu elemento, más capaz. No tienes que analizarlas aún. Solo lística. Ahí están las pistas de tus fortalezas reales.</p>` },
            { id: 'dev-c1-l2', title: 'El Mapa de tus Valores',
              content: `<p>Los valores son los principios que guían tus decisiones cuando tienes opciones. Cuando actúas en contra de un valor importante para ti, sientes tensión, culpa o vacío aunque externamente "tengas éxito". La alineación entre valores y acciones es la base del bienestar real.</p><p>El problema: la mayoría no conoce sus valores con claridad. Los confunde con los de sus padres, su cultura, sus influencers. <strong>Tus valores reales se revelan en tus comportamientos, no en lo que dices que valoras.</strong> Si dices que valoras la salud pero no duermes ni haces ejercicio, la salud no es un valor real — es una aspiración.</p><p><strong>Ejercicio de valores:</strong> Lista 20 valores (busca una lista si necesitas). Reduce a 10. Luego a 5. Luego a 3. Los 3 que quedan son tu núcleo. Ahora pregunta: ¿Tus últimas 30 decisiones importantes están alineadas con esos 3?</p>` },
            { id: 'dev-c1-l3', title: 'Fortalezas y Puntos Ciegos',
              content: `<p>Marcus Buckingham demostró en décadas de investigación que el mayor potencial de crecimiento no está en mejorar las debilidades sino en <strong>maximizar las fortalezas</strong>. Las debilidades deben gestionarse (para que no sean un problema), pero las fortalezas son donde se construye la grandeza.</p><p>Una fortaleza no es solo algo en lo que eres bueno — es algo que al hacerlo te da energía, te genera flow, el tiempo pasa sin que lo notes. Un punto ciego es un patrón de comportamiento que limita tu rendimiento y del que no eres consciente. Generalmente lo ves primero en el feedback de los demás.</p><p><strong>Acción:</strong> Pregunta a 3 personas que te conocen bien: "¿En qué crees que soy mejor y qué crees que me limita más?" Las respuestas que se repiten son oro. Escúchalas sin defenderte.</p>` },
          ]
        },
        {
          id: 'dev-c2', name: 'Objetivos y Propósito', icon: '🎯',
          duration: '30 min', xp: 175,
          desc: 'La diferencia entre vivir con dirección y vivir respondiendo a lo urgente.',
          lessons: [
            { id: 'dev-c2-l1', title: 'Metas de Resultado vs Metas de Sistema',
              content: `<p>La mayoría fija metas de resultado: "Quiero ganar X dinero", "Quiero perder X kilos", "Quiero leer X libros". El problema de las metas puras de resultado: (1) Solo el resultado te hace sentir bien, entonces fracasas mientras tanto. (2) Alcanzas la meta y no sabes qué sigue. (3) No controlas el resultado — solo controlas el proceso.</p><p>James Clear propone el sistema sobre la meta: <strong>"Olvídate de los resultados. Concéntrate en el sistema que los produce."</strong> Si quieres perder 10 kilos, la meta es útil para apuntar la dirección — pero el sistema (qué comes, cuándo ejercitas, cómo duermes) es lo que determina si llegas.</p><p><strong>Reencuadre:</strong> Toma tu meta más importante. Ahora escribe el sistema de hábitos diarios que, si se ejecuta consistentemente, hace inevitable ese resultado.</p>` },
            { id: 'dev-c2-l2', title: 'El Por Qué Detrás de Todo',
              content: `<p>Simon Sinek popularizó el Golden Circle: la gente no compra qué haces ni cómo lo haces — compra <strong>por qué</strong> lo haces. Lo mismo aplica a ti: no te comprometes con lo que haces ni con cómo lo haces. Te comprometes con el por qué.</p><p>El "por qué" es el propósito, la causa, la creencia que impulsa todo lo demás. Sin un "por qué" sólido, la disciplina y la productividad son frágiles — funcionan cuando las circunstancias son favorables y colapsan bajo presión. Con un "por qué" poderoso, las dificultades se convierten en parte del precio, no en razones para parar.</p><p><strong>El ejercicio de los 5 Por Qués:</strong> Define tu meta principal. Pregunta "¿Por qué?" 5 veces consecutivas, siendo más honesto en cada capa. La quinta respuesta suele revelar el propósito real. Escríbelo y tenlo visible.</p>` },
            { id: 'dev-c2-l3', title: 'Diseñar tu Visión de 10 Años',
              content: `<p>Jeff Bezos habla de la "mentalidad del rocking chair": imagina que tienes 80 años mirando hacia atrás. ¿Qué decisiones de hoy te alegrarías de haber tomado? ¿De cuáles te arrepentirías? Esta perspectiva elimina el ruido del corto plazo.</p><p>Una visión de 10 años no es una predicción — es una brújula. No necesitas saber exactamente cómo llegarás. Necesitas saber hacia dónde apunta. Con la dirección clara, el día a día se organiza en función de esa visión, no de las urgencias del momento.</p><p><strong>Escribe tu visión de 10 años:</strong> ¿Cómo es tu vida ideal en 10 años? Salud, trabajo, relaciones, finanzas, impacto. No te limites. La mente consciente corta las alas — deja que fluya. Luego identifica las 3 decisiones más importantes que debes tomar hoy para moverte en esa dirección.</p>` },
          ]
        },
        {
          id: 'dev-c3', name: 'Zona de Confort', icon: '🚀',
          duration: '30 min', xp: 175,
          desc: 'La zona de confort es un lugar cómodo donde nada crece, incluido tú.',
          lessons: [
            { id: 'dev-c3-l1', title: 'Por qué el Cerebro Evita el Riesgo',
              content: `<p>El cerebro evita el riesgo porque evolucionó para sobrevivir, no para prosperar. La amígdala (el sistema de alarma cerebral) trata la incertidumbre como amenaza potencial. Este mecanismo fue vital en la sabana africana. En el mundo moderno, es el principal obstáculo para el crecimiento.</p><p>La zona de confort no es un lugar — es un estado de baja activación del sistema de alarma. Está definida por lo familiar, no por lo seguro. Muchas cosas dentro de la zona de confort son objetivamente más dañinas a largo plazo que las cosas fuera de ella.</p><p><strong>Reencuadre vital:</strong> Estar incómodo no significa estar en peligro. Significa estar en territorio de crecimiento. La incomodidad es la sensación del cerebro adaptándose. Aprende a interpretarla como señal positiva.</p>` },
            { id: 'dev-c3-l2', title: 'El Ciclo de Expansión',
              content: `<p>La zona de confort se expande cada vez que haces algo incómodo y sobrevives. El cerebro actualiza su mapa: "Este territorio también es seguro." Con el tiempo, lo que antes requería valentía se convierte en automático. Lo que fue difícil se vuelve fácil. Y entonces necesitas buscar el siguiente nivel de incomodidad.</p><p>El ciclo: <strong>Incomodidad → Acción → Supervivencia → Expansión → Nueva línea base</strong>. Los de alto rendimiento no tienen menos miedo — tienen un historial más largo de actuar a pesar del miedo, y ese historial les da confianza en su capacidad de atravesar la incomodidad.</p><p><strong>Principio de expansión gradual:</strong> No tienes que hacer el salto más grande. Solo tienes que dar el siguiente paso que está justo en el borde de tu zona actual. Ni dentro (sin crecimiento) ni demasiado lejos (pánico paralizante). El punto exacto donde hay tensión pero hay movimiento.</p>` },
            { id: 'dev-c3-l3', title: 'Una Acción Incómoda al Día',
              content: `<p>Mel Robbins propone la "regla de los 5 segundos": cuando sientes el impulso de hacer algo que sabes que debes hacer pero tu cerebro dice no — cuenta 5, 4, 3, 2, 1 y actúa. El conteo interrumpe el hábito automático de evitación y activa la corteza prefrontal.</p><p>La práctica diaria de una acción incómoda construye lo que se llama <strong>"tolerancia a la incertidumbre"</strong> — la capacidad de funcionar bien en situaciones ambiguas o retadoras. Es una de las habilidades más correlacionadas con el éxito en cualquier campo.</p><p><strong>Compromiso:</strong> Una acción incómoda por día, 30 días. Puede ser pequeña. Una llamada difícil. Un silencio en lugar de hablar. Un ejercicio más. Una conversación honesta. Lleva un registro. Al día 30, mira hacia atrás y verás a alguien diferente. Nivel 5 completado.</p>` },
          ]
        },
      ]
    },

    // ═══ NIVEL 6 — FINANZAS ═════════════════════════════════════
    {
      id: 'finanzas', level: 6,
      icon: '💰', label: 'Finanzas',
      color: '#FFD700', gradient: 'linear-gradient(135deg,#CC8800,#FFD700)',
      tagline: 'La libertad financiera no es un sueño',
      desc: 'Con mentalidad, disciplina y dirección, atacas la libertad financiera.',
      xpTotal: 550,
      courses: [
        {
          id: 'fin-c1', name: 'Libertad Financiera', icon: '🗝️',
          duration: '35 min', xp: 175,
          desc: 'Qué es realmente y cómo se construye.',
          lessons: [
            { id: 'fin-c1-l1', title: 'El Número de la Libertad',
              content: `<p>La libertad financiera es el punto donde tus activos generan suficiente ingreso pasivo para cubrir tus gastos sin necesidad de trabajar activamente. No es un número fijo universal — es tu número: el costo mensual de tu vida ideal multiplicado por 300 (la regla del 4% anual).</p><p>Si tu vida ideal cuesta $3,000/mes, necesitas $900,000 en activos generando un 4% anual para ser financieramente libre. Ese es tu número. Puede parecer lejano — pero sin calcularlo, es imposible. Con él calculado, puedes trazar un camino.</p><p><strong>Calcula tu número hoy:</strong> ¿Cuánto necesitas mensualmente para vivir como quieres? Multiplica por 12 (anual). Multiplica por 25. Ese es tu número de libertad financiera. Escríbelo. Ponlo visible.</p>` },
            { id: 'fin-c1-l2', title: 'Activos vs Pasivos',
              content: `<p>Robert Kiyosaki lo simplificó: un <strong>activo</strong> es algo que pone dinero en tu bolsillo. Un <strong>pasivo</strong> es algo que saca dinero de tu bolsillo. La mayoría trabaja para comprar pasivos creyendo que son activos. El coche de lujo no es un activo — es un pasivo con ruedas.</p><p>La ruta a la libertad financiera es: (1) Reducir pasivos (gastos que no producen valor). (2) Convertir ingresos del trabajo en activos (inversiones, negocios, propiedades). (3) Reinvertir los rendimientos de los activos para comprar más activos. El ciclo virtuoso del capital se construye así.</p><p><strong>Audit financiero:</strong> Lista todo lo que posees. Marca lo que genera ingreso (activos) y lo que genera gasto (pasivos). ¿Qué relación tienen? La brecha entre activos y pasivos es tu punto de partida real.</p>` },
            { id: 'fin-c1-l3', title: 'El Camino a la Independencia',
              content: `<p>JL Collins simplificó el camino: gasta menos de lo que ganas, invierte la diferencia consistentemente en activos de bajo costo y alto rendimiento histórico, y el tiempo hace el resto. No es glamoroso. Es extraordinariamente efectivo.</p><p>Los tres pilares: <strong>Tasa de ahorro</strong> (lo que no gastas puede trabajar para ti), <strong>Rendimiento de inversión</strong> (el interés compuesto es la octava maravilla del mundo) y <strong>Tiempo</strong> (el recurso no renovable y más poderoso de los tres). Empezar tarde no es catastrófico. No empezar nunca sí lo es.</p><p><strong>Primer paso esta semana:</strong> Abre una cuenta de inversión si no tienes una. El primer depósito, aunque sea pequeño, es el más importante. No porque el dinero sea mucho — sino porque activa la identidad de "inversor" en ti.</p>` },
          ]
        },
        {
          id: 'fin-c2', name: 'Inversión para Principiantes', icon: '📈',
          duration: '35 min', xp: 200,
          desc: 'El interés compuesto y por qué Einstein lo llamó la octava maravilla.',
          lessons: [
            { id: 'fin-c2-l1', title: 'El Poder del Interés Compuesto',
              content: `<p>Albert Einstein (según la leyenda) lo llamó "la fuerza más poderosa del universo". El <strong>interés compuesto</strong> es el proceso por el cual los rendimientos de una inversión generan sus propios rendimientos. Al principio parece insignificante. Con el tiempo, se vuelve imparable.</p><p>$10,000 a 10% anual: después de 10 años → $25,937. Después de 20 años → $67,275. Después de 30 años → $174,494. La inversión se multiplicó por 17 sin añadir un peso más. La clave es el tiempo. <strong>Cada año que pospones empezar es años de crecimiento exponencial que pierdes.</strong></p><p><strong>Calcula tu escenario:</strong> ¿Cuánto puedes invertir mensualmente hoy? Busca una calculadora de interés compuesto online y calcula lo que tendrás en 10, 20 y 30 años. Los números te motivarán a empezar esta semana.</p>` },
            { id: 'fin-c2-l2', title: 'Fondos Índice y ETFs',
              content: `<p>John Bogle fundó Vanguard y demostró con décadas de datos que el 90% de los gestores activos de fondos <strong>no supera al mercado</strong> a largo plazo, y los que lo hacen en un período raramente lo repiten. La conclusión: para la mayoría de los inversores, los fondos índice son la estrategia óptima.</p><p>Un <strong>fondo índice</strong> replica el comportamiento de un índice de mercado (S&P 500, por ejemplo) con comisiones mínimas. Un <strong>ETF</strong> es un fondo índice que cotiza en bolsa como una acción. Históricamente el S&P 500 ha dado ~10% anual de promedio en los últimos 100 años, incluyendo todas las crisis.</p><p><strong>Estrategia básica:</strong> Invierte una cantidad fija mensualmente en un ETF de índice amplio, independientemente de si el mercado sube o baja (Dollar Cost Averaging). Esta estrategia supera a la gran mayoría de inversores profesionales a largo plazo.</p>` },
            { id: 'fin-c2-l3', title: 'Diversificación Inteligente',
              content: `<p>No pongas todos los huevos en la misma cesta. La diversificación no es complicar el portafolio — es distribuir el riesgo de forma que un fallo individual no sea catastrófico. Harry Markowitz ganó el Nobel de Economía por demostrarlo matemáticamente.</p><p>Portafolio sencillo para empezar: 60-70% en ETF de renta variable global (ej. MSCI World o S&P 500), 20-30% en renta fija (bonos), 5-10% en caja o equivalentes. Ajusta según tu tolerancia al riesgo y tu horizonte temporal. Cuanto más joven y más largo tu horizonte, más renta variable puedes permitirte.</p><p><strong>Regla de oro:</strong> No inviertas dinero que puedas necesitar en los próximos 5 años. La renta variable a corto plazo es especulación. A largo plazo, es construcción de patrimonio. Nivel 6 completado.</p>` },
          ]
        },
        {
          id: 'fin-c3', name: 'Psicología del Dinero', icon: '🧩',
          duration: '30 min', xp: 175,
          desc: 'El mayor obstáculo para tu libertad financiera no es el mercado. Eres tú.',
          lessons: [
            { id: 'fin-c3-l1', title: 'Tus Creencias sobre el Dinero',
              content: `<p>Antes de los 7 años, absorbiste una programación financiera de tu entorno familiar. Si escuchaste "el dinero no crece en los árboles", "los ricos son corruptos", "el dinero no da la felicidad" — esas frases se instalaron como creencias inconscientes que guían tus decisiones financieras hoy.</p><p>Morgan Housel en <em>Psicología del Dinero</em> argumenta que las decisiones financieras son más emocionales que racionales. No es cuestión de inteligencia — es cuestión de <strong>comportamiento bajo presión</strong>. El inversor más inteligente que entra en pánico en una caída de mercado y vende lo pierde todo.</p><p><strong>Audit de creencias:</strong> Completa estas frases espontáneamente: "El dinero es..." / "Las personas ricas son..." / "Yo y el dinero..." Las primeras palabras que aparezcan revelan tu programación financiera real.</p>` },
            { id: 'fin-c3-l2', title: 'Por qué la Mayoría no se Enriquece',
              content: `<p>No es falta de oportunidades. No es mala suerte. Es comportamiento. Los estudios de DALBAR muestran que el inversor promedio obtiene un rendimiento significativamente inferior al del mercado, no porque el mercado lo haga mal — sino porque el inversor <strong>compra cuando el mercado sube (euforia) y vende cuando baja (pánico)</strong>.</p><p>El principio más importante en finanzas personales: sé aburrido. Ahorra consistentemente. Invierte automáticamente. No toques nada. No intentes adivinar el mercado. No te dejes llevar por las noticias financieras. La riqueza se construye en el aburrimiento, no en la actividad.</p><p><strong>Automatiza:</strong> Configura una transferencia automática mensual el día que cobras. A donde va el dinero primero, crece. A donde va el dinero al final del mes (lo que "sobra"), raramente llega.</p>` },
            { id: 'fin-c3-l3', title: 'El Dinero como Herramienta de Libertad',
              content: `<p>El dinero no da la felicidad — pero la falta de dinero es una fuente constante de estrés que socava la salud, las relaciones y el rendimiento. Housel lo precisa: el valor real del dinero es que te da <strong>opciones</strong>. Opciones de tiempo, de lugar, de relaciones, de trabajo.</p><p>La persona que trabaja por dinero tiene un jefe. La persona que tiene dinero trabajando para ella tiene libertad de elegir. La diferencia no es de inteligencia, clase social o suerte en la mayoría de los casos — es de comportamiento financiero sostenido en el tiempo.</p><p><strong>Reencuadre final:</strong> No estás "ahorrando para no gastar". Estás comprando libertad futura. Cada euro invertido hoy es un fragmento de tiempo libre en el futuro — tiempo para hacer lo que eliges, no lo que te exigen. Ese es el verdadero propósito del dinero.</p>` },
          ]
        },
      ]
    },

    // ═══ NIVEL 7 — TRADING ══════════════════════════════════════
    {
      id: 'trading', level: 7,
      icon: '💹', label: 'Trading',
      color: '#4DFFB8', gradient: 'linear-gradient(135deg,#00664D,#4DFFB8)',
      tagline: '80% psicología, 20% técnica',
      desc: 'El trading requiere todo lo que aprendiste en los niveles anteriores.',
      xpTotal: 575,
      courses: [
        {
          id: 'trd-c1', name: 'Fundamentos del Trading', icon: '📊',
          duration: '40 min', xp: 200,
          desc: 'Qué es el mercado realmente, cómo funciona y qué lo mueve.',
          lessons: [
            { id: 'trd-c1-l1', title: 'Qué es el Mercado Realmente',
              content: `<p>El mercado financiero es el mecanismo por el cual compradores y vendedores acuerdan precios para activos. No es un casino (aunque puede usarse como tal). No es un truco de los ricos (aunque los ricos lo aprovechan mejor). Es un <strong>sistema de descuento de expectativas futuras</strong>.</p><p>El precio de cualquier activo en cualquier momento refleja el consenso actual del mercado sobre el valor futuro de ese activo. Cuando el consenso cambia — por datos económicos, noticias, eventos geopolíticos, psicología colectiva — el precio cambia. <strong>Operar el mercado es apostar a que el consenso cambiará en la dirección que anticipas.</strong></p><p><strong>Mentalidad base:</strong> Antes de hablar de estrategias técnicas, acepta esto: nunca sabes con certeza qué hará el mercado. El trading es gestión de probabilidades, no predicción. Quien entiende esto gestiona el riesgo. Quien no, se arruina.</p>` },
            { id: 'trd-c1-l2', title: 'Tipos de Análisis',
              content: `<p>Hay tres formas principales de analizar el mercado. <strong>Análisis fundamental:</strong> estudia el valor intrínseco de un activo (resultados, deuda, ventajas competitivas). Relevante para inversión a largo plazo. <strong>Análisis técnico:</strong> estudia el comportamiento histórico del precio y el volumen para identificar patrones y tendencias. Relevante para trading a corto/medio plazo. <strong>Análisis del sentimiento:</strong> estudia la psicología del mercado — miedo, euforia, posicionamiento.</p><p>Los traders profesionales no usan uno solo — triangulamos los tres. El fundamental dice "qué", el técnico dice "cuándo" y el sentimiento dice "qué tan extremo está el mercado". Juntos ofrecen una imagen más completa.</p><p><strong>Esta semana:</strong> Elige un activo que conozcas (una empresa que uses, una materia prima, un índice). Analízalo con los tres lentes. ¿Qué te dice cada uno? ¿Coinciden o contradicen?</p>` },
            { id: 'trd-c1-l3', title: 'El Plan de Trading',
              content: `<p>Un trader sin plan es un jugador. Un plan de trading define: (1) <strong>Universo de activos</strong> — en qué mercados operas. (2) <strong>Timeframe</strong> — intradía, swing, posicional. (3) <strong>Setup</strong> — qué condiciones exactas activan una entrada. (4) <strong>Gestión de riesgo</strong> — máximo por operación, máximo diario, máximo mensual. (5) <strong>Criterios de salida</strong> — tanto en beneficio como en pérdida.</p><p>Operar sin plan es garantía de decisiones emocionales. Las emociones son el mayor enemigo del trader. El plan es el antídoto porque convierte las decisiones emocionales en decisiones sistemáticas tomadas en frío.</p><p><strong>Crea tu plan de trading básico</strong> antes de arriesgar un solo euro. No importa si es simple. Importa que exista y que lo sigas. El plan te salva de ti mismo en los momentos de máxima presión emocional.</p>` },
          ]
        },
        {
          id: 'trd-c2', name: 'Análisis Técnico', icon: '📉',
          duration: '40 min', xp: 200,
          desc: 'Leer el mercado a través del precio y el volumen.',
          lessons: [
            { id: 'trd-c2-l1', title: 'Soportes, Resistencias y Tendencias',
              content: `<p>El análisis técnico se basa en tres premisas: los mercados descuentan todo, los precios se mueven en tendencias, y la historia se repite. Los conceptos más fundamentales son soporte, resistencia y tendencia.</p><p>Un <strong>soporte</strong> es un nivel de precio donde históricamente la demanda ha sido suficiente para detener la caída. Una <strong>resistencia</strong> es un nivel donde la oferta históricamente ha detenido la subida. Una <strong>tendencia</strong> es la dirección general del precio — alcista (máximos y mínimos más altos), bajista (máximos y mínimos más bajos) o lateral. <strong>La regla base:</strong> opera en la dirección de la tendencia. "The trend is your friend."</p><p><strong>Práctica:</strong> Abre un gráfico de cualquier activo en TradingView (es gratuito). Identifica los tres últimos soportes, resistencias y la tendencia actual. Hacer esto 10 minutos al día desarrolla el ojo del analista técnico.</p>` },
            { id: 'trd-c2-l2', title: 'Patrones de Velas Japonesas',
              content: `<p>Las velas japonesas son la representación visual más informativa del movimiento del precio. Cada vela muestra cuatro datos: precio de apertura, máximo, mínimo y cierre. La forma y el color revelan la batalla entre compradores y vendedores en ese período.</p><p>Los patrones más importantes: <strong>Doji</strong> (apertura y cierre casi iguales → indecisión), <strong>Martillo/Hammer</strong> (mecha larga abajo → posible suelo), <strong>Estrella fugaz</strong> (mecha larga arriba → posible techo), <strong>Envolvente alcista/bajista</strong> (vela que "engulle" la anterior → cambio de dirección potente). Estos patrones no son certezas — son probabilidades que mejoran tu edge.</p><p><strong>Estudio semanal:</strong> Identifica uno de estos patrones en un gráfico real. Anota qué ocurrió después. Repite 20 veces. El patrón se graba en el reconocimiento visual instintivo.</p>` },
            { id: 'trd-c2-l3', title: 'Indicadores Clave',
              content: `<p>Los indicadores técnicos son derivados matemáticos del precio y el volumen. Los más usados: <strong>Media Móvil (MA)</strong> — suaviza el precio para ver tendencia, la cruza cuando cambia. <strong>RSI</strong> — oscilador que mide sobrecompra (>70) o sobreventa (<30). <strong>MACD</strong> — mide momentum y cruces de tendencia. <strong>Volumen</strong> — confirma o niega los movimientos de precio.</p><p>Advertencia crítica: los indicadores son herramientas de confirmación, no de predicción. Usar demasiados indicadores (paralysis by analysis) es tan peligroso como usar ninguno. El precio manda. Los indicadores apoyan.</p><p><strong>Regla práctica:</strong> Elige máximo 3 indicadores para tu estrategia. Aprende a leerlos profundamente. Más indicadores no es más información — es más ruido. La simplicidad es una ventaja en el trading.</p>` },
          ]
        },
        {
          id: 'trd-c3', name: 'Gestión del Riesgo', icon: '🛡',
          duration: '35 min', xp: 175,
          desc: 'La diferencia entre el trader que dura y el que no. Sin esto, todo lo demás es inútil.',
          lessons: [
            { id: 'trd-c3-l1', title: 'La Regla del 2%',
              content: `<p>La regla más importante del trading: <strong>nunca arriesgues más del 2% de tu capital total en una sola operación</strong>. Con 2% de riesgo por operación, necesitas 50 operaciones perdedoras consecutivas para perder todo. Si arriesgas 10% por operación, 10 pérdidas consecutivas eliminan tu cuenta.</p><p>Las rachas de pérdidas son estadísticamente inevitables en cualquier estrategia. El 2% no es precaución excesiva — es matemática de supervivencia. Los traders que quiebran no quiebran por falta de estrategia. Quiebran por exceso de tamaño de posición en un momento de euforia o desesperación.</p><p><strong>Calcula tu riesgo máximo:</strong> ¿Cuánto capital tienes para trading? El 2% de eso es tu riesgo máximo por operación. Escríbelo. Ponlo delante de tu pantalla. Nunca lo cruces.</p>` },
            { id: 'trd-c3-l2', title: 'Risk/Reward Ratio',
              content: `<p>El <strong>risk/reward ratio</strong> (R:R) es la relación entre lo que arriesgas y lo que ganas en una operación. Un R:R de 1:2 significa que arriesgas 1 para ganar 2. Con un R:R de 1:2 y una tasa de acierto del 40% (pierdes más veces de las que ganas), sigues siendo rentable.</p><p>Matemática simple: 10 operaciones con R:R 1:2. Ganas 4 (4 × 2 = +8). Pierdes 6 (6 × 1 = -6). Resultado: +2. Con R:R de 1:1 y el mismo 40% de acierto: +4 - 6 = -2. La diferencia es el R:R, no la tasa de acierto. <strong>Nunca entres en una operación con R:R inferior a 1:1.5. El mínimo aceptable.</strong></p><p><strong>Antes de cada operación:</strong> Define exactamente tu stop loss (punto de salida en pérdida) y tu take profit (punto de salida en ganancia). Calcula el R:R. Si no cumple el mínimo, no entres. Sin negociación.</p>` },
            { id: 'trd-c3-l3', title: 'El Diario del Trader',
              content: `<p>Los traders profesionales llevan un diario detallado de cada operación: setup utilizado, entrada, stop, target, resultado, y especialmente — <strong>el estado emocional durante la operación</strong>. El diario es el instrumento de mejora continua más poderoso del trading.</p><p>Sin diario, repites los mismos errores indefinidamente porque no los ves como patrones. Con diario, después de 50-100 operaciones puedes identificar: ¿En qué condiciones gano más? ¿Cuándo tiendo a romper las reglas? ¿Qué emociones preceden a mis peores operaciones? Esta información vale más que cualquier curso de análisis técnico.</p><p><strong>Compromiso final:</strong> Registra cada operación que hagas, aunque sea en papel o un Excel básico. Fecha, activo, entrada, salida, R:R, resultado, notas emocionales. Revísalo semanalmente. En 6 meses tendrás más datos sobre tu propio trading que la mayoría de traders con años de experiencia. Nivel 7 completado.</p>` },
          ]
        },
      ]
    },

    // ═══ NIVEL 8 — LIDERAZGO ════════════════════════════════════
    {
      id: 'liderazgo', level: 8,
      icon: '👑', label: 'Liderazgo',
      color: '#FF3366', gradient: 'linear-gradient(135deg,#AA0033,#FF3366)',
      tagline: 'Quien domina todo lo anterior está listo para liderar',
      desc: 'El nivel más alto. Primero te conquistaste a ti mismo. Ahora impactas a otros.',
      xpTotal: 575,
      courses: [
        {
          id: 'lid-c1', name: 'El Líder Interior', icon: '⚜️',
          duration: '35 min', xp: 200,
          desc: 'No puedes liderar a otros si no te lideras a ti mismo primero.',
          lessons: [
            { id: 'lid-c1-l1', title: 'Liderar Empieza por Uno Mismo',
              content: `<p>El liderazgo más difícil no es liderar equipos, empresas ni movimientos. Es liderarse a uno mismo. Es el primer requisito y el más ignorado. Un líder que no puede gestionar sus propias emociones, impulsos y energía no puede gestionar las de otros con integridad.</p><p>Todos los niveles anteriores de la Academia — Psicología, Disciplina, Hábitos, Productividad, Desarrollo Personal, Finanzas, Trading — fueron entrenamiento de autoliderazgo. Ahora esa capacidad se proyecta hacia afuera.</p><p><strong>Principio base:</strong> El nivel de exigencia que le pides a otros no puede superar el que te exiges a ti mismo. Esto no es un ideal moral — es una realidad práctica. Las personas siguen el ejemplo, no las palabras. Tu comportamiento es tu mensaje de liderazgo real.</p>` },
            { id: 'lid-c1-l2', title: 'Responsabilidad Extrema',
              content: `<p>Jocko Willink, ex Navy SEAL, introduce el concepto de <strong>Extreme Ownership</strong>: el líder es responsable de todo lo que ocurre en su equipo. Si el equipo falla, el líder falló. Sin excepciones. Sin culpar a las circunstancias, al equipo, al mercado.</p><p>Esto no es masoquismo — es poder. La persona que asume responsabilidad total tiene control total. La que culpa a externos cede ese control. <strong>Culpar es renuncia al poder de cambiar.</strong> Cuando preguntas "¿Qué hice yo para que esto ocurriera y qué puedo hacer diferente?", encuentras palancas de cambio. Cuando preguntas "¿Quién tuvo la culpa?", solo encuentras validación del estancamiento.</p><p><strong>Práctica esta semana:</strong> En cada problema que enfrentes — profesional o personal — antes de asignar causa externa, pregunta: "¿Qué papel jugué yo en esto?" Un 20% puede ser tu aportación. Eso es suficiente para cambiarlo.</p>` },
            { id: 'lid-c1-l3', title: 'El Líder como Sirviente',
              content: `<p>Robert Greenleaf acuñó el <strong>servant leadership</strong>: el líder existe para servir al equipo, no al revés. El líder de servicio pregunta "¿Qué necesitas para dar lo mejor de ti?" en lugar de "¿Por qué no has dado lo mejor de ti?". Elimina obstáculos. Desarrolla capacidades. Pone la misión y el equipo antes que su propio ego.</p><p>Paradójicamente, este modelo produce más lealtad, mayor rendimiento y mejor clima que el liderazgo autoritario. Las personas hacen el mínimo necesario bajo la amenaza. Dan el máximo cuando se sienten vistas, apoyadas y parte de algo significativo.</p><p><strong>Pregunta de liderazgo:</strong> Piensa en la persona de tu vida que más te ha influido positivamente. ¿Qué hacía? Casi con certeza, te veía, te exigía más de lo que tú te exigías, y te apoyaba mientras lo hacías. Ese es el modelo.</p>` },
          ]
        },
        {
          id: 'lid-c2', name: 'Comunicación de Liderazgo', icon: '🗣️',
          duration: '35 min', xp: 200,
          desc: 'Un líder es tan efectivo como su capacidad de comunicar.',
          lessons: [
            { id: 'lid-c2-l1', title: 'Escucha Activa',
              content: `<p>Stephen Covey lo dijo: <em>"La mayoría de las personas no escucha para entender. Escucha para responder."</em> La escucha activa es la habilidad de comunicación más poderosa y la menos desarrollada. Un líder que escucha de verdad obtiene información real, construye confianza y genera lealtad sin esfuerzo adicional.</p><p>Escucha activa tiene tres componentes: <strong>presencia</strong> (sin teléfono, sin pensar en tu respuesta), <strong>paráfrasis</strong> ("si entiendo bien, lo que dices es...") y <strong>preguntas de profundidad</strong> ("¿y qué más?", "¿cómo te hizo sentir eso?"). Estas tres acciones transmiten que la persona importa.</p><p><strong>Ejercicio esta semana:</strong> En 3 conversaciones, practica escuchar sin interrumpir. Al final, parafrasea lo que escuchaste. Observa cómo cambia la dinámica. La gente abre información cuando siente que realmente la escuchas.</p>` },
            { id: 'lid-c2-l2', title: 'El Arte de la Influencia',
              content: `<p>Robert Cialdini identificó los 6 principios de influencia: reciprocidad, escasez, autoridad, consistencia, gusto y prueba social. El liderazgo ético usa estos principios para mover a las personas hacia objetivos que benefician a todos — no para manipularlas hacia objetivos propios.</p><p>La influencia más duradera no viene de la posición jerárquica ni de la persuasión. Viene de la <strong>credibilidad acumulada</strong>: consistencia entre lo que dices y lo que haces, expertise demostrado, y un historial de poner el bien del equipo antes que el propio. Esa credibilidad es difícil de construir y muy fácil de perder.</p><p><strong>Principio de influencia personal:</strong> Antes de pedir, da. Antes de exigir estándares, demuéstralos. Antes de pedir lealtad, sé leal. La influencia genuina es consecuencia de quién eres — no de lo que dices.</p>` },
            { id: 'lid-c2-l3', title: 'Comunicación en la Adversidad',
              content: `<p>Los líderes se revelan en la adversidad. En tiempos fáciles, cualquiera puede liderar bien. Cuando hay crisis, pérdidas, conflictos — la calidad del liderazgo se manifiesta. Y la comunicación en esos momentos es la herramienta más crítica.</p><p>Principios para comunicar en crisis: <strong>(1) Claridad sobre tranquilidad falsa</strong> — la gente prefiere la verdad difícil a la mentira cómoda. <strong>(2) Proximidad</strong> — estar presente físicamente o emocionalmente. <strong>(3) Dirección</strong> — "aquí está el problema, aquí está el plan, aquí es donde te necesito". El pánico se alimenta del vacío de información y dirección. El líder llena ese vacío.</p><p><strong>Prepara tu comunicación de crisis:</strong> Antes de que llegue (porque llegará), practica la frase: "Aquí está la situación real. Aquí está lo que vamos a hacer. Aquí está cómo puedes ayudar." Simple. Honesto. Con dirección. Eso es suficiente.</p>` },
          ]
        },
        {
          id: 'lid-c3', name: 'Visión y Legado', icon: '🌟',
          duration: '35 min', xp: 175,
          desc: 'El nivel más alto del liderazgo: construir algo más grande que tú.',
          lessons: [
            { id: 'lid-c3-l1', title: 'Construir una Visión que Inspira',
              content: `<p>Una visión no es una declaración corporativa de misión. Es una imagen vívida del futuro que el líder puede ver con claridad antes de que exista, y que puede transmitir de forma que otros también la vean y quieran construirla.</p><p>Martin Luther King no dijo "tengo un plan estratégico". Dijo "tengo un sueño". El lenguaje de la visión es concreto, emocional y específico en el resultado — no en el proceso. <strong>Una visión que inspira responde a "qué mundo queremos crear" antes de responder a "cómo lo haremos".</strong></p><p><strong>Escribe tu visión:</strong> ¿Qué quieres construir que sea más grande que tú? Puede ser en una empresa, una familia, una comunidad, un movimiento. Escríbelo en tiempo presente como si ya existiera. "Existe un mundo donde..." Luego redúcelo a una frase. Esa frase es tu visión.</p>` },
            { id: 'lid-c3-l2', title: 'Dejar un Legado',
              content: `<p>El legado no es lo que acumulas — es lo que transformas. No es lo que posees — es lo que construyes en las personas que te rodean. Los imperios materiales desaparecen. Las transformaciones humanas persisten generaciones.</p><p>Viktor Frankl sobrevivió Auschwitz porque encontró significado en el sufrimiento. Su legado — la logoterapia — ha ayudado a millones de personas. No por sus posesiones. Por la profundidad con que entendió el sufrimiento humano y transformó esa comprensión en herramienta para otros.</p><p><strong>Pregunta de legado:</strong> Si murieras mañana, ¿qué dirían de ti las personas más importantes de tu vida? ¿Es lo que quieres que digan? Si no, ¿qué necesita cambiar hoy para que ese gap se cierre? No mañana. Hoy.</p>` },
            { id: 'lid-c3-l3', title: 'El Líder que Crea Líderes',
              content: `<p>El nivel más alto del liderazgo no es ser indispensable — es ser prescindible. El líder que crea dependencia en su equipo ha fallado en su misión más importante. El líder que desarrolla otros líderes multiplica su impacto exponencialmente.</p><p>John Maxwell lo define así: el nivel 5 del liderazgo (el máximo) es el que <strong>desarrolla líderes que desarrollan líderes</strong>. No líderes que te siguen a ti — líderes que siguen la misión y la visión, y que a su vez pueden llevar a otros.</p><p><strong>Has completado los 8 Niveles de la Academia.</strong> Psicología → Disciplina → Hábitos → Productividad → Desarrollo Personal → Finanzas → Trading → Liderazgo. Este no es el final de tu evolución — es el inicio de una nueva espiral a mayor altitud. Los mismos principios, aplicados desde una perspectiva más elevada. Continúa. Tu legado se construye hoy.</p>` },
          ]
        },
      ]
    },
  ],

  // ── BIBLIOTECA ──────────────────────────────────────────────
  books: [
    { status: 'COMPLETADO', statusColor: 'var(--teal)',  title: 'Hábitos Atómicos',       author: 'James Clear',      pct: 100, fill: 'prog-fill--gold',   pctLabel: '✓ Completado', pctColor: 'var(--gold)' },
    { status: 'EN PROGRESO', statusColor: 'var(--gold)', title: 'El Inversor Inteligente', author: 'Benjamin Graham · Cap. 8 de 20', pct: 40, fill: 'prog-fill--teal', pctLabel: '40% — Seguir leyendo', pctColor: 'var(--teal)' },
    { status: 'RECOMENDADO IA', statusColor: 'var(--text-secondary)', title: 'La Disciplina Igualada', author: 'Jocko Willink', pct: 0, fill: 'prog-fill--accent', pctLabel: 'Sin iniciar — Empezar', pctColor: 'var(--accent)' },
    { status: 'NUEVO',       statusColor: 'var(--accent)', title: 'Padre Rico, Padre Pobre', author: 'Robert Kiyosaki', pct: 0, fill: 'prog-fill--gold', pctLabel: 'Sin iniciar — Empezar', pctColor: 'var(--gold)' },
    { status: 'COMPLETADO',  statusColor: 'var(--teal)',   title: 'El Poder del Hábito',    author: 'Charles Duhigg',  pct: 100, fill: 'prog-fill--teal', pctLabel: '✓ Completado', pctColor: 'var(--teal)' },
    { status: 'EN PROGRESO', statusColor: 'var(--gold)',   title: 'Psico-Cibernética',      author: 'Maxwell Maltz · Cap. 3 de 12', pct: 25, fill: 'prog-fill--accent', pctLabel: '25% — Seguir leyendo', pctColor: 'var(--accent)' },
  ],

  // ── MENTOR IA RESPONSES ─────────────────────────────────────
  mentorResponses: {
    'disciplina':  'La disciplina no es una emoción — es un sistema. Empieza pequeño: un hábito, a la misma hora, todos los días. El cerebro crea patrones en 21 días. Tu racha actual de 14 días es evidencia de que ya estás construyendo ese sistema. Continúa.',
    'gestión':     'La gestión de riesgo es la diferencia entre sobrevivir y prosperar. El plan de evolución establece un 2% por operación. Ese límite existe para proteger tu capital base. Nunca más del 2%. La consistencia a largo plazo supera siempre a la ganancia rápida.',
    'racha':       'Tu racha se mantiene completando al menos las misiones obligatorias diarias. La clave es el sistema, no la motivación. La motivación fluctúa; el sistema permanece. Registra tu diario, estudia al menos 15 minutos y revisa tu plan — eso es todo.',
    'hábitos':     'Los hábitos fallan por tres razones: fricción alta, señales débiles y recompensas ausentes. Haz que el hábito sea fácil de iniciar, conecta la señal a algo que ya haces, y el sistema XP de esta plataforma es tu recompensa inmediata.',
    'estudiar':    'Con tu perfil actual te recomiendo este orden: 1) Psicología del Trading, 2) Gestión de Riesgo, 3) Disciplina de Élite. El conocimiento sin mentalidad es inútil. Empieza por el interior antes de ir al exterior.',
    'riesgo':      'El riesgo no es el enemigo — la ignorancia del riesgo sí lo es. Aprende a cuantificarlo, a medirlo, a respetarlo. Un plan con límites claros transforma el caos en control. El Radar de Riesgo en tu Centro de Evolución es una herramienta clave.',
    'trading':     'El trading es el 20% técnica y el 80% psicología. La mayoría fracasa no por falta de estrategia sino por falta de disciplina emocional. La Academia tiene un módulo completo de psicología del trader. Te lo recomiendo antes de cualquier otra cosa.',
    'default':     'Excelente pregunta, Guerrero. Tu evolución depende de las preguntas que haces y las acciones que tomas. Continúa aprendiendo, cuestionando y mejorando. Cada día que apareces es una victoria contra la versión que quieres dejar atrás.',
  },

  mentorQuickQuestions: [
    '¿Cómo mejorar mi disciplina?',
    '¿Qué es la gestión de riesgo?',
    '¿Cómo mantener mi racha?',
    '¿Por qué fallo en mis hábitos?',
    '¿Qué debo estudiar primero?',
    '¿Cómo gestionar las emociones en el trading?',
  ],

  // ── RADAR ALERTS ────────────────────────────────────────────
  radarAlerts: [
    { icon: '⚠',  text: 'Impulsividad detectada: 2 operaciones fuera del plan esta semana', color: 'var(--red)',   bg: 'rgba(255,51,102,.06)' },
    { icon: '📈', text: 'Disciplina positiva: 7 días consecutivos siguiendo el plan',        color: 'var(--teal)',  bg: 'rgba(77,255,184,.04)' },
    { icon: '🎯', text: 'Meta de aprendizaje al 80% — ¡Excelente progreso educativo!',       color: 'var(--gold)', bg: 'rgba(212,175,55,.04)' },
  ],

  // ── BADGES ──────────────────────────────────────────────────
  badges: [
    { icon: '🔥', name: 'Racha 14d', earned: true  }, { icon: '⭐', name: 'Nivel 20', earned: true  },
    { icon: '🛡', name: 'Disciplina', earned: true  }, { icon: '📚', name: 'Lector',   earned: true  },
    { icon: '💎', name: 'Evolución', earned: true   }, { icon: '🏆', name: 'Top 50',   earned: true  },
    { icon: '🎯', name: 'Enfocado',  earned: true   }, { icon: '⚡', name: 'XP Máx.',  earned: false },
    { icon: '🌟', name: 'Leyenda',   earned: false  }, { icon: '👑', name: 'Monarca',  earned: false },
    { icon: '🔮', name: 'Maestro',   earned: false  }, { icon: '💫', name: 'Élite',    earned: false },
    { icon: '🗡', name: 'Guerrero',  earned: true   }, { icon: '🌙', name: 'Nocturno', earned: false },
    { icon: '☀', name: 'Matutino',  earned: true   },
  ],

  // ── RANKING ─────────────────────────────────────────────────
  ranking: [
    { name: 'Maximus V.', rank: 'Leyenda IX',       score: 47820, bg: 'rgba(212,175,55,.12)', col: 'var(--gold-light)' },
    { name: 'Sarah K.',   rank: 'Titán VII',        score: 43100, bg: 'rgba(200,200,220,.08)', col: '#C0C0C0' },
    { name: 'Carlos R.',  rank: 'Centinela VI',     score: 39400, bg: 'rgba(205,127,50,.08)',  col: '#CD7F32' },
    { name: 'Ana M.',     rank: 'Guerrero V',       score: 35200, bg: 'rgba(123,92,255,.08)',  col: 'var(--accent)' },
    { name: 'Javier L.',  rank: 'Aprendiz IV',      score: 31000, bg: 'rgba(77,255,184,.06)',  col: 'var(--teal)' },
    { name: 'Diana P.',   rank: 'Iniciado III',     score: 27500, bg: 'rgba(255,255,255,.03)', col: 'var(--text-primary)' },
    { name: 'Tú',         rank: 'Centinela III',    score:  8940, bg: 'rgba(212,175,55,.06)',  col: 'var(--gold)' },
  ],

  // ── COMMUNITY POSTS ─────────────────────────────────────────
  communityPosts: [
    {
      user: 'Maximus V.', badge: '🏆 LEYENDA', badgeColor: 'var(--gold)',
      bg: 'rgba(212,175,55,.1)', time: 'hace 2h',
      text: 'Hoy completé mi semana 52 sin fallar. Un año entero de disciplina absoluta. Si yo pude, tú también puedes. La constancia es el único secreto.',
      likes: 148, comments: 34,
    },
    {
      user: 'Ana M.', badge: '💎 GUERRERA', badgeColor: 'var(--accent)',
      bg: 'rgba(123,92,255,.1)', time: 'hace 5h',
      text: 'El Mentor IA me ayudó a entender por qué fallaba en mis análisis. Era impulsividad. Hoy llevo 3 semanas siguiendo el plan al pie de la letra.',
      likes: 87, comments: 21,
    },
    {
      user: 'Carlos R.', badge: '⭐ CENTINELA', badgeColor: 'var(--teal)',
      bg: 'rgba(77,255,184,.08)', time: 'hace 8h',
      text: 'Academia de Mentalidad terminada. El módulo de psicología cambió completamente cómo entiendo mi comportamiento. Conocimiento = poder.',
      likes: 63, comments: 15,
    },
  ],

  // ── HALL OF LEGENDS ─────────────────────────────────────────
  hall: [
    { name: 'Maximus V.',  rank: 'Gran Maestre',         score: '47,820', bg: 'rgba(212,175,55,.18)', icon: '🏆', col: 'var(--gold)'   },
    { name: 'Luisa C.',    rank: 'Maestra Suprema',      score: '44,100', bg: 'rgba(77,255,184,.12)', icon: '👑', col: 'var(--teal)'   },
    { name: 'Rodrigo A.',  rank: 'Leyenda Viviente',     score: '41,500', bg: 'rgba(123,92,255,.15)', icon: '⭐', col: 'var(--accent)' },
    { name: 'Sarah K.',    rank: 'Titán de Hierro',      score: '43,100', bg: 'rgba(200,200,220,.08)', icon: '🗡', col: '#C0C0C0' },
    { name: 'Miguel T.',   rank: 'Guardián Eterno',      score: '38,200', bg: 'rgba(255,107,53,.1)',   icon: '🛡', col: 'var(--orange)' },
    { name: 'Carmen V.',   rank: 'Sabia del Conocimiento', score: '36,800', bg: 'rgba(0,212,255,.08)', icon: '📚', col: 'var(--blue)'   },
  ],

  // ── THEMES ──────────────────────────────────────────────────
  themes: [
    {
      id: 'default', name: 'MI LEGADO',
      desc: 'El origen. Oro y oscuridad. El sistema base.',
      colors: ['#050508','#D4AF37','#7B5CFF'],
      bg: 'linear-gradient(135deg,#0A0A12,#0F0F1A)',
      border: 'rgba(212,175,55,.4)',
      selected: true,
    },
    {
      id: 'solo-leveling', name: 'SOLO LEVELING',
      desc: 'Sombras, portales, monarcas, oscuridad elegante.',
      colors: ['#0D0020','#4B0082','#9B59B6'],
      bg: 'linear-gradient(135deg,#0D0020,#1A0030)',
      border: 'rgba(100,0,200,.4)',
    },
    {
      id: 'demon-slayer', name: 'DEMON SLAYER',
      desc: 'Agua y fuego. Respiraciones. Espíritu samurái.',
      colors: ['#1A0A0A','#8B0000','#FF4444'],
      bg: 'linear-gradient(135deg,#1A0A0A,#2A0A0A)',
      border: 'rgba(180,0,0,.4)',
    },
    {
      id: 'dragon-ball', name: 'DRAGON BALL',
      desc: 'Auras de ki, rayos de energía, poder absoluto.',
      colors: ['#1A1400','#FFD700','#FF8C00'],
      bg: 'linear-gradient(135deg,#1A1400,#2A2000)',
      border: 'rgba(255,200,0,.4)',
    },
    {
      id: 'naruto', name: 'NARUTO',
      desc: 'Chakra, pergaminos, aldeas ninja, energía espiritual.',
      colors: ['#1A1000','#FF6600','#001A40'],
      bg: 'linear-gradient(135deg,#1A1000,#0A0A1A)',
      border: 'rgba(255,100,0,.4)',
    },
    {
      id: 'one-piece', name: 'ONE PIECE',
      desc: 'Océanos, navegación, mapas, estética pirata.',
      colors: ['#001A3A','#CC0000','#0088CC'],
      bg: 'linear-gradient(135deg,#001A2A,#001A3A)',
      border: 'rgba(0,100,200,.4)',
    },
    {
      id: 'aot', name: 'ATTACK ON TITAN',
      desc: 'Estilo militar, acero, murallas, batalla épica.',
      colors: ['#1A1A1A','#4A4A4A','#8B7355'],
      bg: 'linear-gradient(135deg,#101010,#1A1A1A)',
      border: 'rgba(120,120,80,.4)',
    },
    {
      id: 'espartano', name: 'ESPARTANO',
      desc: 'Acero, sangre y gloria. El guerrero que forja su legado en batalla.',
      colors: ['#0A0608','#8B1A1A','#A07820'],
      bg: 'linear-gradient(135deg,#0A0608,#140A08)',
      border: 'rgba(139,26,26,.5)',
    },
  ],
};
