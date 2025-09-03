// Elementos del DOM
const boton = document.getElementById('start');
const entradaTexto = document.getElementById('entradaTexto');
const texto = document.getElementById('texto');
const videoSeña = document.getElementById('videoSeña');
const videoSource = document.getElementById('videoSource');
const startText = document.getElementById('startText');

videoSeña.style.display = "none";

// Configuración de velocidad
const speedControl = document.getElementById("speedControl");
const speedValue = document.getElementById("speedValue");
let currentSpeed = parseFloat(speedControl.value) || 0.75;
speedValue.textContent = currentSpeed + "x";

speedControl.addEventListener("input", () => {
    currentSpeed = parseFloat(speedControl.value);
    videoSeña.playbackRate = currentSpeed;
    speedValue.textContent = currentSpeed + "x";
});

// Micrófono activo/desactivo
function activarMicrofono() { boton.classList.add("mic-active"); }
function desactivarMicrofono() { boton.classList.remove("mic-active"); }

// Mostrar texto reconocido
function mostrarTextoReconocido(t) {
    texto.textContent = t;
    texto.classList.add("glow");
    setTimeout(() => texto.classList.remove("glow"), 1000);
}

// ==== Reconocimiento de voz ====
const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES';

boton.addEventListener('click', () => {
    reconocimiento.start();
    activarMicrofono();
    if(startText) startText.textContent = "Escuchando...";
});

reconocimiento.onresult = (event) => {
    const speechText = event.results[0][0].transcript;
    mostrarTextoReconocido(speechText);
    procesarTextoSecuencial(speechText);
};

reconocimiento.onend = () => {
    desactivarMicrofono();
    if(startText) startText.textContent = "Hablar";
};

// ==== Entrada de texto ====
entradaTexto.addEventListener('keypress', (e) => {
    if(e.key === "Enter") {
        e.preventDefault();
        const userInput = entradaTexto.value;
        mostrarTextoReconocido(userInput);
        procesarTextoSecuencial(userInput);
    }
});

// ==== Funciones de normalización de texto ====
function limpiarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/[.,!?]/g,"")
        .trim();
}

