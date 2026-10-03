"use client";

import { cn } from "@/lib/cn";
import { ease, stagger, useMotionSuppressed } from "@/lib/motion";
import {
    animate,
    motion,
    useMotionValue,
    useTransform,
    type MotionValue,
} from "motion/react";
import { Fragment, useEffect, type ReactNode } from "react";

import type { SpinnerProps } from "./types";

const sizeClasses = {
    sm: "size-4 text-base",
    md: "size-5 text-xl",
    lg: "size-6 text-2xl",
} as const;

const PULSE_DURATION = 1;
const REDUCED_PULSE_DURATION = PULSE_DURATION * 2;

// The 3x3 ordered-dither matrix: the rank at which each cell, in reading order, lights
const BAYER_RANKS = [0, 7, 3, 6, 5, 2, 4, 1, 8] as const;

const ASCII_FRAMES = ["|", "/", "-", "\\"] as const;
const ASCII_FRAME_SECONDS = 0.13;

// Distance of each cell from the centre, in reading order
const RIPPLE_DISTANCES = [
    Math.SQRT2,
    1,
    Math.SQRT2,
    1,
    0,
    1,
    Math.SQRT2,
    1,
    Math.SQRT2,
] as const;
const RIPPLE_SPREAD = 0.15;
const RIPPLE_DURATION = 1.2;
const REDUCED_RIPPLE_DURATION = RIPPLE_DURATION * 2;

const TRAIL_OPACITIES = [1, 0.55, 0.3] as const;
const RESTING_OPACITY = 0.15;

// The clockwise step (of eight) at which the head reaches each cell, in reading
// order; the centre cell is never passed and rests dim.
const ORBIT_STEPS = [0, 1, 2, 7, null, 3, 6, 5, 4] as const;
const ORBIT_STEP_COUNT = 8;
const ORBIT_STEP_SECONDS = 0.1;

const LATTICE_DENSITY_CLASSES = {
    spaced: { grid: "gap-[10%]", cell: "rounded-[18%] bg-current" },
    tight: { grid: "gap-[6%]", cell: "bg-current" },
} as const satisfies Record<string, { grid: string; cell: string }>;

function trailOpacity(clock: number, passStep: number, stepCount: number): number {
    const stepsSincePass = (Math.floor(clock) - passStep + stepCount) % stepCount;
    return TRAIL_OPACITIES[stepsSincePass] ?? RESTING_OPACITY;
}

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
                    className="size-1/4 rounded-full bg-current"
                    initial={{ opacity: 0.3, scale: 0.6 }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.6, 1, 0.6] }}
                    transition={{
                        delay: (index * duration) / 3,
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
        <span aria-hidden="true" className="flex size-full items-center justify-between">
            {[0, 1, 2].map((index) => (
                <motion.span
                    key={index}
                    className="h-full w-1/5 rounded-sm bg-current"
                    animate={{ opacity: [0.35, 1, 0.35], scaleY: [0.55, 1, 0.55] }}
                    transition={{
                        delay: index * stagger.default,
                        duration,
                        ease: ease.inOut,
                        repeat: Infinity,
                    }}
                />
            ))}
        </span>
    );
}

type LatticeCell = { index: number; className: string };

type SpinnerLatticeProps = {
    density: keyof typeof LATTICE_DENSITY_CLASSES;
    renderCell: (cell: LatticeCell) => ReactNode;
};

/**
 * The 3x3 lattice dither, ripple and orbit share. It owns the geometry and the cell
 * shape, so the cell variants scale as one family; each variant only animates the
 * cells it is handed, in reading order.
 */
function SpinnerLattice({ density, renderCell }: SpinnerLatticeProps) {
    const classes = LATTICE_DENSITY_CLASSES[density];

    return (
        <span
            aria-hidden="true"
            className={cn("grid size-full grid-cols-3 grid-rows-3", classes.grid)}
        >
            {Array.from({ length: 9 }, (_, index) => (
                <Fragment key={index}>
                    {renderCell({ index, className: classes.cell })}
                </Fragment>
            ))}
        </span>
    );
}

