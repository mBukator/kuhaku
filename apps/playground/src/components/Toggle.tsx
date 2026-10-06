type ToggleProps = {
    label: string;
    isChecked: boolean;
    onChange: (isChecked: boolean) => void;
};

export function Toggle({ label, isChecked, onChange }: ToggleProps): React.JSX.Element {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-xs">
            <input
                checked={isChecked}
                type="checkbox"
                onChange={(event) => onChange(event.target.checked)}
            />
            {label}
        </label>
    );
}
