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

// Función mejorada para detectar palabras base con conjugaciones verbales comunes
function contienePalabra(text, base) {
    const regex = new RegExp(`\\b${base}(ar|o|as|a|amos|áis|an|é|aste|ó|aron|aba|abas|ábamos|aban|aré|arás|ará|aremos|arán)?\\b`, 'i');
    return regex.test(text);
}

function reproducirVideoSegunTexto(text) {
    let videoPath = "";

    // Palabras fijas
    if (text.includes("hola")) {
        videoPath = "Palabras/hola.mp4";
    } else if (text.includes("como estas") || text.includes("cómo estás")) {
        videoPath = "Palabras/comoestas.mp4";
    } else if (text.includes("vos cómo te llamas") || text.includes("cómo te llamas")) {
        videoPath = "Palabras/comotellamas.mp4";
    } else if (text.includes("me llamo luana")) {
        videoPath = "Palabras/llamoluana.mp4";
    }

    // Abecedario completo
    const letras = ["a","b","c","d","e","f","g","h","i","j","k","l","ll","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z","ch"];
    letras.forEach(letra => {
        if (text === letra || text === `letra ${letra}`) {
            videoPath = `Palabras/letra${letra.toUpperCase()}.mp4`;
        }
    });

    // Palabras con conjugaciones o sinónimos
    const palabrasFlexibles = {
        dialogar: "Dialogar",
        hablar: "Hablar",
        "lengua oral": "Lengua oral",
        decir: "Decir",
        contar: "Contar o Narrar",
        narrar: "Contar o Narrar",
        explicar: "Explicar",
        si: "Si",
        no: "No",
        negar: "Negar",
        también: "Tambien",
        tampoco: "Tampoco",
        estar: "Estar",
        yo: "Yo",
        vos: "Vos",
        ustedes: "Ustedes",
        "el": "El o Ella",
        "ella": "El o Ella",
        "nosotros": "Nosotros o Nosotras",
        "nosotras": "Nosotros o Nosotras"
    };

    for (let clave in palabrasFlexibles) {
        if (contienePalabra(text, clave)) {
            videoPath = `Palabras/${palabrasFlexibles[clave]}.mp4`;
        }
    }

    if (videoPath) {
        videoSource.src = videoPath;
        videoSeña.load();
        videoSeña.style.display = "block";
        videoSeña.play();
    } else {
        videoSeña.style.display = "none";
    }
}
