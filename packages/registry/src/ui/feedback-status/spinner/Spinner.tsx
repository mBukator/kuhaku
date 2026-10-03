"use client";

import { cn } from "@/lib/cn";
import { ease, stagger, useMotionSuppressed } from "@/lib/motion";
import { motion } from "motion/react";

import type { SpinnerProps } from "./types";

const sizeClasses = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
} as const;

const PULSE_DURATION = 0.6;
const REDUCED_PULSE_DURATION = 1.2;
const ASCII_GLYPHS = ["|", "/", "-", "\\"] as const;

type SpinnerIndicatorProps = {
    variant: NonNullable<SpinnerProps["variant"]>;
    suppressed: boolean;
};

function SpinnerArc({ suppressed }: Pick<SpinnerIndicatorProps, "suppressed">) {
    return (
        <motion.svg
            aria-hidden="true"
            className="size-full"
            fill="none"
            viewBox="0 0 24 24"
            animate={{ rotate: "360deg" }}
            transition={{
                duration: suppressed ? 1.4 : 0.9,
                ease: "linear",
                repeat: Infinity,
            }}
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeDasharray="42 14"
                strokeLinecap="round"
                strokeWidth="2"
            />
        </motion.svg>
    );
}

function SpinnerDots({ suppressed }: Pick<SpinnerIndicatorProps, "suppressed">) {
    const duration = suppressed ? REDUCED_PULSE_DURATION : PULSE_DURATION;

    return (
        <span aria-hidden="true" className="flex size-full items-center justify-between">
            {[0, 1, 2].map((index) => (
                <motion.span
                    key={index}
                    className="size-1 rounded-full bg-current"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                        delay: index * stagger.tight,
                        duration,
                        ease: ease.inOut,
                        repeat: Infinity,
                    }}
                />
            ))}
        </span>
    );
}

function SpinnerBars({ suppressed }: Pick<SpinnerIndicatorProps, "suppressed">) {
    const duration = suppressed ? REDUCED_PULSE_DURATION : PULSE_DURATION;

    return (
        <span
            aria-hidden="true"
            className="flex size-full items-center justify-between gap-px"
        >
            {[0, 1, 2].map((index) => (
                <motion.span
                    key={index}
                    className="h-full w-1 rounded-sm bg-current"
                    animate={{ opacity: [0.35, 1, 0.35], scaleY: [0.55, 1, 0.55] }}
                    transition={{
                        delay: index * stagger.tight,
                        duration,
                        ease: ease.inOut,
                        repeat: Infinity,
                    }}
                />
            ))}
        </span>
    );
}

function SpinnerDither({ suppressed }: Pick<SpinnerIndicatorProps, "suppressed">) {
    return (
        <span aria-hidden="true" className="grid size-full grid-cols-3 gap-px">
            {Array.from({ length: 9 }, (_, index) =>
                suppressed ? (
                    <span key={index} className="bg-current opacity-65" />
                ) : (
                    <motion.span
                        key={index}
                        className="bg-current"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                            delay: index * stagger.tight,
                            duration: PULSE_DURATION,
                            ease: ease.inOut,
                            repeat: Infinity,
                        }}
                    />
                )
            )}
        </span>
    );
}

function SpinnerAscii({ suppressed }: Pick<SpinnerIndicatorProps, "suppressed">) {
    const duration = suppressed ? REDUCED_PULSE_DURATION : PULSE_DURATION;

    return (
        <span
            aria-hidden="true"
            className="relative block size-full font-mono leading-none"
        >
            {ASCII_GLYPHS.map((glyph, index) => (
                <motion.span
                    key={glyph}
                    className="absolute inset-0 grid place-items-center"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                        delay: (index * duration) / ASCII_GLYPHS.length,
                        duration,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    {glyph}
                </motion.span>
            ))}
        </span>
    );
}

function SpinnerIndicator({ variant, suppressed }: SpinnerIndicatorProps) {
    switch (variant) {
        case "dots":
            return <SpinnerDots suppressed={suppressed} />;
        case "bars":
            return <SpinnerBars suppressed={suppressed} />;
        case "dither":
            return <SpinnerDither suppressed={suppressed} />;
        case "ascii":
            return <SpinnerAscii suppressed={suppressed} />;
        default:
            return <SpinnerArc suppressed={suppressed} />;
    }
}

export function Spinner({
    className,
    label,
    size = "sm",
    variant = "spinner",
    ...props
}: SpinnerProps): React.JSX.Element {
    const suppressed = useMotionSuppressed();

    return (
        <span
            {...props}
            className={cn("inline-flex items-center gap-1 text-current", className)}
            role="status"
        >
            <span className={cn("shrink-0", sizeClasses[size])}>
                <SpinnerIndicator suppressed={suppressed} variant={variant} />
            </span>
            {label ? <span>{label}</span> : <span className="sr-only">Loading</span>}
        </span>
    );
}
