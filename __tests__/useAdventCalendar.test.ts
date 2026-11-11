import { renderHook, waitFor } from "@testing-library/react";
import { useAdventCalendar } from "../hooks/useAdventCalendar";

const rows = [
  { id: 1, text_number: 1, title: "Eins", content: "a", created_at: "", updated_at: "" },
  { id: 3, text_number: 3, title: "Drei", content: "c", created_at: "", updated_at: "" },
];

describe("useAdventCalendar", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it("lädt Texte aus der Datenbank", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => rows,
    }) as jest.Mock;

    const { result } = renderHook(() => useAdventCalendar());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/adventcalendar?select=*&order=text_number"),
      expect.objectContaining({ method: "GET" })
    );
    expect(result.current.getTextByNumber(3)?.title).toBe("Drei");
    expect(result.current.hasText(2)).toBe(false);
    expect(result.current.getStats().missing).toHaveLength(22);
  });

  it("setzt einen Fehler bei HTTP-Fehlern", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as jest.Mock;

    const { result } = renderHook(() => useAdventCalendar());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("HTTP error! status: 500");
    expect(result.current.texts).toEqual([]);
  });
});
