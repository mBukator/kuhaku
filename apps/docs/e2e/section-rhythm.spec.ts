import { expect, test } from "@playwright/test";

const PAGE_PATH = "/docs/components/button";
const SECTION_RHYTHM_PIXELS = 64;
const MIN_MEASURED_SECTIONS = 5;

test(`content sections sit ${SECTION_RHYTHM_PIXELS}px below the block before them`, async ({
    page,
}) => {
    await page.goto(PAGE_PATH);
    // Content h2s carry an anchor link; the playground's own h2 does not.
    const sectionHeadings = page
        .locator("h2")
        .filter({ has: page.locator("a[href^='#']") });

    const gapsPixels = await sectionHeadings.evaluateAll((headings) =>
        headings.flatMap((heading) => {
            const previous = heading.previousElementSibling;
            if (previous === null) return [];
            const gap =
                heading.getBoundingClientRect().top -
                previous.getBoundingClientRect().bottom;
            return [Math.round(gap)];
        })
    );

    expect(gapsPixels.length).toBeGreaterThanOrEqual(MIN_MEASURED_SECTIONS);
    expect(gapsPixels).toEqual(gapsPixels.map(() => SECTION_RHYTHM_PIXELS));
});
