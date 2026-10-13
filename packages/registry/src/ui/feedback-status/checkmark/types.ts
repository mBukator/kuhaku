import type { ComponentProps } from "react";

export type CheckmarkProps = {
    /**
     * Seconds before the draw starts; the 200ms draw itself is fixed. Button starts it
     * 50ms into the swap's entrance.
     *
     * @default 0
     */
    delay?: number;
} & ComponentProps<"svg">;
