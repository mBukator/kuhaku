"use client";

import { useSidebar } from "fumadocs-ui/components/sidebar/base";
import { useEffect } from "react";

const DRAWER_ID = "nd-sidebar-mobile";
const HEADER_TRIGGER_SELECTOR = `#nd-subnav [aria-controls="${DRAWER_ID}"]`;
const FOCUSABLE_SELECTOR =
    "a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex='-1'])";

/** Everything outside the drawer, except its backdrop, which closes it on click. */
function collectOutside(drawer: HTMLElement): HTMLElement[] {
    const outside: HTMLElement[] = [];
    for (let node: HTMLElement = drawer; node !== document.body;) {
        const parent = node.parentElement;
        if (parent === null) break;
        for (const sibling of parent.children) {
            if (sibling === node || !(sibling instanceof HTMLElement)) continue;
            const isBackdrop = node === drawer && sibling.hasAttribute("data-state");
            if (!isBackdrop && !sibling.inert) outside.push(sibling);
        }
        node = parent;
    }
    return outside;
}

/**
 * Fumadocs' mobile drawer is a plain aside over a backdrop. While it is open, this makes the
 * page behind it inert, moves focus into it, closes it on Escape, and returns focus on close.
 */
export function MobileDrawerFocus(): null {
    const { open: isOpen, setOpen, mode } = useSidebar();
    const isModal = isOpen && mode === "drawer";

    useEffect(() => {
        if (!isModal) return;
        const drawer = document.getElementById(DRAWER_ID);
        if (drawer === null) return;
        // Safari never focuses a tapped button, so the header trigger is the fallback.
        const trigger =
            document.activeElement === document.body
                ? document.querySelector(HEADER_TRIGGER_SELECTOR)
                : document.activeElement;
        const outside = collectOutside(drawer);
        for (const element of outside) element.inert = true;
        drawer.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

        const closeOnEscape = (event: KeyboardEvent): void => {
            if (event.key === "Escape" && !event.defaultPrevented) setOpen(false);
        };
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("keydown", closeOnEscape);
            for (const element of outside) element.inert = false;
            if (trigger instanceof HTMLElement) trigger.focus();
        };
    }, [isModal, setOpen]);

    return null;
}
