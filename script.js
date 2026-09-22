/* ============================================================
   LÓGICA DE LA WEB (JavaScript vanilla, sin librerías)
   Solo hay dos cosas importantes:
   1) La animación de la portada (campo de flores).
   2) Revelar la interfaz principal al terminar.
   Normalmente NO necesitas tocar este archivo para editar textos
   o fotos: eso se hace en index.html.
   ============================================================ */

/* ---------- Ajustes que puedes cambiar sin miedo ---------- */
const CONFIG = {
  numeroFlores: 26,     // cuántas flores crecen en la animación
  emojisFlores: ["🌷", "🌼", "🌸", "🌹", "🪻", "💐"], // qué flores aparecen
  duracionAnimacion: 2200 // milisegundos que dura antes de revelar la web
};

/* ---------- Referencias a elementos del HTML ---------- */
const portada     = document.getElementById("portada");
const botonInicio = document.getElementById("botonInicio");
const campoFlores = document.getElementById("campoFlores");
const principal   = document.getElementById("principal");

/* ------------------------------------------------------------
   1) Al hacer click en la flor: plantar el campo y animar.
   ------------------------------------------------------------ */
botonInicio.addEventListener("click", iniciarAnimacion);

function iniciarAnimacion() {
  // Evita repetir si ya se pulsó
  botonInicio.disabled = true;
  botonInicio.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  botonInicio.style.opacity = "0";
  botonInicio.style.transform = "scale(0.6)";

  // Crear muchas flores que "florecen" desde abajo
  for (let i = 0; i < CONFIG.numeroFlores; i++) {
    const flor = document.createElement("span");
    flor.className = "brote";
    flor.textContent = elegirAlAzar(CONFIG.emojisFlores);

    // Posición horizontal repartida por toda la pantalla
    flor.style.left = (Math.random() * 96) + "%";
    // Tamaño variado para dar profundidad
    flor.style.fontSize = (28 + Math.random() * 46) + "px";
    // Cada flor crece con un pequeño retardo (efecto ola)
    flor.style.animationDelay = (Math.random() * 0.9) + "s";

    campoFlores.appendChild(flor);
  }

  // Tras la animación, revelar la web de forma fluida
  setTimeout(revelarPrincipal, CONFIG.duracionAnimacion);
}

/* ------------------------------------------------------------
   2) Revelar la interfaz principal con transición suave.
   ------------------------------------------------------------ */
function revelarPrincipal() {
  // Desvanecer la portada
  portada.style.opacity = "0";

  // Mostrar la web principal
  principal.classList.remove("oculto");

  // Cuando termina el desvanecido, quitar la portada del todo
  setTimeout(() => {
    portada.classList.add("oculto");
    // Colocar el scroll arriba del todo
    window.scrollTo({ top: 0 });
  }, 900);
}

/* ---------- Utilidad: elegir un elemento al azar de una lista ---------- */
function elegirAlAzar(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

/* ------------------------------------------------------------
   Detalle: parallax muy suave de las flores de fondo al mover
   el ratón (en móvil no molesta porque no hay puntero).
   ------------------------------------------------------------ */
document.addEventListener("mousemove", (e) => {
  const flores = document.querySelectorAll(".flor-fondo");
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  flores.forEach((flor, i) => {
    const factor = (i + 1) * 0.4; // cada flor se mueve un poco distinto
    flor.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

/* ---------- Poner el año actual en el pie automáticamente ---------- */
const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();
