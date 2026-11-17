"use client";

import {
    useEffect,
    useRef,
    useState,
    type ComponentProps,
    type ReactElement,
} from "react";

const HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6";

/** The text of the nearest heading before the table, which names its scroll region. */
function readSectionName(wrapper: HTMLElement): string | null {
    for (
        let sibling = wrapper.previousElementSibling;
        sibling !== null;
        sibling = sibling.previousElementSibling
    ) {
        if (sibling.matches(HEADING_SELECTOR)) return sibling.textContent?.trim() ?? null;
    }
    return null;
}

/**
 * A Markdown table that scrolls inside its own box. While it overflows, the box is a named,
 * focusable region, so a keyboard reaches the hidden columns with the arrow keys.
 */
export function ScrollTable(props: ComponentProps<"table">): ReactElement {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [sectionName, setSectionName] = useState<string | null>(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (wrapper === null) return;
        setSectionName(readSectionName(wrapper));
        const observer = new ResizeObserver(() => {
            setIsOverflowing(wrapper.scrollWidth > wrapper.clientWidth);
        });
        observer.observe(wrapper);
        if (wrapper.firstElementChild !== null) {
            observer.observe(wrapper.firstElementChild);
        }
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={wrapperRef}
            className="relative overflow-auto prose-no-margin my-6"
            {...(isOverflowing && {
                role: "region",
                tabIndex: 0,
                "aria-label": sectionName === null ? "Table" : `${sectionName} table`,
            })}
        >
            <table {...props} />
        </div>
    );
}
