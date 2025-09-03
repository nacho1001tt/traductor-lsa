<script>
// =============================
// Utilidades
// =============================
function limpiarTexto(t) {
  return (t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?;:()"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const norm = s => limpiarTexto(s).replace(/\s+/g, "");

// =============================
// DOM
// =============================
const boton = document.getElementById("start");
const entradaTexto = document.getElementById("entradaTexto");
const texto = document.getElementById("texto");
const video = document.getElementById("videoSeña");
const videoSource = document.getElementById("videoSource");
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
function activarMicrofono() { boton.classList.add("mic-active"); }
function desactivarMicrofono() { boton.classList.remove("mic-active"); }

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
// SpeechRecognition
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

// =============================
// Diccionario y Letras
// =============================
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

const MAP = new Map();
function addTrigger(trigger, filename) { MAP.set(norm(trigger), filename); }

// Letras
const letras = {
  "a":"letraA.mp4","b":"letraB.mp4","c":"letraC.mp4","ch":"letraCH.mp4","d":"letraD.mp4",
  "e":"letraE.mp4","f":"letraF.mp4","g":"letraG.mp4","h":"letraH.mp4","i":"letraI.mp4",
  "j":"letraJ.mp4","k":"letraK.mp4","l":"letraL.mp4","ll":"letraLL.mp4","m":"letraM.mp4",
  "n":"letraN.mp4","ñ":"letraÑ.mp4","o":"letraO.mp4","p":"letraP.mp4","q":"letraQ.mp4",
  "r":"letraR.mp4","s":"letraS.mp4","t":"letraT.mp4","u":"letraU.mp4","v":"letraV.mp4",
  "w":"letraW.mp4","x":"letraX.mp4","y":"letraY.mp4","z":"letraZ.mp4"
};

// =============================
// Palabras exactas + verbos
// =============================
function addVerbConjs(filename, forms) { for (const f of forms) addTrigger(f, filename); }

// Ejemplo: Hablar
addVerbConjs("Hablar.mp4", ["hablar","hablo","hablas","habla","hablamos","hablais","hablan","hablare","hablaras","hablara","hablaremos","hablareis","hablaran","hablaba","hablabas","hablabamos","hablabais","hablaban","hable","hablaste","hablo","hablamos","hablasteis","hablaron","hablando","hablado","hablas","hablas vos","hablas?","hablas!"]);

// Agregar todos los verbos como antes...
// addVerbConjs("Decir.mp4", [...]);
// addVerbConjs("Contar o Narrar.mp4", [...]);
// addVerbConjs("Estar.mp4", [...]);
// addVerbConjs("Explicar.mp4", [...]);
// addVerbConjs("Negar.mp4", [...]);
// addVerbConjs("apurar.mp4", [...]);
// addVerbConjs("llegar.mp4", [...]);
// addVerbConjs("Dialogar.mp4", [...]);

// =============================
// Emparejador principal
// =============================
function procesarTexto(rawInput) {
  if (!rawInput || !rawInput.trim()) return;
  const cleaned = limpiarTexto(rawInput);
  const tokens = cleaned.split(" ").filter(Boolean);
  const cola = [];

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
      const t = tokens[i];
      if (letras[t]) cola.push(letras[t]);
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
  const path = "Palabras/" + encodeURIComponent(next);

  videoSource.src = path;
  video.load();
  video.playbackRate = currentSpeed;
  video.style.display = "block";
  video.controls = false;

  const playNow = () => video.play().catch(err => { video.controls = true; });

  if (video.readyState >= 2) playNow();
  else video.onloadeddata = playNow;

  video.onended = () => setTimeout(() => reproducirSecuencial(lista), 150);
}
</script>
</body>
</html>
