import type { Control, PlaygroundValue, PlaygroundValues } from "./types";

/** A URL value checked against its control, or `undefined` when the control would reject it. */
function parseSetting(control: Control, raw: string): PlaygroundValue | undefined {
    switch (control.kind) {
        case "select":
            return control.options.includes(raw) ? raw : undefined;
        case "switch": {
            if (raw === "true") return true;
            if (raw === "false") return false;

            return undefined;
        }
        case "text": {
            const trimmed = raw.trim();
            const isValidLength =
                trimmed.length > 0 && trimmed.length <= control.maxLengthCharacters;

            return isValidLength ? trimmed : undefined;
        }
    }
}

/** The valid settings in a query string, keyed by control name; anything else is ignored. */
export function readSettings(search: string, controls: Control[]): PlaygroundValues {
    const params = new URLSearchParams(search);
    const settings: PlaygroundValues = {};

    for (const control of controls) {
        const raw = params.get(control.name);
        if (raw === null) continue;

        const value = parseSetting(control, raw);
        if (value !== undefined) settings[control.name] = value;
    }

    return settings;
}

/**
 * `href` with each non-default value set and each default removed. Params the controls
 * do not own and the hash pass through.
 */
export function writeSettings(
    values: PlaygroundValues,
    controls: Control[],
    href: string
): string {
    const url = new URL(href);

    for (const control of controls) {
        const value = values[control.name];
        const nextSetting =
            value === undefined || value === control.defaultValue ? null : String(value);
        // Any write re-encodes every param (`?a` becomes `?a=`), so skip the ones already right.
        if (url.searchParams.get(control.name) === nextSetting) continue;

        if (nextSetting === null) url.searchParams.delete(control.name);
        else url.searchParams.set(control.name, nextSetting);
    }

    return url.href;
}
