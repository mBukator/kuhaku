import { expect, test } from "@playwright/test";

const SECTION_RHYTHM_PIXELS = 64;
const PAGES = [
    { path: "/docs/components/button", minMeasuredSections: 5 },
    { path: "/docs/installation", minMeasuredSections: 4 },
];

for (const { path, minMeasuredSections } of PAGES) {
    test(`${path} content sections sit ${SECTION_RHYTHM_PIXELS}px below the block before them`, async ({
        page,
    }) => {
        await page.goto(path);
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

        expect(gapsPixels.length).toBeGreaterThanOrEqual(minMeasuredSections);
        expect(gapsPixels).toEqual(gapsPixels.map(() => SECTION_RHYTHM_PIXELS));
    });
}
