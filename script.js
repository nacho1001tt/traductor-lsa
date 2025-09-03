const videoSeña = document.getElementById('videoSeña');
const videoSource = document.getElementById('videoSource');
const entradaTexto = document.getElementById('entradaTexto');

entradaTexto.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        event.preventDefault();
        if(entradaTexto.value.toLowerCase() === 'hola') {
            videoSource.src = "Palabras/hola.mp4"; // asegurate que exista
            videoSeña.load();
            videoSeña.style.display = "block";
            videoSeña.play();
        }
    }
});
