export const appName = "Kuhaku";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";

/** The MDX content folder, relative to the docs app. */
export const DOCS_CONTENT_DIRECTORY = "content/docs";

export const gitConfig = {
    user: "mBukator",
    repo: "kuhaku",
    // develop until it is promoted: main does not carry the docs content yet.
    branch: "develop",
    docsAppDirectory: "apps/docs",
};

/** Shiki themes for every code surface. github-light's orange token measures 3.48:1 on white. */
export const CODE_THEMES = {
    light: "github-light-high-contrast",
    dark: "github-dark",
} as const;
