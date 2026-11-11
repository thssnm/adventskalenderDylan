import { act, fireEvent, render, screen } from "@testing-library/react";
import Home from "../pages/index";
import { OPENED_DOORS_STORAGE_KEY } from "../lib/calendar";

jest.mock("react-snowfall", () => () => null);
jest.mock("../hooks/useAdventCalendar", () => ({
  useAdventCalendar: () => ({
    loading: false,
    getTextByNumber: (n: number) =>
      n === 5
        ? { id: 5, text_number: 5, title: "Aramosa", content: "Kaum Koffein" }
        : undefined,
  }),
}));

describe("Home", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 11, 5, 10));
    window.localStorage.clear();
  });
  afterEach(() => jest.useRealTimers());

  it("rendert 24 Türen, offen nur bis heute", () => {
    render(<Home />);
    expect(screen.getAllByTestId(/^door-/)).toHaveLength(24);
    expect(screen.getByTestId("door-5")).toHaveAccessibleName("Türchen 5 öffnen");
    expect(screen.getByTestId("door-6")).toHaveAccessibleName(
      "Türchen 6 ist noch verschlossen"
    );
    expect(screen.getByTestId("door-5").className).toMatch(/today/);
  });

  it("öffnet eine Tür, zeigt den Text und merkt sie sich", () => {
    render(<Home />);
    fireEvent.click(screen.getByTestId("door-5"));
    act(() => jest.advanceTimersByTime(700));

    expect(screen.getByRole("dialog")).toHaveAccessibleName("Aramosa");
    expect(screen.getByText("Kaum Koffein")).toBeInTheDocument();
    expect(
      JSON.parse(window.localStorage.getItem(OPENED_DOORS_STORAGE_KEY)!)
    ).toEqual([5]);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("stellt bereits geöffnete Türen wieder her", () => {
    window.localStorage.setItem(OPENED_DOORS_STORAGE_KEY, "[2]");
    render(<Home />);
    expect(screen.getByTestId("door-2").className).toMatch(/open/);
    expect(screen.getByTestId("door-3").className).not.toMatch(/open/);
  });

  it("schaltet nach 10 Klicks auf & den God Mode frei", () => {
    render(<Home />);
    const ampersand = screen.getByText("&");
    for (let i = 0; i < 10; i++) fireEvent.click(ampersand);
    expect(screen.getByText("god mode activated!")).toBeInTheDocument();
    expect(screen.getByTestId("door-24")).toHaveAccessibleName(
      "Türchen 24 öffnen"
    );
  });
});
