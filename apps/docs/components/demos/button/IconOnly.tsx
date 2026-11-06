import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function IconOnly(): React.JSX.Element {
    return (
        <Button size="icon" aria-label="Add item">
            <Plus />
        </Button>
    );
}