// ==== Lista completa de palabras y verbos con conjugaciones ====
const videos = {
    "hablar": ["hablar","hablo","hablas","habla","hablamos","habláis","hablan","hablé","hablaste","habló","hablamos","hablasteis","hablaron","hablaré","hablarás","hablará","hablaremos","hablaréis","hablarán","hablando","hablado"],
    "decir": ["decir","digo","dices","dice","decimos","decís","dicen","dije","dijiste","dijo","dijimos","dijisteis","dijeron","diré","dirás","dirá","diremos","diréis","dirán","diciendo","dicho"],
    "contar o narrar": ["contar o narrar","cuento","cuentas","cuenta","contamos","contáis","cuentan","conté","contaste","contó","contamos","contasteis","contaron","contaré","contarás","contará","contaremos","contaréis","contarán","contando","contado"],
    "estar": ["estar","estoy","estás","está","estamos","estáis","están","estuve","estuviste","estuvo","estuvimos","estuvisteis","estuvieron","estaré","estarás","estará","estaremos","estaréis","estarán","estando","estado"],
    "explicar": ["explicar","explico","explicas","explica","explicamos","explicáis","explican","expliqué","explicaste","explicó","explicamos","explicasteis","explicaron","explicaré","explicarás","explicará","explicaremos","explicaréis","explicarán","explicando","explicado"],
    "negar": ["negar","niego","niegas","niega","negamos","negáis","niegan","negué","negaste","negó","negamos","negasteis","negaron","negaré","negarás","negará","negaremos","negaréis","negarán","negando","negado"],
    "apurar": ["apurar","apuro","apuras","apura","apuramos","apuráis","apuran","apuré","apuraste","apuró","apuramos","apurasteis","apuraron","apuraré","apurarás","apurará","apuraremos","apuraréis","apurarán","apurando","apurado"],
    "llegar":["llegar","llego","llegas","llega","llegamos","llegáis","llegan","llegué","llegaste","llegó","llegamos","llegasteis","llegaron","llegaré","llegarás","llegará","llegaremos","llegaréis","llegarán","llegando","llegado"],

    // Pronombres, adverbios, sustantivos y letras
    "no":["no"], "si":["si","sí"], "tambien":["tambien","también"], "tampoco":["tampoco"], "yo":["yo"], "vos":["vos"], "ustedes":["ustedes"], "nosotros o nosotras":["nosotros o nosotras"],
    "a veces":["a veces"], "anteayer":["anteayer"], "ayer":["ayer"], "año pasado":["año pasado"], "año":["año"], "cerca":["cerca"], "como estas":["como estas","cómo estás"], "como quieras":["como quieras"], 
    "comoestas":["comoestas"], "comotellamas":["comotellamas","cómo te llamas"], "derecha":["derecha"], "despacio":["despacio"], "después":["después"], "domingo":["domingo"], 
    "enseguida":["enseguida"], "futuro":["futuro"], "hace poco":["hace poco"], "hasta":["hasta"], "hola":["hola"], "hora":["hora"], "hoy":["hoy"], "importante":["importante"], "izquierda":["izquierda"], 
    "jamás":["jamás"], "jueves":["jueves"], "limpio":["limpio"], "llamoluana":["llamoluana"], "lo siento":["lo siento"], "lunes":["lunes"], "martes":["martes"], "mañana":["mañana"], "mediodía":["mediodía"], 
    "mes":["mes"], "minuto":["minuto"], "miércoles":["miércoles"], "pasado":["pasado"], "primeravez":["primeravez"], "rápido":["rápido"], "sabado":["sabado"], "semana":["semana"], "siempre":["siempre"], 
    "tarde":["tarde"], "temprano":["temprano"], "tiempo":["tiempo"], "todalanoche":["todalanoche"], "todavía":["todavía"], "todoslosdias":["todoslosdias"], "viernes":["viernes"], "último":["último"],
    // Letras
    "letraA":["letraA"], "letraB":["letraB"], "letraC":["letraC"], "letraCH":["letraCH"], "letraD":["letraD"], "letraE":["letraE"], "letraF":["letraF"], "letraG":["letraG"], "letraH":["letraH"], "letraI":["letraI"], "letraJ":["letraJ"], "letraK":["letraK"], "letraL":["letraL"], 
    "letraLL":["letraLL"], "letraM":["letraM"], "letraN":["letraN"], "letraO":["letraO"], "letraP":["letraP"], "letraQ":["letraQ"], "letraR":["letraR"], "letraS":["letraS"], "letraT":["letraT"], "letraU":["letraU"], 
    "letraV":["letraV"], "letraW":["letraW"], "letraX":["letraX"], "letraY":["letraY"], "letraZ":["letraZ"], "letraÑ":["letraÑ"]
};

// ==== Función principal ====
function procesarTextoSecuencial(textoRaw) {
    if(!textoRaw) return;

    const text = limpiarTexto(textoRaw);
    const palabras = text.split(" ").filter(p => p.trim() !== "");

    const videosAReproducir = [];

    palabras.forEach(p => {
        for(const key in videos){
            if(videos[key].includes(p)){
                videosAReproducir.push(`Palabras/${encodeURIComponent(key)}.mp4`);
                break;
            }
        }
    });

    reproducirSecuencial(videosAReproducir);
}

// ==== Reproducción secuencial ====
function reproducirSecuencial(lista) {
    if(lista.length === 0){
        videoSeña.style.display = "none";
        return;
    }

    const path = lista.shift();
    videoSource.src = path;
    videoSeña.load();
    videoSeña.style.display = "block";
    videoSeña.playbackRate = currentSpeed;
    videoSeña.play();

    videoSeña.onended = () => {
        setTimeout(() => reproducirSecuencial(lista), 200);
    };
}

// ==== Alto contraste ====
const contrastToggle = document.getElementById("contrastToggle");
contrastToggle.addEventListener("click", () => document.body.classList.toggle("high-contrast"));
