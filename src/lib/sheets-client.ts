export type Submission = {
  q1: string;
  q2: string;
  question1: string;
  question2: string;
};

export function isEndpointConfigured(url: string): boolean {
  return url.startsWith("https://") && url.includes("/exec") && !url.includes("PASTE_");
}

/**
 * Google Apps Script web apps do not send CORS headers to arbitrary origins.
 * A text/plain POST skips preflight; credentials: "omit" stops Google cookies
 * from triggering a 401 when the page is opened from a non-Google origin.
 *
 * The response is opaque, so a resolved promise only means the browser sent
 * the request — not that the sheet accepted it.
 */
export async function submitAnswers(
  endpoint: string,
  payload: Submission,
): Promise<void> {
  await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    credentials: "omit",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
}
