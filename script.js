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

function mostrarSeña(speechText) {
    let nombreArchivo = "desconocido.gif";

    if (speechText.includes("hola")) {
        nombreArchivo = "hola.gif";
    } else if (speechText.includes("gracias")) {
        nombreArchivo = "como estas.gif";
    }

    function reproducirGif() {
        imagenSeña.src = "imagenes/" + nombreArchivo;
        setTimeout(() => {
            imagenSeña.src = ""; // Borra la imagen para reiniciar el GIF
            setTimeout(() => {
                imagenSeña.src = "imagenes/" + nombreArchivo; // Segunda repetición del GIF
                setTimeout(() => {
                    imagenSeña.src = ""; // Borra la imagen tras la segunda repetición
                }, 200); // Delay de 200 ms después de la segunda repetición
            }, 100); // Pequeña pausa antes de la segunda repetición
        }, 1000); // Ajusta este tiempo según la duración de los GIFs
    }

    reproducirGif();
}

reconocimiento.onresult = (event) => {
    const speechText = event.results[0][0].transcript.toLowerCase();
    texto.textContent = speechText;
    
    setTimeout(() => {
        mostrarSeña(speechText);
    }, 200); // Delay de 200 ms entre palabras
};
