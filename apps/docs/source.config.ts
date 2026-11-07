import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

import { remarkApiTable } from "./lib/remark-api-table";
import { remarkInstallCommand } from "./lib/remark-install-command";

export const docs = defineDocs({
    dir: "content/docs",
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
        remarkPlugins: [remarkApiTable, remarkInstallCommand],
    },
});
