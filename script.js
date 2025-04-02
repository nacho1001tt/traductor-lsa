// Capturamos los elementos del HTML
const boton = document.getElementById('start');
const texto = document.getElementById('texto');
const videoSeña = document.getElementById('videoSeña');
const videoSource = document.getElementById('videoSource');

// Configuramos el reconocimiento de voz
const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES'; // Idioma español

boton.addEventListener('click', () => {
    reconocimiento.start(); // Inicia el reconocimiento de voz
});

reconocimiento.onresult = (event) => {
    const speechText = event.results[0][0].transcript.toLowerCase();
    texto.textContent = speechText;

    let videoPath = "";

    // Asignamos el video según la palabra detectada
    if (speechText.includes("hola")) {
        videoPath = "Palabras/hola.mp4";
    } else if (speechText.includes("cómo estás")) {
        videoPath = "Palabras/como estas.mp4";
    }

    // Si se detectó una palabra válida, actualiza el video y lo muestra
    if (videoPath) {
        videoSource.src = videoPath;
        videoSeña.load(); // Recargar el video con la nueva fuente
        videoSeña.style.display = "block"; // Mostrar el video
        videoSeña.play();
    } else {
        videoSeña.style.display = "none"; // Ocultar el video si no hay coincidencia
    }
};
