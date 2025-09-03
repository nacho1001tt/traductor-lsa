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
addTrigger("ustedes","
