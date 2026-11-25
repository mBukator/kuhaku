"use client";

import type { Node, Separator } from "fumadocs-core/page-tree";
import { SidebarSeparator } from "fumadocs-ui/components/sidebar/base";
import { useTreeContext } from "fumadocs-ui/contexts/tree";

const SEPARATOR_CLASS_NAME = "mb-1 [&_svg]:size-4 [&_svg]:shrink-0";
const MARKER_TEXT = "Soon";

function isEmptySection(nodes: Node[], separator: Separator): boolean {
    const index = nodes.indexOf(separator);

    if (index === -1) {
        return false;
    }

    const next = nodes.at(index + 1);

    return next === undefined || next.type === "separator";
}

/** A sidebar section label that marks a section with no pages yet. */
export function SectionSeparator({ item }: { item: Separator }): React.JSX.Element {
    const { root } = useTreeContext();
    const isEmpty = isEmptySection(root.children, item);

    return (
        <SidebarSeparator className={SEPARATOR_CLASS_NAME}>
            {item.icon}
            {item.name}
            {isEmpty && (
                <span className="text-xs font-normal text-muted-foreground">
                    {MARKER_TEXT}
                </span>
            )}
        </SidebarSeparator>
    );
}
