import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Heading, List, ListItem, Parent, Root, RootContent } from "mdast";

import { ITEM_NAME_PATTERN } from "./read-item-name";

const ELEMENT_NAME = "ComponentIndex";
const APP_ROOT = process.cwd();
const COMPONENTS_DIRECTORY = join(APP_ROOT, "content", "docs", "components");
const REGISTRY_DIRECTORY = join(APP_ROOT, "public", "r");
const COMPONENTS_URL = "/docs/components";
// Fumadocs' own group test; it drops these segments from URLs, so links stay flat.
const GROUP_PATTERN = /^\(.+\)$/;
const INDEX_PAGE_NAME = "index";
const MDX_EXTENSION = ".mdx";
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

/** The title and pages of a meta.json, given relative to content/docs/components. */
function readMeta(relativePath: string): { title: unknown; pages: string[] } {
    const meta = readJson(join(COMPONENTS_DIRECTORY, relativePath));
    if (typeof meta !== "object" || meta === null) {
        throw new Error(`<${ELEMENT_NAME}>: components/${relativePath} is not an object`);
    }
    const pages = "pages" in meta ? meta.pages : null;
    if (!Array.isArray(pages) || !pages.every((page) => typeof page === "string")) {
        throw new Error(
            `<${ELEMENT_NAME}>: components/${relativePath} needs a pages array`
        );
    }
    return { title: "title" in meta ? meta.title : undefined, pages };
}

/** The (group) folders components/meta.json lists, in sidebar order. */
function readGroupFolderNames(): string[] {
    const folderNames: string[] = [];
    for (const page of readMeta("meta.json").pages) {
        if (page === INDEX_PAGE_NAME) continue;
        if (!GROUP_PATTERN.test(page)) {
            throw new Error(
                `<${ELEMENT_NAME}>: "${page}" in components/meta.json is not "index" or a (group) folder`
            );
        }
        folderNames.push(page);
    }
    return folderNames;
}

/** Fails on a page or folder in components/ that the sidebar would drop without a word. */
function assertNoUnlistedEntries(groupFolderNames: string[]): void {
    for (const entry of readdirSync(COMPONENTS_DIRECTORY, { withFileTypes: true })) {
        const isLoosePage =
            entry.isFile() &&
            entry.name.endsWith(MDX_EXTENSION) &&
            entry.name !== `${INDEX_PAGE_NAME}${MDX_EXTENSION}`;
        if (isLoosePage) {
            throw new Error(
                `<${ELEMENT_NAME}>: components/${entry.name} sits outside a (group) folder`
            );
        }
        if (entry.isDirectory() && !groupFolderNames.includes(entry.name)) {
            throw new Error(
                `<${ELEMENT_NAME}>: components/${entry.name} is not a (group) folder listed in components/meta.json`
            );
        }
    }
}

/** A (group) folder's category; each listed page needs an MDX file, each MDX file a listing. */
function readCategory(folderName: string): Category {
    const folderPath = join(COMPONENTS_DIRECTORY, folderName);
    if (!existsSync(folderPath)) {
        throw new Error(
            `<${ELEMENT_NAME}>: components/meta.json lists "${folderName}", which is not a folder`
        );
    }
    const { title, pages } = readMeta(`${folderName}/meta.json`);
    if (typeof title !== "string" || title.trim() === "") {
        throw new Error(
            `<${ELEMENT_NAME}>: components/${folderName}/meta.json needs a title`
        );
    }
    if (pages.length === 0) {
        throw new Error(
            `<${ELEMENT_NAME}>: components/${folderName}/meta.json lists no pages`
        );
    }
    for (const page of pages) {
        if (!ITEM_NAME_PATTERN.test(page)) {
            throw new Error(
                `<${ELEMENT_NAME}>: "${page}" in ${folderName} is not a kebab-case page`
            );
        }
        if (!existsSync(join(folderPath, `${page}${MDX_EXTENSION}`))) {
            throw new Error(
                `<${ELEMENT_NAME}>: ${folderName} lists "${page}", which has no page`
            );
        }
    }
    const unlistedFileName = readdirSync(folderPath).find(
        (fileName) =>
            fileName.endsWith(MDX_EXTENSION) &&
            !pages.includes(fileName.slice(0, -MDX_EXTENSION.length))
    );
    if (unlistedFileName !== undefined) {
        throw new Error(
            `<${ELEMENT_NAME}>: components/${folderName}/${unlistedFileName} is not listed in its meta.json`
        );
    }
    return { title, itemNames: pages };
}

function readCategories(): Category[] {
    const groupFolderNames = readGroupFolderNames();
    assertNoUnlistedEntries(groupFolderNames);
    return groupFolderNames.map(readCategory);
}

/** The registry title of a built registry item. */
function readItemTitle(itemName: string): string {
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
            return readCategories().flatMap(toCategoryNodes);
        }
        if ("children" in child) expandComponentIndexes(child);
        return [child];
    });
}

/**
 * Expands `<ComponentIndex />` into one heading and one dense list of links per (group)
 * folder, in the order components/meta.json lists the folders and each folder's meta.json
 * lists its pages, so a page added to a folder joins the index with no edit to it.
 */
export function remarkComponentIndex(): (tree: Root) => void {
    return (tree) => expandComponentIndexes(tree);
}
