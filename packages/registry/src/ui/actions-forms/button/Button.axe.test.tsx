import type { ActionState } from "@/hooks/use-confirmation-hold";
import { runAxe } from "#test/axe";
import { applyColorMode, COLOR_MODES } from "#test/modes";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { Button } from "./Button";
import type { ButtonProps } from "./types";

type ButtonVariant = NonNullable<ButtonProps["variant"]>;

const VARIANTS = Object.keys({
    primary: true,
    secondary: true,
    ghost: true,
    destructive: true,
    link: true,
} satisfies Record<ButtonVariant, true>) as ButtonVariant[];

const STATES = Object.keys({
    idle: true,
    loading: true,
    success: true,
    error: true,
} satisfies Record<ActionState, true>) as ActionState[];

const CASES = VARIANTS.flatMap((variant) =>
    STATES.map((state) => [variant, state] as const)
);

describe.each(COLOR_MODES)("Button in %s mode", (mode) => {
    test.each(CASES)("%s %s has no axe violations", async (variant, state) => {
        applyColorMode(mode);
        const screen = await render(
            <Button variant={variant} state={state}>
                Save
            </Button>
        );

        expect(await runAxe(screen.container)).toHaveNoViolations();
    });
});
