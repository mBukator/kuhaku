import { cva } from "class-variance-authority";

/**
 * Button's surface classes, for styling a link as a button.
 * Press and lift motion stay in `Button`.
 */
export const buttonVariants = cva(
    [
        "relative isolate inline-flex shrink-0 items-center justify-center gap-1 rounded-md",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
        "whitespace-nowrap select-none",
        "forced-colors:border forced-colors:border-[ButtonBorder]",
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10",
        "before:rounded-[inherit] before:opacity-0 before:content-['']",
        "before:transition-opacity before:duration-fast before:ease-in-out",
        "hover:not-data-disabled:before:opacity-100",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']",
        "after:shadow-[0_0_0_2px_var(--background),0_0_0_5px_var(--ring)]",
        "after:opacity-0 after:transition-opacity after:duration-fast after:ease-in-out",
        "focus-visible:after:opacity-100 focus-visible:shadow-none",
        "data-disabled:not-data-[state=loading]:opacity-50",
        "data-disabled:not-data-[state=loading]:cursor-not-allowed",
    ],
    {
        variants: {
            variant: {
                primary: [
                    "bg-primary text-primary-foreground",
                    "before:bg-primary-hover",
                ],
                secondary: [
                    "bg-secondary text-secondary-foreground",
                    "before:bg-secondary-hover",
                ],
                ghost: ["bg-transparent text-foreground", "before:bg-accent"],
                destructive: [
                    "bg-destructive text-destructive-foreground",
                    "before:bg-destructive-hover",
                ],
                link: [
                    "bg-transparent text-primary",
                    "before:hidden",
                    "underline-offset-4",
                    "hover:not-data-disabled:underline",
                    "focus-visible:not-data-disabled:underline",
                ],
            },
            size: {
                sm: ["h-8 px-3 text-sm"],
                md: ["h-10 px-4 text-sm"],
                lg: ["h-12 px-5 text-sm"],
                "icon-sm": ["size-8"],
                icon: ["size-10"],
                "icon-lg": ["size-12"],
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);
