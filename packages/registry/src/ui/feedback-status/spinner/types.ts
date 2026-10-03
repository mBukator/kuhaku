import type { ComponentProps } from "react";

export type SpinnerProps = {
    size?: "sm" | "md" | "lg";
    variant?: "spinner" | "dots" | "bars" | "dither" | "ascii" | "ripple" | "orbit";
    label?: string;
} & ComponentProps<"span">;
