"use client";

import { Checkmark } from "@/components/ui/checkmark";
import { Spinner } from "@/components/ui/spinner";
import { Swap, SWAP_ENTER_DELAY, SWAP_TIMELINE } from "@/components/ui/swap";
import { useConfirmationHold, type ActionState } from "@/hooks/use-confirmation-hold";
import { cn } from "@/lib/cn";
import {
    duration,
    ease,
    hold,
    springs,
    useMotionSuppressed,
    withSuppression,
} from "@/lib/motion";
import { Button as BaseButton } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { motion, type MotionProps } from "motion/react";
import type { ComponentType } from "react";

import type { ButtonProps, ButtonRenderedElement, ButtonState } from "./types";

// Spec 5.6: press compresses to 0.97 in 100ms `ease-out`; hover lifts one pixel,
// the minimum detectable lift, on the tint's 150ms timeline.
const PRESS_SCALE = 0.97;
const PRESS_DURATION_SECONDS = 0.1;
const HOVER_LIFT_PX = -1;

// Spec 5.6 error shake: three cycles at +-4px, 240ms total, translateX only.
const SHAKE_OFFSETS = [0, -4, 4, -4, 4, -4, 4, 0];
const SHAKE_SECONDS = 0.24;

// The check starts drawing 50ms into Swap's entrance, never before it is visible.
const CHECK_DRAW_DELAY = SWAP_ENTER_DELAY + hold.tight;

const buttonVariants = cva(
    [
        "relative isolate inline-flex shrink-0 items-center justify-center rounded-md",
        "whitespace-nowrap select-none",
        "forced-colors:border forced-colors:border-[ButtonBorder]",
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10",
        "before:rounded-[inherit] before:opacity-0 before:content-['']",
        "before:transition-opacity before:duration-fast before:ease-in-out",
        "hover:not-data-disabled:before:opacity-100",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']",
        "after:shadow-[0_0_0_2px_var(--background),0_0_0_5px_var(--ring)]",
        "after:opacity-0 after:transition-opacity after:duration-fast after:ease-in-out",
        "focus-visible:after:opacity-100 focus-visible:shadow-none",
        "data-disabled:not-data-[state=loading]:opacity-50",
        "data-disabled:not-data-[state=loading]:cursor-not-allowed",
    ],
    {
        variants: {
            variant: {
                primary: [
                    "bg-primary text-primary-foreground",
                    "before:bg-primary-hover",
                ],
                secondary: [
                    "bg-secondary text-secondary-foreground",
                    "before:bg-secondary-hover",
                ],
                ghost: ["bg-transparent text-foreground", "before:bg-accent"],
                destructive: [
                    "bg-destructive text-destructive-foreground",
                    "before:bg-destructive-hover",
                ],
                link: [
                    "bg-transparent text-primary",
                    "before:hidden",
                    "underline-offset-4",
                    "hover:not-data-disabled:underline",
                    "focus-visible:not-data-disabled:underline",
                ],
            },
            size: {
                sm: ["h-8 px-3 text-sm"],
                md: ["h-10 px-4 text-sm"],
                lg: ["h-12 px-5 text-sm"],
                "icon-sm": ["size-8"],
                icon: ["size-10"],
                "icon-lg": ["size-12"],
            },
        },
        defaultVariants: {
            variant: "primary",
        },
    }
);

// Coarse pointers get a 44px target (WCAG 2.5.8); lg sizes are already 48px.
const HIT_AREA_CLASSES = {
    sm: "inset-x-0 -inset-y-1.5",
    md: "inset-x-0 -inset-y-0.5",
    lg: "",
    "icon-sm": "-inset-1.5",
    icon: "-inset-0.5",
    "icon-lg": "",
} as const satisfies Record<NonNullable<ButtonProps["size"]>, string>;

type MotionElementType = ComponentType<MotionProps & Record<string, unknown>>;

// One motion wrapper per element type, created once: a new wrapper per render is a new
// component identity, and React remounts the button on every state change. A component
// type defined inline in a parent's render misses this cache on every render.
const MOTION_ELEMENTS = new Map<ButtonRenderedElement["type"], MotionElementType>();

