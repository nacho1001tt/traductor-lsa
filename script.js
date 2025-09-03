// =============================
// Utilidades de normalización
// =============================
function limpiarTexto(t) {
  return (t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[.,!?;:()"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
const norm = s => limpiarTexto(s).replace(/\s+/g, ""); // sin espacios

// =============================
// DOM
// =============================
const boton = document.getElementById("start");
const entradaTexto = document.getElementById("entradaTexto");
const texto = document.getElementById("texto");
const video = document.getElementById("videoSena");   // <- id sin ñ
const videoSource = document.getElementById("videoSource"); // no lo usamos para cargar (dejado por compat)

video.style.display = "none";

// Velocidad
const speedControl = document.getElementById("speedControl");
const speedValue = document.getElementById("speedValue");
let currentSpeed = parseFloat(speedControl.value) || 0.75;
speedValue.textContent = currentSpeed + "x";
speedControl.addEventListener("input", () => {
  currentSpeed = parseFloat(speedControl.value);
  video.playbackRate = currentSpeed;
  speedValue.textContent = currentSpeed + "x";
});

// Mic
function activarMicrofono(){ boton.classList.add("mic-active"); }
function desactivarMicrofono(){ boton.classList.remove("mic-active"); }

// Glow texto
function mostrarTextoReconocido(t) {
  texto.textContent = t;
  texto.classList.add("glow");
  setTimeout(() => texto.classList.remove("glow"), 700);
}

// Alto contraste
document.getElementById("contrastToggle")
  .addEventListener("click", () => document.body.classList.toggle("high-contrast"));

// =============================
// SpeechRecognition (opcional)
// =============================
let reconocimiento = null;
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  reconocimiento = new SR();
  reconocimiento.lang = "es-ES";
  reconocimiento.onresult = (e) => {
    const speechText = e.results[0][0].transcript || "";
    mostrarTextoReconocido(speechText);
    procesarTexto(speechText);
  };
  reconocimiento.onend = () => {
    desactivarMicrofono();
    const st = document.getElementById("startText");
    if (st) st.textContent = "Hablar";
  };
}

boton.addEventListener("click", () => {
  activarMicrofono();
  const st = document.getElementById("startText");
  if (st) st.textContent = "Escuchando...";
  if (reconocimiento) reconocimiento.start();
});

// Entrada texto
entradaTexto.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const t = entradaTexto.value || "";
    mostrarTextoReconocido(t);
    procesarTexto(t);
  }
});

// ==========================================
// Mapeo de archivos EXACTOS y disparadores
// ==========================================

// Lista EXACTA de archivos según tu carpeta
const FILES = [
  "Contar o Narrar.mp4","Decir.mp4","Dialogar.mp4","El o Ella.mp4","Estar.mp4","Explicar.mp4",
  "Hablar.mp4","Lengua oral.mp4","Negar.mp4","No.mp4","Nosotros o Nosotras.mp4","Si.mp4",
  "Tambien.mp4","Tampoco.mp4","Ustedes.mp4","Vos.mp4","Yo.mp4",
  "a veces.mp4","anteayer.mp4","apurar.mp4","ayer.mp4","año pasado.mp4","año.mp4","cerca.mp4",
  "como estas.mp4","como quieras.mp4","comoestas.mp4","comotellamas.mp4","derecha.mp4","despacio.mp4",
  "después.mp4","domingo.mp4","enseguida.mp4","futuro.mp4","hace poco.mp4","hasta.mp4","hola.mp4",
  "hora.mp4","hoy.mp4","importante.mp4","izquierda.mp4","jamás.mp4","jueves.mp4",
  "letraA.mp4","letraB.mp4","letraC.mp4","letraCH.mp4","letraD.mp4","letraE.mp4","letraF.mp4","letraG.mp4",
  "letraH.mp4","letraI.mp4","letraJ.mp4","letraK.mp4","letraL.mp4","letraLL.mp4","letraM.mp4",
  "letraN.mp4","letraO.mp4","letraP.mp4","letraQ.mp4","letraR.mp4","letraS.mp4","letraT.mp4",
  "letraU.mp4","letraV.mp4","letraW.mp4","letraX.mp4","letraY.mp4","letraZ.mp4","letraÑ.mp4",
  "limpio.mp4","llamoluana.mp4","llegar.mp4","lo siento.mp4","lunes.mp4","martes.mp4","mañana.mp4",
  "mediodía.mp4","mes.mp4","minuto.mp4","miércoles.mp4","pasado.mp4","primeravez.mp4","rápido.mp4",
  "sabado.mp4","semana.mp4","siempre.mp4","tarde.mp4","temprano.mp4","tiempo.mp4","todalanoche.mp4",
  "todavía.mp4","todoslosdias.mp4","viernes.mp4","último.mp4"
];

