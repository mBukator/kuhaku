"use client";

import type { ApiProperty } from "@/lib/api-reference";
import { LinkIcon, RotateCcwIcon } from "lucide-react";
import {
    createElement,
    useEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
    type ComponentType,
    type ReactNode,
} from "react";

import { toControls, toDefaultValues } from "./control-model";
import { ControlsPanel } from "./ControlsPanel";
import { readSettings, writeSettings } from "./playground-url";
import { PreviewFrame } from "./PreviewFrame";
import { toJsx } from "./to-jsx";
import type {
    ControlOverrides,
    IconComponents,
    PlaygroundValue,
    PlaygroundValues,
    SnippetChildren,
    SnippetModel,
} from "./types";

const URL_WRITE_DELAY_MILLISECONDS = 300;
const COPY_CONFIRMATION_MILLISECONDS = 1500;
/** The header action style, shared with the entry's Replay. */
export const ACTION_CLASS_NAME =
    "relative inline-flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring pointer-coarse:after:absolute pointer-coarse:after:inset-x-0 pointer-coarse:after:-inset-y-1.5";
const NO_ICONS: IconComponents = {};

type StageProps = Record<string, PlaygroundValue> & { children?: ReactNode };

type CopyStatus = { values: PlaygroundValues; message: string; isCopied: boolean };

type PlaygroundProps = {
    /** The installed component the stage renders. */
    component: ComponentType<StageProps>;
    /** The component's public props, read from its installed source. */
    properties: ApiProperty[];
    /**
     * Props to leave out and controls to add. Declare it at module level: a new
     * object each render rebuilds the controls and restarts the pending URL write.
     */
    overrides: ControlOverrides;
    /**
     * Builds the one model both the stage and the Code tab render from. Receives the
     * defaults too, so the snippet can leave out every prop still at its default.
     */
    toModel: (values: PlaygroundValues, defaults: PlaygroundValues) => SnippetModel;
    /** The icon components the model can name, keyed by their import name. */
    icons?: IconComponents;
    /** Extra header actions for the current values, or `null` for none. */
    renderActions?: (values: PlaygroundValues) => React.JSX.Element | null;
};

/** Nothing to subscribe to: only this component's `replaceState` changes the query. */
function subscribeToNothing(): () => void {
    return () => {};
}

function readSearch(): string {
    return window.location.search;
}

function readServerSearch(): string {
    return "";
}

/** The model's child as a React node; throws on an icon the entry did not pass. */
function toStageChildren(children: SnippetChildren, icons: IconComponents): ReactNode {
    switch (children.kind) {
        case "text":
            return children.text;
        case "icon": {
            const icon = icons[children.iconName];
            if (icon === undefined) {
                throw new Error(
                    `${children.iconName}: the entry passes no icon of this name`
                );
            }

            return createElement(icon);
        }
    }
}

export function Playground({
    component,
    properties,
    overrides,
    toModel,
    icons = NO_ICONS,
    renderActions,
}: PlaygroundProps): React.JSX.Element {
    const [edits, setEdits] = useState<PlaygroundValues | null>(null);
    const [copyStatus, setCopyStatus] = useState<CopyStatus | null>(null);

    const headingRef = useRef<HTMLHeadingElement>(null);
    const controls = useMemo(
        () => toControls(properties, overrides),
        [properties, overrides]
    );
    const defaults = useMemo(() => toDefaultValues(controls), [controls]);
    const search = useSyncExternalStore(subscribeToNothing, readSearch, readServerSearch);
    const urlValues = useMemo(
        () => ({ ...defaults, ...readSettings(search, controls) }),
        [defaults, search, controls]
    );

    useEffect(() => {
        if (edits === null) return;

        const timer = window.setTimeout(() => {
            const nextHref = writeSettings(edits, controls, window.location.href);
            if (nextHref === window.location.href) return;

            window.history.replaceState(null, "", nextHref);
        }, URL_WRITE_DELAY_MILLISECONDS);

        return () => window.clearTimeout(timer);
    }, [edits, controls]);

    // A failure stays: it asks for something, a confirmation does not.
    useEffect(() => {
        if (copyStatus === null || !copyStatus.isCopied) return;

        const timer = window.setTimeout(
            () => setCopyStatus(null),
            COPY_CONFIRMATION_MILLISECONDS
        );

        return () => window.clearTimeout(timer);
    }, [copyStatus]);

    const values = edits ?? urlValues;
    const hasChanges = controls.some(
        (control) => values[control.name] !== control.defaultValue
    );
    const model = toModel(values, defaults);
    const code = toJsx(model);
    const stage = createElement(
        component,
        Object.fromEntries(model.props),
        toStageChildren(model.children, icons)
    );
    const entryActions = renderActions?.(values) ?? null;
    const copyMessage = copyStatus?.values === values ? copyStatus.message : "";

    function handleValueChange(name: string, value: PlaygroundValue): void {
        setEdits((current) => ({ ...(current ?? urlValues), [name]: value }));
    }

    function handleReset(): void {
        headingRef.current?.focus();
        setEdits(defaults);
    }

    async function handleCopyLink(): Promise<void> {
        const href = writeSettings(values, controls, window.location.href);

        try {
            await navigator.clipboard.writeText(href);
            setCopyStatus({ values, message: "Link copied", isCopied: true });
        } catch {
            setCopyStatus({
                values,
                message: "Could not copy the link",
                isCopied: false,
            });
        }
    }

    // On narrow rows the status gets a reserved line, so its text never moves the buttons.
    const actions =
        entryActions === null && !hasChanges ? undefined : (
            <>
                {hasChanges && (
                    <p
                        role="status"
                        className="text-sm text-muted-foreground @max-xl:order-last @max-xl:h-5 @max-xl:basis-full @max-xl:text-right"
                    >
                        {copyMessage}
                    </p>
                )}
                {entryActions}
                {hasChanges && (
                    <>
                        <button
                            type="button"
                            onClick={handleReset}
                            className={ACTION_CLASS_NAME}
                        >
                            <RotateCcwIcon className="size-4" />
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={() => void handleCopyLink()}
                            className={ACTION_CLASS_NAME}
                        >
                            <LinkIcon className="size-4" />
                            Copy link
                        </button>
                    </>
                )}
            </>
        );

    return (
        <>
            <PreviewFrame code={code}>{stage}</PreviewFrame>
            <ControlsPanel
                controls={controls}
                values={values}
                onValueChange={handleValueChange}
                actions={actions}
                headingRef={headingRef}
            />
        </>
    );
}
