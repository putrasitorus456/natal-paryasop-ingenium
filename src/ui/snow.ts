const SNOWFLAKE_COUNT = 42;
const FLAKES = ["❄", "✦", "•", "❅"];

export function renderSnow(root: HTMLElement): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < SNOWFLAKE_COUNT; i += 1) {
    const flake = document.createElement("span");
    flake.className = "snowflake";
    flake.textContent = FLAKES[i % FLAKES.length] ?? "❄";
    flake.style.left = `${Math.random() * 100}%`;
    flake.style.animationDuration = `${8 + Math.random() * 12}s`;
    flake.style.animationDelay = `${-Math.random() * 16}s`;
    flake.style.fontSize = `${0.55 + Math.random() * 0.85}rem`;
    flake.style.opacity = String(0.35 + Math.random() * 0.5);
    fragment.append(flake);
  }

  root.append(fragment);
}
