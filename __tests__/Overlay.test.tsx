import { fireEvent, render, screen } from "@testing-library/react";
import { Overlay } from "../components/Overlay";
import type { AdventText } from "../hooks/useAdventCalendar";

const text: AdventText = {
  id: 1,
  text_number: 3,
  title: "Gelber Catuai",
  content: "Sehr **süß**",
  created_at: "",
  updated_at: "",
};

describe("Overlay", () => {
  it("rendert nichts ohne aktiven Tag", () => {
    const { container } = render(
      <Overlay day={null} text={undefined} loading={false} onClose={jest.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("zeigt Titel und Inhalt aus der Datenbank", () => {
    render(<Overlay day={3} text={text} loading={false} onClose={jest.fn()} />);
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Gelber Catuai");
    expect(screen.getByText("3. Dezember")).toBeInTheDocument();
    expect(screen.getByText("süß").tagName).toBe("STRONG");
  });

  it("zeigt Lade- und Leerzustand", () => {
    const { rerender } = render(
      <Overlay day={3} text={undefined} loading onClose={jest.fn()} />
    );
    expect(screen.getByText("Wird geladen …")).toBeInTheDocument();
    rerender(
      <Overlay day={3} text={undefined} loading={false} onClose={jest.fn()} />
    );
    expect(screen.getByText("Kein Inhalt verfügbar")).toBeInTheDocument();
  });

  it("schließt per Button, Escape und Klick auf den Hintergrund", () => {
    const onClose = jest.fn();
    render(<Overlay day={3} text={text} loading={false} onClose={onClose} />);

    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText("Schließen"));
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.click(screen.getByRole("dialog").parentElement!);
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it("sperrt das Scrollen der Seite solange offen", () => {
    const { unmount } = render(
      <Overlay day={3} text={text} loading={false} onClose={jest.fn()} />
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
