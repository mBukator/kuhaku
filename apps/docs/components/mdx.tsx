import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

import { InstallCommand } from "./InstallCommand";
import { ComponentPreview } from "./playground/ComponentPreview";

export function getMDXComponents(components?: MDXComponents) {
    return {
        ...defaultMdxComponents,
        ...TabsComponents,
        ComponentPreview,
        InstallCommand,
        ...components,
    } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
    type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
