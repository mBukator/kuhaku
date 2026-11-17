import { ScrollDynamicCodeBlock } from "@/components/ScrollCodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "fumadocs-ui/components/tabs";
import type { ReactNode } from "react";

const PREVIEW_TAB = "preview";
const CODE_TAB = "code";

type PreviewFrameProps = {
    /** What the Preview tab renders. */
    children: ReactNode;
    /** The source the Code tab highlights and copies. */
    code: string;
};

/** A live preview and its source, as Preview and Code tabs. */
export function PreviewFrame({ children, code }: PreviewFrameProps): React.JSX.Element {
    // Fumadocs clips both boxes to scroll its tab row, which also cuts the focus rings inside.
    return (
        <Tabs defaultValue={PREVIEW_TAB} className="overflow-visible">
            <TabsList className="overflow-visible">
                <TabsTrigger value={PREVIEW_TAB}>Preview</TabsTrigger>
                <TabsTrigger value={CODE_TAB}>Code</TabsTrigger>
            </TabsList>
            <TabsContent value={PREVIEW_TAB}>
                <div className="not-prose flex flex-wrap items-center justify-center gap-4 min-h-48 p-6">
                    {children}
                </div>
            </TabsContent>
            <TabsContent value={CODE_TAB}>
                <ScrollDynamicCodeBlock lang="tsx" code={code} />
            </TabsContent>
        </Tabs>
    );
}
