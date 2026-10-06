import { ExamplePreview } from "../components/ExamplePreview";
import type { ComponentPage } from "../examples";

export function ComponentPageView({ page }: { page: ComponentPage }): React.JSX.Element {
    return (
        <article className="flex flex-col gap-16">
            <h1 className="text-2xl font-semibold">{page.title}</h1>
            {page.examples.map((example) => (
                <section
                    key={example.name}
                    className="flex flex-col gap-4"
                    id={example.name}
                >
                    <div className="flex flex-col gap-1">
                        <h2 className="text-base font-medium">{example.title}</h2>
                        {example.description && (
                            <p className="text-sm text-muted-foreground">
                                {example.description}
                            </p>
                        )}
                    </div>
                    <ExamplePreview example={example} />
                </section>
            ))}
        </article>
    );
}
