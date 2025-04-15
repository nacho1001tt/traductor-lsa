// Capturamos los elementos del HTML
const boton = document.getElementById('start');
const texto = document.getElementById('texto');
const videoSeña = document.getElementById('videoSeña');
const videoSource = document.getElementById('videoSource');
const entradaTexto = document.getElementById('entradaTexto');
const botonTexto = document.getElementById('botonTexto');

// Ocultar el video al cargar la página
videoSeña.style.display = "none"; 

// Configuramos el reconocimiento de voz
const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES'; // Idioma español

boton.addEventListener('click', () => {
    reconocimiento.start(); // Inicia el reconocimiento de voz
});

// Función para procesar texto y mostrar video
function procesarTexto(speechText) {
    let videoPath = "";
    speechText = speechText.toLowerCase().trim();

    // Palabras completas
    if (speechText.includes("hola")) {
        videoPath = "Palabras/hola.mp4";
    } else if (speechText.includes("como estas") || speechText.includes("cómo estás")) {
        videoPath = "Palabras/comoestas.mp4";
    } else if (speechText.includes("vos cómo te llamas") || speechText.includes("cómo te llamas")) {
        videoPath = "Palabras/comotellamas.mp4";
    } else if (speechText.includes("me llamo luana")) {
        videoPath = "Palabras/llamoluana.mp4";
    }

    // Letras sueltas y "letra + letra"
    const letras = [
        "a","b","c","ch","d","e","f","g","h","i","j","k","l","ll","m","n","ñ",
        "o","p","q","r","s","t","u","v","w","x","y","z"
    ];

    for (let letra of letras) {
        if (speechText === letra || speechText === `letra ${letra}`) {
            const letraMayus = letra.toUpperCase(); // Para nombre de archivo
            videoPath = `Palabras/letra${letraMayus}.mp4`;
            break;
        }
    }

    // Mostrar video si hay coincidencia
    if (videoPath) {
        videoSource.src = videoPath;
        videoSeña.load();
        videoSeña.style.display = "block";
        videoSeña.play();
    } else {
        videoSeña.style.display = "none";
    }
}

// Cuando se detecta la voz
reconocimiento.onresult = (event) => {
    const speechText = event.results[0][0].transcript;
    texto.textContent = speechText;
    procesarTexto(speechText);
};

// Cuando se presiona el botón de texto
botonTexto.addEventListener('click', () => {
    const textoEscrito = entradaTexto.value.trim();
    texto.textContent = textoEscrito;
    procesarTexto(textoEscrito);
});
