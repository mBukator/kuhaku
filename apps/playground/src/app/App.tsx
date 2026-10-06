import { useEffect } from "react";

import { COMPONENT_PAGES } from "../examples";
import { ComponentPageView } from "./ComponentPageView";
import { useRouteSlug } from "./router";
import { Sidebar } from "./Sidebar";
import { Toolbar } from "./Toolbar";

export function App(): React.JSX.Element {
    const slug = useRouteSlug();

    const page =
        slug === ""
            ? COMPONENT_PAGES[0]
            : COMPONENT_PAGES.find((each) => each.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page?.slug]);

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar activeSlug={page?.slug} pages={COMPONENT_PAGES} />
            <div className="flex min-w-0 flex-1 flex-col">
                <Toolbar />
                <main className="mx-auto w-full max-w-4xl px-8 py-12">
                    {page ? (
                        <ComponentPageView key={page.slug} page={page} />
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No examples for "{slug}". Add one under
                            src/examples/&lt;component&gt;/.
                        </p>
                    )}
                </main>
            </div>
        </div>
    );
}
