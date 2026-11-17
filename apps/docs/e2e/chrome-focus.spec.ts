import { expect, test, type Page } from "@playwright/test";

const PAGE_PATH = "/docs/components/button";
const MAX_TAB_STOPS = 150;
const MIN_TAB_STOPS = 20;
const SETTLE_TIMEOUT_MILLISECONDS = 10_000;
const VISIBLE_OPACITY = 0.99;
const CLIP_TOLERANCE_PIXELS = 0.5;
const TABLET_VIEWPORT = { width: 1024, height: 768 };

type TabStop = { label: string; isVisible: boolean; clippedBy: string | null };
type FocusCheck = { visibleOpacity: number; clipTolerance: number };

// Up to 150 Tab presses, each waiting on a transition, outrun 90s under the parallel suite.
test.describe.configure({ timeout: 180_000 });

/** Waits for the focused element's and its ancestors' finite animations, then two frames. */
async function settle(page: Page): Promise<void> {
    await page.waitForFunction(
        () => {
            const element = document.activeElement;
            if (element === null) return true;
            const animations = element.getAnimations();
            for (
                let node = element.parentElement;
                node !== null;
                node = node.parentElement
            ) {
                animations.push(...node.getAnimations());
            }
            return animations.every(
                (animation) =>
                    animation.playState !== "running" ||
                    animation.effect?.getTiming().iterations === Infinity
            );
        },
        undefined,
        { timeout: SETTLE_TIMEOUT_MILLISECONDS }
    );
    await page.evaluate(
        () =>
            new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve))
            )
    );
}

/**
 * The focused element, whether it renders (visible, no transparent ancestor), and the
 * first ancestor whose overflow cuts into its focus ring.
 */
async function readTabStop(page: Page): Promise<TabStop | null> {
    return page.evaluate(
        ({ visibleOpacity, clipTolerance }: FocusCheck) => {
            const element = document.activeElement;
            if (!(element instanceof HTMLElement) || element === document.body)
                return null;

            const describe = (node: Element): string => {
                const label = node.getAttribute("aria-label") ?? "";
                const text =
                    node instanceof HTMLElement
                        ? (node.innerText.trim().split("\n")[0] ?? "")
                        : "";
                const name = label === "" ? text : label;
                return `${node.tagName.toLowerCase()} "${name.slice(0, 40)}"`;
            };

            let opacity = 1;
            for (
                let node: Element | null = element;
                node !== null;
                node = node.parentElement
            ) {
                opacity *= Number(getComputedStyle(node).opacity);
            }
            const isVisible =
                getComputedStyle(element).visibility === "visible" &&
                opacity >= visibleOpacity;

            const style = getComputedStyle(element);
            let ringExtentPixels = 0;
            let shadows = style.boxShadow === "none" ? "" : style.boxShadow;
            // Colors carry commas inside parentheses; drop them before splitting the shadow list.
            while (/\([^()]*\)/.test(shadows))
                shadows = shadows.replace(/\([^()]*\)/g, "");
            for (const shadow of shadows.split(",").filter(Boolean)) {
                if (/\binset\b/.test(shadow)) continue;
                const [offsetX = 0, offsetY = 0, blur = 0, spread = 0] = (
                    shadow.match(/-?[\d.]+px/g) ?? []
                ).map((length) => Number.parseFloat(length));
                ringExtentPixels = Math.max(
                    ringExtentPixels,
                    spread + blur + Math.max(Math.abs(offsetX), Math.abs(offsetY))
                );
            }
            if (style.outlineStyle !== "none") {
                ringExtentPixels = Math.max(
                    ringExtentPixels,
                    Number.parseFloat(style.outlineWidth) +
                        Number.parseFloat(style.outlineOffset)
                );
            }

            const box = element.getBoundingClientRect();
            const ring = {
                left: box.left - ringExtentPixels,
                right: box.right + ringExtentPixels,
                top: box.top - ringExtentPixels,
                bottom: box.bottom + ringExtentPixels,
            };
            let clippedBy: string | null = null;
            for (
                let node = element.parentElement;
                node !== null && node !== document.body && clippedBy === null;
                node = node.parentElement
            ) {
                const nodeStyle = getComputedStyle(node);
                const clipsX = nodeStyle.overflowX !== "visible";
                const clipsY = nodeStyle.overflowY !== "visible";
                if (!clipsX && !clipsY) continue;
                const nodeBox = node.getBoundingClientRect();
                const left = nodeBox.left + node.clientLeft;
                const top = nodeBox.top + node.clientTop;
                const isCutX =
                    clipsX &&
                    (ring.left < left - clipTolerance ||
                        ring.right > left + node.clientWidth + clipTolerance);
                const isCutY =
                    clipsY &&
                    (ring.top < top - clipTolerance ||
                        ring.bottom > top + node.clientHeight + clipTolerance);
                if (isCutX || isCutY) clippedBy = describe(node);
            }

            return { label: describe(element), isVisible, clippedBy };
        },
        { visibleOpacity: VISIBLE_OPACITY, clipTolerance: CLIP_TOLERANCE_PIXELS }
    );
}

/** Presses Tab and reads each stop until focus leaves the page, or leaves `insideSelector`. */
async function walkTabStops(
    page: Page,
    insideSelector: string | null
): Promise<TabStop[]> {
    const stops: TabStop[] = [];
    for (let index = 0; index < MAX_TAB_STOPS; index++) {
        await page.keyboard.press("Tab");
        await settle(page);
        const isInside = await page.evaluate(
            (selector) =>
                selector === null || document.activeElement?.closest(selector) !== null,
            insideSelector
        );
        if (!isInside) break;
        const stop = await readTabStop(page);
        if (stop === null) break;
        stops.push(stop);
    }
    return stops;
}

function describeClippedStops(stops: TabStop[]): string[] {
    return stops
        .filter((stop) => stop.clippedBy !== null)
        .map((stop) => `${stop.label} cut by ${stop.clippedBy}`);
}

for (const mode of ["default", "strict"] as const) {
    test(`every Tab stop on a docs page shows its whole ring (${mode})`, async ({
        page,
    }) => {
        await page.goto(PAGE_PATH);
        if (mode === "strict") {
            await page.evaluate(() => {
                document.documentElement.dataset.a11y = "strict";
            });
            await expect(page.locator("html")).toHaveAttribute("data-a11y", "strict");
        }
        await page.mouse.move(0, 0);
        const stops = await walkTabStops(page, null);

        expect(stops.length).toBeGreaterThanOrEqual(MIN_TAB_STOPS);
        expect(stops.filter((stop) => !stop.isVisible).map((stop) => stop.label)).toEqual(
            []
        );
        expect(describeClippedStops(stops)).toEqual([]);
    });
}

test("below 1280px the table of contents popover shows each link's whole ring", async ({
    page,
}) => {
    await page.setViewportSize(TABLET_VIEWPORT);
    await page.goto(PAGE_PATH);
    const trigger = page.locator("[data-toc-popover-trigger]");
    await trigger.click();
    await settle(page);
    await trigger.focus();

    const stops = await walkTabStops(page, "[data-toc-popover-content]");

    expect(stops.length).toBeGreaterThan(0);
    expect(describeClippedStops(stops)).toEqual([]);
});
