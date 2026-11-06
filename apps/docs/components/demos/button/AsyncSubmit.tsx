"use client";

import { Button } from "@/components/ui/button";
import type { ActionState } from "@/hooks/use-confirmation-hold";
import { useState } from "react";

const SAVE_DELAY_MILLISECONDS = 1200;

function wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function AsyncSubmit(): React.JSX.Element {
    const [state, setState] = useState<ActionState>("idle");

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();
        setState("loading");
        await wait(SAVE_DELAY_MILLISECONDS);
        setState("success");
    }

    return (
        <form onSubmit={(event) => void handleSubmit(event)}>
            <Button type="submit" state={state}>
                Save changes
            </Button>
        </form>
    );
}
