"use client";

import { useEffect, useState } from "react";

const CONFIRMATION_HOLD_MILLISECONDS = 1500;

export type ActionState = "idle" | "loading" | "success" | "error";
type ConfirmationOutcome = "success" | "error";

function isConfirmation(state: ActionState): state is ConfirmationOutcome {
    return state === "success" || state === "error";
}

/**
 * The state an action control displays, given the state its caller set.
 *
 * `success` and `error` are confirmations: each holds for 1.5s from the
 * moment it is entered, then displays `idle` while the caller's prop stays
 * unchanged. A second confirmation of the same kind requires the caller to
 * leave that state and re-enter it. Any prop change during the hold ends it
 * and cancels its timer, so a stale outcome never replaces newer feedback.
 *
 * `idle` and `loading` pass through unchanged; loading persists until the
 * prop changes.
 */
export function useConfirmationHold(state: ActionState): ActionState {
    const [settledState, setSettledState] = useState<ConfirmationOutcome | null>(null);
    const [previousState, setPreviousState] = useState(state);

    if (state !== previousState) {
        setPreviousState(state);
        setSettledState(null);
    }

    const displayedState =
        isConfirmation(state) && settledState === state ? "idle" : state;

    useEffect(() => {
        if (!isConfirmation(state)) return;
        const timer = setTimeout(
            () => setSettledState(state),
            CONFIRMATION_HOLD_MILLISECONDS
        );
        return () => clearTimeout(timer);
    }, [state]);

    return displayedState;
}