function SpinnerDither({ suppressed }: Pick<SpinnerIndicatorProps, "suppressed">) {
    const duration = suppressed ? REDUCED_PULSE_DURATION : PULSE_DURATION;

    return (
        <SpinnerLattice
            density="tight"
            renderCell={({ index, className }) => (
                <motion.span
                    className={className}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                        delay:
                            ((BAYER_RANKS[index] ?? 0) * duration) / BAYER_RANKS.length,
                        duration,
                        ease: ease.inOut,
                        repeat: Infinity,
                    }}
                />
            )}
        />
    );
}

function SpinnerRipple({ suppressed }: Pick<SpinnerIndicatorProps, "suppressed">) {
    const duration = suppressed ? REDUCED_RIPPLE_DURATION : RIPPLE_DURATION;

    return (
        <SpinnerLattice
            density="spaced"
            renderCell={({ index, className }) => (
                <motion.span
                    className={className}
                    initial={{ opacity: 0.3, scale: 0.5 }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.5, 1, 0.5] }}
                    transition={{
                        delay: (RIPPLE_DISTANCES[index] ?? 0) * RIPPLE_SPREAD * duration,
                        duration,
                        times: [0, 0.3, 1],
                        ease: ease.inOut,
                        repeat: Infinity,
                    }}
                />
            )}
        />
    );
}

/**
 * A motion value that runs from 0 to `stepCount` on a loop; stepped variants read
 * `Math.floor` of it as the current step. They derive from it with `useTransform`,
 * which motion writes straight to the DOM, so a stepped loop never re-renders React
 * (the hot path stays off state). Suppression halves the step rate.
 */
function useStepClock(
    stepCount: number,
    stepSeconds: number,
    suppressed: boolean
): MotionValue<number> {
    const clock = useMotionValue(0);
    const seconds = suppressed ? stepSeconds * 2 : stepSeconds;

    useEffect(() => {
        const controls = animate(clock, [0, stepCount], {
            duration: seconds * stepCount,
            ease: "linear",
            repeat: Infinity,
        });
        return () => controls.stop();
    }, [clock, stepCount, seconds]);

    return clock;
}

type TrailCellProps = {
    clock: MotionValue<number>;
    passStep: number;
    stepCount: number;
    className: string;
};

function TrailCell({ clock, passStep, stepCount, className }: TrailCellProps) {
    const opacity = useTransform(clock, (value) =>
        trailOpacity(value, passStep, stepCount)
    );

    return <motion.span className={className} style={{ opacity }} />;
}

function SpinnerOrbit({ suppressed }: Pick<SpinnerIndicatorProps, "suppressed">) {
    const clock = useStepClock(ORBIT_STEP_COUNT, ORBIT_STEP_SECONDS, suppressed);

    return (
        <SpinnerLattice
            density="spaced"
            renderCell={({ index, className }) => {
                const passStep = ORBIT_STEPS[index] ?? null;
                return passStep === null ? (
                    <span className={className} style={{ opacity: RESTING_OPACITY }} />
                ) : (
                    <TrailCell
                        className={className}
                        clock={clock}
                        passStep={passStep}
                        stepCount={ORBIT_STEP_COUNT}
                    />
                );
            }}
        />
    );
}

function SpinnerAscii({ suppressed }: Pick<SpinnerIndicatorProps, "suppressed">) {
    const clock = useStepClock(ASCII_FRAMES.length, ASCII_FRAME_SECONDS, suppressed);
    const glyph = useTransform<number, string>(
        clock,
        (value) => ASCII_FRAMES[Math.floor(value) % ASCII_FRAMES.length] ?? ""
    );

    return (
        <motion.span
            aria-hidden="true"
            className="grid size-full place-items-center font-mono leading-none"
        >
            {glyph}
        </motion.span>
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
        case "ripple":
            return <SpinnerRipple suppressed={suppressed} />;
        case "orbit":
            return <SpinnerOrbit suppressed={suppressed} />;
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
