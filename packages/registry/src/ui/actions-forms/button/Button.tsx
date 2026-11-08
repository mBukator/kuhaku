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
import { X } from "lucide-react";
import { motion, type MotionProps } from "motion/react";
import type { ComponentType } from "react";

import { buttonVariants } from "./button-variants";
import type { ButtonProps, ButtonRenderedElement, ButtonState } from "./types";

const PRESS_SCALE = 0.97;
const PRESS_DURATION_SECONDS = 0.1;
const HOVER_LIFT_PX = -1;

const SHAKE_OFFSETS = [0, -4, 4, -4, 4, -4, 4, 0];
const SHAKE_SECONDS = 0.24;

const CHECK_DRAW_DELAY = SWAP_ENTER_DELAY + hold.tight;

// Coarse pointers get a 44px target (WCAG 2.5.5); lg sizes are already 48px.
const HIT_AREA_CLASSES = {
    sm: "inset-x-0 -inset-y-1.5",
    md: "inset-x-0 -inset-y-0.5",
    lg: "",
    "icon-sm": "-inset-1.5",
    icon: "-inset-0.5",
    "icon-lg": "",
} as const satisfies Record<NonNullable<ButtonProps["size"]>, string>;

type MotionElementType = ComponentType<MotionProps & Record<string, unknown>>;

// Cached per element type: a new motion.create() wrapper would remount the button.
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
                    className="relative z-10 inline-flex items-center gap-1"
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
