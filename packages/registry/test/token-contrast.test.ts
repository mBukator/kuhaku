import { runAxe } from "#test/axe";
import { applyColorMode, COLOR_MODES } from "#test/modes";
import { afterEach, expect, test } from "vitest";

const SURFACES = [
    "--background",
    "--card",
    "--popover",
    "--muted",
    "--secondary",
    "--accent",
    "--sidebar",
] as const;

const NON_TEXT_CONTRAST_FLOOR = 3;
const CANVAS_SENTINEL = "#010203";

let container: HTMLElement | null = null;

function renderMutedTextOnSurfaces(): HTMLElement {
    const element = document.createElement("div");
    for (const surface of SURFACES) {
        const line = document.createElement("p");
        line.textContent = `Muted text on ${surface}`;
        line.style.backgroundColor = `var(${surface})`;
        line.style.color = "var(--muted-foreground)";
        element.append(line);
    }
    document.body.append(element);
    return element;
}

function resolveToken(token: string): string {
    const probe = document.createElement("div");
    probe.style.color = `var(${token}, transparent)`;
    document.body.append(probe);
    const resolved = getComputedStyle(probe).color;
    probe.remove();
    if (resolved === "rgba(0, 0, 0, 0)") throw new Error(`${token} does not resolve`);
    return resolved;
}

/** Paints the colors in order onto one pixel, so alpha composites the way the page does. */
function paintPixel(colors: readonly string[]): number[] {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    if (context === null) throw new Error("A 2D canvas context is unavailable");
    for (const color of colors) {
        // Canvas ignores a color it cannot parse, which would paint the previous one.
        context.fillStyle = CANVAS_SENTINEL;
        context.fillStyle = color;
        if (context.fillStyle === CANVAS_SENTINEL)
            throw new Error(`Canvas rejected ${color}`);
        context.fillRect(0, 0, 1, 1);
    }
    return Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3));
}

function relativeLuminance(channels: readonly number[]): number {
    const [red, green, blue] = channels.map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: readonly number[], second: readonly number[]): number {
    const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort(
        (left, right) => right - left
    );
    return (lighter + 0.05) / (darker + 0.05);
}

function listRingContrastFailures(surface: string): string[] {
    const ring = resolveToken("--ring");
    const surfaceColor = resolveToken(surface);
    const paintedRing = paintPixel([surfaceColor, ring]);
    const neighbors = {
        [surface]: paintPixel([surfaceColor]),
        "--background gap": paintPixel([resolveToken("--background")]),
    };
    return Object.entries(neighbors).flatMap(([neighbor, color]) => {
        const ratio = contrastRatio(paintedRing, color);
        if (ratio >= NON_TEXT_CONTRAST_FLOOR) return [];
        return [`ring over ${surface} against ${neighbor}: ${ratio.toFixed(2)}:1`];
    });
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

test.each(COLOR_MODES)(
    "the focus ring clears 3:1 against every surface and its gap in %s mode",
    (mode) => {
        applyColorMode(mode);

        expect(SURFACES.flatMap(listRingContrastFailures)).toEqual([]);
    }
);
