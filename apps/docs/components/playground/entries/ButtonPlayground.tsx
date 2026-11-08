"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { PlayIcon, PlusIcon } from "lucide-react";
import { useRef, useState } from "react";

import { ACTION_CLASS_NAME, Playground } from "../Playground";
import type {
    ControlOverrides,
    IconComponents,
    PlaygroundEntryProps,
    PlaygroundValue,
    PlaygroundValues,
    SnippetModel,
} from "../types";

const LABEL_CONTROL_NAME = "label";
const DEFAULT_LABEL = "Save changes";
const MAX_LABEL_LENGTH_CHARACTERS = 40;

const BUTTON_IMPORT = 'import { Button } from "@/components/ui/button";';
const PLUS_IMPORT = 'import { Plus } from "lucide-react";';

const OVERRIDES: ControlOverrides = {
    exclude: ["render", "nativeButton"],
    extras: [
        { kind: "switch", name: "disabled", defaultValue: false },
        {
            kind: "text",
            name: LABEL_CONTROL_NAME,
            defaultValue: DEFAULT_LABEL,
            maxLengthCharacters: MAX_LABEL_LENGTH_CHARACTERS,
        },
    ],
};

const ICONS = { Plus: PlusIcon } satisfies IconComponents;

type ButtonSize = NonNullable<ButtonProps["size"]>;

const SIZE_SHOWS_ICON = {
    sm: false,
    md: false,
    lg: false,
    "icon-sm": true,
    icon: true,
    "icon-lg": true,
} satisfies Record<ButtonSize, boolean>;

/** Narrows a string to a Button size; `Object.hasOwn` skips inherited keys such as `toString`. */
function isButtonSize(value: string): value is ButtonSize {
    return Object.hasOwn(SIZE_SHOWS_ICON, value);
}

/** Whether a size value is one of Button's square icon sizes. */
function isIconSize(size: PlaygroundValue): boolean {
    if (typeof size !== "string") return false;
    if (!isButtonSize(size)) return false;
    return SIZE_SHOWS_ICON[size];
}

/** The trimmed label, or the default when empty, matching how `label=` reads back from the URL. */
function readLabel(values: PlaygroundValues): string {
    const label = values[LABEL_CONTROL_NAME];
    if (typeof label !== "string") return DEFAULT_LABEL;

    const trimmed = label.trim();

    return trimmed === "" ? DEFAULT_LABEL : trimmed;
}

/**
 * The snippet for these values: every prop off its default, in control order. Icon
 * sizes swap the label for a Plus child and keep it as the `aria-label`.
 */
function toButtonModel(
    values: PlaygroundValues,
    defaults: PlaygroundValues
): SnippetModel {
    const label = readLabel(values);
    const props = Object.entries(values).filter(
        ([name, value]) => name !== LABEL_CONTROL_NAME && value !== defaults[name]
    );

    if (!isIconSize(values.size)) {
        return {
            componentName: "Button",
            imports: [BUTTON_IMPORT],
            props,
            children: { kind: "text", text: label },
        };
    }

    return {
        componentName: "Button",
        imports: [BUTTON_IMPORT, PLUS_IMPORT],
        props: [...props, ["aria-label", label]],
        children: { kind: "icon", iconName: "Plus" },
    };
}

function isConfirmation(state: PlaygroundValue | undefined): boolean {
    return state === "success" || state === "error";
}

export function ButtonPlayground({
    properties,
}: PlaygroundEntryProps): React.JSX.Element {
    const [isReplaying, setIsReplaying] = useState(false);
    const replayIdRef = useRef<number | null>(null);

    function handleReplay(): void {
        if (replayIdRef.current !== null) cancelAnimationFrame(replayIdRef.current);
        setIsReplaying(true);

        // Two frames, so `idle` paints once before the confirmation returns.
        replayIdRef.current = requestAnimationFrame(() => {
            replayIdRef.current = requestAnimationFrame(() => {
                replayIdRef.current = null;
                setIsReplaying(false);
            });
        });
    }

    return (
        <Playground
            component={Button}
            properties={properties}
            overrides={OVERRIDES}
            icons={ICONS}
            toModel={(values, defaults) =>
                toButtonModel(
                    isReplaying ? { ...values, state: "idle" } : values,
                    defaults
                )
            }
            renderActions={(values) =>
                isConfirmation(values.state) ? (
                    <button
                        type="button"
                        onClick={handleReplay}
                        className={ACTION_CLASS_NAME}
                    >
                        <PlayIcon className="size-4" />
                        Replay
                    </button>
                ) : null
            }
        />
    );
}
