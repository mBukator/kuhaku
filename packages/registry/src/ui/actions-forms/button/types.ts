import type { ActionState } from "@/hooks/use-confirmation-hold";
import type { ComponentProps, HTMLAttributes, ReactElement, RefCallback } from "react";

export type ButtonState = {
    /** True while the button is disabled, including while `state` is `loading`. */
    disabled: boolean;
};

type MotionClaimedHandler = "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd";

export type ButtonRenderProps = HTMLAttributes<HTMLElement> & {
    ref?: RefCallback<HTMLElement>;
};

export type ButtonRenderedElement = ReactElement<Record<string, unknown>>;

export type ButtonProps = {
    /**
     * The visual style. `destructive` marks an action that deletes or cannot be undone;
     * `link` drops the surface and underlines on hover and focus.
     *
     * @default "primary"
     */
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "link";
    /**
     * Height: `sm` 32px, `md` 40px, `lg` 48px. The `icon` sizes are squares of the same
     * heights. On coarse pointers the hit area extends to at least 44px.
     *
     * @default "md"
     */
    size?: "sm" | "md" | "lg" | "icon-sm" | "icon" | "icon-lg";
    /**
     * The action's progress. `loading` shows a spinner, sets `aria-busy` and blocks
     * clicks while keeping focus. `success` and `error` show a check or a shake with a
     * cross for 1.5s, then return to the label while the prop stays unchanged. The
     * label remains the accessible name in every state.
     *
     * @default "idle"
     */
    state?: ActionState;
    /**
     * Keeps a disabled button in the Tab order, so it can still be reached and
     * described. A loading button is always focusable.
     *
     * @default false
     */
    focusableWhenDisabled?: boolean;
    /**
     * Set to `false` when `render` returns an element other than `<button>`, so Button
     * adds `role="button"` and Enter and Space activation.
     *
     * @default true
     */
    nativeButton?: boolean;
    /**
     * Renders your own element in place of `<button>`. Spread the received props,
     * including `ref`, onto it. Declare its component at module level: a component
     * defined during render is a new type each time and remounts the button.
     */
    render?: (props: ButtonRenderProps, state: ButtonState) => ButtonRenderedElement;
} & Omit<ComponentProps<"button">, MotionClaimedHandler>;
