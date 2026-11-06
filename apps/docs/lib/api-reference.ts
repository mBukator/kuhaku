import { existsSync } from "node:fs";
import { isAbsolute, join, relative } from "node:path";
import ts from "typescript";

export type ApiProperty = {
    name: string;
    type: string;
    /** The values of a string-literal union, which the playground offers as a select. */
    options?: string[];
    isOptional: boolean;
    defaultValue?: string;
    description: string;
};

const APP_ROOT = process.cwd();
const INSTALL_DIRECTORY = join(APP_ROOT, "installed");
const TYPE_FORMAT =
    ts.TypeFormatFlags.NoTruncation |
    ts.TypeFormatFlags.InTypeAlias |
    ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;

/** Reads the docs tsconfig, whose `paths` resolve the installed files' `@/` imports. */
function readCompilerOptions(): ts.CompilerOptions {
    const parsed = ts.getParsedCommandLineOfConfigFile(
        join(APP_ROOT, "tsconfig.json"),
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

    if (parsed === undefined)
        throw new Error("apps/docs/tsconfig.json could not be read");

    return { ...parsed.options, noEmit: true, incremental: false };
}

function toPascalCase(name: string): string {
    return name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}

/** Whether every declaration of a property lives in the installed registry files. */
function isOwnProperty(property: ts.Symbol): boolean {
    const declarations = property.declarations ?? [];

    return (
        declarations.length > 0 &&
        declarations.every((declaration) => {
            const fromInstall = relative(
                INSTALL_DIRECTORY,
                declaration.getSourceFile().fileName
            );

            return !fromInstall.startsWith("..") && !isAbsolute(fromInstall);
        })
    );
}

/** Reads a string-literal union in source order, following type aliases to their declaration. */
function readDeclaredLiterals(
    node: ts.TypeNode | undefined,
    checker: ts.TypeChecker
): string[] | undefined {
    if (node === undefined) return undefined;
    if (ts.isTypeReferenceNode(node)) {
        const symbol = checker.getSymbolAtLocation(node.typeName);
        const target =
            symbol !== undefined && (symbol.flags & ts.SymbolFlags.Alias) !== 0
                ? checker.getAliasedSymbol(symbol)
                : symbol;
        const alias = target?.declarations?.find(ts.isTypeAliasDeclaration);
        return readDeclaredLiterals(alias?.type, checker);
    }
    if (!ts.isUnionTypeNode(node)) return undefined;

    const literals = node.types.flatMap((member) =>
        ts.isLiteralTypeNode(member) && ts.isStringLiteral(member.literal)
            ? [member.literal.text]
            : []
    );

    return literals.length === node.types.length ? literals : undefined;
}

function toApiProperty(property: ts.Symbol, checker: ts.TypeChecker): ApiProperty {
    const declaration = property.declarations?.[0];
    if (declaration === undefined) throw new Error(`${property.name} has no declaration`);
    const type = checker.getNonNullableType(
        checker.getTypeOfSymbolAtLocation(property, declaration)
    );
    // The checker orders union members by internal type id, not as the source declares them.
    const options = ts.isPropertySignature(declaration)
        ? readDeclaredLiterals(declaration.type, checker)
        : undefined;
    const defaultTag = property
        .getJsDocTags(checker)
        .find((tag) => tag.name === "default");

    return {
        name: property.name,
        type:
            options === undefined
                ? checker.typeToString(type, undefined, TYPE_FORMAT)
                : options.map((option) => JSON.stringify(option)).join(" | "),
        options,
        isOptional: (property.flags & ts.SymbolFlags.Optional) !== 0,
        defaultValue:
            defaultTag === undefined
                ? undefined
                : ts.displayPartsToString(defaultTag.text),
        description: ts
            .displayPartsToString(property.getDocumentationComment(checker))
            .replace(/\s*\n\s*/g, " "),
    };
}

/**
 * Reads the public props of an installed component: the properties of its exported
 * `<Name>Props` declared in its own files, so inherited native attributes stay out.
 * Throws when a public prop has no JSDoc, since the docs table would show it blank.
 */
export function readApiReference(itemName: string): ApiProperty[] {
    const entryPath = join(INSTALL_DIRECTORY, "ui", itemName, "index.ts");
    if (!existsSync(entryPath)) {
        throw new Error(
            `${itemName}: installed/ui/${itemName}/index.ts is missing; run bun run install:registry`
        );
    }

    const program = ts.createProgram([entryPath], readCompilerOptions());
    const checker = program.getTypeChecker();
    const entry = program.getSourceFile(entryPath);
    const moduleSymbol =
        entry === undefined ? undefined : checker.getSymbolAtLocation(entry);
    const typeName = `${toPascalCase(itemName)}Props`;
    const exported = moduleSymbol
        ? checker.getExportsOfModule(moduleSymbol).find((each) => each.name === typeName)
        : undefined;

    if (exported === undefined) {
        throw new Error(`${itemName}: installed/ui/${itemName} exports no ${typeName}`);
    }

    const propsSymbol =
        (exported.flags & ts.SymbolFlags.Alias) !== 0
            ? checker.getAliasedSymbol(exported)
            : exported;
    const properties = checker
        .getPropertiesOfType(checker.getDeclaredTypeOfSymbol(propsSymbol))
        .filter(isOwnProperty)
        .map((property) => toApiProperty(property, checker));
    const undocumented = properties.filter((property) => property.description === "");

    if (undocumented.length > 0) {
        throw new Error(
            `${typeName}: ${undocumented.map((property) => property.name).join(", ")} ${undocumented.length === 1 ? "has" : "have"} no JSDoc`
        );
    }

    return properties;
}
