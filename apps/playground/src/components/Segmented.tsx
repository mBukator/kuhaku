import { useId } from "react";

type SegmentedProps<T extends string> = {
    label: string;
    options: readonly T[];
    value: T;
    onChange: (next: T) => void;
};

export function Segmented<T extends string>({
    label,
    options,
    value,
    onChange,
}: SegmentedProps<T>): React.JSX.Element {
    const groupName = useId();

    return (
        <fieldset className="flex flex-wrap items-center gap-2">
            <legend className="mb-2 text-xs text-muted-foreground">{label}</legend>
            {options.map((option) => (
                <label
                    key={option}
                    className="cursor-pointer rounded-sm border px-2 py-1 text-xs has-checked:bg-secondary has-focus-visible:ring-2 has-focus-visible:ring-ring"
                >
                    <input
                        checked={value === option}
                        className="sr-only"
                        name={groupName}
                        type="radio"
                        onChange={() => onChange(option)}
                    />
                    {option}
                </label>
            ))}
        </fieldset>
    );
}
