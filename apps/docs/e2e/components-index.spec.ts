import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Locator, type Page } from "@playwright/test";

const PAGE_PATH = "/docs/components";
const COMPONENTS_DIRECTORY = join("content", "docs", "components");
const INDEX_PAGE_NAME = "index";
const MIN_TARGET_HEIGHT_PIXELS = 44;

type Meta = {
    title?: string;
    pages: string[];
};

type Category = {
    title: string;
    names: string[];
};

function readMeta(...pathSegments: string[]): Meta {
    return JSON.parse(
        readFileSync(join(COMPONENTS_DIRECTORY, ...pathSegments, "meta.json"), "utf8")
    );
}

/** One category per (group) folder components/meta.json lists, with its pages in order. */
function readCategories(): Category[] {
    return readMeta()
        .pages.filter((page) => page !== INDEX_PAGE_NAME)
        .map((folderName) => {
            const meta = readMeta(folderName);
            return { title: meta.title ?? folderName, names: meta.pages };
        });
}

function getCategoryHeading(page: Page, title: string): Locator {
    return page.getByRole("heading", { level: 2, name: title, exact: true });
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

test("lists every page of every category folder, in its order", async ({ page }) => {
    const categories = readCategories();
    await page.goto(PAGE_PATH);

    expect(categories.length).toBeGreaterThan(0);
    for (const category of categories) {
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
