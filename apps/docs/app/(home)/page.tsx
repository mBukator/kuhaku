import { InstallCommand } from "@/components/InstallCommand";
import { buttonVariants } from "@/components/ui/button";
import { appName } from "@/lib/shared";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

type Wedge = {
    title: string;
    body: ReactNode;
};

const WEDGES: Wedge[] = [
    {
        title: "Motion is a contract",
        body: (
            <>
                Motion comes in three tiers. Interactive components are tuned through{" "}
                <code className="whitespace-nowrap">--motion-*</code> tokens, never
                through motion props, and reduced motion or strict mode is how you ask for
                stillness.
            </>
        ),
    },
    {
        title: "Every value is argued",
        body: "A token arrives with the reason for its value, so you can change one without breaking the system around it.",
    },
];

export const metadata: Metadata = {
    title: appName,
    description:
        "A motion-first design system, installed as source through a shadcn-compatible registry.",
};

export default function HomePage(): React.JSX.Element {
    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-24 px-6 py-24">
            <section className="flex flex-col items-start gap-6">
                <h1 className="text-3xl font-bold text-balance sm:text-5xl">
                    The motion-first design system where every interaction is crafted and
                    every still surface is dignified.
                </h1>
                <p className="max-w-[65ch] text-lg text-muted-foreground">
                    Built on Base UI, distributed like shadcn, opinionated like Apple.
                </p>
                <div className="flex flex-wrap gap-2">
                    <Link href="/docs" className={buttonVariants({ size: "lg" })}>
                        Read the docs
                    </Link>
                    <Link
                        href="/docs/components"
                        className={buttonVariants({ variant: "secondary", size: "lg" })}
                    >
                        Browse components
                    </Link>
                </div>
            </section>

            <section className="grid gap-12 md:grid-cols-2">
                {WEDGES.map((wedge) => (
                    <div key={wedge.title} className="flex flex-col gap-2">
                        <h2 className="text-xl font-semibold">{wedge.title}</h2>
                        <p className="text-muted-foreground">{wedge.body}</p>
                    </div>
                ))}
            </section>

            <section className="flex w-full max-w-xl flex-col gap-2">
                <h2 className="text-xl font-semibold">Install a component</h2>
                <p className="text-muted-foreground">
                    Kuhaku is pre-release, so neither command works yet.{" "}
                    <Link href="/docs/installation" className="text-foreground underline">
                        Installation
                    </Link>{" "}
                    covers the setup.
                </p>
                <InstallCommand name="button" />
            </section>
        </div>
    );
}
