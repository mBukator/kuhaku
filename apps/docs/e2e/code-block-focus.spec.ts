import { expect, test, type Page } from "@playwright/test";

const PAGE_PATH = "/docs/components/button";
const PHONE_VIEWPORT = { width: 375, height: 812 };
const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

type CodeBlockCensus = { mismatched: string[]; scrolling: number; fitting: number };

/** Every shown code block's scroll box: whether it scrolls, and whether that matches its Tab stop. */
async function readCodeBlocks(page: Page): Promise<CodeBlockCensus> {
    return page.evaluate(() => {
        const census: CodeBlockCensus = { mismatched: [], scrolling: 0, fitting: 0 };
        const viewports = document.querySelectorAll<HTMLElement>(
            "figure.shiki > [role='region']"
        );
        for (const viewport of viewports) {
            if (viewport.getClientRects().length === 0) continue;
            const isScrolling =
                viewport.scrollWidth > viewport.clientWidth ||
                viewport.scrollHeight > viewport.clientHeight;
            if (isScrolling) census.scrolling++;
            else census.fitting++;
            if ((viewport.tabIndex === 0) !== isScrolling) {
                census.mismatched.push(viewport.innerText.trim().split("\n")[0] ?? "");
            }
        }
        return census;
    });
}

test("at 1280px a code block that fits is not a Tab stop", async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto(PAGE_PATH);

    await expect.poll(async () => (await readCodeBlocks(page)).mismatched).toEqual([]);
    expect((await readCodeBlocks(page)).fitting).toBeGreaterThan(0);
});

test("at 375px a code block that scrolls stays a Tab stop", async ({ page }) => {
    await page.setViewportSize(PHONE_VIEWPORT);
    await page.goto(PAGE_PATH);

    await expect.poll(async () => (await readCodeBlocks(page)).mismatched).toEqual([]);
    expect((await readCodeBlocks(page)).scrolling).toBeGreaterThan(0);
});

test("at 375px an install command that outgrows its box becomes a Tab stop", async ({
    page,
}) => {
    await page.setViewportSize(PHONE_VIEWPORT);
    await page.goto(PAGE_PATH);
    await expect.poll(async () => (await readCodeBlocks(page)).mismatched).toEqual([]);
    const scrollingBefore = (await readCodeBlocks(page)).scrolling;

    await page
        .getByRole("group", { name: "Package manager", exact: true })
        .getByRole("radio", { name: "bun", exact: true })
        .check({ force: true });
    await page
        .getByRole("group", { name: "Install with", exact: true })
        .getByRole("radio", { name: "shadcn", exact: true })
        .check({ force: true });

    await expect
        .poll(async () => (await readCodeBlocks(page)).scrolling)
        .toBeGreaterThan(scrollingBefore);
    expect((await readCodeBlocks(page)).mismatched).toEqual([]);
});

test("a code block that starts to scroll when the window narrows becomes a Tab stop", async ({
    page,
}) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto(PAGE_PATH);
    await expect.poll(async () => (await readCodeBlocks(page)).mismatched).toEqual([]);
    const scrollingBefore = (await readCodeBlocks(page)).scrolling;

    await page.setViewportSize(PHONE_VIEWPORT);

    await expect
        .poll(async () => (await readCodeBlocks(page)).scrolling)
        .toBeGreaterThan(scrollingBefore);
    expect((await readCodeBlocks(page)).mismatched).toEqual([]);
});

test("a code block mounted by its tab takes the Tab stop it needs", async ({ page }) => {
    await page.setViewportSize(PHONE_VIEWPORT);
    await page.goto(PAGE_PATH);
    await expect.poll(async () => (await readCodeBlocks(page)).mismatched).toEqual([]);
    const scrollingBefore = (await readCodeBlocks(page)).scrolling;

    await page.getByRole("tab", { name: "Code", exact: true }).first().click();

    await expect
        .poll(async () => (await readCodeBlocks(page)).scrolling)
        .toBeGreaterThan(scrollingBefore);
    expect((await readCodeBlocks(page)).mismatched).toEqual([]);
});
