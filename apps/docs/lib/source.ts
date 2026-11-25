import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

import { docsContentRoute, docsImageRoute, docsRoute } from "./shared";

export const source = loader({
    baseUrl: docsRoute,
    source: docs.toFumadocsSource(),
    plugins: [lucideIconsPlugin()],
    pageTree: {
        transformers: [
            {
                file(node, filePath) {
                    if (filePath === undefined) return node;
                    const file = this.storage.read(filePath);
                    if (file?.format !== "page" || file.data.navTitle === undefined)
                        return node;
                    return { ...node, name: file.data.navTitle };
                },
            },
        ],
    },
});

export function getPageImageUrl(page: (typeof source)["$inferPage"]) {
    const segments = [...page.slugs, "image.png"];

    return {
        segments,
        url:
            "/" +
            [page.locale, ...docsImageRoute.split("/"), ...segments]
                .filter(Boolean)
                .join("/"),
    };
}

export function getPageMarkdownUrl(page: (typeof source)["$inferPage"]) {
    const segments = [...page.slugs, "content.md"];

    return {
        segments,
        url:
            "/" +
            [page.locale, ...docsContentRoute.split("/"), ...segments]
                .filter(Boolean)
                .join("/"),
    };
}

export async function getLLMText(page: (typeof source)["$inferPage"]) {
    const processed = await page.data.getText("processed");

    return `# ${page.data.title} (${page.url})

${processed}`;
}
