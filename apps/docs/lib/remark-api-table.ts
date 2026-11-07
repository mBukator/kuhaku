import type {
    InlineCode,
    Parent,
    PhrasingContent,
    Root,
    Table,
    TableCell,
    TableRow,
    Text,
} from "mdast";

import { readApiReference, type ApiProperty } from "./api-reference";
import { readItemName } from "./read-item-name";

const ELEMENT_NAME = "ApiTable";
const HEADERS = ["Prop", "Type", "Default", "Description"];

/** Splits JSDoc text on backticks, so code spans render as code. */
function toPhrasing(text: string): (InlineCode | Text)[] {
    return text
        .split("`")
        .map((part, index): InlineCode | Text =>
            index % 2 === 1
                ? { type: "inlineCode", value: part }
                : { type: "text", value: part }
        )
        .filter((node) => node.value !== "");
}

function toCell(children: PhrasingContent[]): TableCell {
    return { type: "tableCell", children };
}

function toRow(property: ApiProperty): TableRow {
    const name: PhrasingContent[] = [{ type: "inlineCode", value: property.name }];
    return {
        type: "tableRow",
        children: [
            toCell(
                property.isOptional
                    ? name
                    : [...name, { type: "text", value: " (required)" }]
            ),
            toCell([{ type: "inlineCode", value: property.type }]),
            toCell([
                property.defaultValue === undefined
                    ? { type: "text", value: "-" }
                    : { type: "inlineCode", value: property.defaultValue },
            ]),
            toCell(toPhrasing(property.description)),
        ],
    };
}

function toTable(itemName: string): Table {
    const header: TableRow = {
        type: "tableRow",
        children: HEADERS.map((title) => toCell([{ type: "text", value: title }])),
    };
    return {
        type: "table",
        align: [null, null, null, null],
        children: [header, ...readApiReference(itemName).map(toRow)],
    };
}

function replaceApiTables(parent: Parent): void {
    parent.children.forEach((child, index) => {
        if (child.type === "mdxJsxTextElement" && child.name === ELEMENT_NAME) {
            throw new Error(`<${ELEMENT_NAME}> must stand on its own line`);
        }
        if (child.type === "mdxJsxFlowElement" && child.name === ELEMENT_NAME) {
            parent.children[index] = toTable(readItemName(child));
            return;
        }
        if ("children" in child) replaceApiTables(child);
    });
}

/**
 * Expands `<ApiTable name="button" />` into a markdown table of the installed component's
 * props at compile time, so the page and its processed markdown carry the same rows.
 */
export function remarkApiTable(): (tree: Root) => void {
    return (tree) => replaceApiTables(tree);
}
