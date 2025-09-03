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

// Configuramos el reconocimiento de voz
const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES'; // Idioma español

boton.addEventListener('click', () => {
    activarMicrofono();                    
    if (startText) startText.textContent = "Escuchando..."; 
    reconocimiento.start();                
});

reconocimiento.onresult = (event) => {
    const speechText = event.results[0][0].transcript.toLowerCase();
    mostrarTextoReconocido(speechText);
    procesarTextoSecuencial(speechText);
};

reconocimiento.onend = () => {
    desactivarMicrofono();
    if (startText) startText.textContent = "Hablar"; 
};

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
    dialogar: ["dialogar","dialogo","dialogás","dialogas","dialoga","dialogamos","dialogan","dialogué","dialogaste","dialogó","dialogamos","dialogaron","dialogaba","dialogabas","dialogábamos","dialogaban","dialogaré","dialogarás","dialogará","dialogaremos","dialogarán","dialogaría","dialogarías","dialogaríamos","dialogarían","dialogando","dialogado","he dialogado","hemos dialogado","han dialogado"],
    hablar: ["hablar","hablo","hablás","hablas","habla","hablamos","hablan","hablé","hablaste","habló","hablamos","hablaron","hablaba","hablabas","hablábamos","hablaban","hablaré","hablarás","hablará","hablaremos","hablarán","hablaría","hablarías","hablaríamos","hablarían","hablando","hablado","he hablado","hemos hablado","han hablado"],
    decir: ["decir","digo","decís","dices","dice","decimos","dicen","dije","dijiste","dijo","dijimos","dijeron","decía","decías","decíamos","decían","diré","dirás","dirá","diremos","dirán","diría","dirías","diríamos","dirían","diciendo","dicho","he dicho","hemos dicho","han dicho"],
    contar: ["contar","cuento","contás","contas","cuenta","contamos","cuentan","conté","contaste","contó","contamos","contaron","contaba","contabas","contábamos","contaban","contaré","contarás","contará","contaremos","contarán","contaría","contarías","contaríamos","contarían","contando","contado","he contado","hemos contado","han contado"],
    narrar: ["narrar","narro","narrás","narras","narra","narramos","narran","narré","narraste","narró","narramos","narraron","narraba","narrabas","narrábamos","narraban","narraré","narrarás","narrará","narraremos","narrarán","narrando","narrado","he narrado","hemos narrado","han narrado"],
    explicar: ["explicar","explico","explicás","explicas","explica","explicamos","explican","expliqué","explicaste","explicó","explicamos","explicaron","explicaba","explicabas","explicábamos","explicaban","explicaré","explicarás","explicará","explicaremos","explicarán","explicando","explicado","he explicado","hemos explicado","han explicado"],
    estar: ["estar","estoy","estás","está","estamos","están","estuve","estuviste","estuvo","estuvimos","estuvieron","estaba","estabas","estábamos","estaban","estaré","estarás","estará","estaremos","estarán","estando","estado","he estado","hemos estado","han estado"],
    apurar: ["apurar","apuro","apurás","apuras","apura","apuramos","apuran","apuré","apuraste","apuró","apuramos","apuraron","apuraba","apurabas","apurábamos","apuraban","apuraré","apurarás","apurará","apuraremos","apurarán","apuraría","apurarías","apuraríamos","apurarían","apurando","apurado","he apurado","hemos apurado","han apurado"],
    llegar: ["llegar","llego","llegás","llegas","llega","llegamos","llegan","llegué","llegaste","llegó","llegamos","llegaron","llegaba","llegabas","llegábamos","llegaban","llegaré","llegarás","llegará","llegaremos","llegarán","llegaría","llegarías","llegaríamos","llegarían","llegando","llegado","he llegado","hemos llegado","han llegado"]
};

// ==========================================================
// ==================  Palabras fijas  =======================
// ==========================================================
const palabrasFijas = {
    "lengua oral":"Lengua oral", "si":"Si","sí":"Si","no":"No","negar":"Negar",
    "también":"Tambien","tambien":"Tambien","tampoco":"Tampoco","yo":"Yo","vos":"Vos","ustedes":"Ustedes",
    "el":"El o Ella","ella":"El o Ella","nosotros":"Nosotros o Nosotras","nosotras":"Nosotros o Nosotras",
    "ayer":"ayer","hoy":"hoy","mañana":"mañana","manana":"mañana","año":"año","ano":"año",
    "año pasado":"año pasado","ano pasado":"año pasado","futuro":"futuro","pasado":"pasado",
    "último":"ultimo","ultimo":"ultimo","minuto":"minuto","hora":"hora","mes":"mes","semana":"semana",
    "domingo":"domingo","lunes":"lunes","martes":"martes","miércoles":"miercoles","miercoles":"miercoles",
    "jueves":"jueves","viernes":"viernes","sábado":"sabado","sabado":"sabado","mediodía":"mediodia","mediodia":"mediodia",
    "todavía":"todavia","todavia":"todavia","siempre":"siempre","rápido":"rapido","rapido":"rapido",
    "despacio":"despacio","temprano":"temprano","tarde":"tarde","hasta":"hasta","cerca":"cerca",
    "derecha":"derecha","izquierda":"izquierda","importante":"importante","limpio":"limpio",
    "hola":"hola"
};

