export const MAX_ANSWER_LENGTH = 1000;

export const questions = [
  {
    prompt:
      "Ketua Panitia Natal seperti apa yang kamu harapkan? Coba deskripsikan sedikit.",
    placeholder:
      "Misalnya: tegas tapi ramah, rapi koordinasinya, bisa ngajak orang, nggak gampang panik…",
    required: true,
  },
  {
    prompt: "Ada saran nama? Sebutkan di bawah.",
    placeholder: "Boleh kosong kalau belum ada. Satu nama atau beberapa, juga oke.",
    required: false,
  },
] as const;

export const NO_NAME_SUGGESTION = "Tidak ada saran";

/**
 * Public write-only Apps Script endpoint. It is not a secret:
 * anyone with the form can POST, but they cannot read the sheet.
 * Override with VITE_APPS_SCRIPT_URL when deploying.
 */
export const scriptUrl =
  import.meta.env.VITE_APPS_SCRIPT_URL ??
  "https://script.google.com/macros/s/AKfycbzt6gbf1tyBkza2xndaCbDKLSP6Dpg3wnmVH5P_K9vb5b57RAeJx7ip0oefLVQCYO2A/exec";
