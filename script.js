// Capturamos los elementos del HTML
const boton = document.getElementById('start');
const texto = document.getElementById('texto');
const imagenSeña = document.getElementById('imagenSeña');

// Configuramos el reconocimiento de voz
const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES'; // Idioma español

boton.addEventListener('click', () => {
    reconocimiento.start(); // Inicia el reconocimiento de voz
});

reconocimiento.onresult = (event) => {
    const speechText = event.results[0][0].transcript.toLowerCase();
    texto.textContent = speechText;

    // Cambiamos la imagen según la palabra detectada
    if (speechText.includes("hola")) {
        imagenSeña.src = "imagenes/hola.png";
    } else if (speechText.includes("gracias")) {
        imagenSeña.src = "imagenes/gracias.png";
    } else {
        imagenSeña.src = "imagenes/desconocido.png";
    }
};