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

    procesarTextoSecuencial(speechText);

};



entradaTexto.addEventListener('keypress', (event) => {

    if (event.key === 'Enter') {

        event.preventDefault();

        const userInput = entradaTexto.value.toLowerCase();

        texto.textContent = userInput;

        procesarTextoSecuencial(userInput);

    }

});



// Lista completa de conjugaciones por verbo

const conjugaciones = {

    dialogar: [

        "dialogar", "dialogo", "dialogás", "dialogas", "dialoga", "dialogamos", "dialogan",

        "dialogué", "dialogaste", "dialogó", "dialogamos", "dialogaron",

        "dialogaba", "dialogabas", "dialogábamos", "dialogaban",

        "dialogaré", "dialogarás", "dialogará", "dialogaremos", "dialogarán",

        "dialogaría", "dialogarías", "dialogaríamos", "dialogarían",

        "dialogando", "dialogado", "dialogaré", "he dialogado", "hemos dialogado", "han dialogado"

    ],

    hablar: [

        "hablar", "hablo", "hablás", "hablas", "habla", "hablamos", "hablan",

        "hablé", "hablaste", "habló", "hablamos", "hablaron",

        "hablaba", "hablabas", "hablábamos", "hablaban",

        "hablaré", "hablarás", "hablará", "hablaremos", "hablarán",

        "hablaría", "hablarías", "hablaríamos", "hablarían",

        "hablando", "hablado", "he hablado", "hemos hablado", "han hablado"

    ],

    decir: [

        "decir", "digo", "decís", "dices", "dice", "decimos", "dicen",

        "dije", "dijiste", "dijo", "dijimos", "dijeron",

        "decía", "decías", "decíamos", "decían",

        "diré", "dirás", "dirá", "diremos", "dirán",

        "diría", "dirías", "diríamos", "dirían",

        "diciendo", "dicho", "he dicho", "hemos dicho", "han dicho"

    ],

    contar: [

        "contar", "cuento", "contás", "contas", "cuenta", "contamos", "cuentan",

        "conté", "contaste", "contó", "contamos", "contaron",

        "contaba", "contabas", "contábamos", "contaban",

        "contaré", "contarás", "contará", "contaremos", "contarán",

        "contaría", "contarías", "contaríamos", "contarían",

        "contando", "contado", "he contado", "hemos contado", "han contado"

    ],

    narrar: [

        "narrar", "narro", "narrás", "narras", "narra", "narramos", "narran",

        "narré", "narraste", "narró", "narramos", "narraron",

        "narraba", "narrabas", "narrábamos", "narraban",

        "narraré", "narrarás", "narrará", "narraremos", "narrarán",

        "narrando", "narrado", "he narrado", "hemos narrado", "han narrado"

    ],

    explicar: [

        "explicar", "explico", "explicás", "explicas", "explica", "explicamos", "explican",

        "expliqué", "explicaste", "explicó", "explicamos", "explicaron",

        "explicaba", "explicabas", "explicábamos", "explicaban",

        "explicaré", "explicarás", "explicará", "explicaremos", "explicarán",

        "explicando", "explicado", "he explicado", "hemos explicado", "han explicado"

    ],

    estar: [

        "estar", "estoy", "estás", "está", "estamos", "están",

        "estuve", "estuviste", "estuvo", "estuvimos", "estuvieron",

        "estaba", "estabas", "estábamos", "estaban",

        "estaré", "estarás", "estará", "estaremos", "estarán",

        "estando", "estado", "he estado", "hemos estado", "han estado"

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

    "el": "El o Ella",

    "ella": "El o Ella",

    "nosotros": "Nosotros o Nosotras",

    "nosotras": "Nosotros o Nosotras"

};



// Estructura secuencial con delay de 100ms

function procesarTextoSecuencial(text) {

    const palabras = text.split(" ");

    const videosAReproducir = [];



    for (let palabra of palabras) {

        palabra = palabra.trim();



        // Frases fijas

        if (palabra === "hola") {

            videosAReproducir.push("Palabras/hola.mp4");

            continue;

        }

        if (text.includes("como estas") || text.includes("cómo estás")) {

            videosAReproducir.push("Palabras/comoestas.mp4");

            continue;

        }

        if (text.includes("vos cómo te llamas") || text.includes("cómo te llamas")) {

            videosAReproducir.push("Palabras/comotellamas.mp4");

            continue;

        }

        if (text.includes("me llamo luana")) {

            videosAReproducir.push("Palabras/llamoluana.mp4");

            continue;

        }



        // Letras

        const letras = ["a","b","c","d","e","f","g","h","i","j","k","l","ll","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z","ch"];

        if (letras.includes(palabra)) {

            videosAReproducir.push(`Palabras/letra${palabra.toUpperCase()}.mp4`);

            continue;

        }



        // Verbo conjugado

        for (let verbo in conjugaciones) {

            if (conjugaciones[verbo].includes(palabra)) {

                const nombreArchivo = (verbo === "contar" || verbo === "narrar")

                    ? "Contar o Narrar"

                    : verbo.charAt(0).toUpperCase() + verbo.slice(1);

                videosAReproducir.push(`Palabras/${nombreArchivo}.mp4`);

                break;

            }

        }



        // Palabras fijas sueltas

        for (let fija in palabrasFijas) {

            if (palabra === fija) {

                videosAReproducir.push(`Palabras/${palabrasFijas[fija]}.mp4`);

                break;

            }

        }

    }



    reproducirSecuencialmente(videosAReproducir);

}



// Reproduce los videos uno tras otro con delay de 100ms

function reproducirSecuencialmente(lista) {

    if (lista.length === 0) {

        videoSeña.style.display = "none";

        return;

    }



    const path = lista.shift();

    videoSource.src = path;

    videoSeña.load();

    videoSeña.style.display = "block";

    videoSeña.onended = () => {

        setTimeout(() => {

            reproducirSecuencialmente(lista);

        }, 100); // delay de 100ms

    };

    videoSeña.play();

                       l
