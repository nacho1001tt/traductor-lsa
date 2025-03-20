// Capturamos los elementos del HTML
const boton = document.getElementById('start');
const texto = document.getElementById('texto');
const videoSeña = document.getElementById('videoSeña');

// Configuramos el reconocimiento de voz
const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES'; // Idioma español

boton.addEventListener('click', () => {
    reconocimiento.start(); // Inicia el reconocimiento de voz
});

reconocimiento.onresult = (event) => {
    const speechText = event.results[0][0].transcript.toLowerCase();
    texto.textContent = speechText;

    // Cambiamos el video según la palabra detectada
    if (speechText.includes("hola")) {
        actualizarVideo("Palabras/hola.mp4");
    } else if (speechText.includes("como estas")) {
        actualizarVideo("Palabras/como estas.mp4");
    } else {
        texto.textContent = "No se encontró una seña para esta palabra.";
    }
};

// Función para actualizar el video con repetición
function actualizarVideo(ruta) {
    videoSeña.src = ruta;  // Cambia el video
    videoSeña.load();  // Recarga el video
    videoSeña.play();  // Lo reproduce nuevamente
}
