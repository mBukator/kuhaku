import { expect, test, type Page } from "@playwright/test";

const PAGE_PATH = "/docs/components/button";
const MAX_TAB_STOPS = 150;
const MIN_TAB_STOPS = 20;
const SETTLE_TIMEOUT_MILLISECONDS = 10_000;
const VISIBLE_OPACITY = 0.99;

type TabStop = { label: string; isVisible: boolean };

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

/** The focused element, and whether it renders: visible, with no transparent ancestor. */
async function readTabStop(page: Page): Promise<TabStop | null> {
    return page.evaluate((visibleOpacity) => {
        const element = document.activeElement;
        if (!(element instanceof HTMLElement) || element === document.body) return null;
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
        const label = element.getAttribute("aria-label") ?? element.innerText.trim();
        return {
            label: `${element.tagName.toLowerCase()} "${label.slice(0, 40)}"`,
            isVisible,
        };
    }, VISIBLE_OPACITY);
}

test("every Tab stop on a docs page is visible when it takes focus", async ({ page }) => {
    await page.goto(PAGE_PATH);
    await page.mouse.move(0, 0);
    const stops: TabStop[] = [];

    for (let index = 0; index < MAX_TAB_STOPS; index++) {
        await page.keyboard.press("Tab");
        await settle(page);
        const stop = await readTabStop(page);
        if (stop === null) break;
        stops.push(stop);
    }

    expect(stops.length).toBeGreaterThanOrEqual(MIN_TAB_STOPS);
    expect(stops.filter((stop) => !stop.isVisible).map((stop) => stop.label)).toEqual([]);
});
