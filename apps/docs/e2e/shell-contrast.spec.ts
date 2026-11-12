import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

const SHELL_PAGE_PATHS = ["/docs/components/button", "/docs/components"] as const;
const COLOR_MODES = ["light", "dark"] as const;
const THEME_STORAGE_KEY = "theme";
const HIGHLIGHT_TIMEOUT_MILLISECONDS = 15_000;
const PHONE_VIEWPORT = { width: 375, height: 812 };
const MOBILE_DRAWER_SELECTOR = "#nd-sidebar-mobile";
const AUDIT_TIMEOUT_MILLISECONDS = 60_000;

type ColorMode = (typeof COLOR_MODES)[number];

// Two highlight waits and two axe passes outrun the 30s default on a cold, loaded server.
test.describe.configure({ timeout: AUDIT_TIMEOUT_MILLISECONDS });

async function openInColorMode(page: Page, path: string, mode: ColorMode): Promise<void> {
    await page.addInitScript(([key, value]) => window.localStorage.setItem(key, value), [
        THEME_STORAGE_KEY,
        mode,
    ] as const);
    await page.goto(path);
    await expect(page.locator("html")).toHaveClass(new RegExp(`\\b${mode}\\b`));
    // Search shows ⌘ until hydration reads the profile's Windows user agent and swaps in Ctrl;
    // axe cannot measure a lone symbol.
    await expect(page.locator("kbd", { hasText: "⌘" })).toHaveCount(0);
}

/** Waits until Shiki has colored every code block; until then a block shows plain text. */
async function waitForHighlightedCode(page: Page): Promise<void> {
    await expect(page.locator("pre .line:not(:empty):not(:has(span))")).toHaveCount(0, {
        timeout: HIGHLIGHT_TIMEOUT_MILLISECONDS,
    });
}

async function openCodeTabs(page: Page): Promise<void> {
    for (const tab of await page.getByRole("tab", { name: "Code", exact: true }).all()) {
        await tab.click();
    }
}

/** Opens the mobile navigation drawer and waits for its slide-in to settle. */
async function openMobileDrawer(page: Page): Promise<Locator> {
    // The drawer holds a second, hidden "Open Sidebar" button; the header's is the visible one.
    await page
        .getByRole("button", { name: "Open Sidebar", exact: true })
        .filter({ visible: true })
        .click();
    const drawer = page.locator(MOBILE_DRAWER_SELECTOR);
    await expect(drawer).toHaveAttribute("data-state", "open");
    await expect
        .poll(() => drawer.evaluate((element) => element.getAnimations().length))
        .toBe(0);
    return drawer;
}

/** The computed --sidebar color, read through a probe so both sides share one format. */
async function readSidebarSurface(page: Page): Promise<string> {
    return page.evaluate(() => {
        const probe = document.createElement("div");
        probe.style.backgroundColor = "var(--sidebar)";
        document.body.append(probe);
        const color = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return color;
    });
}

async function findContrastFailures(
    page: Page,
    scopeSelector?: string
): Promise<string[]> {
    const builder = new AxeBuilder({ page }).withRules(["color-contrast"]);
    const results = await (
        scopeSelector === undefined ? builder : builder.include(scopeSelector)
    ).analyze();
    // Unmeasured contrast counts as a failure, as in the registry's axe matcher.
    return [...results.violations, ...results.incomplete].flatMap((result) =>
        result.nodes.map(
            (node) => `${node.target.join(" ")}: ${node.failureSummary ?? ""}`
        )
    );
}

for (const path of SHELL_PAGE_PATHS) {
    for (const mode of COLOR_MODES) {
        test(`${path} chrome and code clear 4.5:1 in ${mode} mode`, async ({ page }) => {
            await openInColorMode(page, path, mode);
            await waitForHighlightedCode(page);
            const failures = await findContrastFailures(page);

            await openCodeTabs(page);
            await waitForHighlightedCode(page);
            failures.push(...(await findContrastFailures(page)));

            expect(failures).toEqual([]);
        });
    }
}

for (const mode of COLOR_MODES) {
    test(`the mobile drawer sits on the sidebar surface and clears 4.5:1 in ${mode} mode`, async ({
        page,
    }) => {
        await page.setViewportSize(PHONE_VIEWPORT);
        await openInColorMode(page, SHELL_PAGE_PATHS[0], mode);
        const drawer = await openMobileDrawer(page);

        await expect(drawer).toHaveCSS(
            "background-color",
            await readSidebarSurface(page)
        );
        expect(await findContrastFailures(page, MOBILE_DRAWER_SELECTOR)).toEqual([]);
    });
}
