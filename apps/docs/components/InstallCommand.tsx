"use client";

import {
    DEFAULT_INSTALL_PREFERENCE,
    INSTALL_DOORS,
    PACKAGE_MANAGERS,
    toInstallCommand,
    toInstallPreference,
    type InstallPreference,
} from "@/lib/install-command";
import { CODE_THEMES } from "@/lib/shared";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useId, useSyncExternalStore } from "react";

const STORAGE_KEY = "kuhaku-install-preference";

type InstallCommandProps = {
    /** The registry item to install, such as `button`. */
    name: string;
};

type OptionGroupProps<Option extends string> = {
    legend: string;
    options: readonly Option[];
    value: Option;
    onValueChange: (value: Option) => void;
};

const listeners = new Set<() => void>();
let currentPreference: InstallPreference | null = null;

function loadPreference(): InstallPreference {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored === null
            ? DEFAULT_INSTALL_PREFERENCE
            : toInstallPreference(JSON.parse(stored));
    } catch {
        // Storage throws in private windows and when site data is blocked; the default stands in.
        return DEFAULT_INSTALL_PREFERENCE;
    }
}

function readPreference(): InstallPreference {
    currentPreference ??= loadPreference();
    return currentPreference;
}

function readServerPreference(): InstallPreference {
    return DEFAULT_INSTALL_PREFERENCE;
}

function notifyListeners(): void {
    listeners.forEach((listener) => listener());
}

function subscribeToPreference(listener: () => void): () => void {
    const handleStorage = (event: StorageEvent): void => {
        if (event.key !== STORAGE_KEY) return;
        currentPreference = loadPreference();
        notifyListeners();
    };

    listeners.add(listener);
    window.addEventListener("storage", handleStorage);

    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", handleStorage);
        // Unlistened, the cache misses changes from other tabs; the next picker re-reads storage.
        if (listeners.size === 0) currentPreference = null;
    };
}

function writePreference(preference: InstallPreference): void {
    currentPreference = preference;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
    } catch {
        // Without storage the choice still holds for this page view.
    }
    notifyListeners();
}

function OptionGroup<Option extends string>({
    legend,
    options,
    value,
    onValueChange,
}: OptionGroupProps<Option>): React.JSX.Element {
    const groupName = useId();

    return (
        <fieldset className="flex min-w-0">
            <legend className="sr-only">{legend}</legend>
            {options.map((option) => (
                <label
                    key={option}
                    className="group relative inline-flex items-center rounded-md px-2 py-1.5 pointer-coarse:py-3 text-sm font-medium text-nowrap transition-colors duration-fast hover:text-fd-accent-foreground has-checked:text-fd-primary has-focus-visible:ring-[3px] has-focus-visible:ring-ring"
                >
                    <input
                        type="radio"
                        name={groupName}
                        value={option}
                        checked={option === value}
                        onChange={() => onValueChange(option)}
                        className="sr-only"
                    />
                    {option}
                    <span
                        aria-hidden="true"
                        className="absolute inset-x-2 bottom-0 h-px group-has-checked:bg-fd-primary"
                    />
                </label>
            ))}
        </fieldset>
    );
}

/** The install command for one registry item, for the reader's package manager and door. */
export function InstallCommand({ name }: InstallCommandProps): React.JSX.Element {
    const preference = useSyncExternalStore(
        subscribeToPreference,
        readPreference,
        readServerPreference
    );

    const command = toInstallCommand(preference.packageManager, preference.door, name);

    return (
        <div className="not-prose my-4 rounded-xl border bg-fd-card">
            <div className="flex flex-wrap items-center justify-between gap-x-4 px-2 text-fd-muted-foreground">
                <OptionGroup
                    legend="Package manager"
                    options={PACKAGE_MANAGERS}
                    value={preference.packageManager}
                    onValueChange={(packageManager) =>
                        writePreference({ ...preference, packageManager })
                    }
                />
                <OptionGroup
                    legend="Install with"
                    options={INSTALL_DOORS}
                    value={preference.door}
                    onValueChange={(door) => writePreference({ ...preference, door })}
                />
            </div>
            <DynamicCodeBlock
                lang="bash"
                code={command}
                options={{ themes: CODE_THEMES }}
                codeblock={{
                    className: "my-0 -mx-px -mb-px rounded-t-none bg-fd-secondary",
                }}
            />
        </div>
    );
}
