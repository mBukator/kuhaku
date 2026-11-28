import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Locator, type Page } from "@playwright/test";

import { REGISTRY_ORIGIN } from "../lib/shared";

const PAGE_PATH = "/docs/installation";
const MARKDOWN_PATH = "/llms.mdx/docs/installation/content.md";
const REGISTRY_URL = `${REGISTRY_ORIGIN}/r/{name}.json`;
const KUHAKU_COMMAND = "npx kuhaku add button";
const SHADCN_COMMAND = "npx shadcn@latest add @kuhaku/button";
const SOURCE_DIRECTORIES = ["app", "components", "content", "lib"];
const ORIGIN_FILE = join("lib", "shared.ts");

function getConfigBlock(page: Page): Locator {
    return page.locator("#nd-page figure").filter({ hasText: "components.json" });
}

function getInstallPicker(page: Page): Locator {
    return page
        .getByRole("group", { name: "Install with", exact: true })
        .locator("xpath=ancestor::div[.//pre][1]");
}

function listFiles(directory: string): string[] {
    return readdirSync(directory, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => join(entry.parentPath, entry.name));
}

test("registers the @kuhaku namespace in components.json", async ({ page }) => {
    await page.goto(PAGE_PATH);

    const source = await getConfigBlock(page).locator("pre").textContent();

    expect(JSON.parse(source ?? "")).toEqual({
        registries: { "@kuhaku": REGISTRY_URL },
    });
});

test("offers both doors for the same component", async ({ page }) => {
    await page.goto(PAGE_PATH);
    const picker = getInstallPicker(page);

    await expect(picker.locator("pre")).toHaveText(KUHAKU_COMMAND);
    // The label covers its visually hidden radio, so the check is forced past it.
    await picker.getByRole("radio", { name: "shadcn", exact: true }).check({
        force: true,
    });
    await expect(picker.locator("pre")).toHaveText(SHADCN_COMMAND);
});

test("the Markdown for machines carries the config and both commands", async ({
    request,
}) => {
    const response = await request.get(MARKDOWN_PATH);
    const markdown = await response.text();

    expect(response.ok()).toBe(true);
    expect(markdown).toContain('```json title="components.json"');
    expect(markdown).toContain(`"@kuhaku": "${REGISTRY_URL}"`);
    expect(markdown).toContain(KUHAKU_COMMAND);
    expect(markdown).toContain(SHADCN_COMMAND);
});

test("only lib/shared.ts types the registry's domain", () => {
    const { host } = new URL(REGISTRY_ORIGIN);
    const files = SOURCE_DIRECTORIES.flatMap(listFiles);
    const typingFiles = files.filter((file) => readFileSync(file, "utf8").includes(host));

    expect(files).toContain(ORIGIN_FILE);
    expect(typingFiles).toEqual([ORIGIN_FILE]);
});
