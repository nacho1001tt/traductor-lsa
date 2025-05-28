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

// Lista de conjugaciones por palabra clave
const conjugaciones = {
    dialogar: [
        "dialogo", "dialogas", "dialoga", "dialogamos", "dialogan",
        "dialogué", "dialogaste", "dialogó", "dialogamos", "dialogaron",
        "dialogaba", "dialogabas", "dialogábamos", "dialogaban",
        "dialogaré", "dialogarás", "dialogará", "dialogaremos", "dialogarán",
        "dialogaría", "dialogarías", "dialogaríamos", "dialogarían",
        "dialogando", "dialogado"
    ],
    hablar: [
        "hablo", "hablas", "habla", "hablamos", "hablan",
        "hablé", "hablaste", "habló", "hablamos", "hablaron",
        "hablaba", "hablabas", "hablábamos", "hablaban",
        "hablaré", "hablarás", "hablará", "hablaremos", "hablarán",
        "hablaría", "hablarías", "hablaríamos", "hablarían",
        "hablando", "hablado"
    ],
    decir: [
        "digo", "dices", "dice", "decimos", "dicen",
        "dije", "dijiste", "dijo", "dijimos", "dijeron",
        "decía", "decías", "decíamos", "decían",
        "diré", "dirás", "dirá", "diremos", "dirán",
        "diría", "dirías", "diríamos", "dirían",
        "diciendo", "dicho"
    ],
    contar: [
        "cuento", "cuentas", "cuenta", "contamos", "cuentan",
        "conté", "contaste", "contó", "contamos", "contaron",
        "contaba", "contabas", "contábamos", "contaban",
        "contaré", "contarás", "contará", "contaremos", "contarán",
        "contaría", "contarías", "contaríamos", "contarían",
        "contando", "contado"
    ],
    narrar: [
        "narro", "narras", "narra", "narramos", "narran",
        "narré", "narraste", "narró", "narramos", "narraron",
        "narraba", "narrabas", "narrábamos", "narraban",
        "narraré", "narrarás", "narrará", "narraremos", "narrarán",
        "narrando", "narrado"
    ],
    explicar: [
        "explico", "explicas", "explica", "explicamos", "explican",
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

// Palabras base sin conjugaciones
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

// Función que busca coincidencia en conjugaciones
function contieneConjugacion(texto, verbo) {
    const formas = conjugaciones[verbo];
    return formas.some(f => texto.includes(f));
}

function reproducirVideoSegunTexto(text) {
    let videoPath = "";

    // Frases fijas
    if (text.includes("hola")) {
        videoPath = "Palabras/hola.mp4";
    } else if (text.includes("como estas") || text.includes("cómo estás")) {
        videoPath = "Palabras/comoestas.mp4";
    } else if (text.includes("vos cómo te llamas") || text.includes("cómo te llamas")) {
        videoPath = "Palabras/comotellamas.mp4";
    } else if (text.includes("me llamo luana")) {
        videoPath = "Palabras/llamoluana.mp4";
    }

    // Letras del abecedario
    const letras = ["a","b","c","d","e","f","g","h","i","j","k","l","ll","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z","ch"];
    letras.forEach(letra => {
        if (text === letra || text === `letra ${letra}`) {
            videoPath = `Palabras/letra${letra.toUpperCase()}.mp4`;
        }
    });

    // Buscar conjugaciones
    for (let verbo in conjugaciones) {
        if (contieneConjugacion(text, verbo)) {
            const nombreArchivo = verbo === "contar" || verbo === "narrar" ? "Contar o Narrar" : verbo.charAt(0).toUpperCase() + verbo.slice(1);
            videoPath = `Palabras/${nombreArchivo}.mp4`;
        }
    }

    // Palabras fijas sin conjugación
    for (let palabra in palabrasFijas) {
        if (text.includes(palabra)) {
            videoPath = `Palabras/${palabrasFijas[palabra]}.mp4`;
        }
    }

    // Reproducir video
    if (videoPath) {
        videoSource.src = videoPath;
        videoSeña.load();
        videoSeña.style.display = "block";
        videoSeña.play();
    } else {
        videoSeña.style.display = "none";
    }
}
