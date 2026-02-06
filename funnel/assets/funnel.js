const FUNNEL_KEY = "quiz_funnel_answers_v1";

function getAnswers() {
  try {
    return JSON.parse(localStorage.getItem(FUNNEL_KEY)) || {};
  } catch {
    return {};
  }
}

function setAnswer(step, value) {
  const a = getAnswers();
  a[`step${step}`] = value;
  a.updatedAt = new Date().toISOString();
  localStorage.setItem(FUNNEL_KEY, JSON.stringify(a));
}

function resetAnswers() {
  localStorage.removeItem(FUNNEL_KEY);
}

function setProgress(step, total = 8) {
  const pct = Math.round((step / total) * 100);
  const bar = document.querySelector("[data-progress-bar]");
  const label = document.querySelector("[data-progress-label]");
  if (bar) bar.style.width = `${pct}%`;
  if (label) label.textContent = `${step} / ${total}`;
}

function wireOptions(step, nextUrl) {
  const buttons = document.querySelectorAll("[data-option]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-option");
      setAnswer(step, val);
      window.location.href = nextUrl;
    });
  });
}

function goBack(fallback = "index.html") {
  // Simple back fallback
  if (history.length > 1) history.back();
  else window.location.href = fallback;
}
