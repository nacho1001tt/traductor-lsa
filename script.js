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

entradaTexto.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const userInput = entradaTexto.value.toLowerCase();
        texto.textContent = userInput;
        reproducirVideoSegunTexto(userInput);
    }
});

// Conjugaciones de verbos comunes
const conjugaciones = {
    dialogar: ["dialogo", "dialogás", "dialoga", "dialogamos", "dialogan", "dialogando", "dialogado", "dialogué"],
    hablar: ["hablo", "hablás", "habla", "hablamos", "hablan", "hablando", "hablado", "hablé"],
    decir: ["digo", "decís", "dice", "decimos", "dicen", "diciendo", "dicho", "dije"],
    contar: ["cuento", "contás", "cuenta", "contamos", "cuentan", "contando", "contado", "conté"],
    narrar: ["narro", "narrás", "narra", "narramos", "narran", "narrando", "narrado", "narré"],
    explicar: ["explico", "explicás", "explica", "explicamos", "explican", "explicando", "explicado", "expliqué"],
    estar: ["estoy", "estás", "está", "estamos", "están", "estando", "estado", "estuve"]
};

// Palabras fijas con sus nombres de archivo
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

// Letras del abecedario
const letras = ["a","b","c","d","e","f","g","h","i","j","k","l","ll","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z","ch"];

// Función principal que arma la lista de videos
function reproducirVideoSegunTexto(text) {
    const partes = text.split(/[,.;?!¿¡\s]+/).filter(Boolean);
    const videoPaths = [];

    // Frases completas especiales
    const frase = text.toLowerCase();
    if (frase.includes("hola, buen dia, cómo estas") || frase.includes("hola buen dia cómo estás")) {
        videoPaths.push("Palabras/hola.mp4", "Palabras/buendia.mp4", "Palabras/comoestas.mp4");
        reproducirVideosEnCadena(videoPaths);
        return;
    }

    for (let palabra of partes) {
        palabra = palabra.toLowerCase();

        // Frases fijas
        if (palabra === "hola") {
            videoPaths.push("Palabras/hola.mp4");
            continue;
        }
        if (palabra === "comoestas" || palabra === "cómoestás" || palabra === "como" || palabra === "estás") {
            videoPaths.push("Palabras/comoestas.mp4");
            continue;
        }
        if (palabra === "comotellamas" || palabra === "llamas") {
            videoPaths.push("Palabras/comotellamas.mp4");
            continue;
        }
        if (palabra === "luana" || palabra === "llamoluana") {
            videoPaths.push("Palabras/llamoluana.mp4");
            continue;
        }

        // Letras
        if (letras.includes(palabra)) {
            videoPaths.push(`Palabras/letra${palabra.toUpperCase()}.mp4`);
            continue;
        }

        // Conjugaciones
        let encontrado = false;
        for (let verbo in conjugaciones) {
            for (let forma of conjugaciones[verbo]) {
                if (palabra === forma) {
                    const nombreArchivo = (verbo === "contar" || verbo === "narrar")
                        ? "Contar o Narrar"
                        : verbo.charAt(0).toUpperCase() + verbo.slice(1);
                    videoPaths.push(`Palabras/${nombreArchivo}.mp4`);
                    encontrado = true;
                    break;
                }
            }
            if (encontrado) break;
        }
        if (encontrado) continue;

        // Palabras fijas
        for (let palabraFija in palabrasFijas) {
            if (palabra === palabraFija) {
                videoPaths.push(`Palabras/${palabrasFijas[palabraFija]}.mp4`);
                break;
            }
        }
    }

    if (videoPaths.length > 0) {
        reproducirVideosEnCadena(videoPaths);
    } else {
        videoSeña.style.display = "none";
    }
}

// Función que reproduce una lista de videos uno tras otro, con delay de 200 ms entre ellos
function reproducirVideosEnCadena(videoPaths) {
    let index = 0;

    function reproducirSiguiente() {
        if (index >= videoPaths.length) {
            videoSeña.style.display = "none";
            return;
        }

        videoSource.src = videoPaths[index];
        videoSeña.load();
        videoSeña.style.display = "block";
        videoSeña.play();

        videoSeña.onended = () => {
            setTimeout(() => {
                index++;
                reproducirSiguiente();
            }, 200); // Delay de 200ms
        };
    }

    reproducirSiguiente();
}
