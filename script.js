// script.js - Versión completa con manejo de .play().catch()
// Mantuvimos exactamente tus conjugaciones, rutas "Palabras/..." y la estructura.

document.addEventListener('DOMContentLoaded', () => {

  // --- Elementos del DOM ---
  const boton = document.getElementById('start');
  const texto = document.getElementById('texto');
  const videoSeña = document.getElementById('videoSeña');
  const videoSource = document.getElementById('videoSource');
  const entradaTexto = document.getElementById('entradaTexto');
  const speedControl = document.getElementById('speedControl'); // opcional
  const speedValue = document.getElementById('speedValue');     // opcional
  const contrastToggle = document.getElementById('contrastToggle'); // opcional

  // Verificación mínima
  if (!boton || !texto || !videoSeña || !videoSource || !entradaTexto) {
    console.error('Faltan elementos HTML requeridos (start, texto, videoSeña, videoSource, entradaTexto).');
    // no abortamos por completo para permitir pruebas parciales
  }

  // 🔊 Silenciar video para intentar permitir autoplay en navegadores que lo permiten
  try { videoSeña.muted = true; } catch(e){ /* noop */ }

  // Ocultar el video al inicio
  videoSeña.style.display = "none";

  // Velocidad por defecto
  const DEFAULT_SPEED = 0.75;
  if (speedControl) {
    if (!speedControl.value) speedControl.value = DEFAULT_SPEED;
    if (speedValue) speedValue.textContent = speedControl.value + "x";
    speedControl.addEventListener('input', () => {
      const s = parseFloat(speedControl.value) || DEFAULT_SPEED;
      videoSeña.playbackRate = s;
      if (speedValue) speedValue.textContent = s + "x";
    });
  } else {
    videoSeña.playbackRate = DEFAULT_SPEED;
  }

  // Toggle alto contraste (si existe)
  if (contrastToggle) {
    contrastToggle.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
    });
  }

  // --- Reconocimiento de voz ---
  const Recon = window.SpeechRecognition || window.webkitSpeechRecognition;
  const reconocimiento = Recon ? new Recon() : null;
  if (!Recon) {
    console.warn('SpeechRecognition no disponible en este navegador. Solo entrada por texto funcionará.');
  } else {
    reconocimiento.lang = 'es-ES';
    reconocimiento.onstart = () => boton.classList.add('mic-active');
    reconocimiento.onend = () => boton.classList.remove('mic-active');

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
    if (!reconocimiento) {
      alert('Reconocimiento de voz no disponible en este navegador.');
      return;
    }
    try { reconocimiento.start(); }
    catch (err) { console.error('No se pudo iniciar reconocimiento:', err); }
  });

  // Tecla Enter en input
  entradaTexto.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const userInput = entradaTexto.value.toLowerCase().trim();
      mostrarTextoReconocido(userInput);
      procesarTextoSecuencial(userInput);
    }
  });

  // --- Tus conjugaciones (idénticas a las que proporcionaste) ---
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

  // Palabras fijas
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

  // --- Funciones auxiliares ---
  function mostrarTextoReconocido(str) {
    texto.textContent = str || '';
    texto.classList.add('glow');
    setTimeout(() => texto.classList.remove('glow'), 900);
  }

  // --- Procesar texto y armar lista de videos ---
  function procesarTextoSecuencial(text) {
    if (!text || !text.trim()) {
      console.log('Texto vacío - nada que reproducir.');
      return;
    }

    // separar por espacios/puntuación
    const palabras = text.split(/[\s,;?.!¡¿]+/).filter(Boolean);
    const videosAReproducir = [];

    // para detecciones de frases
    const fraseLower = text.toLowerCase();

    for (let palabra of palabras) {
      palabra = palabra.trim().toLowerCase();
      if (!palabra) continue;

      // Frases y expresiones (prioritarias)
      if (palabra === "hola") {
        videosAReproducir.push("Palabras/hola.mp4");
        continue;
      }
      if (fraseLower.includes("como estas") || fraseLower.includes("cómo estás")) {
        if (!videosAReproducir.includes("Palabras/comoestas.mp4")) videosAReproducir.push("Palabras/comoestas.mp4");
      }
      if (fraseLower.includes("vos cómo te llamas") || fraseLower.includes("cómo te llamas")) {
        if (!videosAReproducir.includes("Palabras/comotellamas.mp4")) videosAReproducir.push("Palabras/comotellamas.mp4");
      }
      if (fraseLower.includes("me llamo luana")) {
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
    } // end for

    if (videosAReproducir.length === 0) {
      console.log('No se encontró video para las palabras ingresadas.');
      videoSeña.style.display = "none";
      return;
    }

    reproducirSecuencialmente(videosAReproducir);
  }

  // --- Reproducción secuencial con .play().catch(...) ---
  function reproducirSecuencialmente(lista) {
    if (!Array.isArray(lista) || lista.length === 0) {
      videoSeña.style.display = "none";
      return;
    }

    const path = lista.shift();
    console.log('Reproduciendo:', path);

    // actualizar fuente
    videoSource.src = path;

    // cargar
    try { videoSeña.load(); } catch (err) { console.warn('video.load() dio error:', err); }

    // mostrar el video (para que el usuario pueda darle play manual si es necesario)
    videoSeña.style.display = "block";

    // ajustar velocidad
    const velocidad = speedControl ? parseFloat(speedControl.value) || DEFAULT_SPEED : DEFAULT_SPEED;
    videoSeña.playbackRate = velocidad;

    // si ocurre error en la carga, pasar al siguiente
    videoSeña.onerror = (ev) => {
      console.error('Error cargando el video:', ev);
      setTimeout(() => reproducirSecuencialmente(lista), 250);
    };

    // cuando termine, reproducir siguiente después del delay
    const DELAY_MS = 100;
    videoSeña.onended = () => {
      setTimeout(() => reproducirSecuencialmente(lista), DELAY_MS);
    };

    // Intentar reproducir y capturar rechazo (autoplay policies)
    const playPromise = videoSeña.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // reproducción iniciada correctamente
          console.log('play() OK:', path);
        })
        .catch((err) => {
          console.warn('play() rechazado por el navegador (autoplay):', err);
          // dejar video cargado y visible para que el usuario pulse "play" manualmente:
          texto.innerHTML = `No se pudo reproducir automáticamente el video. Hacé click en el botón "Reproducir" del video para continuar.`;
          // el video ya está cargado (videoSource.src), permanecerá visible en pausa
          try { videoSeña.pause(); } catch(e){/* noop */ }
          // NO avanzar automáticamente — se esperará a que el usuario pulse play
        });
    }
  }

  // --- Exponer funciones para debug si querés desde consola ---
  window._procesarTexto = procesarTextoSecuencial;
  window._reproducir = reproducirSecuencialmente;
  window._conjugaciones = conjugaciones;

}); // end DOMContentLoaded
