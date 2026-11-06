import { Button } from "@/components/ui/button";

export function ActionGroup(): React.JSX.Element {
    return (
        <div className="flex gap-2">
            <Button variant="secondary">Cancel</Button>
            <Button>Save changes</Button>
        </div>
    );
}
