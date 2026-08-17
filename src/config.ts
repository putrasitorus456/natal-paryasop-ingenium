export const MAX_ANSWER_LENGTH = 1000;

export const questions = [
  {
    prompt:
      "Ketua Panitia Natal seperti apa yang kamu harapkan? Coba deskripsikan sedikit.",
    placeholder:
      "Misalnya: tegas tapi ramah, koordinasinya oke, bisa ngajak orang, nggak gampang panik…",
    required: true,
  },
  {
    prompt: "Ada saran nama? Sebutkan di bawah.",
    placeholder: "Boleh satu atau beberapa. Kosong juga sebenarnya boleh, tapi isi aja plis :)",
    required: false,
  },
] as const;

export const NO_NAME_SUGGESTION = "Tidak ada saran";

/** Form open while local time is before this instant (WIB). */
export const closesAt = "2026-08-17T22:30:00+07:00";

/**
 * Public write-only Apps Script endpoint. It is not a secret:
 * anyone with the form can POST, but they cannot read the sheet.
 * Override with VITE_APPS_SCRIPT_URL when deploying.
 */
export const scriptUrl =
  import.meta.env.VITE_APPS_SCRIPT_URL ??
  "https://script.google.com/macros/s/AKfycbzt6gbf1tyBkza2xndaCbDKLSP6Dpg3wnmVH5P_K9vb5b57RAeJx7ip0oefLVQCYO2A/exec";
