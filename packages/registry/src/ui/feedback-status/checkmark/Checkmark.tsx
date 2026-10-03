"use client";

import { cn } from "@/lib/cn";
import { ease, useMotionSuppressed, withSuppression } from "@/lib/motion";
import { motion, type Transition } from "motion/react";

import type { CheckmarkProps } from "./types";

type Point = { x: number; y: number };

type Stroke = Point & {
    length: number;
    angleDegrees: number;
};

/**
 * A stroke laid flat from `from`, then rotated into place. scaleX can only
 * lengthen a stroke that runs along its own x-axis; on a diagonal it would
 * change the angle instead.
 */
function strokeBetween(from: Point, to: Point): Stroke {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return {
        ...from,
        length: Math.hypot(dx, dy),
        angleDegrees: (Math.atan2(dy, dx) * 180) / Math.PI,
    };
}

const SHORT_STROKE = strokeBetween({ x: 4, y: 12 }, { x: 9, y: 17 });
const LONG_STROKE = strokeBetween({ x: 9, y: 17 }, { x: 20, y: 6 });

const DRAW_SECONDS = 0.2;
const SHORT_SHARE = SHORT_STROKE.length / (SHORT_STROKE.length + LONG_STROKE.length);
const SHORT_SECONDS = DRAW_SECONDS * SHORT_SHARE;
const LONG_SECONDS = DRAW_SECONDS - SHORT_SECONDS;

function CheckStroke({ stroke, transition }: { stroke: Stroke; transition: Transition }) {
    return (
        <g
            transform={`translate(${stroke.x} ${stroke.y}) rotate(${stroke.angleDegrees})`}
        >
            <motion.line
                x1={0}
                y1={0}
                x2={stroke.length}
                y2={0}
                style={{ originX: 0 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={transition}
            />
        </g>
    );
}

export function Checkmark({
    delay = 0,
    className,
    ...props
}: CheckmarkProps): React.JSX.Element {
    const suppressed = useMotionSuppressed();

    const shortStroke = withSuppression(
        { duration: SHORT_SECONDS, delay, ease: ease.out },
        suppressed
    );
    const longStroke = withSuppression(
        { duration: LONG_SECONDS, delay: delay + SHORT_SECONDS, ease: ease.out },
        suppressed
    );

    return (
        <svg
            aria-hidden="true"
            {...props}
            className={cn("size-4", className)}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <CheckStroke stroke={SHORT_STROKE} transition={shortStroke} />
            <CheckStroke stroke={LONG_STROKE} transition={longStroke} />
        </svg>
    );
}
