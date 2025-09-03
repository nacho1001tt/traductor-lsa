<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Reproducción de Señas</title>
<style>
  body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
  #texto { font-size: 1.5em; margin-bottom: 20px; }
  video { max-width: 80%; margin-top: 20px; }
</style>
</head>
<body>

<h1>Reconocimiento de Voz a Señas</h1>

<div id="texto">Texto reconocido aparecerá aquí</div>

<input type="text" id="entradaTexto" placeholder="Escribe algo y presiona Enter" />

<button id="start">🎤 Hablar</button>

<video id="videoSeña" controls>
  <source id="videoSource" src="" type="video/mp4">
  Tu navegador no soporta HTML5 video.
</video>

<script>
  // =============================
  // Captura de elementos
  // =============================
  const boton = document.getElementById('start');
  const texto = document.getElementById('texto');
  const videoSeña = document.getElementById('videoSeña');
  const videoSource = document.getElementById('videoSource');
  const entradaTexto = document.getElementById('entradaTexto');

  // Ocultar video al inicio
  videoSeña.style.display = "none";

  // =============================
  // Reconocimiento de voz
  // =============================
  const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  reconocimiento.lang = 'es-ES';

  boton.addEventListener('click', () => {
      reconocimiento.start();
  });

  reconocimiento.onresult = (event) => {
      const speechText = event.results[0][0].transcript.toLowerCase();
      texto.textContent = speechText;
      reproducirVideoSegunTexto(speechText);
  };

  // Entrada de texto con Enter
  entradaTexto.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
          event.preventDefault();
          const userInput = entradaTexto.value.toLowerCase();
          texto.textContent = userInput;
          reproducirVideoSegunTexto(userInput);
      }
  });

  // =============================
  // Diccionario de palabras
  // =============================
  const palabrasClave = {
      "Palabras/Dialogar.mp4": ["dialogar", "dialogo", "dialogamos", "dialogan", "dialogando", "dialogué"],
      "Palabras/Hablar.mp4": ["hablar", "hablo", "hablamos", "hablan", "hablando", "hablé", "hablado"],
      "Palabras/Lengua oral.mp4": ["lengua oral"],
      "Palabras/Decir.mp4": ["decir", "digo", "dices", "dice", "decimos", "dicen", "dije", "dicho", "diciendo"],
      "Palabras/Contar o Narrar.mp4": ["contar", "narrar", "cuento", "contamos", "contando", "narramos", "narrando", "narré"],
      "Palabras/Explicar.mp4": ["explicar", "explico", "explicas", "explicamos", "explicando", "expliqué"],
      "Palabras/Si.mp4": ["si","sí"],
      "Palabras/No.mp4": ["no"],
      "Palabras/Negar.mp4": ["negar", "nego", "negamos", "negando", "negué"],
      "Palabras/Tambien.mp4": ["tambien", "también"],
      "Palabras/Tampoco.mp4": ["tampoco"],
      "Palabras/Estar.mp4": ["estar", "estoy", "estás", "está", "estamos", "están", "estuve", "estado", "estando"],
      "Palabras/Yo.mp4": ["yo"],
      "Palabras/Vos.mp4": ["vos"],
      "Palabras/Ustedes.mp4": ["ustedes"],
      "Palabras/El o Ella.mp4": ["el", "ella"],
      "Palabras/Nosotros o Nosotras.mp4": ["nosotros", "nosotras"],
      "Palabras/Hola.mp4": ["hola"],
      "Palabras/Comoestas.mp4": ["como estas","cómo estás"],
      "Palabras/Comotellamas.mp4": ["cómo te llamas","como te llamas","vos cómo te llamas"],
      "Palabras/Llamoluana.mp4": ["me llamo luana"]
  };

  // Letras individuales
  const letras = ["a","b","c","d","e","f","g","h","i","j","k","l","ll","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z","ch"];

  // =============================
  // Función principal de reproducción
  // =============================
  function reproducirVideoSegunTexto(text) {
      let videoPath = "";

      // Palabras exactas del diccionario
      for (const [ruta, variaciones] of Object.entries(palabrasClave)) {
          if (variaciones.some(forma => text.includes(forma))) {
              videoPath = ruta;
              break;
          }
      }

      // Letras sueltas
      letras.forEach(letra => {
          if (text === letra) {
              videoPath = `Palabras/letra${letra.toUpperCase()}.mp4`;
          }
      });

      // Reproducir video si se encontró ruta
      if (videoPath) {
          videoSource.src = videoPath;
          videoSeña.load();
          videoSeña.style.display = "block";
          videoSeña.play();
      } else {
          videoSeña.style.display = "none";
      }
  }
</script>

</body>
</html>
