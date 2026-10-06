import { Button } from "@/components/ui/button";
import { useState, type ComponentProps } from "react";

// Declared at module level: a component defined inside the example would get a new
// identity on every render and defeat Button's motion wrapper cache.
function CustomButton(props: ComponentProps<"button">): React.JSX.Element {
    return <button {...props} data-custom="" />;
}

export const description =
    "render swaps the element and keeps Button's motion and state on it. A non-button element takes nativeButton={false}.";

export default function ButtonRenderProp(): React.JSX.Element {
    const [clickCount, setClickCount] = useState(0);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    nativeButton={false}
                    render={(props) => <div {...props} />}
                    onClick={() => setClickCount((count) => count + 1)}
                >
                    as div
                </Button>
                <Button
                    render={(props) => <CustomButton {...props} />}
                    onClick={() => setClickCount((count) => count + 1)}
                >
                    as component
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                onClick fired {clickCount} {clickCount === 1 ? "time" : "times"}
            </p>
        </div>
    );
}
