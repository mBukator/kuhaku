/**
 * Builds the registry served at /r:
 *
 *   bun run packages/registry/scripts/registry-build.ts
 *
 * Kuhaku checks what shadcn cannot know (namespaced graph, import completeness,
 * the Base UI boundary), then delegates inlining and emit to `shadcn build`, so
 * the served JSON is the protocol's own output, byte for byte.
 */

import { readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";
import { registryItemSchema, registrySchema } from "shadcn/schema";
import ts from "typescript";

import { checkNeverLeak } from "./never-leak";
import { checkRegistry, type Registry } from "./registry-checks";

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIRECTORY = resolve(PACKAGE_ROOT, "..", "..", "apps", "docs", "public", "r");
const SOURCE_EXTENSION = /\.tsx?$/;

function readCompilerOptions(): ts.CompilerOptions {
    const parsed = ts.getParsedCommandLineOfConfigFile(
        join(PACKAGE_ROOT, "tsconfig.json"),
        {},
        {
            ...ts.sys,
            onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
                throw new Error(
                    ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")
                );
            },
        }
    );
    if (parsed === undefined) throw new Error("tsconfig.json could not be read");
    return parsed.options;
}

function readRegistry(): Registry {
    const manifest: unknown = JSON.parse(
        readFileSync(join(PACKAGE_ROOT, "registry.json"), "utf8")
    );
    const result = registrySchema.safeParse(manifest);
    if (!result.success) {
        throw new Error(
            `registry.json fails the shadcn schema:\n${result.error.message}`
        );
    }
    return result.data;
}

function verifyOutput(registry: Registry): string[] {
    return registry.items.flatMap((item) => {
        const emitted: unknown = JSON.parse(
            readFileSync(join(OUTPUT_DIRECTORY, `${item.name}.json`), "utf8")
        );
        const result = registryItemSchema.safeParse(emitted);
        if (!result.success) return [`${item.name}.json fails the registry-item schema`];

        const emittedFiles = result.data.files ?? [];
        if (emittedFiles.length !== (item.files ?? []).length) {
            return [
                `${item.name}.json: emitted ${emittedFiles.length} files, declared ${(item.files ?? []).length}`,
            ];
        }
        return emittedFiles.flatMap((file) =>
            file.content === readFileSync(join(PACKAGE_ROOT, file.path), "utf8")
                ? []
                : [`${item.name}.json: ${file.path} content differs from its source`]
        );
    });
}

function fail(heading: string, violations: string[]): never {
    console.error(
        `${heading}\n${violations.map((violation) => `  - ${violation}`).join("\n")}`
    );
    process.exit(1);
}

const registry = readRegistry();
const compilerOptions = readCompilerOptions();
const sourcePaths = registry.items
    .flatMap((item) => item.files ?? [])
    .map((file) => resolve(PACKAGE_ROOT, file.path))
    .filter((path) => SOURCE_EXTENSION.test(path));

const violations = [
    ...checkRegistry(registry, { packageRoot: PACKAGE_ROOT, compilerOptions }),
    ...checkNeverLeak(sourcePaths, compilerOptions, PACKAGE_ROOT),
];
if (violations.length > 0) fail("registry check failed:", violations);

rmSync(OUTPUT_DIRECTORY, { recursive: true, force: true });
await execa("shadcn", ["build", "registry.json", "--output", OUTPUT_DIRECTORY], {
    cwd: PACKAGE_ROOT,
    preferLocal: true,
    stdio: "inherit",
});

const outputViolations = verifyOutput(registry);
if (outputViolations.length > 0) fail("registry output failed:", outputViolations);
console.log(`\nwrote ${registry.items.length} items to ${OUTPUT_DIRECTORY}`);
