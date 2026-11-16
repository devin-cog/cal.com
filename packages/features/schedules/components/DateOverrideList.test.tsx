import { TooltipProvider } from "@radix-ui/react-tooltip";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import DateOverrideList from "./DateOverrideList";

const { mockUseIsPlatform } = vi.hoisted(() => ({ mockUseIsPlatform: vi.fn(() => false) }));

vi.mock("@calcom/atoms/hooks/useIsPlatform", () => ({
  useIsPlatform: mockUseIsPlatform,
}));

vi.mock("@calcom/lib/hooks/useLocale", () => ({
  useLocale: () => ({
    t: (key: string, options?: { date?: string }) =>
      key === "date_overrides_delete_on_date" ? `Delete date overrides on ${options?.date}` : key,
    i18n: { language: "en" },
  }),
}));

vi.mock("./DateOverrideInputDialog", () => ({
  default: () => null,
}));

const fields = [
  {
    id: "override-1",
    ranges: [{ start: new Date("2024-06-03T09:00:00.000Z"), end: new Date("2024-06-03T17:00:00.000Z") }],
  },
];

const renderList = () =>
  render(
    <TooltipProvider>
      <DateOverrideList
        replace={vi.fn()}
        fields={fields}
        workingHours={[]}
        userTimeFormat={12}
        hour12={true}
      />
    </TooltipProvider>
  );

describe("DateOverrideList delete button title", () => {
  it("names the override's date on the web app", () => {
    mockUseIsPlatform.mockReturnValue(false);
    renderList();
    expect(screen.getByTestId("delete-button")).toHaveAttribute(
      "title",
      "Delete date overrides on Monday, June 3"
    );
  });

  it("names the override's date, not its start time, on platform", () => {
    mockUseIsPlatform.mockReturnValue(true);
    renderList();
    expect(screen.getByTestId("delete-button")).toHaveAttribute(
      "title",
      "Delete date overrides on Mon Jun 03"
    );
  });
});
