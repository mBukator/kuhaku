import { expect, test, type Locator, type Page } from "@playwright/test";

import { readApiReference } from "../lib/api-reference";

const PAGE_PATH = "/docs/components/button";
const BUTTON_IMPORT = 'import { Button } from "@/components/ui/button";';
const PLUS_IMPORT = 'import { Plus } from "lucide-react";';
const DEFAULT_SNIPPET = [BUTTON_IMPORT, "", "<Button>Save changes</Button>"].join("\n");
const CONTROL_ROLES = {
    variant: "combobox",
    size: "combobox",
    state: "combobox",
    focusableWhenDisabled: "switch",
    disabled: "switch",
    label: "textbox",
} as const satisfies Record<string, "combobox" | "switch" | "textbox">;
const SELECT_NAMES = ["variant", "size", "state"] as const;
const STORAGE_KEY = "kuhaku-install-preference";
const HYDRATION_ERROR_PATTERN = /hydrat|#418|#423|#425/i;
const COPY_CONFIRMATION_MILLISECONDS = 1500;
const HIGHLIGHT_TIMEOUT_MILLISECONDS = 15_000;

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

function getControls(page: Page): Locator {
    return page.getByRole("region", { name: "Customize", exact: true });
}

/** The playground's stage; the demos further down render their own Preview panels. */
function getStage(page: Page): Locator {
    return page.getByRole("tabpanel", { name: "Preview", exact: true }).first();
}

type ControlName = keyof typeof CONTROL_ROLES;

function getControl(page: Page, name: ControlName): Locator {
    return getControls(page).getByRole(CONTROL_ROLES[name], { name, exact: true });
}

async function chooseOption(
    page: Page,
    controlName: ControlName,
    option: string
): Promise<void> {
    await getControl(page, controlName).click();
    await page.getByRole("option", { name: option, exact: true }).click();
}

/** Opens the playground's Code tab and returns its code block. */
async function openCode(page: Page): Promise<Locator> {
    await page.getByRole("tab", { name: "Code", exact: true }).first().click();

    return page
        .getByRole("tabpanel", { name: "Code", exact: true })
        .first()
        .locator("pre");
}

async function expectSnippet(page: Page, snippet: string): Promise<void> {
    const codeBlock = await openCode(page);

    // Until Shiki loads its theme the block is a placeholder whose lines carry no newlines.
    await expect
        .poll(() => codeBlock.textContent(), { timeout: HIGHLIGHT_TIMEOUT_MILLISECONDS })
        .toBe(snippet);
}

/** Waits out the debounced `replaceState` until the URL carries `name=value`. */
async function expectSetting(page: Page, name: string, value: string): Promise<void> {
    await expect.poll(() => new URL(page.url()).searchParams.get(name)).toBe(value);
}

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

async function readClipboard(page: Page): Promise<string> {
    const text = await page.evaluate(() => navigator.clipboard.readText());

    // The Windows clipboard stores CRLF; the copied text itself uses LF.
    return text.replaceAll("\r\n", "\n");
}

