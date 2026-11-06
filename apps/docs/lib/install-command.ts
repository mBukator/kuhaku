export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
export type InstallDoor = "kuhaku" | "shadcn";

export type InstallPreference = {
    packageManager: PackageManager;
    door: InstallDoor;
};

const PACKAGE_RUNNERS = {
    npm: "npx",
    pnpm: "pnpm dlx",
    yarn: "yarn dlx",
    bun: "bunx --bun",
} as const satisfies Record<PackageManager, string>;

const DOOR_COMMANDS = {
    kuhaku: (itemName: string) => `kuhaku add ${itemName}`,
    shadcn: (itemName: string) => `shadcn@latest add @kuhaku/${itemName}`,
} as const satisfies Record<InstallDoor, (itemName: string) => string>;

export const PACKAGE_MANAGERS = Object.keys(PACKAGE_RUNNERS) as PackageManager[];
export const INSTALL_DOORS = Object.keys(DOOR_COMMANDS) as InstallDoor[];

/** What a first-time reader sees: npm, through the kuhaku CLI. */
export const DEFAULT_INSTALL_PREFERENCE: InstallPreference = {
    packageManager: "npm",
    door: "kuhaku",
};

function isPackageManager(value: unknown): value is PackageManager {
    return typeof value === "string" && Object.hasOwn(PACKAGE_RUNNERS, value);
}

function isInstallDoor(value: unknown): value is InstallDoor {
    return typeof value === "string" && Object.hasOwn(DOOR_COMMANDS, value);
}

/** Reads a stored preference field by field; a missing or unknown field takes its default. */
export function toInstallPreference(value: unknown): InstallPreference {
    if (typeof value !== "object" || value === null) return DEFAULT_INSTALL_PREFERENCE;

    return {
        packageManager:
            "packageManager" in value && isPackageManager(value.packageManager)
                ? value.packageManager
                : DEFAULT_INSTALL_PREFERENCE.packageManager,
        door:
            "door" in value && isInstallDoor(value.door)
                ? value.door
                : DEFAULT_INSTALL_PREFERENCE.door,
    };
}

/** The command that installs a registry item with this package manager and door. */
export function toInstallCommand(
    packageManager: PackageManager,
    door: InstallDoor,
    itemName: string
): string {
    const doorCommand = DOOR_COMMANDS[door](itemName);
    return `${PACKAGE_RUNNERS[packageManager]} ${doorCommand}`;
}
