import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { appName, gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
    return {
        nav: {
            title: appName,
        },
        githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
        // "nav" keeps it out of the docs sidebar, whose Components section already links the index.
        links: [
            {
                text: "Components",
                url: "/docs/components",
                active: "nested-url",
                on: "nav",
            },
        ],
    };
}
