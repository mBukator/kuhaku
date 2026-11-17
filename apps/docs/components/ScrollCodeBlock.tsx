"use client";

import { cn } from "@/lib/cn";
import { CODE_THEMES } from "@/lib/shared";
import { CodeBlock, Pre, type CodeBlockProps } from "fumadocs-ui/components/codeblock";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useEffect, useMemo, useRef, type ReactElement } from "react";

type ScrollDynamicCodeBlockProps = {
    /** The Shiki language id. */
    lang: string;
    /** The source to highlight and copy. */
    code: string;
    /** Classes merged onto the code block's figure. */
    className?: string;
};

function syncTabStop(viewport: HTMLElement): void {
    const isOverflowing =
        viewport.scrollWidth > viewport.clientWidth ||
        viewport.scrollHeight > viewport.clientHeight;
    viewport.tabIndex = isOverflowing ? 0 : -1;
}

/**
 * A code block whose scroll box is a Tab stop only while its code overflows, so the arrow
 * keys reach hidden code and a block that fits adds no stop.
 */
export function ScrollCodeBlock({ children, ...props }: CodeBlockProps): ReactElement {
    const figureRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const viewport = figureRef.current?.querySelector<HTMLElement>(
            ":scope > [role='region']"
        );
        if (viewport === null || viewport === undefined) return;
        const observer = new ResizeObserver(() => syncTabStop(viewport));
        observer.observe(viewport);
        if (viewport.firstElementChild !== null) {
            observer.observe(viewport.firstElementChild);
        }
        return () => observer.disconnect();
    }, []);

    return (
        <CodeBlock {...props} ref={figureRef}>
            <Pre>{children}</Pre>
        </CodeBlock>
    );
}

/** Highlights `code` on the client into a `ScrollCodeBlock`. */
export function ScrollDynamicCodeBlock({
    lang,
    code,
    className,
}: ScrollDynamicCodeBlockProps): ReactElement {
    const components = useMemo(
        () => ({
            pre: (props: CodeBlockProps) => (
                <ScrollCodeBlock
                    {...props}
                    className={cn("my-0", props.className, className)}
                />
            ),
        }),
        [className]
    );

    return (
        <DynamicCodeBlock
            lang={lang}
            code={code}
            options={{ themes: CODE_THEMES, components }}
        />
    );
}
