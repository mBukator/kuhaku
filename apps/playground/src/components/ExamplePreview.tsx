import { useState } from "react";

import type { Example } from "../examples";

type Tab = "preview" | "code";

const TABS: Tab[] = ["preview", "code"];

export function ExamplePreview({ example }: { example: Example }): React.JSX.Element {
    const [tab, setTab] = useState<Tab>("preview");
    const [mountCount, setMountCount] = useState(0);

    const { Component } = example;

    return (
        <div className="overflow-hidden rounded-lg border">
            <div className="flex items-center justify-between border-b px-3 py-2">
                <div className="flex gap-1">
                    {TABS.map((each) => (
                        <button
                            key={each}
                            aria-pressed={tab === each}
                            className="rounded-sm px-2 py-1 text-xs text-muted-foreground capitalize aria-pressed:bg-secondary aria-pressed:text-foreground"
                            type="button"
                            onClick={() => setTab(each)}
                        >
                            {each}
                        </button>
                    ))}
                </div>
                {/* Remounting replays entrance motion without a page reload. */}
                <button
                    aria-label={`Remount ${example.title}`}
                    className="rounded-sm px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                    type="button"
                    onClick={() => setMountCount((count) => count + 1)}
                >
                    Remount
                </button>
            </div>
            {tab === "preview" ? (
                <div className="flex min-h-48 items-center justify-center p-10">
                    <Component key={mountCount} />
                </div>
            ) : (
                <pre className="max-h-128 overflow-auto bg-muted/40 p-4 font-mono text-xs leading-relaxed">
                    <code>{example.source}</code>
                </pre>
            )}
        </div>
    );
}