// Diccionario de disparadores → archivo
// Clave SIEMPRE normalizada sin espacios ni acentos (norm(...))
const MAP = new Map();

// Helper para registrar
function addTrigger(trigger, filename) { MAP.set(norm(trigger), filename); }

// Palabras/Frases sueltas (no verbos)
addTrigger("hola","hola.mp4");
addTrigger("si","Si.mp4"); addTrigger("sí","Si.mp4");
addTrigger("no","No.mp4");
addTrigger("tambien","Tambien.mp4"); addTrigger("también","Tambien.mp4");
addTrigger("tampoco","Tampoco.mp4");

addTrigger("yo","Yo.mp4");
addTrigger("vos","Vos.mp4");
addTrigger("ustedes","Ustedes.mp4");
addTrigger("el","El o Ella.mp4"); addTrigger("ella","El o Ella.mp4"); addTrigger("él","El o Ella.mp4");
addTrigger("nosotros","Nosotros o Nosotras.mp4"); addTrigger("nosotras","Nosotros o Nosotras.mp4");

addTrigger("lengua oral","Lengua oral.mp4");

addTrigger("a veces","a veces.mp4");
addTrigger("anteayer","anteayer.mp4");
addTrigger("ayer","ayer.mp4");
addTrigger("año pasado","año pasado.mp4"); addTrigger("ano pasado","año pasado.mp4");
addTrigger("año","año.mp4"); addTrigger("ano","año.mp4");
addTrigger("cerca","cerca.mp4");
addTrigger("como estas","como estas.mp4"); addTrigger("cómo estás","como estas.mp4"); addTrigger("comoestas","comoestas.mp4");
addTrigger("como quieras","como quieras.mp4"); // (archivo exacto)
addTrigger("como te llamas","comotellamas.mp4"); addTrigger("cómo te llamas","comotellamas.mp4"); addTrigger("comotellamas","comotellamas.mp4");
addTrigger("derecha","derecha.mp4");
addTrigger("despacio","despacio.mp4");
addTrigger("despues","después.mp4"); addTrigger("después","después.mp4");
addTrigger("domingo","domingo.mp4");
addTrigger("enseguida","enseguida.mp4");
addTrigger("futuro","futuro.mp4");
addTrigger("hace poco","hace poco.mp4");
addTrigger("hasta","hasta.mp4");
addTrigger("hora","hora.mp4");
addTrigger("hoy","hoy.mp4");
addTrigger("importante","importante.mp4");
addTrigger("izquierda","izquierda.mp4");
addTrigger("jamas","jamás.mp4"); addTrigger("jamás","jamás.mp4");
addTrigger("jueves","jueves.mp4");
addTrigger("limpio","limpio.mp4");
addTrigger("llamoluana","llamoluana.mp4");
addTrigger("lo siento","lo siento.mp4"); addTrigger("losiento","lo siento.mp4");
addTrigger("lunes","lunes.mp4");
addTrigger("martes","martes.mp4");
addTrigger("manana","mañana.mp4"); addTrigger("mañana","mañana.mp4");
addTrigger("mediodia","mediodía.mp4"); addTrigger("mediodía","mediodía.mp4");
addTrigger("mes","mes.mp4");
addTrigger("minuto","minuto.mp4");
addTrigger("miercoles","miércoles.mp4"); addTrigger("miércoles","miércoles.mp4");
addTrigger("pasado","pasado.mp4");
addTrigger("primeravez","primeravez.mp4"); addTrigger("primera vez","primeravez.mp4");
addTrigger("rapido","rápido.mp4"); addTrigger("rápido","rápido.mp4");
addTrigger("sabado","sabado.mp4"); addTrigger("sábado","sabado.mp4"); // tu archivo es "sabado.mp4"
addTrigger("semana","semana.mp4");
addTrigger("siempre","siempre.mp4");
addTrigger("tarde","tarde.mp4");
addTrigger("temprano","temprano.mp4");
addTrigger("tiempo","tiempo.mp4");
addTrigger("toda la noche","todalanoche.mp4"); addTrigger("todalanoche","todalanoche.mp4");
addTrigger("todavia","todavía.mp4"); addTrigger("todavía","todavía.mp4");
addTrigger("todos los dias","todoslosdias.mp4"); addTrigger("todos los días","todoslosdias.mp4"); addTrigger("todoslosdias","todoslosdias.mp4");
addTrigger("viernes","viernes.mp4");
addTrigger("ultimo","último.mp4"); addTrigger("último","último.mp4");

