/**
 * Emits CSS linear() approximations of the motion spring tokens.
 *
 *   bun run packages/tokens/scripts/build-springs.ts
 *
 * Springs are physics, CSS transitions take easing functions, and linear() is
 * the bridge. Components using motion/react get the real simulation; CSS-only
 * consumers get these curves. Never hand-write the output - rerun the script.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type Spring = {
    stiffness: number;
    damping: number;
    mass: number;
};

/** Must match --motion-spring-* in motion.css. */
const SPRINGS: Record<string, Spring> = {
    snappy: { stiffness: 500, damping: 32, mass: 1 },
    soft: { stiffness: 260, damping: 26, mass: 1 },
};

const REST_THRESHOLD = 0.001; // settled within 0.1% of target
const TOLERANCE = 0.005; // max piecewise-linear error, 0.5%
const MAX_POINTS = 40;

/**
 * Displacement 0 -> 1 over time, matching motion/react's physical model.
 *
 * w0: natural angular frequency (rad/s); wd: damped frequency; zeta: damping
 * ratio. zeta<1 underdamped, ==1 critical, >1 overdamped. r1/r2: characteristic
 * roots; c1/c2: integration coefficients fixed by position(0)=0, velocity(0)=0.
 */
function solve({ stiffness, damping, mass }: Spring) {
    const w0 = Math.sqrt(stiffness / mass);
    const zeta = damping / (2 * Math.sqrt(stiffness * mass));

    let position: (t: number) => number;

    if (zeta < 1) {
        const wd = w0 * Math.sqrt(1 - zeta * zeta);
        position = (t) =>
            1 -
            Math.exp(-zeta * w0 * t) *
                (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
    } else if (zeta === 1) {
        position = (t) => 1 - Math.exp(-w0 * t) * (1 + w0 * t);
    } else {
        const r1 = -w0 * (zeta - Math.sqrt(zeta * zeta - 1));
        const r2 = -w0 * (zeta + Math.sqrt(zeta * zeta - 1));
        const c1 = -r2 / (r1 - r2);
        const c2 = r1 / (r1 - r2);
        position = (t) => 1 + c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
    }

    // Settling time: last moment outside the rest threshold, scanned backwards.
    let timeSeconds = 10;
    while (timeSeconds > 0 && Math.abs(position(timeSeconds) - 1) <= REST_THRESHOLD)
        timeSeconds -= 0.001;
    const durationMs = Math.round((timeSeconds + 0.001) * 1000);

    let peak = 0;
    for (let i = 0; i <= durationMs; i++) peak = Math.max(peak, position(i / 1000));

    return { position, durationMs, zeta, overshoot: (peak - 1) * 100 };
}

/**
 * Place points by curvature, not evenly: recursively split the segment with the
 * largest interpolation error. Roughly halves the point count at equal fidelity,
 * because the settled tail needs almost no resolution.
 */
function sample(position: (t: number) => number, durationMs: number) {
    const at = (x: number) => position((x * durationMs) / 1000);
    const xs = [0, 1];

    const worstIn = (a: number, b: number) => {
        const valueAtStart = at(a);
        const valueAtEnd = at(b);
        let worstX = a;
        let worstError = 0;
        for (let i = 1; i < 60; i++) {
            const x = a + ((b - a) * i) / 60;
            const interpolated =
                valueAtStart + ((valueAtEnd - valueAtStart) * (x - a)) / (b - a);
            const error = Math.abs(at(x) - interpolated);
            if (error > worstError) {
                worstError = error;
                worstX = x;
            }
        }
        return { worstX, worstError };
    };

    while (xs.length < MAX_POINTS) {
        let segmentIndex = -1;
        let splitAt = 0;
        let largestError = 0;
        for (let i = 0; i < xs.length - 1; i++) {
            const { worstX, worstError } = worstIn(xs[i], xs[i + 1]);
            if (worstError > largestError) {
                largestError = worstError;
                segmentIndex = i;
                splitAt = worstX;
            }
        }
        if (largestError <= TOLERANCE) break;
        xs.splice(segmentIndex + 1, 0, splitAt);
    }

    const values = xs.map(at);
    values[0] = 0;
    values[values.length - 1] = 1;
    return { xs, values };
}

function toLinear(xs: number[], values: number[]) {
    const stops = xs.map((x, i) => {
        const value = Number(values[i].toFixed(4)).toString();
        const percent = Number((x * 100).toFixed(1));
        return `${value} ${percent}%`;
    });
    return `linear(${stops.join(", ")})`;
}

function maxError(
    position: (t: number) => number,
    durationMs: number,
    xs: number[],
    values: number[]
) {
    let worst = 0;
    for (let i = 0; i <= 1000; i++) {
        const x = i / 1000;
        const truth = position((x * durationMs) / 1000);
        let j = 0;
        while (j < xs.length - 2 && xs[j + 1] < x) j++;
        const span = xs[j + 1] - xs[j];
        const fraction = span === 0 ? 0 : (x - xs[j]) / span;
        const interpolated = values[j] + (values[j + 1] - values[j]) * fraction;
        worst = Math.max(worst, Math.abs(truth - interpolated));
    }
    return worst;
}

const lines: string[] = [
    "/* GENERATED by scripts/build-springs.ts - do not edit.",
    "   linear() approximations of the spring tokens, for CSS-only consumers.",
    "   Components using motion/react run the real simulation instead. */",
    "",
    ":root {",
];

for (const [name, spring] of Object.entries(SPRINGS)) {
    const { position, durationMs, zeta, overshoot } = solve(spring);
    const { xs, values } = sample(position, durationMs);
    const error = maxError(position, durationMs, xs, values);

    lines.push(
        `  /* ${name}: stiffness ${spring.stiffness}, damping ${spring.damping}, mass ${spring.mass}`,
        `     damping ratio ${zeta.toFixed(3)}, overshoot ${overshoot.toFixed(2)}%, ${xs.length} stops, max error ${(error * 100).toFixed(2)}% */`,
        `  --motion-spring-${name}-duration: ${durationMs}ms;`,
        `  --motion-spring-${name}: ${toLinear(xs, values)};`,
        ""
    );

    console.log(
        `${name}: ζ=${zeta.toFixed(3)}  ${durationMs}ms  overshoot ${overshoot.toFixed(2)}%  ${xs.length} stops  error ${(error * 100).toFixed(2)}%`
    );
}

lines.push("}", "");

// Reduced motion and strict mode collapse springs to instant, matching motion.css.
lines.push(
    "@media (prefers-reduced-motion: reduce) {",
    "  :root {",
    ...Object.keys(SPRINGS).flatMap((name) => [
        `    --motion-spring-${name}-duration: 0ms;`,
        `    --motion-spring-${name}: linear(0, 1);`,
    ]),
    "  }",
    "}",
    "",
    '[data-a11y="strict"] {',
    ...Object.keys(SPRINGS).flatMap((name) => [
        `  --motion-spring-${name}-duration: 0ms;`,
        `  --motion-spring-${name}: linear(0, 1);`,
    ]),
    "}",
    ""
);

const out = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "src",
    "css",
    "springs.generated.css"
);
writeFileSync(out, lines.join("\n"));
console.log(`\nwrote ${out}`);
