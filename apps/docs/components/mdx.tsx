import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

import { Heading } from "./Heading";
import { InstallCommand } from "./InstallCommand";
import { ComponentPlayground } from "./playground/ComponentPlayground";
import { ComponentPreview } from "./playground/ComponentPreview";
import { ScrollTable } from "./ScrollTable";

type HeadingElementProps = ComponentProps<"h2">;

export function getMDXComponents(components?: MDXComponents) {
    return {
        ...defaultMdxComponents,
        ...TabsComponents,
        h1: (props: HeadingElementProps) => <Heading as="h1" {...props} />,
        h2: (props: HeadingElementProps) => <Heading as="h2" {...props} />,
        h3: (props: HeadingElementProps) => <Heading as="h3" {...props} />,
        h4: (props: HeadingElementProps) => <Heading as="h4" {...props} />,
        h5: (props: HeadingElementProps) => <Heading as="h5" {...props} />,
        h6: (props: HeadingElementProps) => <Heading as="h6" {...props} />,
        table: ScrollTable,
        ComponentPlayground,
        ComponentPreview,
        InstallCommand,
        ...components,
    } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
    type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
