import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

import { remarkApiTable } from "./lib/remark-api-table";
import { remarkComponentIndex } from "./lib/remark-component-index";
import { remarkInstallCommand } from "./lib/remark-install-command";
import { CODE_THEMES, DOCS_CONTENT_DIRECTORY } from "./lib/shared";

export const docs = defineDocs({
    dir: DOCS_CONTENT_DIRECTORY,
    docs: {
        schema: pageSchema,
        postprocess: {
            includeProcessedMarkdown: true,
        },
    },
    meta: {
        schema: metaSchema,
    },
});

export default defineConfig({
    mdxOptions: {
        remarkPlugins: [remarkComponentIndex, remarkApiTable, remarkInstallCommand],
        rehypeCodeOptions: { themes: CODE_THEMES },
    },
});
