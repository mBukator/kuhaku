import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import type { ReactNode } from "react";

const PREVIEW_TAB = "Preview";
const CODE_TAB = "Code";

type PreviewFrameProps = {
    /** What the Preview tab renders. */
    children: ReactNode;
    /** The source the Code tab highlights and copies. */
    code: string;
};

export function PreviewFrame({ children, code }: PreviewFrameProps): React.JSX.Element {
    return (
        <Tabs items={[PREVIEW_TAB, CODE_TAB]}>
            <Tab value={PREVIEW_TAB}>
                <div className="not-prose flex flex-wrap items-center justify-center gap-4 min-h-48 p-6">
                    {children}
                </div>
            </Tab>
            <Tab value={CODE_TAB}>
                <DynamicCodeBlock lang="tsx" code={code} />
            </Tab>
        </Tabs>
    );
}
