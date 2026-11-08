import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export function LinkAsButton(): React.JSX.Element {
    return (
        <Link href="/docs/components" className={buttonVariants({ size: "lg" })}>
            Browse components
        </Link>
    );
}
