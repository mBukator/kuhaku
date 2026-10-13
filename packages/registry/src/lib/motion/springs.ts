// Hand-mirrored from motion.css --motion-spring-*; nothing checks that they agree.
export type SpringToken = {
    stiffness: number;
    damping: number;
    mass: number;
};

/**
 * snappy - ζ 0.716, ~4% overshoot, settles in 455ms.
 * Direct manipulation and confirmation: presses, toggles, grabs, pops.
 */
export const springSnappy: SpringToken = {
    stiffness: 500,
    damping: 32,
    mass: 1,
};

/**
 * soft - ζ 0.806, ~1.4% overshoot, settles in 529ms.
 * Systems reorganising themselves: indicators travelling, stacks reflowing.
 */
export const springSoft: SpringToken = {
    stiffness: 260,
    damping: 26,
    mass: 1,
};

export const springs = {
    snappy: springSnappy,
    soft: springSoft,
} as const;

export type SpringName = keyof typeof springs;
