import type { ComponentType } from "react";

type ExampleModule = {
    default: ComponentType;
    description?: string;
};

export type Example = {
    name: string;
    title: string;
    description?: string;
    Component: ComponentType;
    source: string;
};

export type ComponentPage = {
    slug: string;
    title: string;
    examples: Example[];
};

const EXAMPLE_PATH = /^\.\/([a-z0-9-]+)\/([A-Za-z0-9]+)\.tsx$/;

const modules = import.meta.glob<ExampleModule>("./*/*.tsx", { eager: true });
const sources = import.meta.glob<string>("./*/*.tsx", {
    eager: true,
    query: "?raw",
    import: "default",
});

function toPascalCase(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}

function toSentenceCase(pascalCase: string): string {
    const words = pascalCase.split(/(?=[A-Z])/).map((word) => word.toLowerCase());
    const sentence = words.join(" ");
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

function toExample(path: string, module: ExampleModule): [string, Example] {
    const match = EXAMPLE_PATH.exec(path);
    if (match === null) {
        throw new Error(
            `${path}: examples live at examples/<component>/<Component><Case>.tsx`
        );
    }
    if (typeof module.default !== "function") {
        throw new Error(`${path}: an example needs a default export`);
    }
    const [, slug, name] = match;
    const prefix = toPascalCase(slug);
    if (!name.startsWith(prefix) || name === prefix) {
        throw new Error(`${path}: the file name must be ${prefix} followed by its case`);
    }
    return [
        slug,
        {
            name,
            title: toSentenceCase(name.slice(prefix.length)),
            description: module.description,
            Component: module.default,
            source: sources[path] ?? "",
        },
    ];
}

// The demo leads its page, as on shadcn's; the rest follow alphabetically.
function compareExamples(first: Example, second: Example): number {
    const isFirstDemo = first.title === "Demo";
    const isSecondDemo = second.title === "Demo";
    if (isFirstDemo !== isSecondDemo) return isFirstDemo ? -1 : 1;
    return first.name.localeCompare(second.name);
}

function buildPages(): ComponentPage[] {
    const examplesBySlug = new Map<string, Example[]>();
    for (const [path, module] of Object.entries(modules)) {
        const [slug, example] = toExample(path, module);
        examplesBySlug.set(slug, [...(examplesBySlug.get(slug) ?? []), example]);
    }
    return [...examplesBySlug]
        .map(([slug, examples]) => ({
            slug,
            title: toSentenceCase(toPascalCase(slug)),
            examples: examples.sort(compareExamples),
        }))
        .sort((first, second) => first.title.localeCompare(second.title));
}

export const COMPONENT_PAGES = buildPages();
