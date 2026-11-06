import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DEMOS, type DemoName } from "@/components/demos";

import { PreviewFrame } from "./PreviewFrame";

type ComponentPreviewProps = {
    /** A key of DEMOS, such as `button-async-submit`. */
    name: string;
};

/** Narrows a string to a registered demo name; `Object.hasOwn` skips inherited keys. */
function isDemoName(name: string): name is DemoName {
    return Object.hasOwn(DEMOS, name);
}

/** The demo file's text; throws naming the demo when the file cannot be read. */
async function readDemoSource(name: DemoName, sourcePath: string): Promise<string> {
    try {
        return await readFile(
            join(process.cwd(), "components", "demos", sourcePath),
            "utf8"
        );
    } catch (error) {
        throw new Error(`${name}: demo source ${sourcePath} is missing`, {
            cause: error,
        });
    }
}

/** The live demo and its exact source for a named docs example. */
export async function ComponentPreview({
    name,
}: ComponentPreviewProps): Promise<React.JSX.Element> {
    if (!isDemoName(name)) {
        throw new Error(`${name}: no demo of this name; add it to DEMOS`);
    }

    const demo = DEMOS[name];

    const source = await readDemoSource(name, demo.sourcePath);

    const Demo = demo.component;

    return (
        <PreviewFrame code={source}>
            <Demo />
        </PreviewFrame>
    );
}
