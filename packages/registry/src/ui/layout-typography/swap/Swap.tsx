"use client";

import { cn } from "@/lib/cn";
import { duration, ease, hold, useMotionSuppressed, withSuppression } from "@/lib/motion";
import { AnimatePresence, motion } from "motion/react";
import { forwardRef, useEffect, useMemo, useRef } from "react";

import type { SwapProps } from "./types";

const TIMELINE = {
    enter: duration.fast,
    hold: hold.tight,
    exit: (duration.fast * 2) / 3, // Exits run at two-thirds of their entrance
};

const ENTER_DELAY = TIMELINE.exit + TIMELINE.hold;
const TOTAL = ENTER_DELAY + TIMELINE.enter;

if (process.env.NODE_ENV !== "production" && TOTAL > 0.3) {
    console.warn(`Swap exceeds 300ms micro-interaction ceiling (${TOTAL * 1000}ms)`);
}

const OFFSET = 8; // Vertical travel for numeric swaps

export const Swap = forwardRef<HTMLSpanElement, SwapProps>(function Swap(
    { value, children, inline = true, className, ...props },
    ref
) {
    const suppressed = useMotionSuppressed();
    const numeric = typeof value === "number";

    const previous = useRef<string | number>(value);
    const direction = useMemo(() => {
        if (!numeric || typeof previous.current !== "number") {
            return 0;
        }
        return Math.sign((value as number) - previous.current);
    }, [value, numeric]);

    useEffect(() => {
        previous.current = value;
    }, [value]);

    const enterTransition = withSuppression(
        { duration: TIMELINE.enter, delay: ENTER_DELAY, ease: ease.inOut },
        suppressed
    );
    const exitTransition = withSuppression(
        { duration: TIMELINE.exit, ease: ease.inOut },
        suppressed
    );

    return (
        <span
            ref={ref}
            className={cn(
                "relative inline-grid place-items-center overflow-visible",
                "[grid-template-areas:'swap']",
                "*:[grid-area:swap]",
                !inline && "grid",
                numeric && "tabular-nums",
                className
            )}
            {...props}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={String(value)}
                    initial={{
                        opacity: 0,
                        scale: 1.04,
                        y: direction * OFFSET,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: enterTransition,
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.94,
                        y: direction * -OFFSET,
                        transition: exitTransition,
                    }}
                >
                    {children}
                </motion.span>
            </AnimatePresence>
        </span>
    );
});
