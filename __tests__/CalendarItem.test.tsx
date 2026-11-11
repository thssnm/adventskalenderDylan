import { act, fireEvent, render, screen } from "@testing-library/react";
import { CalendarItem } from "../components/CalendarItem";

const renderDoor = (props: Partial<React.ComponentProps<typeof CalendarItem>>) => {
  const onOpen = jest.fn();
  render(
    <CalendarItem
      day={7}
      index={0}
      unlocked
      today={false}
      opened={false}
      onOpen={onOpen}
      {...props}
    />
  );
  return { onOpen, door: screen.getByTestId("door-7") };
};

describe("CalendarItem", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("zeigt die Türnummer vorne und hinter der Tür", () => {
    renderDoor({ opened: true });
    // einmal auf der Tür, einmal im geöffneten Fach
    expect(screen.getAllByText("7")).toHaveLength(2);
  });

  it("öffnet eine verschlossene Tür nicht, sondern wackelt", () => {
    const { onOpen, door } = renderDoor({ unlocked: false });
    expect(door).toHaveAccessibleName("Türchen 7 ist noch verschlossen");
    fireEvent.click(door);
    act(() => jest.runAllTimers());
    expect(onOpen).not.toHaveBeenCalled();
    expect(door.className).toMatch(/shake/);
  });

  it("spielt erst die Tür-Animation ab und ruft dann onOpen", () => {
    const { onOpen, door } = renderDoor({});
    fireEvent.click(door);
    expect(door.className).toMatch(/open/);
    expect(onOpen).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(700));
    expect(onOpen).toHaveBeenCalledWith(7);
  });

  it("zeigt bereits geöffnete Türen sofort an", () => {
    const { onOpen, door } = renderDoor({ opened: true });
    expect(door.className).toMatch(/open/);
    fireEvent.click(door);
    expect(onOpen).toHaveBeenCalledWith(7);
  });

  it("markiert die heutige Tür", () => {
    const { door } = renderDoor({ today: true });
    expect(door.className).toMatch(/today/);
  });
});
