import { useEffect, useState } from "react";

import { Toggle } from "../components/Toggle";

export function Toolbar(): React.JSX.Element {
    const [isDark, setIsDark] = useState(true);
    const [isStrict, setIsStrict] = useState(false);

    // Theme and strict mode live on <html>, where the tokens and
    // useMotionSuppressed look for them.
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", isDark);
        if (isStrict) root.dataset.a11y = "strict";
        else delete root.dataset.a11y;
    }, [isDark, isStrict]);

    return (
        <header className="sticky top-0 z-10 flex justify-end gap-6 border-b bg-background/80 px-8 py-3 backdrop-blur">
            <Toggle isChecked={isDark} label="dark" onChange={setIsDark} />
            <Toggle
                isChecked={isStrict}
                label="strict (data-a11y)"
                onChange={setIsStrict}
            />
        </header>
    );
}
