import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { registryItemSchema, registrySchema } from "shadcn/schema";

type RegistryItem = ReturnType<typeof registryItemSchema.parse>;

type PlannedFile = {
    path: string;
    content: string;
};

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY_DIRECTORY = join(APP_ROOT, "public", "r");
const INSTALL_DIRECTORY = join(APP_ROOT, "installed");
// Each name becomes a file path under public/r.
const ITEM_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Mirrors the `paths` in tsconfig.json; a placeholder without an alias there must fail here.
const TARGET_DIRECTORIES: Record<string, string> = {
    "@ui/": "ui",
    "@lib/": "lib",
    "@hooks/": "hooks",
};

/** Reads and parses a JSON file, naming the file when it is not valid JSON. */
function readJson(path: string): unknown {
    try {
        return JSON.parse(readFileSync(path, "utf8"));
    } catch (error) {
        throw new Error(`${relative(APP_ROOT, path)} could not be read`, {
            cause: error,
        });
    }
}

/** Lists the item names the built registry index declares. */
function readItemNames(): string[] {
    const result = registrySchema.safeParse(
        readJson(join(REGISTRY_DIRECTORY, "registry.json"))
    );
    if (!result.success) {
        throw new Error(
            `public/r/registry.json fails the shadcn schema:\n${result.error.message}`
        );
    }
    const names = result.data.items.map((item) => item.name);
    const invalidName = names.find((name) => !ITEM_NAME_PATTERN.test(name));
    if (invalidName !== undefined) {
        throw new Error(
            `public/r/registry.json: "${invalidName}" is not a kebab-case item name`
        );
    }
    return names;
}

/** Reads one built item and validates it against the registry-item schema. */
function readItem(name: string): RegistryItem {
    const result = registryItemSchema.safeParse(
        readJson(join(REGISTRY_DIRECTORY, `${name}.json`))
    );
    if (!result.success) {
        throw new Error(
            `public/r/${name}.json fails the shadcn schema:\n${result.error.message}`
        );
    }
    return result.data;
}

/** Reads the docs app's own `dependencies`, the ranges an install would have to match. */
function readAppDependencies(): Map<string, string> {
    const manifest = readJson(join(APP_ROOT, "package.json"));
    const dependencies =
        typeof manifest === "object" && manifest !== null && "dependencies" in manifest
            ? manifest.dependencies
            : undefined;
    if (typeof dependencies !== "object" || dependencies === null) {
        throw new Error("apps/docs/package.json declares no dependencies");
    }
    return new Map(
        Object.entries(dependencies).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string"
        )
    );
}

/** Returns one error per item dependency the docs app lacks or declares at another range. */
function checkDependencies(
    items: RegistryItem[],
    appDependencies: Map<string, string>
): string[] {
    const errors: string[] = [];
    for (const item of items) {
        for (const entry of item.dependencies ?? []) {
            const versionSeparator = entry.lastIndexOf("@");
            const packageName =
                versionSeparator > 0 ? entry.slice(0, versionSeparator) : entry;
            const range =
                versionSeparator > 0 ? entry.slice(versionSeparator + 1) : undefined;
            const appRange = appDependencies.get(packageName);
            if (appRange !== range) {
                errors.push(
                    `${item.name}: needs ${entry}, but apps/docs/package.json declares ${packageName}@${appRange ?? "nothing"}`
                );
            }
        }
    }
    return errors;
}

/** Resolves a placeholder target to a path inside `installed/`, or returns why it cannot. */
function resolveTarget(target: string): string | Error {
    const placeholder = Object.keys(TARGET_DIRECTORIES).find((each) =>
        target.startsWith(each)
    );
    if (placeholder === undefined) {
        return new Error(`target "${target}" has no docs alias`);
    }
    const directory = join(INSTALL_DIRECTORY, TARGET_DIRECTORIES[placeholder]);
    const path = resolve(directory, target.slice(placeholder.length));
    const fromDirectory = relative(directory, path);
    if (
        fromDirectory === "" ||
        fromDirectory.startsWith("..") ||
        isAbsolute(fromDirectory)
    ) {
        return new Error(`target "${target}" escapes ${relative(APP_ROOT, directory)}`);
    }
    return path;
}

/** Returns the files an item would write, plus one error per file that cannot be placed. */
function planItem(item: RegistryItem): { files: PlannedFile[]; errors: string[] } {
    const files: PlannedFile[] = [];
    const errors: string[] = [];
    for (const file of item.files ?? []) {
        if (file.target === undefined || file.content === undefined) {
            errors.push(
                `${item.name}: ${file.path} carries no target or no inlined content`
            );
            continue;
        }
        const path = resolveTarget(file.target);
        if (path instanceof Error) {
            errors.push(`${item.name}: ${path.message}`);
            continue;
        }
        files.push({ path, content: file.content });
    }
    return { files, errors };
}

function main(): void {
    const items = readItemNames().map(readItem);
    const plans = items.map(planItem);
    const files = plans.flatMap((plan) => plan.files);
    const errors = [
        ...plans.flatMap((plan) => plan.errors),
        ...checkDependencies(items, readAppDependencies()),
    ];
    const seenPaths = new Set<string>();
    for (const file of files) {
        if (seenPaths.has(file.path)) {
            errors.push(`two items write ${relative(APP_ROOT, file.path)}`);
        }
        seenPaths.add(file.path);
    }
    if (errors.length > 0) {
        throw new Error(`The built registry does not install:\n- ${errors.join("\n- ")}`);
    }

    rmSync(INSTALL_DIRECTORY, { recursive: true, force: true });
    for (const file of files) {
        mkdirSync(dirname(file.path), { recursive: true });
        writeFileSync(file.path, file.content);
    }
    console.log(`Installed ${files.length} files from ${items.length} registry items.`);
}

main();
