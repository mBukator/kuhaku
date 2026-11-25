import { getMDXComponents } from "@/components/mdx";
import { DOCS_CONTENT_DIRECTORY, gitConfig } from "@/lib/shared";
import { getPageImageUrl, getPageMarkdownUrl, source } from "@/lib/source";
import { findNeighbour, type Item } from "fumadocs-core/page-tree";
import {
    DocsBody,
    DocsDescription,
    DocsPage,
    DocsTitle,
    MarkdownCopyButton,
    ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type FooterItem = Pick<Item, "name" | "description" | "url">;

// The tree names pages by navTitle, which only reads right under its sidebar section.
function toFooterItem(item: Item | undefined): FooterItem | undefined {
    if (item === undefined) return undefined;
    const title = source.getNodePage(item)?.data.title ?? item.name;
    return { name: title, description: item.description, url: item.url };
}

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
    const params = await props.params;
    const page = source.getPage(params.slug);
    if (!page) notFound();

    const MDX = page.data.body;
    const markdownUrl = getPageMarkdownUrl(page).url;
    const neighbours = findNeighbour(source.getPageTree(), page.url, {
        separateRoot: false,
    });
    const footerItems = {
        previous: toFooterItem(neighbours.previous),
        next: toFooterItem(neighbours.next),
    };

    return (
        <DocsPage
            toc={page.data.toc}
            full={page.data.full}
            footer={{ items: footerItems }}
        >
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
            <div className="flex flex-row gap-2 items-center border-b pb-6">
                <MarkdownCopyButton markdownUrl={markdownUrl} />
                <ViewOptionsPopover
                    markdownUrl={markdownUrl}
                    githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/${gitConfig.docsAppDirectory}/${DOCS_CONTENT_DIRECTORY}/${page.path}`}
                />
            </div>
            <DocsBody>
                <MDX
                    components={getMDXComponents({
                        a: createRelativeLink(source, page),
                    })}
                />
            </DocsBody>
        </DocsPage>
    );
}

export async function generateStaticParams() {
    return source.generateParams();
}

export async function generateMetadata(
    props: PageProps<"/docs/[[...slug]]">
): Promise<Metadata> {
    const params = await props.params;
    const page = source.getPage(params.slug);
    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description,
        openGraph: {
            images: getPageImageUrl(page).url,
        },
    };
}