// ==========================================================
// =========  Procesamiento secuencial (con frases) =========
// ==========================================================
function procesarTextoSecuencial(text){
    const palabras = text.split(" ");
    const videosAReproducir = [];

    // Frases fijas
    const frases = [
        ["como estas","Palabras/comoestas.mp4"],
        ["cómo estás","Palabras/comoestas.mp4"],
        ["vos cómo te llamas","Palabras/comotellamas.mp4"],
        ["cómo te llamas","Palabras/comotellamas.mp4"],
        ["me llamo luana","Palabras/llamoluana.mp4"],
        ["como quieres","Palabras/como quieres.mp4"],
        ["lo siento","Palabras/lo siento.mp4"],
        ["hace poco","Palabras/hace poco.mp4"],
        ["a veces","Palabras/a veces.mp4"],
        ["toda la noche","Palabras/toda la noche.mp4"],
        ["todos los dias","Palabras/todos los dias.mp4"],
        ["todos los días","Palabras/todos los dias.mp4"],
        ["primera vez","Palabras/primera vez.mp4"],
        ["año pasado","Palabras/año pasado.mp4"],
        ["ano pasado","Palabras/año pasado.mp4"]
    ];

    for(let [frase, archivo] of frases){
        if(text.includes(frase)) videosAReproducir.push(archivo);
    }

    // Palabras individuales
    const letras = ["a","b","c","d","e","f","g","h","i","j","k","l","ll","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z","ch"];
    for(let palabra of palabras){
        palabra = palabra.trim();

        if(letras.includes(palabra)) videosAReproducir.push(`Palabras/letra${palabra.toUpperCase()}.mp4`);

        for(let verbo in conjugaciones){
            if(conjugaciones[verbo].includes(palabra)){
                const nombreArchivo = (verbo==="contar"||verbo==="narrar")?"Contar o Narrar":verbo.charAt(0).toUpperCase()+verbo.slice(1);
                videosAReproducir.push(`Palabras/${nombreArchivo}.mp4`);
                break;
            }
        }

        if(palabrasFijas[palabra]) videosAReproducir.push(`Palabras/${palabrasFijas[palabra]}.mp4`);

        if(palabra==="anteayer"||palabra==="antayer") videosAReproducir.push("Palabras/antayer.mp4");
    }

    reproducirSecuencialmente(videosAReproducir);
}

// ==========================================================
// ==============  Reproducción secuencial  =================
// ==========================================================
let currentSpeed = (()=>{const sc=document.getElementById("speedControl");const val=sc?parseFloat(sc.value):NaN;return Number.isFinite(val)?val:0.75;})();

function reproducirSecuencialmente(lista){
    if(lista.length===0){videoSeña.style.display="none";return;}
    const path = lista.shift();
    videoSource.src=path;
    videoSeña.load();
    videoSeña.style.display="block";
    videoSeña.playbackRate=currentSpeed;
    setTimeout(()=>videoSeña.play(),50); // 🔹 fix Chrome/Edge
    videoSeña.onended=()=>setTimeout(()=>reproducirSecuencialmente(lista),100);
}

// ==========================================================
// =====================  Extras UI  ========================
// ==========================================================
const speedControl = document.getElementById("speedControl");
const speedValue = document.getElementById("speedValue");
if(speedValue && speedControl) speedValue.textContent=parseFloat(speedControl.value)+"x";
speedControl.addEventListener("input",()=>{
    currentSpeed=parseFloat(speedControl.value);
    videoSeña.playbackRate=currentSpeed;
    speedValue.textContent=currentSpeed+"x";
});

function activarMicrofono(){boton.classList.add("mic-active");}
function desactivarMicrofono(){boton.classList.remove("mic-active");}

function mostrarTextoReconocido(textoReconocido){
    texto.textContent=textoReconocido;
    texto.classList.add("glow");
    setTimeout(()=>texto.classList.remove("glow"),1000);
}

const contrastToggle = document.getElementById("contrastToggle");
contrastToggle.addEventListener("click",()=>document.body.classList.toggle("high-contrast"));
