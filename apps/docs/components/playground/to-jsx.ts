import type { PlaygroundValue, SnippetChildren, SnippetModel } from "./types";

const MAX_LINE_LENGTH_CHARACTERS = 90;
const INDENT = "    ";
const UNSAFE_JSX_CHARACTERS = /["&{}<>]/;

/** Whether a string prints as-is in JSX: nothing JSX would parse or decode, no edge whitespace. */
function canPrintPlain(value: string): boolean {
    return !UNSAFE_JSX_CHARACTERS.test(value) && value === value.trim();
}

function toBracedString(value: string): string {
    return `{${JSON.stringify(value)}}`;
}

/** An attribute value: `"value"` when safe, else a braced JavaScript string. */
function toAttributeValue(value: string): string {
    return canPrintPlain(value) ? `"${value}"` : toBracedString(value);
}

/** One JSX attribute: `true` prints the bare name, `false` stays explicit. */
function toAttribute([name, value]: [string, PlaygroundValue]): string {
    if (value === true) return name;
    if (value === false) return `${name}={false}`;

    return `${name}=${toAttributeValue(value)}`;
}

/** The element's child: an icon element, or text escaped like an attribute value. */
function toChild(children: SnippetChildren): string {
    switch (children.kind) {
        case "icon":
            return `<${children.iconName} />`;
        case "text":
            return canPrintPlain(children.text)
                ? children.text
                : toBracedString(children.text);
    }
}

/**
 * Prints the element the way Prettier would at 90 columns: on one line when it fits,
 * else the child on its own line, else one attribute per line as well.
 */
function toElement({ componentName, props, children }: SnippetModel): string {
    const attributes = props.map(toAttribute);
    const child = toChild(children);
    const openingTag = `<${[componentName, ...attributes].join(" ")}>`;
    const closingTag = `</${componentName}>`;
    const singleLine = `${openingTag}${child}${closingTag}`;
    // Prettier moves the child to its own line for an element child or two or more attributes.
    const canFitOneLine =
        children.kind === "text" &&
        attributes.length <= 1 &&
        singleLine.length <= MAX_LINE_LENGTH_CHARACTERS;
    // Prettier never breaks an opening tag whose only attribute is a quoted string.
    const isLoneQuotedAttribute =
        attributes.length === 1 && attributes[0]?.endsWith('"') === true;

    if (canFitOneLine) return singleLine;
    if (openingTag.length <= MAX_LINE_LENGTH_CHARACTERS || isLoneQuotedAttribute) {
        return [openingTag, INDENT + child, closingTag].join("\n");
    }

    return [
        `<${componentName}`,
        ...attributes.map((attribute) => INDENT + attribute),
        ">",
        INDENT + child,
        closingTag,
    ].join("\n");
}

/** The snippet the Code tab shows: the imports, a blank line, then the element. */
export function toJsx(model: SnippetModel): string {
    if (model.imports.length === 0) {
        return toElement(model);
    }

    return [...model.imports, "", toElement(model)].join("\n");
}