// Letras (si escriben letras sueltas)
const letras = {
  "a":"letraA.mp4","b":"letraB.mp4","c":"letraC.mp4","ch":"letraCH.mp4","d":"letraD.mp4",
  "e":"letraE.mp4","f":"letraF.mp4","g":"letraG.mp4","h":"letraH.mp4","i":"letraI.mp4",
  "j":"letraJ.mp4","k":"letraK.mp4","l":"letraL.mp4","ll":"letraLL.mp4","m":"letraM.mp4",
  "n":"letraN.mp4","ñ":"letraÑ.mp4","o":"letraO.mp4","p":"letraP.mp4","q":"letraQ.mp4",
  "r":"letraR.mp4","s":"letraS.mp4","t":"letraT.mp4","u":"letraU.mp4","v":"letraV.mp4",
  "w":"letraW.mp4","x":"letraX.mp4","y":"letraY.mp4","z":"letraZ.mp4"
};

// =============================
// Conjugaciones de verbos
// (todas normalizadas, apuntan al MP4 correcto)
// =============================

function addVerbConjs(filename, forms) {
  for (const f of forms) addTrigger(f, filename);
}

// HABLAR → "Hablar.mp4"
addVerbConjs("Hablar.mp4", [
  "hablar","hablo","hablas","habla","hablamos","hablais","hablan",
  "hablare","hablaras","hablara","hablaremos","hablareis","hablaran",
  "hablaba","hablabas","hablabamos","hablabais","hablaban",
  "hable","hablaste","hablo","hablamos","hablasteis","hablaron",
  "hablando","hablado",
  // voseo
  "hablas","hablas vos","hablas?","hablas!"
]);

// DECIR → "Decir.mp4"
addVerbConjs("Decir.mp4", [
  "decir","digo","dices","dice","decimos","decis","dicen",
  "dire","diras","dira","diremos","direis","diran",
  "decia","decias","deciamos","deciais","decian",
  "dije","dijiste","dijo","dijimos","dijisteis","dijeron",
  "diciendo","dicho"
]);

// CONTAR / NARRAR → "Contar o Narrar.mp4"
addVerbConjs("Contar o Narrar.mp4", [
  "contar","cuento","cuentas","cuenta","contamos","contais","cuentan",
  "conte","contaste","conto","contamos","contasteis","contaron",
  "contare","contaras","contara","contaremos","contareis","contaran",
  "contaba","contabas","contabamos","contabais","contaban",
  "contando","contado",
  "narrar","narro","narras","narra","narramos","narrais","narran",
  "narre","narraste","narro","narramos","narrasteis","narraron",
  "narrare","narraras","narrara","narraremos","narrareis","narraran",
  "narraba","narrabas","narrabamos","narrabais","narraban",
  "narrando","narrado"
]);

// ESTAR → "Estar.mp4"
addVerbConjs("Estar.mp4", [
  "estar","estoy","estas","esta","estamos","estais","estan",
  "estuve","estuviste","estuvo","estuvimos","estuvisteis","estuvieron",
  "estare","estaras","estara","estaremos","estareis","estaran",
  "estaba","estabas","estabamos","estabais","estaban",
  "estando","estado"
]);

