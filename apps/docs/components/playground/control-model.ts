import type { ApiProperty } from "@/lib/api-reference";

import type {
    Control,
    ControlOverrides,
    PlaygroundValue,
    PlaygroundValues,
} from "./types";

/** Parses a prop's `@default`; throws unless it is a JSON string or boolean. */
export function parseDefault(property: ApiProperty): PlaygroundValue | undefined {
    if (property.defaultValue === undefined) return;

    let parsed: unknown;

    try {
        parsed = JSON.parse(property.defaultValue);
    } catch (error) {
        throw new Error(
            `${property.name}: @default ${property.defaultValue} is not valid JSON`,
            { cause: error }
        );
    }

    if (typeof parsed === "string" || typeof parsed === "boolean") {
        return parsed;
    }

    throw new Error(
        `${property.name}: @default ${property.defaultValue} is not a JSON string or boolean`
    );
}

/** Throws when two controls share a name, since they would share one value and one URL key. */
function assertUniqueNames(controls: Control[]): void {
    const seenNames = new Set<string>();

    for (const control of controls) {
        if (seenNames.has(control.name)) {
            throw new Error(`${control.name}: two controls share this name`);
        }
        seenNames.add(control.name);
    }
}

/**
 * Builds the playground's controls from a component's public props: a select per
 * string-literal union, a switch per boolean, then the entry's extras. Throws on a
 * `@default` that does not fit its prop, or on two controls with one name.
 */
export function toControls(
    properties: ApiProperty[],
    overrides: ControlOverrides
): Control[] {
    const controls: Control[] = [];

    for (const property of properties) {
        if (overrides.exclude.includes(property.name)) continue;

        const defaultValue = parseDefault(property);

        if (property.options !== undefined) {
            if (defaultValue === undefined) {
                throw new Error(
                    `${property.name}: a string-literal union needs a @default to become a select`
                );
            }

            if (
                typeof defaultValue !== "string" ||
                !property.options.includes(defaultValue)
            ) {
                throw new Error(
                    `${property.name}: @default ${property.defaultValue} is not one of the options`
                );
            }

            controls.push({
                name: property.name,
                kind: "select",
                defaultValue,
                options: property.options,
            });
        } else if (property.type === "boolean") {
            const value = defaultValue ?? false;
            if (typeof value !== "boolean") {
                throw new Error(
                    `${property.name}: @default ${property.defaultValue} is not a boolean`
                );
            }

            controls.push({
                name: property.name,
                kind: "switch",
                defaultValue: value,
            });
        }
    }

    const allControls = controls.concat(overrides.extras);
    assertUniqueNames(allControls);

    return allControls;
}

/** Each control's default value, keyed by its name: the playground's initial state. */
export function toDefaultValues(controls: Control[]): PlaygroundValues {
    return Object.fromEntries(
        controls.map(({ name, defaultValue }) => [name, defaultValue])
    );
}
