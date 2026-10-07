import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import type { registrySchema } from "shadcn/schema";
import ts from "typescript";

export type Registry = ReturnType<typeof registrySchema.parse>;
type RegistryItem = Registry["items"][number];

export type CheckContext = {
    packageRoot: string;
    compilerOptions: ts.CompilerOptions;
    packageDependencies: ReadonlyMap<string, string>;
};

const NAMESPACE = "@kuhaku/";
// The name becomes the output filename, so it must never carry a path.
const ITEM_NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const SOURCE_EXTENSION = /.tsx?$/;
const TARGET_PLACEHOLDERS = ["@components/", "@ui/", "@lib/", "@hooks/"];
// Adopters already have React; listing it would only invite version conflicts.
const IMPLICIT_PACKAGES = new Set(["react", "react-dom"]);

export function checkRegistry(registry: Registry, context: CheckContext): string[] {
    const declaredNames = new Set(registry.items.map((item) => item.name));

    return [
        ...checkNames(registry.items),
        ...registry.items.flatMap((item) => [
            ...checkRegistryDependencies(item, declaredNames),
            ...checkDependencyVersions(item, context.packageDependencies),
            ...checkFiles(item, context.packageRoot),
        ]),
        ...checkCycles(registry.items),
        ...checkImports(registry.items, context),
    ];
}

function checkNames(items: RegistryItem[]): string[] {
    const seen = new Set<string>();
    const violations: string[] = [];
    for (const { name } of items) {
        if (!ITEM_NAME.test(name)) violations.push(`${name}: name must be kebab-case`);
        if (seen.has(name)) violations.push(`${name}: declared more than once`);
        seen.add(name);
    }
    return violations;
}

function checkRegistryDependencies(
    item: RegistryItem,
    declaredNames: Set<string>
): string[] {
    return (item.registryDependencies ?? []).flatMap((dependency) => {
        if (!dependency.startsWith(NAMESPACE)) {
            return [
                `${item.name}: registry dependency "${dependency}" is not namespaced; a bare name resolves to shadcn's own item`,
            ];
        }
        if (!declaredNames.has(dependency.slice(NAMESPACE.length))) {
            return [`${item.name}: registry dependency "${dependency}" is not declared`];
        }
        return [];
    });
}

// An unversioned entry installs whatever is latest, which may be a major Kuhaku was never built against.
function checkDependencyVersions(
    item: RegistryItem,
    packageDependencies: ReadonlyMap<string, string>
): string[] {
    return (item.dependencies ?? []).flatMap((specifier) => {
        const name = packageName(specifier);
        const range = packageDependencies.get(name);
        if (range === undefined) {
            return [
                `${item.name}: dependency "${name}" is missing from package.json dependencies`,
            ];
        }
        if (!range.startsWith("^")) {
            return [
                `${item.name}: package.json range "${range}" for "${name}" must be a caret range`,
            ];
        }
        if (specifier === `${name}@${range}`) return [];
        return [
            `${item.name}: dependency "${specifier}" must be "${name}@${range}", matching package.json`,
        ];
    });
}

function checkFiles(item: RegistryItem, packageRoot: string): string[] {
    return (item.files ?? []).flatMap((file) => {
        const relativePath = relative(packageRoot, resolve(packageRoot, file.path));
        if (isAbsolute(file.path) || relativePath.startsWith("..")) {
            return [`${item.name}: ${file.path} resolves outside packages/registry`];
        }
        const violations: string[] = [];
        if (!existsSync(resolve(packageRoot, file.path))) {
            violations.push(`${item.name}: ${file.path} does not exist`);
        }
        if (
            !TARGET_PLACEHOLDERS.some((placeholder) =>
                file.target?.startsWith(placeholder)
            )
        ) {
            violations.push(
                `${item.name}: ${file.path} target "${file.target ?? ""}" must start with ${TARGET_PLACEHOLDERS.join(", ")}`
            );
        }
        return violations;
    });
}

function checkCycles(items: RegistryItem[]): string[] {
    const edges = new Map(
        items.map((item) => [
            item.name,
            (item.registryDependencies ?? [])
                .filter((dependency) => dependency.startsWith(NAMESPACE))
                .map((dependency) => dependency.slice(NAMESPACE.length)),
        ])
    );
    const finished = new Set<string>();
    const violations: string[] = [];

    const visit = (name: string, path: string[]): void => {
        if (path.includes(name)) {
            const cycle = [...path.slice(path.indexOf(name)), name];
            violations.push(`registry dependency cycle: ${cycle.join(" -> ")}`);
            return;
        }
        if (finished.has(name)) return;
        for (const dependency of edges.get(name) ?? [])
            visit(dependency, [...path, name]);
        finished.add(name);
    };

    for (const name of edges.keys()) visit(name, []);
    return violations;
}

function packageName(specifier: string): string {
    const withoutVersion = /^@?[^@]+/.exec(specifier)?.[0] ?? specifier;
    const segments = withoutVersion.split("/");
    return withoutVersion.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
}

function checkImports(items: RegistryItem[], context: CheckContext): string[] {
    const owners = new Map<string, string>();
    for (const item of items) {
        for (const file of item.files ?? []) {
            owners.set(resolve(context.packageRoot, file.path), item.name);
        }
    }

    return items.flatMap((item) =>
        (item.files ?? []).flatMap((file) => {
            const sourcePath = resolve(context.packageRoot, file.path);
            if (!SOURCE_EXTENSION.test(sourcePath) || !existsSync(sourcePath)) return [];
            const { importedFiles } = ts.preProcessFile(readFileSync(sourcePath, "utf8"));
            return importedFiles.flatMap(({ fileName: specifier }) =>
                checkImport(item, file.path, specifier, owners, context)
            );
        })
    );
}

function checkImport(
    item: RegistryItem,
    filePath: string,
    specifier: string,
    owners: Map<string, string>,
    context: CheckContext
): string[] {
    const isRelative = specifier.startsWith(".");
    if (!isRelative && !specifier.startsWith("@/")) {
        const name = packageName(specifier);
        const declared = (item.dependencies ?? []).map(packageName);
        if (IMPLICIT_PACKAGES.has(name) || declared.includes(name)) return [];
        return [`${item.name}: ${filePath} imports "${name}", missing from dependencies`];
    }

    const sourcePath = resolve(context.packageRoot, filePath);
    const resolved = ts.resolveModuleName(
        specifier,
        sourcePath,
        context.compilerOptions,
        ts.sys
    ).resolvedModule?.resolvedFileName;
    const owner = resolved === undefined ? undefined : owners.get(resolve(resolved));
    if (owner === undefined) {
        return [
            `${item.name}: ${filePath} imports "${specifier}", which no registry item ships`,
        ];
    }
    if (owner === item.name) return [];
    if (isRelative) {
        return [`${item.name}: ${filePath} reaches into ${owner} with a relative import`];
    }
    if ((item.registryDependencies ?? []).includes(`${NAMESPACE}${owner}`)) return [];
    return [
        `${item.name}: ${filePath} imports "${specifier}", missing ${NAMESPACE}${owner}`,
    ];
}
