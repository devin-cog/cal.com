import { TooltipProvider } from "@radix-ui/react-tooltip";
import { render, screen } from "@testing-library/react";
import type { ReactElement, Ref } from "react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Tooltip } from "./Tooltip";

// Mimics a React 19 element: `ref` lives in props and `element.ref` is a warning getter.
// React 18's own cloneElement still reads `element.ref`, so only reads from outside React count.
function asReact19Element(
  element: ReactElement,
  ref: Ref<HTMLButtonElement>
): { element: ReactElement; readersOutsideReact: string[] } {
  const readersOutsideReact: string[] = [];
  const react19Element = { ...element, props: { ...element.props, ref } };
  const warningGetter = Object.assign(
    () => {
      const reader = new Error().stack?.split("\n")[2]?.trim() ?? "";
      if (!reader.includes("/react/cjs/")) readersOutsideReact.push(reader);
      return ref;
    },
    { isReactWarning: true }
  );
  Object.defineProperty(react19Element, "ref", { get: warningGetter, enumerable: false });
  return { element: react19Element, readersOutsideReact };
}

describe("Tooltip", () => {
  it("forwards the trigger ref without reading the removed element.ref", () => {
    const buttonRef = createRef<HTMLButtonElement>();
    const trigger = asReact19Element(<button>trigger</button>, buttonRef);

    render(
      <TooltipProvider>
        <Tooltip content="Search" open>
          {trigger.element}
        </Tooltip>
      </TooltipProvider>
    );

    expect(trigger.readersOutsideReact).toEqual([]);
    expect(buttonRef.current).toBe(screen.getByRole("button", { name: "trigger" }));
    expect(screen.getByRole("tooltip")).toHaveTextContent("Search");
  });
});