test.describe("playground", () => {
    test("starts at the defaults", async ({ page }) => {
        await page.goto(PAGE_PATH);

        await expect(getControl(page, "variant")).toHaveText("primary");
        await expect(getControl(page, "size")).toHaveText("md");
        await expect(getControl(page, "state")).toHaveText("idle");
        await expect(getControl(page, "disabled")).not.toBeChecked();
        await expect(getControl(page, "label")).toHaveValue("Save changes");
        await expect(getStage(page).getByRole("button")).toHaveAccessibleName(
            "Save changes"
        );
        await expectSnippet(page, DEFAULT_SNIPPET);
    });

    test("offers exactly the union members ButtonProps declares", async ({ page }) => {
        const properties = readApiReference("button");
        await page.goto(PAGE_PATH);

        expect(
            properties
                .filter((property) => property.options !== undefined)
                .map((property) => property.name)
        ).toEqual(SELECT_NAMES);
        for (const name of SELECT_NAMES) {
            const options = properties.find(
                (property) => property.name === name
            )?.options;

            await getControl(page, name).click();
            await expect(page.getByRole("option")).toHaveText(options ?? []);
            await page.keyboard.press("Escape");
        }
    });

    test("prints a changed variant in the code", async ({ page }) => {
        await page.goto(PAGE_PATH);

        await chooseOption(page, "variant", "secondary");

        await expect(getControl(page, "variant")).toHaveText("secondary");
        await expectSnippet(
            page,
            [BUTTON_IMPORT, "", '<Button variant="secondary">Save changes</Button>'].join(
                "\n"
            )
        );
    });

    test("an icon size moves the label to aria-label and imports Plus", async ({
        page,
    }) => {
        await page.goto(PAGE_PATH);

        await chooseOption(page, "size", "icon");

        const stageButton = getStage(page).getByRole("button");
        await expect(stageButton).toHaveAttribute("aria-label", "Save changes");
        await expect(stageButton).not.toContainText("Save changes");
        await expectSnippet(
            page,
            [
                BUTTON_IMPORT,
                PLUS_IMPORT,
                "",
                '<Button size="icon" aria-label="Save changes">',
                "    <Plus />",
                "</Button>",
            ].join("\n")
        );
    });

    test("disables the stage button", async ({ page }) => {
        await page.goto(PAGE_PATH);

        await getControl(page, "disabled").click();

        await expect(getControl(page, "disabled")).toBeChecked();
        await expect(getStage(page).getByRole("button")).toBeDisabled();
        await expectSnippet(
            page,
            [BUTTON_IMPORT, "", "<Button disabled>Save changes</Button>"].join("\n")
        );
    });

    test("Replay shows a settled success again", async ({ page }) => {
        await page.goto(PAGE_PATH);
        const stageButton = getStage(page).getByRole("button");

        await chooseOption(page, "state", "success");
        await expect(stageButton).toHaveAttribute("data-state", "success");
        await expect(stageButton).toHaveAttribute("data-state", "idle");

        await getControls(page)
            .getByRole("button", { name: "Replay", exact: true })
            .click();

        await expect(stageButton).toHaveAttribute("data-state", "success");
    });

    test("Reset restores the defaults and focuses the heading", async ({ page }) => {
        await page.goto(PAGE_PATH);
        const controls = getControls(page);

        await chooseOption(page, "variant", "ghost");
        await getControl(page, "label").fill("Ship it");
        await expectSetting(page, "label", "Ship it");
        await controls.getByRole("button", { name: "Reset", exact: true }).click();

        await expect(
            controls.getByRole("heading", { name: "Customize", exact: true })
        ).toBeFocused();
        await expect(
            controls.getByRole("button", { name: "Reset", exact: true })
        ).toHaveCount(0);
        await expect(getControl(page, "variant")).toHaveText("primary");
        await expect(getControl(page, "label")).toHaveValue("Save changes");
        await expect.poll(() => new URL(page.url()).search).toBe("");
        await expectSnippet(page, DEFAULT_SNIPPET);
    });

    test("Tab reaches every action and control in order", async ({ page }) => {
        await page.goto(`${PAGE_PATH}?state=success`);
        const controls = getControls(page);
        const targets = [
            controls.getByRole("button", { name: "Replay", exact: true }),
            controls.getByRole("button", { name: "Reset", exact: true }),
            controls.getByRole("button", { name: "Copy link", exact: true }),
            ...Object.keys(CONTROL_ROLES).map((name) =>
                getControl(page, name as ControlName)
            ),
        ];

        await controls.getByRole("heading", { name: "Customize", exact: true }).focus();

        for (const target of targets) {
            await page.keyboard.press("Tab");
            await expect(target).toBeFocused();
        }
    });
});

