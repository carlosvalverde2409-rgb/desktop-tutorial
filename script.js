/* ============================================================
   LÓGICA DE LA WEB (JavaScript vanilla, sin librerías)
   Contiene:
   1) Un "generador" de flores pixeladas estilo Minecraft (cuadraditos).
   2) La animación de la portada (campo de flores que crece).
   3) La transición para revelar la web principal.
   Para editar textos/fotos NO hace falta tocar este archivo:
   eso se hace en index.html.
   ============================================================ */

/* ------------------------------------------------------------
   AJUSTES QUE PUEDES CAMBIAR SIN MIEDO
   ------------------------------------------------------------ */
const CONFIG = {
  numeroFlores: 34,      // cuántas flores crecen en la animación
  numeroEstrellas: 16,   // nubes pixeladas del cielo de la portada
  duracionAnimacion: 2400, // ms antes de revelar la web

  /* EDITABLE: fecha en la que empezasteis (AAAA, MM, DD).
     OJO: el mes va de 0 a 11 -> enero = 0, junio = 5, etc.
     Con esto se calcula el contador "días juntos" del inicio. */
  fechaInicio: new Date(2026, 3, 13), // 13 de abril de 2026

  /* Colores de los pétalos (los "tipos" de flor se mezclan con estos).
     Pensados como favoritos: morados, rosas, azul y verde sable (Star
     Wars) y amarillo. Cambia/añade códigos de color aquí. */
  coloresPetalo: [
    "#8e6fd4", // morado
    "#b9a7ec", // lila
    "#4b3f9e", // índigo
    "#e88ac0", // rosa
    "#d94f7a", // fucsia
    "#ffd76b", // amarillo
    "#4fb0ff", // azul sable
    "#6be07a", // verde sable
    "#ffffff"  // blanco
  ]
};

/* ------------------------------------------------------------
   1) GENERADOR DE FLORES PIXELADAS
   Cada flor es una rejilla (matriz) de letras:
     .  = vacío        P = pétalo (color variable)
     C  = centro       S = tallo         L = hoja
   Se dibuja como SVG con un <rect> (cuadradito) por celda.
   Añadir una flor nueva = añadir otra matriz a PLANTILLAS.
   ------------------------------------------------------------ */
const PLANTILLAS = [
  // Margarita redondeada
  [
    "..PPP..",
    ".PPPPP.",
    "PPCCCPP",
    "PPCCCPP",
    "PPCCCPP",
    ".PPPPP.",
    "..PPP..",
    "...S...",
    "..LSL..",
    "...S...",
  ],
  // Flor de 4 pétalos (tipo cruceta)
  [
    "...P...",
    "..PPP..",
    "P.PPP.P",
    "PPPCPPP",
    "P.PPP.P",
    "..PPP..",
    "...P...",
    "...S...",
    "..LS...",
    "...S...",
  ],
  // Tulipán
  [
    ".P.P.P.",
    ".PPPPP.",
    ".PPPPP.",
    "..PPP..",
    "...P...",
    "...S...",
    "...S...",
    "..LSL..",
    "...S...",
    "...S...",
  ],
  // Flor pequeña estrellada (estilo galaxia)
  [
    "...P...",
    "P..P..P",
    ".PPCPP.",
    "..CCC..",
    ".PPCPP.",
    "P..P..P",
    "...P...",
    "...S...",
    "...S...",
    "..LS...",
  ],
];

