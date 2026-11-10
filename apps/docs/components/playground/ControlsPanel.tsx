"use client";

import { cn } from "@/lib/cn";
import { Select } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useId, type ReactNode, type Ref } from "react";

import type { Control, PlaygroundValue, PlaygroundValues } from "./types";

const FOCUS_RING_CLASS_NAME =
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring";

type ControlsPanelProps = {
    /** The rows to render, in order. */
    controls: Control[];
    /** The current value of every control, keyed by name. */
    values: PlaygroundValues;
    /** Reports one control's new value. */
    onValueChange: (name: string, value: PlaygroundValue) => void;
    /** Buttons for the header, such as Reset and Copy link. */
    actions?: ReactNode;
    /** Receives focus after Reset, which unmounts the button that had it. */
    headingRef?: Ref<HTMLHeadingElement>;
};

type ControlRowProps = {
    control: Control;
    value: PlaygroundValue;
    onValueChange: (name: string, value: PlaygroundValue) => void;
};

type ControlInputProps = ControlRowProps & {
    inputId: string;
};

type ControlSelectProps = ControlInputProps & {
    control: Extract<Control, { kind: "select" }>;
};

function ControlSelect({
    control,
    value,
    inputId,
    onValueChange,
}: ControlSelectProps): React.JSX.Element {
    return (
        <Select.Root
            value={typeof value === "string" ? value : control.defaultValue}
            onValueChange={(next) => {
                if (typeof next === "string") onValueChange(control.name, next);
            }}
        >
            <Select.Trigger
                id={inputId}
                className={cn(
                    "relative inline-flex h-8 items-center gap-1.5 rounded-md pr-2 pl-2.5 text-sm font-medium text-foreground",
                    "pointer-coarse:after:absolute pointer-coarse:after:inset-x-0 pointer-coarse:after:-inset-y-1.5",
                    "transition-colors duration-fast ease-in-out hover:bg-secondary-hover data-popup-open:bg-secondary-hover",
                    FOCUS_RING_CLASS_NAME
                )}
            >
                <Select.Value />
                <Select.Icon className="flex text-muted-foreground">
                    <ChevronDownIcon className="size-4" />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Positioner
                    className="z-50 outline-none"
                    alignItemWithTrigger={false}
                >
                    <Select.Popup
                        className={cn(
                            "min-w-(--anchor-width) rounded-lg border bg-popover p-1 text-popover-foreground shadow-md outline-none",
                            "origin-(--transform-origin) transition-[opacity,scale] duration-fast ease-out",
                            "data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
                        )}
                    >
                        {control.options.map((option) => (
                            <Select.Item
                                key={option}
                                value={option}
                                className="flex h-8 cursor-default items-center justify-between gap-6 rounded-md pr-2 pl-2.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                            >
                                <Select.ItemText>{option}</Select.ItemText>
                                <Select.ItemIndicator className="flex">
                                    <CheckIcon className="size-4" />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Popup>
                </Select.Positioner>
            </Select.Portal>
        </Select.Root>
    );
}

/** The input that edits one control: a select, a switch or a text field. */
function ControlInput({
    control,
    value,
    inputId,
    onValueChange,
}: ControlInputProps): React.JSX.Element {
    switch (control.kind) {
        case "select":
            return (
                <ControlSelect
                    control={control}
                    value={value}
                    inputId={inputId}
                    onValueChange={onValueChange}
                />
            );
        case "switch": {
            const isOn = value === true;

            return (
                <button
                    type="button"
                    role="switch"
                    id={inputId}
                    aria-checked={isOn}
                    onClick={() => onValueChange(control.name, !isOn)}
                    className={cn(
                        "group relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-muted aria-checked:bg-primary",
                        "pointer-coarse:after:absolute pointer-coarse:after:inset-x-0 pointer-coarse:after:-inset-y-2.5",
                        FOCUS_RING_CLASS_NAME
                    )}
                >
                    <span className="size-5 translate-x-0.5 rounded-full bg-muted-foreground transition-transform duration-fast ease-out group-aria-checked:translate-x-5.5 group-aria-checked:bg-primary-foreground" />
                </button>
            );
        }
        case "text":
            return (
                <input
                    type="text"
                    id={inputId}
                    value={typeof value === "string" ? value : control.defaultValue}
                    maxLength={control.maxLengthCharacters}
                    onChange={(event) => onValueChange(control.name, event.target.value)}
                    className={cn(
                        "h-8 w-40 min-w-0 rounded-md border border-input bg-background px-2 text-sm text-foreground pointer-coarse:h-11",
                        FOCUS_RING_CLASS_NAME
                    )}
                />
            );
    }
}

function ControlRow({
    control,
    value,
    onValueChange,
}: ControlRowProps): React.JSX.Element {
    const inputId = useId();

    return (
        <div className="flex min-h-12 items-center justify-between gap-4 rounded-lg bg-secondary py-2 pr-2 pl-4">
            <label htmlFor={inputId} className="truncate text-sm text-muted-foreground">
                {control.name}
            </label>
            <ControlInput
                control={control}
                value={value}
                inputId={inputId}
                onValueChange={onValueChange}
            />
        </div>
    );
}

export function ControlsPanel({
    controls,
    values,
    onValueChange,
    actions,
    headingRef,
}: ControlsPanelProps): React.JSX.Element {
    const headingId = useId();

    return (
        <section
            aria-labelledby={headingId}
            className="not-prose @container my-6 rounded-xl border bg-card p-4"
        >
            <div className="mb-4 flex min-h-10 flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <h2
                    ref={headingRef}
                    tabIndex={-1}
                    id={headingId}
                    className="text-lg font-semibold outline-none"
                >
                    Customize
                </h2>
                {actions !== undefined && (
                    <div className="flex flex-wrap items-center justify-end gap-2 @max-xl:w-full">
                        {actions}
                    </div>
                )}
            </div>
            <div className="grid gap-2 @md:grid-cols-2 @3xl:grid-cols-3">
                {controls.map((control) => (
                    <ControlRow
                        key={control.name}
                        control={control}
                        value={values[control.name]}
                        onValueChange={onValueChange}
                    />
                ))}
            </div>
        </section>
    );
}
