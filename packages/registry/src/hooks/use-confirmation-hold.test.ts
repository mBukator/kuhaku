import { afterEach, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

import { useConfirmationHold, type ActionState } from "./use-confirmation-hold";

const CONFIRMATION_HOLD_MILLISECONDS = 1500;
const LONG_PAST_HOLD_MILLISECONDS = 5000;
const MID_HOLD_MILLISECONDS = 1000;

const CONFIRMATIONS = ["success", "error"] as const;
const PASS_THROUGH_STATES = ["idle", "loading"] as const;

afterEach(() => {
    vi.useRealTimers();
});

test.each(PASS_THROUGH_STATES)("passes %s through unchanged", async (state) => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });

    const { result, act } = await renderHook(
        (state: ActionState = "idle") => useConfirmationHold(state),
        { initialProps: state }
    );

    expect(result.current).toBe(state);

    await act(() => {
        vi.advanceTimersByTime(LONG_PAST_HOLD_MILLISECONDS);
    });
    expect(result.current).toBe(state);
});

test.each(CONFIRMATIONS)("holds %s for 1.5s then shows idle", async (state) => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });

    const { result, act } = await renderHook(
        (state: ActionState = "idle") => useConfirmationHold(state),
        { initialProps: state }
    );

    expect(result.current).toBe(state);

    await act(() => {
        vi.advanceTimersByTime(CONFIRMATION_HOLD_MILLISECONDS - 1);
    });
    expect(result.current).toBe(state);

    await act(() => {
        vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("idle");
});

test("keeps the hold running when the same outcome renders again", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });

    const { result, act, rerender } = await renderHook(
        (state: ActionState = "idle") => useConfirmationHold(state),
        { initialProps: "success" }
    );

    await act(() => {
        vi.advanceTimersByTime(MID_HOLD_MILLISECONDS);
    });
    await rerender("success");

    await act(() => {
        vi.advanceTimersByTime(
            CONFIRMATION_HOLD_MILLISECONDS - MID_HOLD_MILLISECONDS - 1
        );
    });
    expect(result.current).toBe("success");

    await act(() => {
        vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("idle");
});

test("confirms again only after the state leaves the outcome", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });

    const { result, act, rerender } = await renderHook(
        (state: ActionState = "idle") => useConfirmationHold(state),
        { initialProps: "success" }
    );

    await act(() => {
        vi.advanceTimersByTime(CONFIRMATION_HOLD_MILLISECONDS);
    });
    await rerender("success");
    expect(result.current).toBe("idle");

    await rerender("loading");
    await rerender("success");
    expect(result.current).toBe("success");

    await act(() => {
        vi.advanceTimersByTime(CONFIRMATION_HOLD_MILLISECONDS - 1);
    });
    expect(result.current).toBe("success");

    await act(() => {
        vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("idle");
});

test("cancels the earlier hold when the outcome is entered again", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });

    const { result, act, rerender } = await renderHook(
        (state: ActionState = "idle") => useConfirmationHold(state),
        { initialProps: "success" }
    );

    await act(() => {
        vi.advanceTimersByTime(MID_HOLD_MILLISECONDS);
    });
    await rerender("loading");
    await rerender("success");

    await act(() => {
        vi.advanceTimersByTime(CONFIRMATION_HOLD_MILLISECONDS - 1);
    });
    expect(result.current).toBe("success");

    await act(() => {
        vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("idle");
});

test("lets a new outcome take over with a hold of its own", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });

    const { result, act, rerender } = await renderHook(
        (state: ActionState = "idle") => useConfirmationHold(state),
        { initialProps: "success" }
    );

    await act(() => {
        vi.advanceTimersByTime(MID_HOLD_MILLISECONDS);
    });
    await rerender("error");
    expect(result.current).toBe("error");

    await act(() => {
        vi.advanceTimersByTime(CONFIRMATION_HOLD_MILLISECONDS - 1);
    });
    expect(result.current).toBe("error");

    await act(() => {
        vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("idle");
});
