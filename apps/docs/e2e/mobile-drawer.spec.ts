import { expect, test, type Locator, type Page } from "@playwright/test";

const PAGE_PATH = "/docs/components/button";
const PHONE_VIEWPORT = { width: 375, height: 812 };
const DESKTOP_VIEWPORT = { width: 1024, height: 812 };
// Left of the drawer, which covers the right 85% of the phone viewport.
const BACKDROP_POINT = { x: 20, y: 400 };
const DRAWER_SELECTOR = "#nd-sidebar-mobile";
const HEADER_SELECTOR = "#nd-subnav";
const TAB_PRESSES = 40;

type FocusPlace = "drawer" | "none" | "outside";

/** The header's trigger; the drawer holds a second "Open Sidebar" button of its own. */
function getHeaderTrigger(page: Page): Locator {
    return page
        .locator(HEADER_SELECTOR)
        .getByRole("button", { name: "Open Sidebar", exact: true });
}

/** Where focus sits: in the drawer, on no element (browser UI), or on the page behind it. */
async function readFocusPlace(drawer: Locator): Promise<FocusPlace> {
    return drawer.evaluate((element) => {
        const active = document.activeElement;
        if (active === null || active === document.body) return "none";
        return element.contains(active) ? "drawer" : "outside";
    });
}

test.beforeEach(async ({ page }) => {
    await page.setViewportSize(PHONE_VIEWPORT);
    await page.goto(PAGE_PATH);
});

test("the open drawer takes focus, and Tab never reaches the page behind it", async ({
    page,
}) => {
    await getHeaderTrigger(page).click();
    const drawer = page.locator(DRAWER_SELECTOR);
    await expect(drawer).toHaveAttribute("data-state", "open");
    await expect.poll(() => readFocusPlace(drawer)).toBe("drawer");

    const places = new Set<FocusPlace>();
    for (let index = 0; index < TAB_PRESSES; index++) {
        await page.keyboard.press("Tab");
        places.add(await readFocusPlace(drawer));
    }

    expect(places.has("outside")).toBe(false);
    expect(places.has("drawer")).toBe(true);
});

test("Escape closes the drawer and returns focus to its trigger", async ({ page }) => {
    const trigger = getHeaderTrigger(page);
    await trigger.click();
    const drawer = page.locator(DRAWER_SELECTOR);
    await expect.poll(() => readFocusPlace(drawer)).toBe("drawer");

    await page.keyboard.press("Escape");

    await expect(drawer).toHaveAttribute("data-state", "closed");
    await expect(trigger).toBeFocused();
});

test("closing from the backdrop leaves nothing inert", async ({ page }) => {
    await getHeaderTrigger(page).click();
    const drawer = page.locator(DRAWER_SELECTOR);
    await expect(page.locator("[inert]")).not.toHaveCount(0);

    await page.mouse.click(BACKDROP_POINT.x, BACKDROP_POINT.y);

    await expect(drawer).toHaveAttribute("data-state", "closed");
    await expect(page.locator("[inert]")).toHaveCount(0);
});

test("widening past the drawer breakpoint leaves nothing inert", async ({ page }) => {
    await getHeaderTrigger(page).click();
    await expect(page.locator("[inert]")).not.toHaveCount(0);

    await page.setViewportSize(DESKTOP_VIEWPORT);

    await expect(page.locator(DRAWER_SELECTOR)).toHaveCount(0);
    await expect(page.locator("[inert]")).toHaveCount(0);
});
