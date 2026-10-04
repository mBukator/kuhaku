import type { ActionState } from "@/hooks/use-confirmation-hold";
import type { ComponentProps, HTMLAttributes, ReactElement, RefCallback } from "react";

export type ButtonState = {
    disabled: boolean;
};

type MotionClaimedHandler = "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd";

export type ButtonRenderProps = HTMLAttributes<HTMLElement> & {
    ref?: RefCallback<HTMLElement>;
};

export type ButtonRenderedElement = ReactElement<Record<string, unknown>>;

export type ButtonProps = {
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "link";
    size?: "sm" | "md" | "lg" | "icon-sm" | "icon" | "icon-lg";
    state?: ActionState;
    focusableWhenDisabled?: boolean;
    nativeButton?: boolean;
    render?: (props: ButtonRenderProps, state: ButtonState) => ButtonRenderedElement;
} & Omit<ComponentProps<"button">, MotionClaimedHandler>;
