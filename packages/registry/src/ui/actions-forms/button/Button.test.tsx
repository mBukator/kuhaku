import type { ActionState } from "@/hooks/use-confirmation-hold";
import { afterEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

import { Button } from "./Button";
import type { ButtonRenderProps } from "./types";

const STATES = Object.keys({
    idle: true,
    loading: true,
    success: true,
    error: true,
} satisfies Record<ActionState, true>) as ActionState[];

/** Renders Button as a div, the element its `nativeButton={false}` path is for. */
const renderDiv = (props: ButtonRenderProps) => {
    return <div {...props} />;
};

const ACTIVATION_CASES = [
    { name: "native button" },
    { name: "rendered div", nativeButton: false, render: renderDiv },
];

const CONFIRMATIONS = ["success", "error"] as const;

const CONFIRMATION_HOLD_MILLISECONDS = 1500;

/**
 * Resolves after two real animation frames, by which time React has committed pending
 * updates and Chromium has moved focus off any element that stopped being focusable.
 */
function waitForFrames(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
        });
    });
}

afterEach(() => {
    vi.useRealTimers();
});

test("renders a native button named by its label", async () => {
    const screen = await render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    await expect.element(button).toBeVisible();
    expect(button.element().tagName).toBe("BUTTON");
});

test("marks a loading button busy", async () => {
    const screen = await render(<Button state="loading">Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    await expect.element(button).toHaveAttribute("aria-busy", "true");
    await expect.element(button).toHaveAttribute("data-state", "loading");
});

test("keeps focus when it starts loading", async () => {
    const screen = await render(<Button>Save</Button>);
    await userEvent.tab();

    const button = screen.getByRole("button", { name: "Save" });
    await screen.rerender(<Button state="loading">Save</Button>);
    await waitForFrames();

    expect(button.element()).toHaveFocus();
});

test("stays in the Tab order while loading", async () => {
    const screen = await render(
        <>
            <Button>Before</Button>
            <Button state="loading">Save</Button>
            <Button>After</Button>
        </>
    );
    const button = screen.getByRole("button", { name: "Save" });

    await userEvent.tab();
    await userEvent.tab();

    await expect.element(button).toHaveFocus();
});

test("blocks clicks while loading", async () => {
    const onClick = vi.fn();

    const screen = await render(
        <Button state="loading" onClick={onClick}>
            Save
        </Button>
    );
    const button = screen.getByRole("button", { name: "Save" });

    await userEvent.click(button, { force: true });

    expect(onClick).not.toHaveBeenCalled();
});

test.each(STATES)("keeps the label as its name while %s", async (state) => {
    const screen = await render(<Button state={state}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    await expect.element(button).toHaveAccessibleName("Save");
});

test("hides the indicator from assistive technology while loading", async () => {
    const screen = await render(<Button state="loading">Save</Button>);

    await expect
        .element(screen.getByRole("status", { includeHidden: true }))
        .toBeInTheDocument();
    await expect.element(screen.getByRole("status")).not.toBeInTheDocument();
});

test("blocks clicks while disabled", async () => {
    const onClick = vi.fn();

    const screen = await render(
        <Button onClick={onClick} disabled>
            Save
        </Button>
    );
    const button = screen.getByRole("button", { name: "Save" });

    await userEvent.click(button, { force: true });

    expect(onClick).not.toHaveBeenCalled();
});

test("skips a disabled button in the Tab order", async () => {
    const screen = await render(
        <>
            <Button>Before</Button>
            <Button disabled>Save</Button>
            <Button>After</Button>
        </>
    );
    const button = screen.getByRole("button", { name: "After" });

    await userEvent.tab();
    await userEvent.tab();

    await expect.element(button).toHaveFocus();
});

test("exposes a rendered div as a button", async () => {
    const screen = await render(
        <Button nativeButton={false} render={renderDiv}>
            Save
        </Button>
    );
    const button = screen.getByRole("button", { name: "Save" });

    expect(button.element().tagName).toBe("DIV");
});

test.each(ACTIVATION_CASES)(
    "activates a $name with Enter and Space",
    async ({ name, ...props }) => {
        const onClick = vi.fn();

        const screen = await render(
            <Button {...props} onClick={onClick}>
                Save
            </Button>
        );
        const button = screen.getByRole("button", { name: "Save" });

        await userEvent.tab();
        await expect.element(button).toHaveFocus();

        await userEvent.keyboard("{Enter}");
        expect(onClick).toHaveBeenCalledOnce();

        onClick.mockClear();

        await userEvent.keyboard(" ");
        expect(onClick).toHaveBeenCalledOnce();
    }
);

test.each(CONFIRMATIONS)("returns to idle 1.5s after %s", async (state) => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });

    const screen = await render(<Button state={state}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    expect(button.element()).toHaveAttribute("data-state", state);

    // Plain expect: expect.element's retries would advance the fake clock themselves.
    vi.advanceTimersByTime(CONFIRMATION_HOLD_MILLISECONDS - 1);
    await waitForFrames();
    expect(button.element()).toHaveAttribute("data-state", state);

    vi.advanceTimersByTime(1);
    await waitForFrames();
    expect(button.element()).toHaveAttribute("data-state", "idle");
});
