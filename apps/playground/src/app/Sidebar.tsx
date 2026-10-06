import type { ComponentPage } from "../examples";
import { hrefFor } from "./router";

type SidebarProps = {
    pages: ComponentPage[];
    activeSlug: string | undefined;
};

export function Sidebar({ pages, activeSlug }: SidebarProps): React.JSX.Element {
    return (
        <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar px-4 py-6 text-sidebar-foreground">
            <p className="px-2 text-sm font-semibold">kuhaku playground</p>
            <nav aria-label="Components">
                <ul className="flex flex-col gap-1">
                    {pages.map((page) => (
                        <li key={page.slug}>
                            <a
                                aria-current={
                                    page.slug === activeSlug ? "page" : undefined
                                }
                                className="block rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:text-sidebar-foreground aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-accent-foreground"
                                href={hrefFor(page.slug)}
                            >
                                {page.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
