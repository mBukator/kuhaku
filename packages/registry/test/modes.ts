export const COLOR_MODES = ["light", "dark", "strict", "strict-dark"] as const;

export type ColorMode = (typeof COLOR_MODES)[number];

export function applyColorMode(mode: ColorMode): void {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark" || mode === "strict-dark");

    if (mode === "strict" || mode === "strict-dark") {
        root.dataset.a11y = "strict";
        return;
    }
    delete root.dataset.a11y;
}
