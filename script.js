// Capturamos los elementos del HTML
const boton = document.getElementById('start');
const texto = document.getElementById('texto');
const videoSeña = document.getElementById('videoSeña');
const videoSource = document.getElementById('videoSource');
const entradaTexto = document.getElementById('entradaTexto');

// Ocultar el video al cargar la página
videoSeña.style.display = "none";

// Configuración del reconocimiento de voz
const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES';

boton.addEventListener('click', () => {
    reconocimiento.start();
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

// Lista completa de conjugaciones por verbo
const conjugaciones = {
    dialogar: [
        "dialogo", "dialogás", "dialogas", "dialoga", "dialogamos", "dialogan",
        "dialogué", "dialogaste", "dialogó", "dialogamos", "dialogaron",
        "dialogaba", "dialogabas", "dialogábamos", "dialogaban",
        "dialogaré", "dialogarás", "dialogará", "dialogaremos", "dialogarán",
        "dialogaría", "dialogarías", "dialogaríamos", "dialogarían",
        "dialogando", "dialogado"
    ],
    hablar: [
        "hablo", "hablás", "hablas", "habla", "hablamos", "hablan",
        "hablé", "hablaste", "habló", "hablamos", "hablaron",
        "hablaba", "hablabas", "hablábamos", "hablaban",
        "hablaré", "hablarás", "hablará", "hablaremos", "hablarán",
        "hablaría", "hablarías", "hablaríamos", "hablarían",
        "hablando", "hablado"
    ],
    decir: [
        "digo", "decís", "dices", "dice", "decimos", "dicen",
        "dije", "dijiste", "dijo", "dijimos", "dijeron",
        "decía", "decías", "decíamos", "decían",
        "diré", "dirás", "dirá", "diremos", "dirán",
        "diría", "dirías", "diríamos", "dirían",
        "diciendo", "dicho"
    ],
    contar: [
        "cuento", "contás", "contas", "cuenta", "contamos", "cuentan",
        "conté", "contaste", "contó", "contamos", "contaron",
        "contaba", "contabas", "contábamos", "contaban",
        "contaré", "contarás", "contará", "contaremos", "contarán",
        "contaría", "contarías", "contaríamos", "contarían",
        "contando", "contado"
    ],
    narrar: [
        "narro", "narrás", "narras", "narra", "narramos", "narran",
        "narré", "narraste", "narró", "narramos", "narraron",
        "narraba", "narrabas", "narrábamos", "narraban",
        "narraré", "narrarás", "narrará", "narraremos", "narrarán",
        "narrando", "narrado"
    ],
    explicar: [
        "explico", "explicás", "explicas", "explica", "explicamos", "explican",
        "expliqué", "explicaste", "explicó", "explicamos", "explicaron",
        "explicaba", "explicabas", "explicábamos", "explicaban",
        "explicaré", "explicarás", "explicará", "explicaremos", "explicarán",
        "explicando", "explicado"
    ],
    estar: [
        "estoy", "estás", "está", "estamos", "están",
        "estuve", "estuviste", "estuvo", "estuvimos", "estuvieron",
        "estaba", "estabas", "estábamos", "estaban",
        "estaré", "estarás", "estará", "estaremos", "estarán",
        "estando", "estado"
    ]
};

// Palabras fijas sin conjugación
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
    el: "El o Ella",
    ella: "El o Ella",
    nosotros: "Nosotros o Nosotras",
    nosotras: "Nosotros o Nosotras"
};

// Letras del abecedario
const letras = ["a","b","c","d","e","f","g","h","i","j","k","l","ll","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z","ch"];

// Función principal
function reproducirVideoSegunTexto(text) {
    const palabras = text.split(/[\s,;?.!¡¿]+/).filter(Boolean);
    const videoPaths = [];

    for (let palabra of palabras) {
        palabra = palabra.toLowerCase();

        // Frases completas
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
        let detectado = false;
        for (let verbo in conjugaciones) {
            if (conjugaciones[verbo].includes(palabra)) {
                const nombreArchivo = (verbo === "contar" || verbo === "narrar") ? "Contar o Narrar" : verbo.charAt(0).toUpperCase() + verbo.slice(1);
                videoPaths.push(`Palabras/${nombreArchivo}.mp4`);
                detectado = true;
                break;
            }
        }
        if (detectado) continue;

        // Palabras fijas
        for (let clave in palabrasFijas) {
            if (palabra === clave) {
                videoPaths.push(`Palabras/${palabrasFijas[clave]}.mp4`);
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

// Función para reproducir los videos uno tras otro con delay
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
            }, 200);
        };
    }

    reproducirSiguiente();
}
