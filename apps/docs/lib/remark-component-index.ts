import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Heading, List, ListItem, Parent, Root, RootContent } from "mdast";

import { ITEM_NAME_PATTERN } from "./read-item-name";

const ELEMENT_NAME = "ComponentIndex";
const APP_ROOT = process.cwd();
const COMPONENTS_DIRECTORY = join(APP_ROOT, "content", "docs", "components");
const REGISTRY_DIRECTORY = join(APP_ROOT, "public", "r");
const COMPONENTS_URL = "/docs/components";
// Fumadocs separators may carry a lucide icon: `---[Layers]Overlays---`.
const SEPARATOR_PATTERN = /^---(?:\[[^\]]+\])?(.+)---$/;
const LIST_CLASS_NAME =
    "not-prose my-4 grid list-none grid-cols-2 gap-x-8 p-0 sm:grid-cols-3";
const ITEM_CLASS_NAME = "border-b";
const LINK_CLASS_NAME =
    "-mx-2 flex min-h-11 items-center rounded-sm px-2 text-sm font-medium text-foreground/70 no-underline outline-none transition-colors duration-fast hover:text-foreground focus-visible:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring";

type Category = {
    title: string;
    itemNames: string[];
};

function readJson(path: string): unknown {
    try {
        return JSON.parse(readFileSync(path, "utf8"));
    } catch (error) {
        throw new Error(`<${ELEMENT_NAME}>: ${path} could not be read`, { cause: error });
    }
}

/** The `pages` of components/meta.json, the sidebar order the index follows. */
function readMetaPages(): string[] {
    const meta = readJson(join(COMPONENTS_DIRECTORY, "meta.json"));
    const pages =
        typeof meta === "object" && meta !== null && "pages" in meta ? meta.pages : null;
    if (!Array.isArray(pages) || !pages.every((page) => typeof page === "string")) {
        throw new Error(`<${ELEMENT_NAME}>: components/meta.json needs a pages array`);
    }
    return pages;
}

/** Groups the pages under their separators; every page must sit under one. */
function toCategories(pages: string[]): Category[] {
    const categories: Category[] = [];

    for (const page of pages) {
        const separator = SEPARATOR_PATTERN.exec(page);
        if (separator !== null) {
            categories.push({ title: separator[1].trim(), itemNames: [] });
            continue;
        }
        if (!ITEM_NAME_PATTERN.test(page)) {
            throw new Error(
                `<${ELEMENT_NAME}>: "${page}" in components/meta.json is not a separator or a kebab-case page`
            );
        }
        const category = categories.at(-1);
        if (category === undefined) {
            throw new Error(
                `<${ELEMENT_NAME}>: "${page}" needs a category separator above it`
            );
        }
        category.itemNames.push(page);
    }

    return categories;
}

/** The registry title of a component that has both a page and a built registry item. */
function readItemTitle(itemName: string): string {
    if (!existsSync(join(COMPONENTS_DIRECTORY, `${itemName}.mdx`))) {
        throw new Error(
            `<${ELEMENT_NAME}>: components/meta.json lists "${itemName}", which has no page`
        );
    }
    const itemPath = join(REGISTRY_DIRECTORY, `${itemName}.json`);
    if (!existsSync(itemPath)) {
        throw new Error(
            `<${ELEMENT_NAME}>: "${itemName}" has no registry item at public/r/${itemName}.json`
        );
    }
    const item = readJson(itemPath);
    const title =
        typeof item === "object" && item !== null && "title" in item ? item.title : null;
    if (typeof title !== "string") {
        throw new Error(`<${ELEMENT_NAME}>: public/r/${itemName}.json has no title`);
    }
    return title;
}

function toListItem(itemName: string): ListItem {
    return {
        type: "listItem",
        data: { hProperties: { className: ITEM_CLASS_NAME.split(" ") } },
        children: [
            {
                type: "paragraph",
                children: [
                    {
                        type: "link",
                        url: `${COMPONENTS_URL}/${itemName}`,
                        data: { hProperties: { className: LINK_CLASS_NAME.split(" ") } },
                        children: [{ type: "text", value: readItemTitle(itemName) }],
                    },
                ],
            },
        ],
    };
}

/** "Actions & forms" becomes `actions-forms`. */
function toAnchorId(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function toCategoryNodes(category: Category): [Heading, List] {
    return [
        {
            type: "heading",
            depth: 2,
            // Fumadocs' heading plugin has already run, so the id is set here.
            data: { hProperties: { id: toAnchorId(category.title) } },
            children: [{ type: "text", value: category.title }],
        },
        {
            type: "list",
            ordered: false,
            spread: false,
            data: { hProperties: { className: LIST_CLASS_NAME.split(" ") } },
            children: category.itemNames.map(toListItem),
        },
    ];
}

function expandComponentIndexes(parent: Parent): void {
    parent.children = parent.children.flatMap((child): RootContent[] => {
        if (child.type === "mdxJsxTextElement" && child.name === ELEMENT_NAME) {
            throw new Error(`<${ELEMENT_NAME}> must stand on its own line`);
        }
        if (child.type === "mdxJsxFlowElement" && child.name === ELEMENT_NAME) {
            return toCategories(readMetaPages()).flatMap(toCategoryNodes);
        }
        if ("children" in child) expandComponentIndexes(child);
        return [child];
    });
}

/**
 * Expands `<ComponentIndex />` into one heading and one dense list of links per category,
 * in the order components/meta.json gives the sidebar, so a page added there joins the
 * index with no edit to it.
 */
export function remarkComponentIndex(): (tree: Root) => void {
    return (tree) => expandComponentIndexes(tree);
}
