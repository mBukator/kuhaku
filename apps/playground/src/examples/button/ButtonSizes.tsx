import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ButtonSizes(): React.JSX.Element {
    return (
        <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
                <Button size="sm">Small</Button>
                <Button aria-label="Add item" size="icon-sm">
                    <Plus className="size-4" />
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <Button size="md">Default</Button>
                <Button aria-label="Add item" size="icon">
                    <Plus className="size-4" />
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <Button size="lg">Large</Button>
                <Button aria-label="Add item" size="icon-lg">
                    <Plus className="size-4" />
                </Button>
            </div>
        </div>
    );
}
