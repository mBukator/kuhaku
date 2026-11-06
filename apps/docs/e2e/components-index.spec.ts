import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Locator, type Page } from "@playwright/test";

const PAGE_PATH = "/docs/components";
const SEPARATOR_PATTERN = /^---(?:\[[^\]]+\])?(.+)---$/;
const MIN_TARGET_HEIGHT_PIXELS = 44;

type Category = {
    title: string;
    names: string[];
};

/** The categories and page names components/meta.json gives the sidebar. */
function readCategories(): Category[] {
    const meta: { pages: string[] } = JSON.parse(
        readFileSync(join("content", "docs", "components", "meta.json"), "utf8")
    );
    const categories: Category[] = [];

    for (const page of meta.pages) {
        const separator = SEPARATOR_PATTERN.exec(page);
        if (separator !== null) categories.push({ title: separator[1], names: [] });
        else categories.at(-1)?.names.push(page);
    }

    return categories;
}

/**
 * A category heading. Fumadocs puts a Copy Anchor Link button inside each h2, so the
 * heading has no plain name; it is found by the anchor link it holds instead.
 */
function getCategoryHeading(page: Page, title: string): Locator {
    return page
        .getByRole("heading", { level: 2 })
        .filter({ has: page.getByRole("link", { name: title, exact: true }) });
}

/** The list of links under a category heading; the sidebar repeats each name. */
function getCategoryList(page: Page, title: string): Locator {
    return getCategoryHeading(page, title).locator("xpath=following-sibling::ul[1]");
}

function readTitle(itemName: string): string {
    const item: { title: string } = JSON.parse(
        readFileSync(join("public", "r", `${itemName}.json`), "utf8")
    );

    return item.title;
}

test("lists Button under Actions & forms", async ({ page }) => {
    await page.goto(PAGE_PATH);

    await expect(getCategoryHeading(page, "Actions & forms")).toBeVisible();
    await expect(
        getCategoryList(page, "Actions & forms").getByRole("link", {
            name: "Button",
            exact: true,
        })
    ).toHaveAttribute("href", "/docs/components/button");
});

test("lists every page in components/meta.json, in its order", async ({ page }) => {
    await page.goto(PAGE_PATH);

    for (const category of readCategories()) {
        await expect(getCategoryList(page, category.title).getByRole("link")).toHaveText(
            category.names.map(readTitle)
        );
    }
});

test("each category is a table-of-contents entry", async ({ page }) => {
    await page.goto(PAGE_PATH);

    // One link is the heading's own anchor, the other its entry under "On this page".
    await expect(
        page.getByRole("link", { name: "Actions & forms", exact: true })
    ).toHaveCount(2);
    await expect(getCategoryHeading(page, "Actions & forms")).toHaveAttribute(
        "id",
        "actions-forms"
    );
});

test("a name opens its component page", async ({ page }) => {
    await page.goto(PAGE_PATH);

    await getCategoryList(page, "Actions & forms")
        .getByRole("link", { name: "Button", exact: true })
        .click();

    await expect(page).toHaveURL(/\/docs\/components\/button$/);
    await expect(
        page.getByRole("heading", { name: "Button", exact: true })
    ).toBeVisible();
});

test("each name is at least 44px tall", async ({ page }) => {
    await page.goto(PAGE_PATH);

    const box = await getCategoryList(page, "Actions & forms")
        .getByRole("link", { name: "Button", exact: true })
        .boundingBox();

    expect(box?.height).toBeGreaterThanOrEqual(MIN_TARGET_HEIGHT_PIXELS);
});

test("the Markdown for machines carries the index", async ({ request }) => {
    const response = await request.get("/llms.mdx/docs/components/content.md");
    const markdown = await response.text();

    expect(response.ok()).toBe(true);
    expect(markdown).toContain("## Actions & forms");
    expect(markdown).toContain("[Button](/docs/components/button)");
});
