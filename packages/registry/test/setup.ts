/// <reference types="vite/client" />
import "vitest-browser-react";
import "./styles.css";

import { afterEach, expect } from "vitest";

import { toHaveNoViolations } from "./axe";
import { applyColorMode } from "./modes";

expect.extend({ toHaveNoViolations });

afterEach(() => {
    applyColorMode("light");
});
