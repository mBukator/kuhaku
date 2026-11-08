import type { ComponentType } from "react";

import { ActionGroup } from "./button/ActionGroup";
import { AsyncSubmit } from "./button/AsyncSubmit";
import { IconOnly } from "./button/IconOnly";
import { LinkAsButton } from "./button/LinkAsButton";

type Demo = {
    /** The demo rendered in the Preview tab. */
    component: ComponentType;
    /** The demo's file under components/demos, shown in the Code tab. */
    sourcePath: string;
};

/** Every demo a docs page can preview, keyed by name. */
export const DEMOS = {
    "button-async-submit": {
        component: AsyncSubmit,
        sourcePath: "button/AsyncSubmit.tsx",
    },
    "button-action-group": {
        component: ActionGroup,
        sourcePath: "button/ActionGroup.tsx",
    },
    "button-icon-only": {
        component: IconOnly,
        sourcePath: "button/IconOnly.tsx",
    },
    "button-link": {
        component: LinkAsButton,
        sourcePath: "button/LinkAsButton.tsx",
    },
} satisfies Record<string, Demo>;

export type DemoName = keyof typeof DEMOS;
