import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Parent, Root } from "mdast";

import { INSTALL_DOORS, toInstallCommand } from "./install-command";
import { readItemName } from "./read-item-name";

const ELEMENT_NAME = "InstallCommand";
const REGISTRY_DIRECTORY = join(process.cwd(), "public", "r");

function toMarkdown(itemName: string): string {
    if (!existsSync(join(REGISTRY_DIRECTORY, `${itemName}.json`))) {
        throw new Error(`<${ELEMENT_NAME}>: no registry item public/r/${itemName}.json`);
    }
    return INSTALL_DOORS.map(
        (door) => `\`\`\`bash\n${toInstallCommand("npm", door, itemName)}\n\`\`\``
    ).join("\n\n");
}

function annotateInstallCommands(parent: Parent): void {
    parent.children.forEach((child) => {
        if (child.type === "mdxJsxTextElement" && child.name === ELEMENT_NAME) {
            throw new Error(`<${ELEMENT_NAME}> must stand on its own line`);
        }
        if (child.type === "mdxJsxFlowElement" && child.name === ELEMENT_NAME) {
            child.data = {
                ...child.data,
                _stringify: { text: toMarkdown(readItemName(child)) },
            };
            return;
        }
        if ("children" in child) annotateInstallCommands(child);
    });
}

/**
 * Checks each `<InstallCommand name="button" />` against the built registry and gives the
 * processed markdown both npm commands, since the page's picker renders only on the client.
 */
export function remarkInstallCommand(): (tree: Root) => void {
    return (tree) => annotateInstallCommands(tree);
}
