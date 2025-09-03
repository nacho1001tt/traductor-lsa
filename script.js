// ==========================================================
// ==============  Traductor Voz/Text → Señas  ==============
// ==========================================================

// Capturamos los elementos del HTML
const boton = document.getElementById('start');
const texto = document.getElementById('texto');
const videoSeña = document.getElementById('videoSeña');
const videoSource = document.getElementById('videoSource');
const entradaTexto = document.getElementById('entradaTexto');
const startText = document.getElementById('startText'); // Texto del botón

// Ocultar el video al cargar la página
videoSeña.style.display = "none";

// Velocidad global inicial
let currentSpeed = 0.75;

// Configuramos el reconocimiento de voz
const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES'; // Idioma español

// ===== Eventos del botón de micrófono =====
boton.addEventListener('click', () => {
    activarMicrofono();
    if (startText) startText.textContent = "Escuchando...";
    reconocimiento.start();
});

// ===== Resultado del reconocimiento de voz =====
reconocimiento.onresult = (event) => {
    const speechText = event.results[0][0].transcript.toLowerCase();
    mostrarTextoReconocido(speechText);
    procesarTextoSecuencial(speechText);
};

// ===== Fin del reconocimiento =====
reconocimiento.onend = () => {
    desactivarMicrofono();
    if (startText) startText.textContent = "Hablar";
};

// ===== Input de texto =====
entradaTexto.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const userInput = entradaTexto.value.toLowerCase();
        mostrarTextoReconocido(userInput);
        procesarTextoSecuencial(userInput);
    }
});

// ==========================================================
// ===============  Conjugaciones por verbo  =================
// ==========================================================
const conjugaciones = {
    dialogar: [
        "dialogar","dialogo","dialogás","dialogas","dialoga","dialogamos","dialogan",
        "dialogué","dialogaste","dialogó","dialogamos","dialogaron",
        "dialogaba","dialogabas","dialogábamos","dialogaban",
        "dialogaré","dialogarás","dialogará","dialogaremos","dialogarán",
        "dialogaría","dialogarías","dialogaríamos","dialogarían",
        "dialogando","dialogado","he dialogado","hemos dialogado","han dialogado"
    ],
    hablar: [
        "hablar","hablo","hablás","hablas","habla","hablamos","hablan",
        "hablé","hablaste","habló","hablamos","hablaron",
        "hablaba","hablabas","hablábamos","hablaban",
        "hablaré","hablarás","hablará","hablaremos","hablarán",
        "hablaría","hablarías","hablaríamos","hablarían",
        "hablando","hablado","he hablado","hemos hablado","han hablado"
    ],
    decir: [
        "decir","digo","decís","dices","dice","decimos","dicen",
        "dije","dijiste","dijo","dijimos","dijeron",
        "decía","decías","decíamos","decían",
        "diré","dirás","dirá","diremos","dirán",
        "diría","dirías","diríamos","dirían",
        "diciendo","dicho","he dicho","hemos dicho","han dicho"
    ],
    contar: [
        "contar","cuento","contás","contas","cuenta","contamos","cuentan",
        "conté","contaste","contó","contamos","contaron",
        "contaba","contabas","contábamos","contaban",
        "contaré","contarás","contará","contaremos","contarán",
        "contaría","contarías","contaríamos","contarían",
        "contando","contado","he contado","hemos contado","han contado"
    ],
    narrar: [
        "narrar","narro","narrás","narras","narra","narramos","narran",
        "narré","narraste","narró","narramos","narraron",
        "narraba","narrabas","narrábamos","narraban",
        "narraré","narrarás","narrará","narraremos","narrarán",
        "narrando","narrado","he narrado","hemos narrado","han narrado"
    ],
    explicar: [
        "explicar","explico","explicás","explicas","explica","explicamos","explican",
        "expliqué","explicaste","explicó","explicamos","explicaron",
        "explicaba","explicabas","explicábamos","explicaban",
        "explicaré","explicarás","explicará","explicaremos","explicarán",
        "explicando","explicado","he explicado","hemos explicado","han explicado"
    ],
    estar: [
        "estar","estoy","estás","está","estamos","están",
        "estuve","estuviste","estuvo","estuvimos","estuvieron",
        "estaba","estabas","estábamos","estaban",
        "estaré","estarás","estará","estaremos","estarán",
        "estando","estado","he estado","hemos estado","han estado"
    ],
    apurar: [
        "apurar","apuro","apurás","apuras","apura","apuramos","apuran",
        "apuré","apuraste","apuró","apuramos","apuraron",
        "apuraba","apurabas","apurábamos","apuraban",
        "apuraré","apurarás","apurará","apuraremos","apurarán",
        "apuraría","apurarías","apuraríamos","apurarían",
        "apurando","apurado","he apurado","hemos apurado","han apurado"
    ],
    llegar: [
        "llegar","llego","llegás","llegas","llega","llegamos","llegan",
        "llegué","llegaste","llegó","llegamos","llegaron",
        "llegaba","llegabas","llegábamos","llegaban",
        "llegaré","llegarás","llegará","llegaremos","llegarán",
        "llegaría","llegarías","llegaríamos","llegarían",
        "llegando","llegado","he llegado","hemos llegado","han llegado"
    ]
};

