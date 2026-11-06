import { readApiReference } from "@/lib/api-reference";
import { cache, type ComponentType } from "react";

import { ButtonPlayground } from "./entries/ButtonPlayground";
import type { PlaygroundEntryProps } from "./types";

const readCachedApiReference = cache(readApiReference);

/** One client entry per component with a playground, keyed by registry item name. */
const PLAYGROUND_ENTRIES = { button: ButtonPlayground } satisfies Record<
    string,
    ComponentType<PlaygroundEntryProps>
>;

type PlaygroundName = keyof typeof PLAYGROUND_ENTRIES;

type ComponentPlaygroundProps = {
    /** The registry item name, such as `button`. */
    name: string;
};

/** Narrows a string to a registered playground name; `Object.hasOwn` skips inherited keys. */
function isPlaygroundName(name: string): name is PlaygroundName {
    return Object.hasOwn(PLAYGROUND_ENTRIES, name);
}

/** The interactive playground for a registry item: controls, a live preview and the matching code. */
export function ComponentPlayground({
    name,
}: ComponentPlaygroundProps): React.JSX.Element {
    if (!isPlaygroundName(name)) {
        throw new Error(`${name}: no playground entry; add one to PLAYGROUND_ENTRIES`);
    }

    const Entry = PLAYGROUND_ENTRIES[name];

    return <Entry properties={readCachedApiReference(name)} />;
}
