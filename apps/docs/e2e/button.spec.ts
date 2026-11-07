import { expect, test, type Locator, type Page } from "@playwright/test";

const PAGE_PATH = "/docs/components/button";
const STORAGE_KEY = "kuhaku-install-preference";
const HYDRATION_ERROR_PATTERN = /hydrat|#418|#423|#425/i;

const INSTALL_COMMANDS = [
    { packageManager: "npm", door: "kuhaku", command: "npx kuhaku add button" },
    { packageManager: "pnpm", door: "kuhaku", command: "pnpm dlx kuhaku add button" },
    { packageManager: "yarn", door: "kuhaku", command: "yarn dlx kuhaku add button" },
    { packageManager: "bun", door: "kuhaku", command: "bunx --bun kuhaku add button" },
    {
        packageManager: "npm",
        door: "shadcn",
        command: "npx shadcn@latest add @kuhaku/button",
    },
    {
        packageManager: "pnpm",
        door: "shadcn",
        command: "pnpm dlx shadcn@latest add @kuhaku/button",
    },
    {
        packageManager: "yarn",
        door: "shadcn",
        command: "yarn dlx shadcn@latest add @kuhaku/button",
    },
    {
        packageManager: "bun",
        door: "shadcn",
        command: "bunx --bun shadcn@latest add @kuhaku/button",
    },
];

/** The picker's code block has no accessible name, so it is scoped from the picker. */
function getInstallCommand(page: Page): Locator {
    return page
        .getByRole("group", { name: "Package manager", exact: true })
        .locator("xpath=ancestor::div[.//pre][1]")
        .locator("pre");
}

function getInstallOption(page: Page, group: string, option: string): Locator {
    return page
        .getByRole("group", { name: group, exact: true })
        .getByRole("radio", { name: option, exact: true });
}

async function chooseInstallOption(
    page: Page,
    group: string,
    option: string
): Promise<void> {
    // The label covers its visually hidden radio, so the click lands on the label, as a reader's does.
    await getInstallOption(page, group, option).check({ force: true });
}

/** Collects the console errors that report a hydration mismatch. */
function collectHydrationErrors(page: Page): string[] {
    const errors: string[] = [];
    page.on("console", (message) => {
        if (message.type() !== "error") return;
        if (HYDRATION_ERROR_PATTERN.test(message.text())) errors.push(message.text());
    });
    page.on("pageerror", (error) => {
        if (HYDRATION_ERROR_PATTERN.test(error.message)) errors.push(error.message);
    });

    return errors;
}

async function storePreference(page: Page, stored: string): Promise<void> {
    await page.addInitScript(([key, value]) => window.localStorage.setItem(key, value), [
        STORAGE_KEY,
        stored,
    ] as const);
}

test.describe("install picker", () => {
    test("starts at npm through the kuhaku CLI", async ({ page }) => {
        await page.goto(PAGE_PATH);

        await expect(getInstallOption(page, "Package manager", "npm")).toBeChecked();
        await expect(getInstallOption(page, "Install with", "kuhaku")).toBeChecked();
        await expect(getInstallCommand(page)).toHaveText("npx kuhaku add button");
    });

    for (const { packageManager, door, command } of INSTALL_COMMANDS) {
        test(`${packageManager} with ${door} prints ${command}`, async ({ page }) => {
            await page.goto(PAGE_PATH);

            await chooseInstallOption(page, "Package manager", packageManager);
            await chooseInstallOption(page, "Install with", door);

            await expect(getInstallCommand(page)).toHaveText(command);
        });
    }

    test("the choice survives a reload", async ({ page }) => {
        await page.goto(PAGE_PATH);

        await chooseInstallOption(page, "Package manager", "bun");
        await chooseInstallOption(page, "Install with", "shadcn");
        await page.reload();

        await expect(getInstallOption(page, "Package manager", "bun")).toBeChecked();
        await expect(getInstallOption(page, "Install with", "shadcn")).toBeChecked();
        await expect(getInstallCommand(page)).toHaveText(
            "bunx --bun shadcn@latest add @kuhaku/button"
        );
    });

    test("a stored field it does not know falls back to its default", async ({
        page,
    }) => {
        await storePreference(
            page,
            JSON.stringify({ packageManager: "yarn", door: "npm" })
        );
        await page.goto(PAGE_PATH);

        await expect(getInstallCommand(page)).toHaveText("yarn dlx kuhaku add button");
    });

    test("a stored value that is not JSON falls back to the defaults", async ({
        page,
    }) => {
        await storePreference(page, "{");
        await page.goto(PAGE_PATH);

        await expect(getInstallCommand(page)).toHaveText("npx kuhaku add button");
    });

    test("hydrates a stored choice without a mismatch", async ({ page }) => {
        const hydrationErrors = collectHydrationErrors(page);
        await storePreference(
            page,
            JSON.stringify({ packageManager: "pnpm", door: "shadcn" })
        );
        await page.goto(PAGE_PATH);

        await expect(getInstallCommand(page)).toHaveText(
            "pnpm dlx shadcn@latest add @kuhaku/button"
        );
        await expect(getInstallOption(page, "Package manager", "pnpm")).toBeChecked();
        expect(hydrationErrors).toEqual([]);
    });

    test("a choice in one tab reaches a picker open in another", async ({
        page,
        context,
    }) => {
        const otherPage = await context.newPage();
        await page.goto(PAGE_PATH);
        await otherPage.goto(PAGE_PATH);

        await chooseInstallOption(page, "Package manager", "yarn");

        await expect(
            getInstallOption(otherPage, "Package manager", "yarn")
        ).toBeChecked();
        await expect(getInstallCommand(otherPage)).toHaveText(
            "yarn dlx kuhaku add button"
        );
    });

    test("a choice made in another tab while the picker was unmounted shows on return", async ({
        page,
        context,
    }) => {
        await page.goto(PAGE_PATH);
        await expect(getInstallCommand(page)).toHaveText("npx kuhaku add button");
        await page.evaluate(() => Reflect.set(window, "isSamePageLoad", true));

        await page.getByRole("link", { name: "Components", exact: true }).first().click();
        await expect(page).toHaveURL(/\/docs\/components$/);
        const otherPage = await context.newPage();
        await otherPage.goto(PAGE_PATH);
        await chooseInstallOption(otherPage, "Package manager", "bun");
        await page.getByRole("link", { name: "Button", exact: true }).first().click();

        await expect(page).toHaveURL(new RegExp(`${PAGE_PATH}$`));
        await expect(getInstallCommand(page)).toHaveText("bunx --bun kuhaku add button");
        expect(await page.evaluate(() => Reflect.get(window, "isSamePageLoad"))).toBe(
            true
        );
    });
});
