import type { ComponentProps } from "react";

export type CheckmarkProps = {
    /**
     * Seconds before the draw begins. The draw itself is fixed grammar; only
     * its start belongs to the composing component - after a swap's entrance,
     * or 50ms into a checkbox fill.
     *
     * @default 0
     */
    delay?: number;
} & ComponentProps<"svg">;
