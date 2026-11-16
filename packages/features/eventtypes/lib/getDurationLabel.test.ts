import { describe, expect, it } from "vitest";
import { getDurationLabel } from "./getDurationLabel";

const t = ((key: string) => (key === "minute_timeUnit" ? "mins" : key)) as unknown as Parameters<
  typeof getDurationLabel
>[0]["t"];

describe("getDurationLabel", () => {
  it("returns the single duration", () => {
    expect(getDurationLabel({ length: 15, t })).toBe("15 mins");
  });

  it("returns every duration of a multiple duration event type", () => {
    expect(getDurationLabel({ length: 15, multipleDuration: [15, 30], t })).toBe(" 15, 30 mins");
  });

  it("returns an empty label while the duration field is empty", () => {
    expect(getDurationLabel({ length: NaN, t })).toBe("");
    expect(getDurationLabel({ length: undefined, t })).toBe("");
  });
});