function getMotionElement(type: ButtonRenderedElement["type"]): MotionElementType {
    const cached = MOTION_ELEMENTS.get(type);
    if (cached !== undefined) return cached;

    const created = motion.create(type);
    MOTION_ELEMENTS.set(type, created);
    return created;
}

function ButtonIndicator({ state }: { state: ActionState }) {
    switch (state) {
        case "loading":
            return <Spinner className="flex" />;
        case "success":
            return <Checkmark delay={CHECK_DRAW_DELAY} />;
        case "error":
            return <X className="size-4" />;
        default:
            return null;
    }
}

export function Button({
    className,
    variant,
    size = "md",
    state = "idle",
    disabled,
    focusableWhenDisabled,
    children,
    render,
    nativeButton,
    ...props
}: ButtonProps): React.JSX.Element {
    const suppressed = useMotionSuppressed();
    const displayedState = useConfirmationHold(state);

    const isIdle = displayedState === "idle";
    const isLoading = displayedState === "loading";
    const isError = displayedState === "error";
    const isInteractive = !disabled && !isLoading;

    const press = withSuppression(
        { duration: PRESS_DURATION_SECONDS, ease: ease.out },
        suppressed
    );
    const release = withSuppression(
        {
            scale: { type: "spring", ...springs.snappy },
            y: { duration: duration.fast, ease: ease.inOut },
        },
        suppressed
    );

    const labelEnter = withSuppression(
        { duration: SWAP_TIMELINE.enter, delay: SWAP_ENTER_DELAY, ease: ease.inOut },
        suppressed
    );
    const labelExit = withSuppression(
        { duration: SWAP_TIMELINE.exit, ease: ease.inOut },
        suppressed
    );

    const shake = withSuppression(
        { duration: SHAKE_SECONDS, delay: SWAP_ENTER_DELAY, ease: ease.inOut },
        suppressed
    );
    const shakeSettle = withSuppression(
        { duration: SWAP_TIMELINE.exit, ease: ease.inOut },
        suppressed
    );

    return (
        <BaseButton
            {...props}
            disabled={disabled || isLoading}
            focusableWhenDisabled={isLoading || (focusableWhenDisabled ?? false)}
            nativeButton={nativeButton}
            className={cn(buttonVariants({ variant, size }), className)}
            aria-busy={isLoading}
            data-state={displayedState}
            render={(renderProps, baseState) => {
                // Our own state object: a field Base UI adds later never reaches adopters.
                const renderState: ButtonState = { disabled: baseState.disabled };
                const element: ButtonRenderedElement = render ? (
                    render(
                        {
                            ...renderProps,
                            // Base UI types its merged ref as `Ref<any>`; at runtime it is
                            // always a callback, and on the server there is none.
                            ref:
                                typeof renderProps.ref === "function"
                                    ? renderProps.ref
                                    : undefined,
                        },
                        renderState
                    )
                ) : (
                    <button {...renderProps} />
                );
                const MotionElement = getMotionElement(element.type);

                // Motion props come after the spread: an adopter's element carries
                // Button's motion, never its own (Tier 2).
                return (
                    <MotionElement
                        {...element.props}
                        animate={
                            isError
                                ? { x: SHAKE_OFFSETS, transition: shake }
                                : { x: 0, transition: shakeSettle }
                        }
                        whileHover={isInteractive ? { y: HOVER_LIFT_PX } : undefined}
                        whileTap={
                            isInteractive
                                ? { scale: PRESS_SCALE, transition: press }
                                : undefined
                        }
                        transition={release}
                    />
                );
            }}
        >
            <span
                aria-hidden="true"
                className={cn(
                    "absolute hidden pointer-coarse:block",
                    HIT_AREA_CLASSES[size]
                )}
            />
            <span className="grid place-items-center [grid-template-areas:'stack'] *:[grid-area:stack]">
                <motion.span
                    initial={false}
                    animate={{ opacity: isIdle ? 1 : 0 }}
                    transition={isIdle ? labelEnter : labelExit}
                    className="inline-flex items-center gap-1"
                >
                    {children}
                </motion.span>
                <Swap className="size-4" value={displayedState} aria-hidden="true">
                    <ButtonIndicator state={displayedState} />
                </Swap>
            </span>
        </BaseButton>
    );
}