/* Convierte una matriz + color de pétalo en una cadena SVG pixelada. */
function crearFlorSVG(matriz, colorPetalo) {
  const filas = matriz.length;
  const cols = matriz[0].length;

  // Paleta de colores según la letra de la celda
  const colores = {
    P: colorPetalo,
    C: "#ffcf4d", // centro amarillo
    S: "#4f9d5e", // tallo verde
    L: "#6bd07f", // hoja verde claro
  };

  let rects = "";
  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < cols; x++) {
      const letra = matriz[y][x];
      if (letra === ".") continue;               // celda vacía
      const color = colores[letra] || colorPetalo;
      // Cada píxel: cuadrado 1x1. El borde oscuro da el look "bloque".
      rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" `
             + `stroke="rgba(0,0,0,0.12)" stroke-width="0.06"/>`;
    }
  }
  return `<svg viewBox="0 0 ${cols} ${filas}" width="100%" height="100%" `
       + `xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

/* Devuelve un elemento al azar de una lista */
function alAzar(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

/* ------------------------------------------------------------
   Referencias a elementos del HTML
   ------------------------------------------------------------ */
const portada     = document.getElementById("portada");
const botonInicio = document.getElementById("botonInicio");
const florInicio  = document.getElementById("florInicio");
const campoFlores = document.getElementById("campoFlores");
const cieloPixel  = document.getElementById("cieloPixel");
const principal   = document.getElementById("principal");

/* Dibuja la flor pixelada central (margarita en morado) */
florInicio.innerHTML = crearFlorSVG(PLANTILLAS[0], "#b9a7ec");

/* Pinta nubes pixeladas que cruzan el cielo de la portada */
(function pintarNubes() {
  for (let i = 0; i < CONFIG.numeroEstrellas; i++) {
    const nube = document.createElement("span");
    nube.className = "estrella"; // reutiliza el estilo de "pixel de nube"
    nube.style.left = Math.random() * 100 + "%";
    nube.style.top = (Math.random() * 42) + "%"; // solo en la parte alta (cielo)
    nube.style.animationDelay = (Math.random() * -26) + "s"; // arranque escalonado
    if (Math.random() < 0.3) nube.style.transform = "scale(1.4)";
    cieloPixel.appendChild(nube);
  }
})();

/* Calcula y muestra los días que lleváis juntos (contador de Bayas) */
(function contarDias() {
  const hoy = new Date();
  const msPorDia = 1000 * 60 * 60 * 24;
  const dias = Math.max(0, Math.floor((hoy - CONFIG.fechaInicio) / msPorDia));
  const texto = dias.toLocaleString("es-ES");
  const destino = document.getElementById("diasJuntos");
  const subtitulo = document.getElementById("diasSubtitulo");
  if (destino) destino.textContent = texto;
  if (subtitulo) subtitulo.textContent = texto;
})();

/* ------------------------------------------------------------
   2) Al hacer click: plantar el campo de flores pixeladas.
   ------------------------------------------------------------ */
botonInicio.addEventListener("click", iniciarAnimacion);

function iniciarAnimacion() {
  botonInicio.disabled = true;
  botonInicio.style.transition = "opacity 0.5s ease, transform 0.4s steps(4)";
  botonInicio.style.opacity = "0";
  botonInicio.style.transform = "scale(0.5)";

  for (let i = 0; i < CONFIG.numeroFlores; i++) {
    const flor = document.createElement("span");
    flor.className = "brote";

    // Tipo de flor y color de pétalo al azar (mucha variedad)
    const matriz = alAzar(PLANTILLAS);
    const color = alAzar(CONFIG.coloresPetalo);

    // Tamaño del "sprite" de la flor (en píxeles de pantalla)
    const tam = 46 + Math.floor(Math.random() * 70);
    flor.style.width = tam + "px";
    flor.style.height = (tam * 1.4) + "px"; // más alto por el tallo

    // Posición horizontal repartida por toda la pantalla
    flor.style.left = (Math.random() * 94) + "%";
    // Retardo escalonado -> efecto de campo que va brotando
    flor.style.animationDelay = (Math.random() * 1.1) + "s";

    flor.innerHTML = crearFlorSVG(matriz, color);
    campoFlores.appendChild(flor);
  }

  setTimeout(revelarPrincipal, CONFIG.duracionAnimacion);
}

/* ------------------------------------------------------------
   3) Revelar la interfaz principal con transición suave.
   ------------------------------------------------------------ */
function revelarPrincipal() {
  portada.style.opacity = "0";
  principal.classList.remove("oculto");
  setTimeout(() => {
    portada.classList.add("oculto");
    window.scrollTo({ top: 0 });
  }, 900);
}

/* ------------------------------------------------------------
   Parallax muy suave de las flores de fondo al mover el ratón.
   ------------------------------------------------------------ */
document.addEventListener("mousemove", (e) => {
  const flores = document.querySelectorAll(".flor-fondo");
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  flores.forEach((flor, i) => {
    const factor = (i + 1) * 0.4;
    flor.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

/* ---------- Poner el año actual en el pie automáticamente ---------- */
const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();


/* ============================================================
   MÚSICA (creada con Web Audio API: notas sintetizadas, sin
   archivos ni copyright). Suena una melodía alegre al pulsar
   "Click aquí" y luego un fondo suave en bucle. Se puede
   silenciar con el botón de la esquina.
   ------------------------------------------------------------
   AJUSTE: sube o baja el volumen general con CONFIG.volumen.
   ============================================================ */
const MUSICA = {
  ctx: null,
  master: null,
  volumen: 0.14,   // volumen general (0 = mudo, 1 = alto)
  bucle: null,
  silenciado: false,

  /* Crea el "motor" de audio (solo tras un click del usuario) */
  iniciar() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;                 // navegador sin soporte
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.silenciado ? 0 : this.volumen;
    this.master.connect(this.ctx.destination);
  },

  /* Toca una nota (frecuencia en Hz) con envolvente suave */
  nota(freq, inicio, duracion, tipo = "triangle", vol = 0.5) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + inicio;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = tipo;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);      // ataque
    g.gain.exponentialRampToValueAtTime(0.001, t + duracion); // caída
    osc.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + duracion + 0.05);
  },

  /* Melodía alegre de bienvenida (tipo "abrir el juego") */
  melodiaInicio() {
    // Notas (Do, Mi, Sol, Do agudo, La, Do agudo)
    const n = [523.25, 659.25, 783.99, 1046.5, 880.0, 1046.5];
    n.forEach((f, i) => this.nota(f, i * 0.14, 0.35, "triangle", 0.5));
    // Un pequeño acorde final
    [523.25, 659.25, 783.99].forEach((f) =>
      this.nota(f, 0.9, 0.9, "sine", 0.35));
  },

  /* Fondo suave en bucle: pequeños arpegios relajados */
  iniciarBucle() {
    if (!this.ctx || this.bucle) return;
    // Acordes pentatónicos suaves que se van alternando
    const acordes = [
      [392.0, 493.88, 587.33],  // Sol
      [440.0, 523.25, 659.25],  // La menor-ish
      [349.23, 440.0, 523.25],  // Fa
      [392.0, 587.33, 783.99],  // Sol amplio
    ];
    let i = 0;
    const tocar = () => {
      const ac = acordes[i % acordes.length];
      ac.forEach((f, j) => this.nota(f, j * 0.18, 1.6, "sine", 0.22));
      i++;
    };
    tocar();
    this.bucle = setInterval(tocar, 3200);
  },

  /* Silenciar / activar */
  alternar() {
    this.silenciado = !this.silenciado;
    if (this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(
        this.silenciado ? 0 : this.volumen, t + 0.2);
    }
    return this.silenciado;
  }
};

/* Al pulsar la flor de inicio: arrancar audio + melodía + bucle */
botonInicio.addEventListener("click", () => {
  MUSICA.iniciar();
  MUSICA.melodiaInicio();
  // El fondo empieza cuando ya se ve la web
  setTimeout(() => MUSICA.iniciarBucle(), CONFIG.duracionAnimacion + 300);
});

/* Botón de silenciar/activar música */
const btnMusica = document.getElementById("btnMusica");
if (btnMusica) {
  btnMusica.addEventListener("click", () => {
    // Si aún no hay audio (por si acaso), lo arranca
    MUSICA.iniciar();
    if (!MUSICA.bucle) MUSICA.iniciarBucle();
    const mudo = MUSICA.alternar();
    btnMusica.textContent = mudo ? "🔇" : "🔊";
    btnMusica.classList.toggle("silenciado", mudo);
    btnMusica.setAttribute("aria-label", mudo ? "Activar música" : "Silenciar música");
  });
}
