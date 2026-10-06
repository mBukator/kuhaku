import { Button, type ButtonProps } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Segmented } from "../../components/Segmented";
import { Toggle } from "../../components/Toggle";

type Variant = NonNullable<ButtonProps["variant"]>;
type Size = NonNullable<ButtonProps["size"]>;
type State = NonNullable<ButtonProps["state"]>;

const VARIANTS: Variant[] = ["primary", "secondary", "ghost", "destructive", "link"];
const SIZES: Size[] = ["sm", "md", "lg", "icon-sm", "icon", "icon-lg"];
const STATES: State[] = ["idle", "loading", "success", "error"];
const SIMULATED_REQUEST_MILLISECONDS = 1200;

export const description =
    "Every prop at once. Simulate a request to watch loading settle into success or error.";

export default function ButtonDemo(): React.JSX.Element {
    const [variant, setVariant] = useState<Variant>("primary");
    const [size, setSize] = useState<Size>("md");
    const [state, setState] = useState<State>("idle");
    const [isDisabled, setIsDisabled] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const requestTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(requestTimer.current), []);

    const isIconSize = size.startsWith("icon");

    const simulateRequest = (outcome: "success" | "error") => {
        clearTimeout(requestTimer.current);
        setState("loading");
        requestTimer.current = setTimeout(
            () => setState(outcome),
            SIMULATED_REQUEST_MILLISECONDS
        );
    };

    return (
        <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-4">
                <Segmented
                    label="variant"
                    options={VARIANTS}
                    value={variant}
                    onChange={setVariant}
                />
                <Segmented label="size" options={SIZES} value={size} onChange={setSize} />
                <Segmented
                    label="state"
                    options={STATES}
                    value={state}
                    onChange={setState}
                />
                <Toggle
                    isChecked={isDisabled}
                    label="disabled"
                    onChange={setIsDisabled}
                />
            </div>

            <div className="flex flex-col items-center gap-3">
                <Button
                    aria-label={isIconSize ? "Add item" : undefined}
                    disabled={isDisabled}
                    size={size}
                    state={state}
                    variant={variant}
                    onClick={() => setClickCount((count) => count + 1)}
                >
                    {isIconSize ? <Plus className="size-4" /> : "Save changes"}
                </Button>
                <p className="text-xs text-muted-foreground">
                    onClick fired {clickCount} {clickCount === 1 ? "time" : "times"}
                </p>
                <div className="flex gap-2 text-xs">
                    <button
                        className="rounded-sm border px-2 py-1"
                        type="button"
                        onClick={() => simulateRequest("success")}
                    >
                        simulate request → success
                    </button>
                    <button
                        className="rounded-sm border px-2 py-1"
                        type="button"
                        onClick={() => simulateRequest("error")}
                    >
                        simulate request → error
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                    All variants at this size and state
                </p>
                <div className="flex flex-wrap items-center gap-2">
                    {VARIANTS.map((each) => (
                        <Button
                            key={each}
                            aria-label={isIconSize ? each : undefined}
                            size={size}
                            state={state}
                            variant={each}
                        >
                            {isIconSize ? <Plus className="size-4" /> : each}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
