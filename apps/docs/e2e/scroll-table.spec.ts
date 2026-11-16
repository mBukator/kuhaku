import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGE_PATH = "/docs/components/button";
const PHONE_VIEWPORT = { width: 375, height: 812 };
const DESKTOP_VIEWPORT = { width: 1280, height: 720 };
const API_REGION_NAME = "API reference table";
const MAX_TAB_STOPS = 150;

test("at 375px the props table is a named region the keyboard reaches and scrolls", async ({
    page,
}) => {
    await page.setViewportSize(PHONE_VIEWPORT);
    await page.goto(PAGE_PATH);
    const region = page.getByRole("region", { name: API_REGION_NAME, exact: true });
    await expect(region).toBeAttached();

    for (let index = 0; index < MAX_TAB_STOPS; index++) {
        await page.keyboard.press("Tab");
        if (await region.evaluate((element) => element === document.activeElement)) break;
    }
    await expect(region).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect
        .poll(() => region.evaluate((element) => element.scrollLeft))
        .toBeGreaterThan(0);
});

test("at 375px no scroll region is out of keyboard reach", async ({ page }) => {
    await page.setViewportSize(PHONE_VIEWPORT);
    await page.goto(PAGE_PATH);
    await expect(
        page.getByRole("region", { name: API_REGION_NAME, exact: true })
    ).toBeAttached();

    const results = await new AxeBuilder({ page })
        .withRules(["scrollable-region-focusable"])
        .analyze();
    expect(results.violations.flatMap((violation) => violation.nodes)).toEqual([]);
});

test("a table that fits again stops being a Tab stop", async ({ page }) => {
    await page.setViewportSize(PHONE_VIEWPORT);
    await page.goto(PAGE_PATH);
    const region = page.getByRole("region", { name: API_REGION_NAME, exact: true });
    await expect(region).toBeAttached();

    await page.setViewportSize(DESKTOP_VIEWPORT);

    await expect(region).toHaveCount(0);
    await expect(page.locator("table[tabindex], div:has(> table)[tabindex]")).toHaveCount(
        0
    );
});
