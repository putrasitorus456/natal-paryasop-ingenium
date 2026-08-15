import {
  MAX_ANSWER_LENGTH,
  NO_NAME_SUGGESTION,
  questions,
  scriptUrl,
} from "./config";
import {
  isEndpointConfigured,
  submitAnswers,
} from "./lib/sheets-client";

const LOADING_MESSAGES = [
  "Packing suggestion…",
  "Giving red ribbon…",
  "Throwing to the chimney…",
];
const MESSAGE_INTERVAL_MS = 1800;
const MIN_LOADING_MS = MESSAGE_INTERVAL_MS * LOADING_MESSAGES.length;

type FormElements = {
  form: HTMLFormElement;
  formView: HTMLElement;
  done: HTMLElement;
  error: HTMLElement;
  submitBtn: HTMLButtonElement;
  setupWarn: HTMLElement;
  q1: HTMLTextAreaElement;
  q2: HTMLTextAreaElement;
  honeypot: HTMLInputElement;
  overlay: HTMLElement;
  statusCopy: HTMLElement;
  card: HTMLElement;
};

function requiredElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`Missing #${id}`);
  }
  return el as T;
}

function collectElements(): FormElements {
  const card = document.querySelector(".card");
  if (!(card instanceof HTMLElement)) {
    throw new Error("Missing .card");
  }

  return {
    form: requiredElement<HTMLFormElement>("form"),
    formView: requiredElement("form-view"),
    done: requiredElement("done"),
    error: requiredElement("error"),
    submitBtn: requiredElement<HTMLButtonElement>("submit-btn"),
    setupWarn: requiredElement("setup-warn"),
    q1: requiredElement<HTMLTextAreaElement>("q1"),
    q2: requiredElement<HTMLTextAreaElement>("q2"),
    honeypot: requiredElement<HTMLInputElement>("website"),
    overlay: requiredElement("status-overlay"),
    statusCopy: requiredElement("status-copy"),
    card,
  };
}

function bindField(
  textarea: HTMLTextAreaElement,
  countId: string,
  placeholder: string,
  required: boolean,
): void {
  const count = requiredElement(countId);
  textarea.placeholder = placeholder;
  textarea.required = required;
  textarea.maxLength = MAX_ANSWER_LENGTH;

  const update = () => {
    count.textContent = String(textarea.value.length);
  };

  textarea.addEventListener("input", update);
  update();
}

function replay(el: HTMLElement, className: string): void {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function startLoading(ui: FormElements): () => void {
  ui.error.hidden = true;
  ui.error.classList.remove("is-in");
  ui.submitBtn.disabled = true;
  ui.submitBtn.setAttribute("aria-busy", "true");
  ui.submitBtn.classList.add("is-busy");
  ui.formView.classList.add("is-dimmed");
  ui.overlay.hidden = false;
  ui.overlay.classList.remove("is-out");
  replay(ui.overlay, "is-in");
  ui.statusCopy.textContent = LOADING_MESSAGES[0] ?? "Mengirim…";

  if (prefersReducedMotion()) {
    return () => undefined;
  }

  let index = 0;
  const timer = window.setInterval(() => {
    index = (index + 1) % LOADING_MESSAGES.length;
    ui.statusCopy.textContent = LOADING_MESSAGES[index] ?? "Mengirim…";
    replay(ui.statusCopy, "is-swap");
  }, MESSAGE_INTERVAL_MS);

  return () => {
    window.clearInterval(timer);
  };
}

function stopLoading(ui: FormElements): void {
  ui.overlay.classList.remove("is-in");
  ui.overlay.hidden = true;
  ui.formView.classList.remove("is-dimmed");
  ui.submitBtn.classList.remove("is-busy");
}

function showError(ui: FormElements, message: string): void {
  stopLoading(ui);
  ui.submitBtn.disabled = false;
  ui.submitBtn.removeAttribute("aria-busy");
  ui.error.textContent = message;
  ui.error.hidden = false;
  replay(ui.error, "is-in");
  replay(ui.card, "is-shake");
}

function showDone(ui: FormElements): void {
  stopLoading(ui);
  ui.formView.hidden = true;
  ui.done.hidden = false;
  replay(ui.done, "is-in");
  ui.done.focus();
}

export function initForm(): void {
  const ui = collectElements();

  requiredElement("label-q1").textContent = questions[0].prompt;
  requiredElement("label-q2").textContent = questions[1].prompt;

  bindField(ui.q1, "count-q1", questions[0].placeholder, questions[0].required);
  bindField(ui.q2, "count-q2", questions[1].placeholder, questions[1].required);

  if (!isEndpointConfigured(scriptUrl)) {
    ui.setupWarn.hidden = false;
  }

  ui.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    ui.error.hidden = true;
    ui.error.classList.remove("is-in");

    if (ui.honeypot.value.trim()) {
      showDone(ui);
      return;
    }

    const q1 = ui.q1.value.trim();
    const q2 = ui.q2.value.trim() || NO_NAME_SUGGESTION;

    if (!q1) {
      showError(ui, "Yang wajib isi dulu hey.");
      ui.q1.focus();
      return;
    }

    if (!isEndpointConfigured(scriptUrl)) {
      showError(
        ui,
        "Form belum tersambung ke Google Sheets. Isi VITE_APPS_SCRIPT_URL atau src/config.ts.",
      );
      return;
    }

    const stopMessages = startLoading(ui);

    try {
      await Promise.all([
        submitAnswers(scriptUrl, {
          q1,
          q2,
          question1: questions[0].prompt,
          question2: questions[1].prompt,
        }),
        wait(prefersReducedMotion() ? 0 : MIN_LOADING_MS),
      ]);
      stopMessages();
      showDone(ui);
    } catch {
      stopMessages();
      showError(
        ui,
        "Gagal mengirim. Coba lagi, jangan sampai nyangkut di cerobong.",
      );
    }
  });
}
