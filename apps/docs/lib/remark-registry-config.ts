import type { Code, Parent, Root, RootContent } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";

import { REGISTRY_ORIGIN } from "./shared";

const ELEMENT_NAME = "RegistryConfig";

function toCodeNode(): Code {
    const config = { registries: { "@kuhaku": `${REGISTRY_ORIGIN}/r/{name}.json` } };

    return {
        type: "code",
        lang: "json",
        meta: 'title="components.json"',
        value: JSON.stringify(config, null, 4),
    };
}

function assertBareElement(element: MdxJsxFlowElement): void {
    if (element.attributes.length > 0 || element.children.length > 0) {
        throw new Error(`<${ELEMENT_NAME}> takes no props or children`);
    }
}

function expandRegistryConfigs(parent: Parent): void {
    parent.children = parent.children.map((child): RootContent => {
        if (child.type === "mdxJsxTextElement" && child.name === ELEMENT_NAME) {
            throw new Error(`<${ELEMENT_NAME}> must stand on its own line`);
        }

        if (child.type === "mdxJsxFlowElement" && child.name === ELEMENT_NAME) {
            assertBareElement(child);
            return toCodeNode();
        }

        if ("children" in child) {
            expandRegistryConfigs(child);
        }

        return child;
    });
}

/** Expands <RegistryConfig /> into a components.json block */
export function remarkRegistryConfig(): (tree: Root) => void {
    return (tree) => expandRegistryConfigs(tree);
}
