import type { ComponentProps } from "react";

export type SpinnerProps = {
    size?: "sm" | "md" | "lg";
    variant?: "spinner" | "dots" | "bars" | "dither" | "ascii";
    label?: string;
} & ComponentProps<"span">;