test.describe("copy", () => {
    test.use({ permissions: ["clipboard-read", "clipboard-write"] });

    test("Copy Text copies the code the Code tab shows", async ({ page }) => {
        const snippet = [
            BUTTON_IMPORT,
            "",
            '<Button variant="destructive">Save changes</Button>',
        ].join("\n");
        await page.goto(PAGE_PATH);

        await chooseOption(page, "variant", "destructive");
        await expectSnippet(page, snippet);
        await page
            .getByRole("tabpanel", { name: "Code", exact: true })
            .first()
            .getByRole("button", { name: "Copy Text", exact: true })
            .click();

        expect(await readClipboard(page)).toBe(snippet);
    });

    test("Copy link copies the URL with the current settings", async ({ page }) => {
        await page.goto(`${PAGE_PATH}?ref=docs`);

        await chooseOption(page, "variant", "ghost");
        await getControls(page)
            .getByRole("button", { name: "Copy link", exact: true })
            .click();

        await expect(getControls(page).getByRole("status")).toHaveText("Link copied");
        const copied = new URL(await readClipboard(page));
        expect(copied.pathname).toBe(PAGE_PATH);
        expect(copied.searchParams.get("variant")).toBe("ghost");
        expect(copied.searchParams.get("ref")).toBe("docs");
    });

    test("the confirmation clears, so a second copy is announced again", async ({
        page,
    }) => {
        await page.goto(PAGE_PATH);
        const controls = getControls(page);
        const status = controls.getByRole("status");
        const copyLink = controls.getByRole("button", { name: "Copy link", exact: true });

        await chooseOption(page, "variant", "ghost");
        await copyLink.click();
        await expect(status).toHaveText("Link copied");
        await expect(status).toHaveText("");

        await copyLink.click();
        await expect(status).toHaveText("Link copied");
    });

    test("a failed copy stays on screen", async ({ page }) => {
        await page.addInitScript(() => {
            navigator.clipboard.writeText = () =>
                Promise.reject(new Error("Clipboard write denied"));
        });
        await page.goto(PAGE_PATH);
        const status = getControls(page).getByRole("status");

        await chooseOption(page, "variant", "ghost");
        await getControls(page)
            .getByRole("button", { name: "Copy link", exact: true })
            .click();
        await expect(status).toHaveText("Could not copy the link");
        await page.waitForTimeout(COPY_CONFIRMATION_MILLISECONDS + 500);

        await expect(status).toHaveText("Could not copy the link");
    });
});

