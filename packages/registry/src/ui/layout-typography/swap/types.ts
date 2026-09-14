import type * as React from "react";

export type SwapProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
    /**
     * The identity of the current content. When it changes, the swap plays.
     *
     * Numeric values additionally derive direction: a value that increased
     * enters from below, one that decreased enters from above. That inference
     * is semantic, not configuration - there is no direction prop.
     */
    value: string | number;
    /** The content for the current value. */
    children: React.ReactNode;
    /**
     * Lay out as an inline element (default) or a block.
     * Inline suits icons and digits inside text; block suits standalone slots.
     *
     * \@default true
     */
    inline?: boolean;
};
