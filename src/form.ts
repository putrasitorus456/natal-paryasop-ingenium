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
};

function requiredElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`Missing #${id}`);
  }
  return el as T;
}

function collectElements(): FormElements {
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

function showError(error: HTMLElement, message: string): void {
  error.textContent = message;
  error.hidden = false;
}

function showDone(formView: HTMLElement, done: HTMLElement): void {
  formView.hidden = true;
  done.hidden = false;
  done.focus();
}

function resetSubmit(button: HTMLButtonElement): void {
  button.disabled = false;
  button.removeAttribute("aria-busy");
  button.textContent = "Submit Suggestion 🚀";
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

    if (ui.honeypot.value.trim()) {
      showDone(ui.formView, ui.done);
      return;
    }

    const q1 = ui.q1.value.trim();
    const q2 = ui.q2.value.trim() || NO_NAME_SUGGESTION;

    if (!q1) {
      showError(ui.error, "Yang wajib isi dulu hey.");
      ui.q1.focus();
      return;
    }

    if (!isEndpointConfigured(scriptUrl)) {
      showError(
        ui.error,
        "Form belum tersambung ke Google Sheets. Isi VITE_APPS_SCRIPT_URL atau src/config.ts.",
      );
      return;
    }

    ui.submitBtn.disabled = true;
    ui.submitBtn.setAttribute("aria-busy", "true");
    ui.submitBtn.textContent = "Mengirim…";

    try {
      await submitAnswers(scriptUrl, {
        q1,
        q2,
        question1: questions[0].prompt,
        question2: questions[1].prompt,
      });
      showDone(ui.formView, ui.done);
    } catch {
      showError(ui.error, "Gagal mengirim. Coba lagi, jangan sampai nyangkut di cerobong.");
      resetSubmit(ui.submitBtn);
    }
  });
}
