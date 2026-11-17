"use client";

import { cn } from "@/lib/cn";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { CopyCheckIcon, LinkIcon } from "lucide-react";
import { useId, type ComponentProps, type ReactElement } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = ComponentProps<"h2"> & {
    /** The heading element to render. */
    as: HeadingLevel;
};

/**
 * Fumadocs' heading, named by its text alone: the copy button sits inside the heading, so
 * without `aria-labelledby` its label joins the heading's accessible name.
 */
export function Heading({
    as: As,
    id,
    className,
    children,
    ...props
}: HeadingProps): ReactElement {
    const linkId = useId();
    const [isCopied, copyLink] = useCopyButton(() => {
        if (id === undefined) return;
        const url = new URL(window.location.href);
        url.hash = id;
        return navigator.clipboard.writeText(url.href);
    });

    if (id === undefined) {
        return (
            <As className={className} {...props}>
                {children}
            </As>
        );
    }

    return (
        <As
            id={id}
            aria-labelledby={linkId}
            className={cn(
                "group/heading flex scroll-m-28 flex-row items-center gap-1",
                className
            )}
            {...props}
        >
            <a id={linkId} data-card="" href={`#${id}`}>
                {children}
            </a>
            <button
                type="button"
                aria-label="Copy link to this section"
                className={cn(
                    buttonVariants({ variant: "ghost", size: "icon-xs" }),
                    "not-prose shrink-0 text-fd-muted-foreground opacity-0 transition-opacity group-hover/heading:opacity-100 focus-visible:opacity-100"
                )}
                onClick={copyLink}
            >
                {isCopied ? <CopyCheckIcon /> : <LinkIcon />}
            </button>
        </As>
    );
}
