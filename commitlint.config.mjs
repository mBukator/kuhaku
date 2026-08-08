export default {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "subject-max-length": [2, "always", 72],
        "scope-max-length": [2, "always", 20],
        "scope-enum": [
            2,
            "always",
            ["tokens", "registry", "cli", "docs", "motion", "a11y", "repo", "deps"],
        ],
    },
};
