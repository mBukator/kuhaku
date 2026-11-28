import { expect, test, type Locator, type Page } from "@playwright/test";

const PAGE_PATH = "/";
const POSITIONING_SENTENCE =
    "The motion-first design system where every interaction is crafted and every still surface is dignified.";
const SECTION_RHYTHM_PIXELS = 96;
const PHONE_VIEWPORT = { width: 375, height: 812 };
const INSTALL_COMMAND = "npx kuhaku add button";
const LINKS = [
    { name: "Read the docs", href: "/docs" },
    { name: "Browse components", href: "/docs/components" },
    { name: "Installation", href: "/docs/installation" },
];

function getContent(page: Page): Locator {
    return page.locator("#nd-home-layout");
}

test("is titled and described", async ({ page }) => {
    await page.goto(PAGE_PATH);

    await expect(page).toHaveTitle("Kuhaku");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /motion-first design system/
    );
});

test("the positioning sentence is the only top-level heading", async ({ page }) => {
    await page.goto(PAGE_PATH);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText([
        POSITIONING_SENTENCE,
    ]);
});

test("states both wedges, then the install step", async ({ page }) => {
    await page.goto(PAGE_PATH);

    await expect(page.getByRole("heading", { level: 2 })).toHaveText([
        "Motion is a contract",
        "Every value is argued",
        "Install a component",
    ]);
});

for (const { name, href } of LINKS) {
    test(`links "${name}" to ${href}`, async ({ page }) => {
        await page.goto(PAGE_PATH);

        await expect(
            getContent(page).getByRole("link", { name, exact: true })
        ).toHaveAttribute("href", href);
    });
}

test("shows one install command", async ({ page }) => {
    await page.goto(PAGE_PATH);

    await expect(getContent(page).locator("pre")).toHaveText([INSTALL_COMMAND]);
});

test(`sections sit ${SECTION_RHYTHM_PIXELS}px apart`, async ({ page }) => {
    await page.goto(PAGE_PATH);

    const gapsPixels = await getContent(page)
        .locator("section")
        .evaluateAll((sections) =>
            sections.slice(1).map((section, index) => {
                const previous = sections[index].getBoundingClientRect();
                return Math.round(section.getBoundingClientRect().top - previous.bottom);
            })
        );

    expect(gapsPixels).toEqual([SECTION_RHYTHM_PIXELS, SECTION_RHYTHM_PIXELS]);
});

test("fits a phone without scrolling sideways", async ({ page }) => {
    await page.setViewportSize(PHONE_VIEWPORT);
    await page.goto(PAGE_PATH);
    // The command renders on the client, and it is the widest thing on the page.
    await expect(getContent(page).locator("pre")).toHaveText(INSTALL_COMMAND);

    const overflowPixels = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    const rightEdgesPixels = await getContent(page)
        .locator("section, section > *")
        .evaluateAll((elements) =>
            elements.map((element) => element.getBoundingClientRect().right)
        );

    expect(overflowPixels).toBeLessThanOrEqual(0);
    expect(Math.max(...rightEdgesPixels)).toBeLessThanOrEqual(PHONE_VIEWPORT.width);
});
