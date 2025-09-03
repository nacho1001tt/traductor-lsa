// script.js - versión revisada y robusta
document.addEventListener('DOMContentLoaded', () => {

  // --- Elementos del DOM (según tu HTML) ---
  const boton = document.getElementById('start');
  const texto = document.getElementById('texto');
  const videoSeña = document.getElementById('videoSeña');
  const videoSource = document.getElementById('videoSource');
  const entradaTexto = document.getElementById('entradaTexto');

  // slider de velocidad (si existe en tu HTML)
  const speedControl = document.getElementById('speedControl'); // <input type="range" id="speedControl" ...>
  const speedValue = document.getElementById('speedValue');     // <span id="speedValue">0.75x</span>

  // compruebo elementos esenciales
  if (!boton || !texto || !videoSeña || !videoSource || !entradaTexto) {
    console.error('Faltan elementos HTML requeridos. Revisa que existan start, texto, videoSeña, videoSource y entradaTexto.');
    return;
  }

  // Ocultar el video al cargar la página
  videoSeña.style.display = "none";

  // Valor por defecto de velocidad
  const DEFAULT_SPEED = 0.75;
  if (speedControl) {
    // dejar el control sincronizado con el valor por defecto si no tiene valor
    if (!speedControl.value) speedControl.value = DEFAULT_SPEED;
    if (speedValue) speedValue.textContent = speedControl.value + "x";

    speedControl.addEventListener('input', () => {
      const s = parseFloat(speedControl.value) || DEFAULT_SPEED;
      videoSeña.playbackRate = s;
      if (speedValue) speedValue.textContent = s + "x";
    });
  } else {
    // si no hay slider, fijo la velocidad por defecto
    videoSeña.playbackRate = DEFAULT_SPEED;
  }

  // --- Reconocimiento de voz (Web Speech API) ---
  const Recon = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recon) {
    console.warn('Este navegador no soporta SpeechRecognition. Solo funcionará la entrada por texto.');
  }
  const reconocimiento = Recon ? new Recon() : null;
  if (reconocimiento) {
    reconocimiento.lang = 'es-ES'; // idioma español

    // Indicador visual para el micrófono (añade/quita clase .mic-active al botón)
    reconocimiento.onstart = () => {
      boton.classList.add('mic-active');
    };
    reconocimiento.onend = () => {
      boton.classList.remove('mic-active');
    };

    reconocimiento.onresult = (event) => {
      try {
        const speechText = event.results[0][0].transcript.toLowerCase();
        mostrarTextoReconocido(speechText);
        procesarTextoSecuencial(speechText);
      } catch (err) {
        console.error('Error procesando resultado de reconocimiento:', err);
      }
    };
  }

  boton.addEventListener('click', () => {
    // Si no hay SpeechRecognition, avisar al usuario y no crash
    if (!reconocimiento) {
      alert('Reconocimiento de voz no disponible en este navegador.');
      return;
    }
    try {
      reconocimiento.start();
    } catch (err) {
      console.error('No se pudo iniciar el reconocimiento:', err);
    }
  });

  // entrada por teclado (Enter)
  entradaTexto.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const userInput = entradaTexto.value.toLowerCase().trim();
      mostrarTextoReconocido(userInput);
      procesarTextoSecuencial(userInput);
    }
  });

  // --- Diccionarios (mantuve EXACTAMENTE tu estructura y conjugaciones) ---
  const conjugaciones = {
    dialogar: [
        "dialogar", "dialogo", "dialogás", "dialogas", "dialoga", "dialogamos", "dialogan",
        "dialogué", "dialogaste", "dialogó", "dialogamos", "dialogaron",
        "dialogaba", "dialogabas", "dialogábamos", "dialogaban",
        "dialogaré", "dialogarás", "dialogará", "dialogaremos", "dialogarán",
        "dialogaría", "dialogarías", "dialogaríamos", "dialogarían",
        "dialogando", "dialogado", "dialogaré", "he dialogado", "hemos dialogado", "han dialogado"
    ],
    hablar: [
        "hablar", "hablo", "hablás", "hablas", "habla", "hablamos", "hablan",
        "hablé", "hablaste", "habló", "hablamos", "hablaron",
        "hablaba", "hablabas", "hablábamos", "hablaban",
        "hablaré", "hablarás", "hablará", "hablaremos", "hablarán",
        "hablaría", "hablarías", "hablaríamos", "hablarían",
        "hablando", "hablado", "he hablado", "hemos hablado", "han hablado"
    ],
    decir: [
        "decir", "digo", "decís", "dices", "dice", "decimos", "dicen",
        "dije", "dijiste", "dijo", "dijimos", "dijeron",
        "decía", "decías", "decíamos", "decían",
        "diré", "dirás", "dirá", "diremos", "dirán",
        "diría", "dirías", "diríamos", "dirían",
        "diciendo", "dicho", "he dicho", "hemos dicho", "han dicho"
    ],
    contar: [
        "contar", "cuento", "contás", "contas", "cuenta", "contamos", "cuentan",
        "conté", "contaste", "contó", "contamos", "contaron",
        "contaba", "contabas", "contábamos", "contaban",
        "contaré", "contarás", "contará", "contaremos", "contarán",
        "contaría", "contarías", "contaríamos", "contarían",
        "contando", "contado", "he contado", "hemos contado", "han contado"
    ],
    narrar: [
        "narrar", "narro", "narrás", "narras", "narra", "narramos", "narran",
        "narré", "narraste", "narró", "narramos", "narraron",
        "narraba", "narrabas", "narrábamos", "narraban",
        "narraré", "narrarás", "narrará", "narraremos", "narrarán",
        "narrando", "narrado", "he narrado", "hemos narrado", "han narrado"
    ],
    explicar: [
        "explicar", "explico", "explicás", "explicas", "explica", "explicamos", "explican",
        "expliqué", "explicaste", "explicó", "explicamos", "explicaron",
        "explicaba", "explicabas", "explicábamos", "explicaban",
        "explicaré", "explicarás", "explicará", "explicaremos", "explicarán",
        "explicando", "explicado", "he explicado", "hemos explicado", "han explicado"
    ],
    estar: [
        "estar", "estoy", "estás", "está", "estamos", "están",
        "estuve", "estuviste", "estuvo", "estuvimos", "estuvieron",
        "estaba", "estabas", "estábamos", "estaban",
        "estaré", "estarás", "estará", "estaremos", "estarán",
        "estando", "estado", "he estado", "hemos estado", "han estado"
    ]
  };

  const palabrasFijas = {
    "lengua oral": "Lengua oral",
    si: "Si",
    no: "No",
    negar: "Negar",
    también: "Tambien",
    tampoco: "Tampoco",
    yo: "Yo",
    vos: "Vos",
    ustedes: "Ustedes",
    "el": "El o Ella",
    "ella": "El o Ella",
    "nosotros": "Nosotros o Nosotras",
    "nosotras": "Nosotros o Nosotras"
  };

  // --- Funciones de UI auxiliares ---
  function mostrarTextoReconocido(str) {
    texto.textContent = str || '';
    // efecto glow: agregar clase y quitarla luego
    texto.classList.add('glow');
    setTimeout(() => texto.classList.remove('glow'), 900);
  }

  // --- Procesamiento del texto -> lista de videos ---
  function procesarTextoSecuencial(text) {
    if (!text || !text.trim()) {
      console.log('Texto vacío, no hay nada que reproducir.');
      return;
    }

    // mejor separar por espacios/puntuación
    const palabras = text.split(/[\s,;?.!¡¿]+/).filter(Boolean);
    const videosAReproducir = [];

    for (let palabra of palabras) {
      palabra = palabra.trim().toLowerCase();
      if (!palabra) continue;

      // Frases fijas (prioritarias)
      if (palabra === "hola") {
        videosAReproducir.push("Palabras/hola.mp4");
        continue;
      }
      // comprobaciones que usaban `text.includes(...)` las dejo también (para frases múltiples)
      if (text.includes("como estas") || text.includes("cómo estás")) {
        if (!videosAReproducir.includes("Palabras/comoestas.mp4")) videosAReproducir.push("Palabras/comoestas.mp4");
      }
      if (text.includes("vos cómo te llamas") || text.includes("cómo te llamas")) {
        if (!videosAReproducir.includes("Palabras/comotellamas.mp4")) videosAReproducir.push("Palabras/comotellamas.mp4");
      }
      if (text.includes("me llamo luana")) {
        if (!videosAReproducir.includes("Palabras/llamoluana.mp4")) videosAReproducir.push("Palabras/llamoluana.mp4");
      }

      // Letras
      const letras = ["a","b","c","d","e","f","g","h","i","j","k","l","ll","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z","ch"];
      if (letras.includes(palabra)) {
        videosAReproducir.push(`Palabras/letra${palabra.toUpperCase()}.mp4`);
        continue;
      }

      // Conjugaciones / verbos
      let encontrado = false;
      for (let verbo in conjugaciones) {
        if (conjugaciones[verbo].includes(palabra)) {
          const nombreArchivo = (verbo === "contar" || verbo === "narrar") ? "Contar o Narrar" : verbo.charAt(0).toUpperCase() + verbo.slice(1);
          videosAReproducir.push(`Palabras/${nombreArchivo}.mp4`);
          encontrado = true;
          break;
        }
      }
      if (encontrado) continue;

      // Palabras fijas sueltas
      for (let fija in palabrasFijas) {
        if (palabra === fija) {
          videosAReproducir.push(`Palabras/${palabrasFijas[fija]}.mp4`);
          break;
        }
      }
    }

    if (videosAReproducir.length === 0) {
      console.log('No se encontró ningún video para las palabras ingresadas.');
      videoSeña.style.display = "none";
      return;
    }

    reproducirSecuencialmente(videosAReproducir);
  }

  // --- Reproducción secuencial con manejo de errores en play() ---
  function reproducirSecuencialmente(lista) {
    if (!Array.isArray(lista) || lista.length === 0) {
      videoSeña.style.display = "none";
      return;
    }

    const path = lista.shift();
    console.log('Reproduciendo:', path);

    // actualizar la fuente y preparar reproducción
    videoSource.src = path;
    // forzar reload de la fuente
    try {
      videoSeña.load();
    } catch (err) {
      console.warn('videoSeña.load() falló:', err);
    }

    // mostrar video
    videoSeña.style.display = "block";

    // asegurar playbackRate según slider o por defecto
    const velocidad = speedControl ? parseFloat(speedControl.value) || DEFAULT_SPEED : DEFAULT_SPEED;
    videoSeña.playbackRate = velocidad;

    // manejar error de carga
    videoSeña.onerror = (ev) => {
      console.error('Error al cargar/reproducir el video:', ev);
      // intentar continuar con siguiente video
      setTimeout(() => reproducirSecuencialmente(lista), 250);
    };

    // cuando termine, esperar delay y reproducir siguiente
    const DELAY_MS = 100;
    videoSeña.onended = () => {
      setTimeout(() => {
        reproducirSecuencialmente(lista);
      }, DELAY_MS);
    };

    // intentar reproducir y capturar errores (autoplay, codecs, etc.)
    const playPromise = videoSeña.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // éxito
        })
        .catch((err) => {
          console.error('Error en video.play():', err);
          // Si falla (política autoplay) intentar mostrar un control visual para que el usuario pulse "play" manualmente:
          // mostramos un mensaje en consola y ocultamos el video para evitar bucles
          videoSeña.style.display = "none";
          alert('No se pudo reproducir automáticamente el video. Por favor, hacé click en el botón "Reproducir" del video para continuar.');
        });
    }
  }

  // --- Opcional: exposición de funciones para debug en consola ---
  window._procesarTextoSecuencial = procesarTextoSecuencial;
  window._reproducirSecuencialmente = reproducirSecuencialmente;

});
