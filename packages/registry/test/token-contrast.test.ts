import { runAxe } from "#test/axe";
import { applyColorMode, COLOR_MODES } from "#test/modes";
import { afterEach, expect, test } from "vitest";

const MUTED_TEXT_SURFACES = [
    "--background",
    "--card",
    "--popover",
    "--muted",
    "--secondary",
    "--accent",
    "--sidebar",
] as const;

let container: HTMLElement | null = null;

function renderMutedTextOnSurfaces(): HTMLElement {
    const element = document.createElement("div");
    for (const surface of MUTED_TEXT_SURFACES) {
        const line = document.createElement("p");
        line.textContent = `Muted text on ${surface}`;
        line.style.backgroundColor = `var(${surface})`;
        line.style.color = "var(--muted-foreground)";
        element.append(line);
    }
    document.body.append(element);
    return element;
}

afterEach(() => {
    container?.remove();
    container = null;
});

test.each(COLOR_MODES)(
    "muted text clears its contrast floor on every surface in %s mode",
    async (mode) => {
        applyColorMode(mode);
        container = renderMutedTextOnSurfaces();

        expect(await runAxe(container)).toHaveNoViolations();
    }
);
