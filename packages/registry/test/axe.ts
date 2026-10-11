import axe, { type AxeResults, type Result } from "axe-core";

// The AA floor the spec audits against; best-practice rules such as `region`
// judge page structure, which a component rendered alone does not have.
const WCAG_AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

type MatcherResult = { pass: boolean; message: () => string };

// Type parameters copied from Vitest's own `Matchers`; merging requires them identical.
declare module "vitest" {
    interface Matchers<
        R extends void | Promise<void> = void | Promise<void>,
        T = unknown,
    > {
        toHaveNoViolations: () => R;
    }
}

const CONTRAST_RULES = new Set(["color-contrast", "color-contrast-enhanced"]);

// Strict mode promises AAA contrast, so it is held to 7:1 on top of the AA floor.
export function runAxe(element: Element): Promise<AxeResults> {
    const isStrict = document.documentElement.dataset.a11y === "strict";
    const tags = isStrict ? [...WCAG_AA_TAGS, "wcag2aaa"] : WCAG_AA_TAGS;
    return axe.run(element, { runOnly: { type: "tag", values: tags } });
}

function formatResult(result: Result): string {
    const nodes = result.nodes.map((node) => {
        const reason =
            node.failureSummary ?? node.any.map((check) => check.message).join("; ");
        return `  ${node.target.join(" ")}\n    ${reason}`;
    });
    return [`${result.id}: ${result.help}`, ...nodes].join("\n");
}

// axe reports contrast it cannot measure (an overlapping element, a background
// image) as incomplete, not as a violation; passing on it would let the gate
// pass without having measured anything.
function isUnmeasuredContrast(result: Result): boolean {
    return CONTRAST_RULES.has(result.id) && result.nodes.length > 0;
}

export function toHaveNoViolations(results: AxeResults): MatcherResult {
    const failures = [
        ...results.violations,
        ...results.incomplete.filter(isUnmeasuredContrast),
    ];
    return {
        pass: failures.length === 0,
        message: () =>
            failures.length === 0
                ? "expected axe violations, found none"
                : failures.map(formatResult).join("\n\n"),
    };
}
