import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";

/** A registry item name: kebab-case, so it is safe to use as a file name. */
export const ITEM_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * The registry item an MDX element names; throws when `name` is missing, not a string or
 * not kebab-case, since it becomes a file path.
 */
export function readItemName(element: MdxJsxFlowElement): string {
    const attribute = element.attributes.find(
        (each) => each.type === "mdxJsxAttribute" && each.name === "name"
    );
    if (attribute?.type !== "mdxJsxAttribute" || typeof attribute.value !== "string") {
        throw new Error(`<${element.name}> needs a string name, as in name="button"`);
    }
    if (!ITEM_NAME_PATTERN.test(attribute.value)) {
        throw new Error(
            `<${element.name}>: "${attribute.value}" is not a kebab-case item name`
        );
    }
    return attribute.value;
}
