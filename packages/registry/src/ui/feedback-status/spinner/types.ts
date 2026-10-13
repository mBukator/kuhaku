import type { ComponentProps } from "react";

export type SpinnerProps = {
    /**
     * Indicator size: `sm` 16px, `md` 20px, `lg` 24px.
     *
     * @default "sm"
     */
    size?: "sm" | "md" | "lg";
    /**
     * The indicator's form. Every variant draws in `currentColor`.
     *
     * @default "spinner"
     */
    variant?: "spinner" | "dots" | "bars" | "dither" | "ascii" | "ripple" | "orbit";
    /**
     * Visible text beside the indicator, announced as the status. Without it, assistive
     * technology hears "Loading".
     */
    label?: string;
} & ComponentProps<"span">;
