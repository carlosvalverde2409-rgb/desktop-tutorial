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
  fechaInicio: new Date(2025, 2, 22), // 22 de marzo de 2025 (cámbiala)

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
  const destino = document.getElementById("diasJuntos");
  if (!destino) return;
  const hoy = new Date();
  const msPorDia = 1000 * 60 * 60 * 24;
  const dias = Math.max(0, Math.floor((hoy - CONFIG.fechaInicio) / msPorDia));
  destino.textContent = dias.toLocaleString("es-ES");
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