test.describe("URL sync", () => {
    test("a shared link applies its settings", async ({ page }) => {
        await page.goto(
            `${PAGE_PATH}?variant=secondary&size=lg&disabled=true&label=Ship+it`
        );

        await expect(getControl(page, "variant")).toHaveText("secondary");
        await expect(getControl(page, "size")).toHaveText("lg");
        await expect(getControl(page, "disabled")).toBeChecked();
        await expect(getControl(page, "label")).toHaveValue("Ship it");
        await expectSnippet(
            page,
            [
                BUTTON_IMPORT,
                "",
                '<Button variant="secondary" size="lg" disabled>',
                "    Ship it",
                "</Button>",
            ].join("\n")
        );
    });

    test("ignores values the controls reject", async ({ page }) => {
        const tooLongLabel = "x".repeat(41);
        await page.goto(
            `${PAGE_PATH}?variant=huge&size=toString&disabled=yes&label=${tooLongLabel}`
        );

        await expect(getControl(page, "variant")).toHaveText("primary");
        await expect(getControl(page, "size")).toHaveText("md");
        await expect(getControl(page, "disabled")).not.toBeChecked();
        await expect(getControl(page, "label")).toHaveValue("Save changes");
        await expectSnippet(page, DEFAULT_SNIPPET);
    });

    test("renders a label holding HTML as text", async ({ page }) => {
        const label = "<img src=x onerror=alert(1)>";
        const dialogs: string[] = [];
        page.on("dialog", (dialog) => {
            dialogs.push(dialog.message());
            void dialog.dismiss();
        });
        await page.goto(`${PAGE_PATH}?${new URLSearchParams({ label }).toString()}`);

        await expect(getStage(page).getByRole("button")).toHaveText(label);
        await expect(getStage(page).locator("img")).toHaveCount(0);
        await expectSnippet(
            page,
            [BUTTON_IMPORT, "", `<Button>{${JSON.stringify(label)}}</Button>`].join("\n")
        );
        expect(dialogs).toEqual([]);
    });

    test("replaces the history entry instead of pushing one", async ({ page }) => {
        await page.goto(PAGE_PATH);
        const historyLength = await page.evaluate(() => window.history.length);

        await chooseOption(page, "variant", "ghost");
        await expectSetting(page, "variant", "ghost");
        await chooseOption(page, "size", "lg");
        await expectSetting(page, "size", "lg");

        expect(await page.evaluate(() => window.history.length)).toBe(historyLength);
    });

    test("keeps unrelated params and the hash", async ({ page }) => {
        await page.goto(`${PAGE_PATH}?ref=docs#usage`);

        await chooseOption(page, "variant", "secondary");
        await expectSetting(page, "variant", "secondary");

        const url = new URL(page.url());
        expect(url.searchParams.get("ref")).toBe("docs");
        expect(url.hash).toBe("#usage");
    });

    test("a reload restores the settings", async ({ page }) => {
        await page.goto(PAGE_PATH);

        await chooseOption(page, "variant", "ghost");
        await expectSetting(page, "variant", "ghost");
        await page.reload();

        await expect(getControl(page, "variant")).toHaveText("ghost");
    });

    test("Back leaves the page in one step", async ({ page }) => {
        await page.goto("/docs/components");
        await page.goto(PAGE_PATH);

        await chooseOption(page, "variant", "ghost");
        await expectSetting(page, "variant", "ghost");
        await getControl(page, "label").fill("Ship it");
        await expectSetting(page, "label", "Ship it");
        await page.goBack();

        expect(new URL(page.url()).pathname).toBe("/docs/components");
    });
});

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

test.describe("examples", () => {
    function getLinkDemo(page: Page): Locator {
        return page.getByRole("link", { name: "Browse components", exact: true });
    }

    test("the link styled as a button stays a link at 48px", async ({ page }) => {
        await page.goto(PAGE_PATH);
        const link = getLinkDemo(page);

        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", "/docs/components");
        await expect(
            page.getByRole("button", { name: "Browse components", exact: true })
        ).toHaveCount(0);
        expect((await link.boundingBox())?.height).toBe(48);
    });

    test("the link styled as a button shows the focus ring", async ({ page }) => {
        await page.goto(PAGE_PATH);
        const link = getLinkDemo(page);
        const readRingOpacity = (): Promise<string> =>
            link.evaluate((element) => getComputedStyle(element, "::after").opacity);

        expect(await readRingOpacity()).toBe("0");
        // A key press first, so the scripted focus counts as keyboard focus.
        await page.keyboard.press("Tab");
        await link.focus();

        await expect.poll(readRingOpacity).toBe("1");
    });

    test("Enter on the link styled as a button navigates", async ({ page }) => {
        await page.goto(PAGE_PATH);

        await getLinkDemo(page).focus();
        await page.keyboard.press("Enter");

        await expect(page).toHaveURL(/\/docs\/components$/);
    });

    test("the icon-only demo renders its icon at 16px", async ({ page }) => {
        await page.goto(PAGE_PATH);
        const icon = page
            .getByRole("button", { name: "Add item", exact: true })
            .locator("svg");

        await expect(icon).toBeVisible();
        expect(await icon.boundingBox()).toMatchObject({ width: 16, height: 16 });
    });
});
