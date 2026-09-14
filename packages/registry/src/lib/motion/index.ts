"use client";

/**
 * lib/motion — the motion runtime.
 *
 * CSS gets its motion values from motion.css. JavaScript gets them from here.
 * The two must agree, so this file is written to mirror the token table
 * exactly; the build validates that it does.
 */
import * as React from "react";

export { springs, springSnappy, springSoft } from "./springs";
export type { SpringToken, SpringName } from "./springs";

/** Seconds, because motion/react speaks seconds. Mirrors --motion-duration-*. */
export const duration = {
    instant: 0.05,
    fast: 0.15,
    default: 0.25,
    slow: 0.4,
    slower: 0.6,
} as const;

/** Cubic-bezier control points. Mirrors --motion-ease-*. */
export const ease = {
    out: [0.16, 1, 0.3, 1],
    inOut: [0.66, 0, 0.34, 1],
    anticipate: [0.44, -0.24, 0.28, 1],
} as const;

// Mirrors --motion-stagger-*, --motion-hold, --motion-delay-hint
export const stagger = {
    tight: 0.025,
    default: 0.045,
    loose: 0.08,
} as const;

export const hold = {
    tight: 0.05,
    default: 0.08,
} as const;

export const delayHint = 0.4;

/**
 * True when motion should collapse to its end state.
 *
 * Two signals, one answer: the OS reduced-motion preference, and kuhaku's
 * page-level strict accessibility mode. CSS handles both by collapsing the
 * duration tokens to zero; JavaScript-driven motion has no token to read,
 * so it reads this instead.
 *
 * @returns `false` during SSR and on the first client render, then corrects
 * after mount - animation must never be the reason markup mismatches.
 */
export function useMotionSuppressed(): boolean {
    const [suppressed, setSuppressed] = React.useState(false);

    React.useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");

        const read = () =>
            query.matches ||
            document.documentElement.dataset.a11y === "strict" ||
            document.body.dataset.a11y === "strict";

        const sync = () => setSuppressed(read());
        sync();

        query.addEventListener("change", sync);

        // Strict mode is an attribute, not a media query, so watch for it.
        const observer = new MutationObserver(sync);
        const options = { attributes: true, attributeFilter: ["data-a11y"] };
        observer.observe(document.documentElement, options);
        observer.observe(document.body, options);

        return () => {
            query.removeEventListener("change", sync);
            observer.disconnect();
        };
    }, []);

    return suppressed;
}

/**
 * Collapses a transition to an instant cut when motion is suppressed.
 * Components pass their normal transition and get the honest one back.
 */
export function withSuppression<T extends Record<string, unknown>>(
    transition: T,
    suppressed: boolean
): T | { duration: 0; delay: 0 } {
    return suppressed ? { duration: 0, delay: 0 } : transition;
}
