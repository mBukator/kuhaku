import { Spinner, type SpinnerProps } from "@/components/ui/spinner";

type SpinnerVariant = NonNullable<SpinnerProps["variant"]>;
type SpinnerSize = NonNullable<SpinnerProps["size"]>;

const VARIANTS: SpinnerVariant[] = [
    "spinner",
    "dots",
    "bars",
    "dither",
    "ascii",
    "ripple",
    "orbit",
];
const SIZES: SpinnerSize[] = ["sm", "md", "lg"];

export const description =
    "Every variant at every size. Turn on strict in the toolbar to see suppression.";

export default function SpinnerDemo(): React.JSX.Element {
    return (
        <div className="grid grid-cols-[auto_repeat(3,auto)] items-center justify-start gap-x-8 gap-y-4 text-xs">
            <span />
            {SIZES.map((size) => (
                <span key={size} className="text-muted-foreground">
                    {size}
                </span>
            ))}
            {VARIANTS.map((variant) => (
                <div key={variant} className="contents">
                    <span className="text-muted-foreground">{variant}</span>
                    {SIZES.map((size) => (
                        <Spinner key={size} size={size} variant={variant} />
                    ))}
                </div>
            ))}
        </div>
    );
}
