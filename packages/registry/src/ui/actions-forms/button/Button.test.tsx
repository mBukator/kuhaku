import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { Button } from "./Button";

test("renders a native button named by its label", async () => {
    const screen = await render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    await expect.element(button).toBeVisible();
    expect(button.element().tagName).toBe("BUTTON");
});