// ==========================================================
// ==================  Palabras fijas  ======================
// ==========================================================
const palabrasFijas = {
    "lengua oral": "Lengua oral",
    "si": "Si", "sí": "Si",
    "no": "No",
    "negar": "Negar",
    "también": "Tambien", "tambien": "Tambien",
    "tampoco": "Tampoco",
    "yo": "Yo",
    "vos": "Vos",
    "ustedes": "Ustedes",
    "el": "El o Ella",
    "ella": "El o Ella",
    "nosotros": "Nosotros o Nosotras",
    "nosotras": "Nosotros o Nosotras",

    "ayer": "ayer",
    "hoy": "hoy",
    "mañana": "mañana", "manana": "mañana",
    "año": "año", "ano": "año",
    "año pasado": "año pasado", "ano pasado": "año pasado",
    "futuro": "futuro",
    "pasado": "pasado",
    "último": "ultimo", "ultimo": "ultimo",
    "minuto": "minuto",
    "hora": "hora",
    "mes": "mes",
    "semana": "semana",
    "domingo": "domingo",
    "lunes": "lunes",
    "martes": "martes",
    "miércoles": "miercoles", "miercoles": "miercoles",
    "jueves": "jueves",
    "viernes": "viernes",
    "sábado": "sabado", "sabado": "sabado",
    "mediodía": "mediodia", "mediodia": "mediodia",
    "todavía": "todavia", "todavia": "todavia",
    "siempre": "siempre",
    "rápido": "rapido", "rapido": "rapido",
    "despacio": "despacio",
    "temprano": "temprano",
    "tarde": "tarde",
    "hasta": "hasta",

    "cerca": "cerca",
    "derecha": "derecha",
    "izquierda": "izquierda",
    "importante": "importante",
    "limpio": "limpio",

    "hola": "hola"
};

