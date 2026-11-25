import { expect, test, type Locator, type Page } from "@playwright/test";

const INTRODUCTION_PATH = "/docs";
const COMPONENT_PATH = "/docs/components/button";
const SIDEBAR_SELECTOR = "#nd-sidebar";
const MARKER_TEXT = "Soon";

function getSidebar(page: Page): Locator {
    return page.locator(SIDEBAR_SELECTOR);
}

function getSectionLabel(page: Page, title: string): Locator {
    return getSidebar(page).getByRole("paragraph").filter({ hasText: title });
}

test("the sections follow the site map, and only the empty one is marked", async ({
    page,
}) => {
    await page.goto(INTRODUCTION_PATH);

    await expect(getSidebar(page).getByRole("paragraph")).toHaveText([
        "Get started",
        `Foundations${MARKER_TEXT}`,
        "Components",
    ]);
    await expect(getSidebar(page).getByText(MARKER_TEXT, { exact: true })).toHaveCount(1);
    await expect(
        getSectionLabel(page, "Foundations").getByText(MARKER_TEXT, { exact: true })
    ).toBeVisible();
});

test("the sidebar names each page by its navigation title", async ({ page }) => {
    await page.goto(INTRODUCTION_PATH);
    const sidebar = getSidebar(page);

    await expect(
        sidebar.getByRole("link", { name: "Introduction", exact: true })
    ).toHaveAttribute("href", "/docs");
    await expect(
        sidebar.getByRole("link", { name: "Overview", exact: true })
    ).toHaveAttribute("href", "/docs/components");
});

test("a category folder opens on its own pages and stays closed elsewhere", async ({
    page,
}) => {
    const getFolder = (): Locator =>
        getSidebar(page).getByRole("button", { name: "Actions & forms", exact: true });

    await page.goto(INTRODUCTION_PATH);
    await expect(getFolder()).toHaveAttribute("aria-expanded", "false");

    await page.goto(COMPONENT_PATH);
    await expect(getFolder()).toHaveAttribute("aria-expanded", "true");
    await expect(
        getSidebar(page).getByRole("link", { name: "Button", exact: true })
    ).toHaveAttribute("href", COMPONENT_PATH);
});

test("the header links to Components, and the docs sidebar does not repeat it", async ({
    page,
}) => {
    await page.goto("/");
    await expect(
        page
            .getByRole("navigation")
            .getByRole("link", { name: "Components", exact: true })
    ).toHaveAttribute("href", "/docs/components");

    await page.goto(INTRODUCTION_PATH);
    await expect(
        getSidebar(page).getByRole("link", { name: "Components", exact: true })
    ).toHaveCount(0);
});

test("the page cards name the components index by its title, not its sidebar label", async ({
    page,
}) => {
    for (const path of [INTRODUCTION_PATH, COMPONENT_PATH]) {
        await page.goto(path);
        const card = page.locator("#nd-page").locator('a[href="/docs/components"]');

        await expect(card.getByRole("paragraph").first()).toHaveText("Components");
    }
});