// EXPLICAR → "Explicar.mp4"
addVerbConjs("Explicar.mp4", [
  "explicar","explico","explicas","explica","explicamos","explicais","explican",
  "explique","explicaste","explico","explicamos","explicasteis","explicaron",
  "explicare","explicaras","explicara","explicaremos","explicareis","explicaran",
  "explicaba","explicabas","explicabamos","explicabais","explicaban",
  "explicando","explicado"
]);

// NEGAR → "Negar.mp4"
addVerbConjs("Negar.mp4", [
  "negar","niego","niegas","niega","negamos","negais","niegan",
  "negue","negaste","nego","negamos","negasteis","negaron",
  "negare","negaras","negara","negaremos","negareis","negaran",
  "negaba","negabas","negabamos","negabais","negaban",
  "negando","negado"
]);

// APURAR → "apurar.mp4"
addVerbConjs("apurar.mp4", [
  "apurar","apuro","apuras","apura","apuramos","apurais","apuran",
  "apure","apuraste","apuro","apuramos","apurasteis","apuraron",
  "apuraré","apuraras","apurara","apuraremos","apureis","apuran",
  "apuraba","apurabas","apurabamos","apurabais","apuraban",
  "apurando","apurado"
].map(limpiarTexto)); // normalizo acentos si alguno escapó

// LLEGAR → "llegar.mp4"
addVerbConjs("llegar.mp4", [
  "llegar","llego","llegas","llega","llegamos","llegais","llegan",
  "llegue","llegaste","llego","llegamos","llegasteis","llegaron",
  "llegare","llegaras","llegara","llegaremos","llegareis","llegaran",
  "llegaba","llegabas","llegabamos","llegabais","llegaban",
  "llegando","llegado"
]);

// DIALOGAR → "Dialogar.mp4"
addVerbConjs("Dialogar.mp4", [
  "dialogar","dialogo","dialogas","dialoga","dialogamos","dialogais","dialogan",
  "dialogue","dialogaste","dialogo","dialogamos","dialogasteis","dialogaron",
  "dialogare","dialogaras","dialogara","dialogaremos","dialogareis","dialogaran",
  "dialogaba","dialogabas","dialogabamos","dialogabais","dialogaban",
  "dialogando","dialogado"
]);

// =============================
// Emparejador principal
// =============================
function procesarTexto(rawInput) {
  if (!rawInput || !rawInput.trim()) return;

  const original = rawInput.trim();
  const cleaned = limpiarTexto(original);
  const tokens = cleaned.split(" ").filter(Boolean);

  const cola = [];

  // Greedy por frases (ventanas 4→1 palabras) para capturar cosas tipo "todos los dias", "contar o narrar", etc.
  for (let i = 0; i < tokens.length; i++) {
    let matched = false;

    for (let win = 4; win >= 1; win--) {
      if (i + win > tokens.length) continue;
      const slice = tokens.slice(i, i + win).join("");
      const filename = MAP.get(slice);
      if (filename) {
        cola.push(filename);
        i += (win - 1);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Letras sueltas (incluye ch/ll/ñ)
      const t = tokens[i];
      if (letras[t]) {
        cola.push(letras[t]);
      }
    }
  }

  reproducirSecuencial(cola);
}

// =============================
// Reproducción secuencial
// =============================
function reproducirSecuencial(lista) {
  if (!lista || lista.length === 0) {
    video.style.display = "none";
    return;
  }

  const next = lista.shift();
  const path = "Palabras/" + encodeURI(next); // respeta espacios/tildes

  // cargamos directo en el <video>, no en <source>
  video.src = path;
  video.playbackRate = currentSpeed;

  // mostrar
  video.style.display = "block";

  // cuando esté cargado, reproducir
  const playNow = () => {
    video.play().catch(() => {
      // si el navegador bloquea, al menos queda visible y el usuario puede darle play
    });
  };

  if (video.readyState >= 2) {
    playNow();
  } else {
    video.onloadeddata = playNow;
  }

  video.onended = () => {
    setTimeout(() => reproducirSecuencial(lista), 150);
  };
}
