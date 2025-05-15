// Capturamos los elementos del HTML
const boton = document.getElementById('start');
const texto = document.getElementById('texto');
const videoSeña = document.getElementById('videoSeña');
const videoSource = document.getElementById('videoSource');
const entradaTexto = document.getElementById('entradaTexto');

// Ocultar el video al cargar la página
videoSeña.style.display = "none";

// Configuramos el reconocimiento de voz
const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES'; // Idioma español

boton.addEventListener('click', () => {
    reconocimiento.start(); // Inicia el reconocimiento de voz
});

reconocimiento.onresult = (event) => {
    const speechText = event.results[0][0].transcript.toLowerCase();
    texto.textContent = speechText;
    reproducirVideoSegunTexto(speechText);
};

// Escuchar cuando presionan Enter en el campo de texto
entradaTexto.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const userInput = entradaTexto.value.toLowerCase();
        texto.textContent = userInput;
        reproducirVideoSegunTexto(userInput);
    }
});

// Diccionario de palabras clave para cada video
const palabrasClave = {
    "Palabras/Dialogar.mp4": ["dialogar", "dialogo", "dialogamos", "dialogan", "dialogando", "dialogué"],
    "Palabras/Hablar.mp4": ["hablar", "hablo", "hablamos", "hablan", "hablando", "hablé", "hablado"],
    "Palabras/Lengua oral.mp4": ["lengua oral"],
    "Palabras/Decir.mp4": ["decir", "digo", "dices", "dice", "decimos", "dicen", "dije", "dicho", "diciendo"],
    "Palabras/Contar o Narrar.mp4": ["contar", "narrar", "cuento", "contamos", "contando", "narramos", "narrando", "narré"],
    "Palabras/Explicar.mp4": ["explicar", "explico", "explicas", "explicamos", "explicando", "expliqué"],
    "Palabras/Si.mp4": ["si"],
    "Palabras/No.mp4": ["no"],
    "Palabras/Negar.mp4": ["negar", "nego", "negamos", "negando", "negué"],
    "Palabras/Tambien.mp4": ["tambien", "también"],
    "Palabras/Tampoco.mp4": ["tampoco"],
    "Palabras/Estar.mp4": ["estar", "estoy", "estás", "está", "estamos", "están", "estuve", "estado", "estando"],
    "Palabras/Yo.mp4": ["yo"],
    "Palabras/Vos.mp4": ["vos"],
    "Palabras/Ustedes.mp4": ["ustedes"],
    "Palabras/El o Ella.mp4": ["el", "ella"],
    "Palabras/Nosotros o Nosotras.mp4": ["nosotros", "nosotras"]
};

// Letras del abecedario (incluyendo LL y CH)
const letras = ["a","b","c","d","e","f","g","h","i","j","k","l","ll","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z","ch"];

// Función principal para reproducir video según palabra
function reproducirVideoSegunTexto(text) {
    let videoPath = "";

    // Palabras específicas
    if (text.includes("hola")) {
        videoPath = "Palabras/hola.mp4";
    } else if (text.includes("como estas") || text.includes("cómo estás")) {
        videoPath = "Palabras/comoestas.mp4";
    } else if (text.includes("vos cómo te llamas") || text.includes("cómo te llamas")) {
        videoPath = "Palabras/comotellamas.mp4";
    } else if (text.includes("me llamo luana")) {
        videoPath = "Palabras/llamoluana.mp4";
    }

    // Letras individuales
    letras.forEach(letra => {
        if (text === letra || text === `letra ${letra}`) {
            videoPath = `Palabras/letra${letra.toUpperCase()}.mp4`;
        }
    });

    // Palabras del diccionario
    for (const [ruta, variaciones] of Object.entries(palabrasClave)) {
        if (variaciones.some(forma => text.includes(forma))) {
            videoPath = ruta;
            break;
        }
    }

    // Reproducir video si se detectó alguna coincidencia
    if (videoPath) {
        videoSource.src = videoPath;
        videoSeña.load();
        videoSeña.style.display = "block";
        videoSeña.play();
    } else {
        videoSeña.style.display = "none";
    }
}
