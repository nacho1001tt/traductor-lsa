// Capturamos elementos del HTML
const videoSeña = document.getElementById('videoSeña');
const videoSource = document.getElementById('videoSource');
const entradaTexto = document.getElementById('entradaTexto');

// Inicializamos el video en muted para evitar bloqueo de autoplay
videoSeña.muted = true; 
videoSeña.style.display = "none";

// Función para reproducir un video dado su nombre
function reproducirVideo(nombreArchivo) {
    videoSource.src = `Palabras/${nombreArchivo}.mp4`; // ruta exacta
    videoSeña.load();
    videoSeña.style.display = "block";
    videoSeña.play()
        .then(() => console.log(`Reproduciendo: ${nombreArchivo}.mp4`))
        .catch(err => console.log("Error al reproducir video:", err));
}

// Detecta Enter en el input
entradaTexto.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        event.preventDefault();
        const palabra = entradaTexto.value.toLowerCase().trim();

        if(palabra === 'hola') {
            reproducirVideo('hola');
        } else {
            console.log(`No hay video para la palabra: "${palabra}"`);
        }

        entradaTexto.value = ""; // limpia el input
    }
});
