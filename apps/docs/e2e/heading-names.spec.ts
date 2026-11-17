import { expect, test } from "@playwright/test";

const PAGE_PATH = "/docs/components/button";
const SECTION_HEADINGS = [
    { level: 2, name: "Installation" },
    { level: 2, name: "Usage" },
    { level: 3, name: "Action state" },
    { level: 2, name: "API reference" },
    { level: 2, name: "Motion behavior" },
    { level: 2, name: "Accessibility" },
    { level: 2, name: "Examples" },
    { level: 3, name: "Async submit" },
] as const;
const COPY_LINK_LABEL = "Copy link to this section";

test("content headings are named by their text, without the copy button", async ({
    page,
}) => {
    await page.goto(PAGE_PATH);

    for (const { level, name } of SECTION_HEADINGS) {
        await expect(page.getByRole("heading", { level, name, exact: true })).toHaveCount(
            1
        );
    }
});

test("each content heading keeps its copy-link button", async ({ page }) => {
    await page.goto(PAGE_PATH);
    const installation = page.getByRole("heading", { name: "Installation", exact: true });

    await expect(
        installation.getByRole("button", { name: COPY_LINK_LABEL, exact: true })
    ).toHaveCount(1);
    await expect(
        installation.getByRole("link", { name: "Installation", exact: true })
    ).toHaveAttribute("href", "#installation");
});
