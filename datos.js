/* ============================================================
   DATOS DE LA WEB (aquí se añade contenido, sin tocar el HTML)
   ------------------------------------------------------------
   Cada lista es un conjunto de bloques { ... } separados por comas.
   Para añadir algo: copia un bloque entero, pégalo donde quieras
   y cambia los textos. Respeta las comillas "" y la coma final.
   ============================================================ */


/* ------------------------------------------------------------
   LÍNEA DEL TIEMPO (sección "Nuestra historia")
   Se muestra en el mismo orden que aquí (de arriba a abajo).

   Campos de cada hito:
     fecha  -> lo que sale en la etiqueta: una fecha ("13 abr 2026")
               o un texto corto ("🎂 Tu cumple").
     titulo -> título del hito.
     texto  -> una o dos frases (puede ir vacío: "").
     foto   -> ruta de una imagen de la carpeta images/ (o "" si no hay).
   ------------------------------------------------------------ */
const LINEA_TIEMPO = [
  {
    fecha: "23 mar 2026",
    titulo: "Nuestra primera cita",
    texto: "El punto de partida de todo.",
    foto: "images/primera-cita.jpg"
  },
  {
    fecha: "13 abr 2026",
    titulo: "El día que empezó todo",
    texto: "Aquí empieza nuestra isla.",
    foto: ""
  },
  {
    fecha: "🎂 Tu cumple",
    titulo: "Tus 20 añitos",
    texto: "",
    foto: "images/foto1.jpg"
  },
  {
    fecha: "💃 Noche de baile",
    titulo: "Bailando juntos",
    texto: "",
    foto: "images/foto2.jpg"
  },
  {
    fecha: "🌹 Fiestas",
    titulo: "Nuestras fiestas",
    texto: "",
    foto: "images/foto3.jpg"
  }
  /* PLANTILLA para añadir un hito (quita los símbolos de comentario
     y pon una coma después del bloque anterior):
  ,{
    fecha: "1 may 2026",
    titulo: "Título del recuerdo",
    texto: "Lo que pasó ese día.",
    foto: "images/nombre-de-la-foto.jpg"
  }
  */
];
