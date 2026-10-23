import { applyColorMode } from "#test/modes";
import { afterEach, expect, test } from "vitest";
import { renderHook } from "vitest-browser-react";

import { duration, ease, useMotionSuppressed, withSuppression } from "./index";

afterEach(() => {
    delete document.body.dataset.a11y;
});

test("returns the transition unchanged while motion runs", () => {
    const transition = { duration: duration.fast, ease: ease.out };

    expect(withSuppression(transition, false)).toBe(transition);
});

test("collapses the transition to an instant cut while motion is suppressed", () => {
    const transition = {
        duration: duration.fast,
        delay: duration.instant,
        ease: ease.out,
    };

    expect(withSuppression(transition, true)).toEqual({ duration: 0, delay: 0 });
});

test("reports motion as running by default", async () => {
    const { result } = await renderHook(() => useMotionSuppressed());

    expect(result.current).toBe(false);
});

test("reports suppression once strict mode is set on the root, without a remount", async () => {
    const { result } = await renderHook(() => useMotionSuppressed());

    applyColorMode("strict");

    await expect.poll(() => result.current).toBe(true);
});

test("reports suppression when strict mode is set on the body", async () => {
    const { result } = await renderHook(() => useMotionSuppressed());

    document.body.dataset.a11y = "strict";

    await expect.poll(() => result.current).toBe(true);
});

test("stops reporting suppression when strict mode is removed", async () => {
    const { result } = await renderHook(() => useMotionSuppressed());

    applyColorMode("strict");
    await expect.poll(() => result.current).toBe(true);

    applyColorMode("light");
    await expect.poll(() => result.current).toBe(false);
});
