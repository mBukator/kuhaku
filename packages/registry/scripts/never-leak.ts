import { readFileSync } from "node:fs";
import { relative } from "node:path";
import ts from "typescript";

const BASE_UI = "@base-ui/";

function findLeaks(fileName: string, text: string, packageRoot: string): string[] {
    const leaks = text
        .split("\n")
        .filter((line) => line.includes(BASE_UI))
        .map((line) => line.trim());
    if (leaks.length === 0) return [];
    return [
        `${relative(packageRoot, fileName)} exposes ${BASE_UI}* in its public types: ${leaks.join(" | ")}`,
    ];
}

/**
 * Emits declarations in memory and fails any that mention Base UI. A declaration
 * file holds exactly the public type surface, so internal use stays legal.
 */
export function checkNeverLeak(
    sourcePaths: string[],
    compilerOptions: ts.CompilerOptions,
    packageRoot: string
): string[] {
    // Declaration emit skips files that already are declarations, so read those directly.
    const violations = sourcePaths
        .filter((path) => path.endsWith(".d.ts"))
        .flatMap((path) => findLeaks(path, readFileSync(path, "utf8"), packageRoot));

    const program = ts.createProgram(sourcePaths, {
        ...compilerOptions,
        noEmit: false,
        declaration: true,
        emitDeclarationOnly: true,
    });
    const { diagnostics } = program.emit(
        undefined,
        (fileName, text) => violations.push(...findLeaks(fileName, text, packageRoot)),
        undefined,
        true
    );

    // TS2742 and friends: a public type that cannot be named without Base UI.
    for (const diagnostic of diagnostics) {
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, " ");
        const location = diagnostic.file
            ? `${relative(packageRoot, diagnostic.file.fileName)}: `
            : "";
        violations.push(`${location}${message}`);
    }
    return violations;
}
