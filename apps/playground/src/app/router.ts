import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
}

function readSlug(): string {
    return window.location.hash.replace(/^#\/?/, "").replace(/\/$/, "");
}

export function useRouteSlug(): string {
    return useSyncExternalStore(subscribe, readSlug);
}

export function hrefFor(slug: string): string {
    return `#/${slug}`;
}
