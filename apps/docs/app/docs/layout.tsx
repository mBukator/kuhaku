import { MobileDrawerFocus } from "@/components/MobileDrawerFocus";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

export default function Layout({ children }: LayoutProps<"/docs">) {
    return (
        <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
            <MobileDrawerFocus />
            {children}
        </DocsLayout>
    );
}