// ==========================================================
// ========  Procesamiento secuencial del texto  ==========
// ==========================================================
function procesarTextoSecuencial(text) {
    const palabras = text.split(" ");
    const videosAReproducir = [];

    // ---- Frases multi-palabra ----
    const frases = [
        { frase: ["como estas","cómo estás"], archivo: "Palabras/comoestas.mp4" },
        { frase: ["vos cómo te llamas","cómo te llamas"], archivo: "Palabras/comotellamas.mp4" },
        { frase: ["me llamo luana"], archivo: "Palabras/llamoluana.mp4" },
        { frase: ["como quieres","cómo quieres"], archivo: "Palabras/como quieres.mp4" },
        { frase: ["lo siento"], archivo: "Palabras/lo siento.mp4" },
        { frase: ["hace poco"], archivo: "Palabras/hace poco.mp4" },
        { frase: ["a veces"], archivo: "Palabras/a veces.mp4" },
        { frase: ["toda la noche"], archivo: "Palabras/toda la noche.mp4" },
        { frase: ["todos los dias","todos los días"], archivo: "Palabras/todos los dias.mp4" },
        { frase: ["primera vez"], archivo: "Palabras/primera vez.mp4" },
        { frase: ["año pasado","ano pasado"], archivo: "Palabras/año pasado.mp4" }
    ];

    frases.forEach(f => {
        f.frase.forEach(fx => {
            if (text.includes(fx)) {
                videosAReproducir.push(f.archivo);
            }
        });
    });

    // ---- Palabras individuales ----
    palabras.forEach(palabraRaw => {
        let palabra = palabraRaw.trim();

        // Letras
        const letras = ["a","b","c","d","e","f","g","h","i","j","k","l","ll","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z","ch"];
        if (letras.includes(palabra)) {
            videosAReproducir.push(`Palabras/letra${palabra.toUpperCase()}.mp4`);
            return;
        }

        // Verbos conjugados
        for (let verbo in conjugaciones) {
            if (conjugaciones[verbo].includes(palabra)) {
                const nombreArchivo = (verbo === "contar" || verbo === "narrar") ? "Contar o Narrar" : verbo.charAt(0).toUpperCase() + verbo.slice(1);
                videosAReproducir.push(`Palabras/${nombreArchivo}.mp4`);
                break;
            }
        }

        // Palabras fijas
        for (let fija in palabrasFijas) {
            if (palabra === fija) {
                videosAReproducir.push(`Palabras/${palabrasFijas[fija]}.mp4`);
                break;
            }
        }

        // Palabras sueltas como archivos exactos
        const archivosUnaPalabra = [
            "ayer","hoy","mañana","manana","futuro","pasado","ultimo","último",
            "minuto","hora","mes","semana","domingo","lunes","martes",
            "miercoles","miércoles","jueves","viernes","sabado","sábado",
            "mediodia","mediodía","todavia","todavía","siempre","rapido","rápido",
            "despacio","temprano","tarde","cerca","derecha","izquierda",
            "importante","limpio"
        ];

        if (archivosUnaPalabra.includes(palabra)) {
            const normalizaciones = {
                "manana":"mañana",
                "miercoles":"miercoles",
                "miércoles":"miercoles",
                "sabado":"sabado",
                "sábado":"sabado",
                "mediodía":"mediodia",
                "todavía":"todavia",
                "rápido":"rapido",
                "último":"ultimo"
            };
            const nombre = normalizaciones[palabra] || palabra;
            videosAReproducir.push(`Palabras/${nombre}.mp4`);
            return;
        }

        // Variantes de anteayer
        if (palabra === "anteayer" || palabra === "antayer") {
            videosAReproducir.push("Palabras/antayer.mp4");
            return;
        }
    });

    console.log("Videos a reproducir:", videosAReproducir); // Debug

    reproducirSecuencialmente(videosAReproducir);
}

// ==========================================================
// ==============  Reproducción secuencial  =================
// ==========================================================
function reproducirSecuencialmente(lista) {
    if (lista.length === 0) {
        videoSeña.style.display = "none";
        return;
    }

    const path = lista.shift();
    videoSource.src = path;
    videoSeña.load(); // 🔹 Recargar antes de reproducir
    videoSeña.style.display = "block";
    videoSeña.playbackRate = currentSpeed;

    videoSeña.onended = () => {
        setTimeout(() => {
            reproducirSecuencialmente(lista);
        }, 100);
    };
    videoSeña.play();
}

// ==========================================================
// ================== BLOQUE EXTRA AGREGADO =================
// ==========================================================

// 🎚 Control de velocidad
const speedControl = document.getElementById("speedControl");
const speedValue = document.getElementById("speedValue");

if (speedValue && speedControl) {
    speedValue.textContent = parseFloat(speedControl.value) + "x";
}

speedControl.addEventListener("input", () => {
    currentSpeed = parseFloat(speedControl.value);
    videoSeña.playbackRate = currentSpeed;
    speedValue.textContent = currentSpeed + "x";
});

// 🎤 Indicador de micrófono
function activarMicrofono() { boton.classList.add("mic-active"); }
function desactivarMicrofono() { boton.classList.remove("mic-active"); }

// ✨ Glow en el texto cuando hay input
function mostrarTextoReconocido(textoReconocido) {
    texto.textContent = textoReconocido;
    texto.classList.add("glow");
    setTimeout(() => texto.classList.remove("glow"), 1000);
}

// ♿ Toggle de alto contraste
const contrastToggle = document.getElementById("contrastToggle");
contrastToggle.addEventListener("click", () => {
    document.body.classList.toggle("high-contrast");
});
