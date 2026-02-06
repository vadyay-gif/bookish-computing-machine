const FUNNEL_KEY = "quiz_funnel_answers_v2";
const TOTAL = 8;
const OFFER_URL = "https://onlinepuonline.com/k4aTiiO7/";

// 8-step quiz content (easy to edit in one place)
const STEPS = [
  {
    title: "⚡ Test rápido: ¿Qué oportunidad online es ideal para ti en 2026?",
    subtitle: "Responde 8 preguntas y descubre lo que personas como tú están usando para generar ingresos extra.",
    question: "¿Por qué estás buscando algo online ahora mismo?",
    options: [
      "Necesito más dinero",
      "Quiero libertad financiera",
      "Quiero una segunda fuente de ingresos",
      "Solo tengo curiosidad",
    ],
    footerText: "Tus respuestas se usan para mostrarte un resultado personalizado.",
  },
  {
    title: "Entendemos…",
    subtitle: "Esta parte ayuda a ajustar el resultado a tu perfil.",
    question: "¿Qué te frustra más de tu situación actual?",
    options: [
      "El dinero nunca alcanza",
      "No tengo libertad",
      "Trabajo mucho y gano poco",
      "Siento que estoy estancado",
    ],
    footerText: "",
  },
  {
    title: "Si todo saliera bien…",
    subtitle: "Elige el rango que te motivaría de verdad.",
    question: "¿Cuánto dinero extra al mes te gustaría generar?",
    options: ["$300 – $1,000", "$1,000 – $3,000", "$3,000 – $10,000", "Más de $10,000"],
    footerText: "",
  },
  {
    title: "Sé honesto:",
    subtitle: "Esto nos ayuda a recomendarte el mejor camino.",
    question: "¿Crees que aún es posible ganar dinero online en 2026?",
    options: ["Sí, pero no sé cómo", "Sí, con el sistema correcto", "No estoy seguro", "Tengo dudas"],
    footerText: "",
  },
  {
    title: "Tu experiencia:",
    subtitle: "No hay respuesta mala. Solo ajusta el resultado.",
    question: "¿Has intentado ganar dinero online antes?",
    options: ["Sí y funcionó un poco", "Sí pero fallé", "Nunca lo intenté", "Solo estoy investigando"],
    footerText: "",
  },
  {
    title: "Pregunta importante:",
    subtitle: "Esto mide tu ritmo ideal para empezar.",
    question: "¿Cuánto tiempo podrías dedicarle si funciona?",
    options: ["1–2 horas al día", "30–60 min diarios", "Solo fines de semana", "Depende de resultados"],
    footerText: "",
  },
  {
    title: "Analizando tus respuestas…",
    subtitle: "Estamos calculando el mejor método para tu perfil. Solo el 17% califica para lo que vamos a mostrar…",
    question: "Si calificas, ¿te gustaría ver un sistema paso a paso?",
    options: ["Sí, definitivamente", "Sí, muéstramelo", "Tal vez", "Solo si es fácil"],
    footerText: "Tip: responde honestamente para ver el mejor resultado.",
    showLoader: true,
  },
  {
    title: "🎉 ¡Buenas noticias!",
    subtitle:
      "Según tus respuestas, calificas para ver este sistema que muchas personas están usando para generar ingresos online.",
    question: "¿Quieres ver cómo funciona ahora?",
    options: ["Sí, ver ahora", "Sí, acceso inmediato", "Muéstrame el sistema"],
    footerText: "Al hacer clic, verás la presentación completa.",
    isFinal: true,
  },
];

function getAnswers() {
  try {
    return JSON.parse(localStorage.getItem(FUNNEL_KEY)) || {};
  } catch {
    return {};
  }
}
function setAnswer(stepIndex, optionIndex) {
  const a = getAnswers();
  a[`step${stepIndex + 1}`] = optionIndex;
  a.updatedAt = new Date().toISOString();
  localStorage.setItem(FUNNEL_KEY, JSON.stringify(a));
}
function resetAnswers() {
  localStorage.removeItem(FUNNEL_KEY);
}

function setProgress(step) {
  const pct = Math.round((step / TOTAL) * 100);
  document.getElementById("progressText").textContent = `${step} / ${TOTAL}`;
  document.getElementById("progressBar").style.width = `${pct}%`;
}

function render(stepIndex) {
  const step = STEPS[stepIndex];
  setProgress(stepIndex + 1);

  document.getElementById("title").textContent = step.title;
  document.getElementById("subtitle").textContent = step.subtitle || "";
  document.getElementById("question").textContent = step.question;
  document.getElementById("footerText").textContent = step.footerText || "";

  const opts = document.getElementById("options");
  opts.innerHTML = "";

  // Optional loader animation on step 7
  if (step.showLoader) {
    const loader = document.createElement("div");
    loader.className = "loader";
    loader.innerHTML = "<div></div>";
    opts.appendChild(loader);
  }

  step.options.forEach((txt, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = `${String.fromCharCode(65 + i)}. ${txt}`;
    btn.addEventListener("click", () => {
      setAnswer(stepIndex, i);

      if (step.isFinal) {
        // Append lightweight params (no PII)
        const a = getAnswers();
        const qp = new URLSearchParams();
        for (let s = 1; s <= TOTAL; s++) {
          const v = a[`step${s}`];
          if (typeof v === "number") qp.set(`s${s}`, String(v));
        }
        window.location.href = OFFER_URL + (OFFER_URL.includes("?") ? "&" : "?") + qp.toString();
        return;
      }

      const next = stepIndex + 1;
      // Use hash navigation so it's still one file
      window.location.hash = `#step=${next + 1}`;
      render(next);
    });
    opts.appendChild(btn);
  });

  // Back link behavior
  const back = document.getElementById("backLink");
  back.style.visibility = stepIndex === 0 ? "hidden" : "visible";
  back.onclick = (e) => {
    e.preventDefault();
    if (stepIndex > 0) {
      const prev = stepIndex - 1;
      window.location.hash = `#step=${prev + 1}`;
      render(prev);
    }
  };
}

function readStepFromHash() {
  const m = window.location.hash.match(/step=(\d+)/);
  if (!m) return 0;
  const s = parseInt(m[1], 10);
  if (!Number.isFinite(s)) return 0;
  return Math.min(Math.max(s - 1, 0), TOTAL - 1);
}

document.getElementById("resetLink").addEventListener("click", (e) => {
  e.preventDefault();
  resetAnswers();
  window.location.hash = "#step=1";
  render(0);
});

window.addEventListener("hashchange", () => {
  render(readStepFromHash());
});

// Initial load
render(readStepFromHash());
