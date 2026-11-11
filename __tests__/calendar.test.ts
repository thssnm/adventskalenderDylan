import {
  isDoorUnlocked,
  isGodMode,
  isToday,
  loadOpenedDoors,
  OPENED_DOORS_STORAGE_KEY,
  renderMarkdown,
  saveOpenedDoors,
} from "../lib/calendar";

describe("isDoorUnlocked", () => {
  const dec5 = new Date(2026, 11, 5);

  it("öffnet Türen bis einschließlich heute im Dezember", () => {
    expect(isDoorUnlocked(1, dec5)).toBe(true);
    expect(isDoorUnlocked(5, dec5)).toBe(true);
    expect(isDoorUnlocked(6, dec5)).toBe(false);
    expect(isDoorUnlocked(24, dec5)).toBe(false);
  });

  it("hält vor dem Dezember alle Türen geschlossen", () => {
    const nov30 = new Date(2026, 10, 30);
    expect(isDoorUnlocked(1, nov30)).toBe(false);
  });

  it("lässt nach Silvester bis Ende April alle Türen offen", () => {
    expect(isDoorUnlocked(24, new Date(2027, 0, 1))).toBe(true);
    expect(isDoorUnlocked(24, new Date(2027, 3, 30, 23, 59))).toBe(true);
  });

  it("schließt ab Mai wieder alle Türen", () => {
    expect(isDoorUnlocked(1, new Date(2027, 4, 1))).toBe(false);
    expect(isDoorUnlocked(1, new Date(2027, 8, 15))).toBe(false);
  });

  it("öffnet im God Mode alle Türen", () => {
    expect(isDoorUnlocked(24, new Date(2026, 6, 1), true)).toBe(true);
  });
});

describe("isGodMode", () => {
  it("aktiviert sich ab dem 10. Klick", () => {
    expect(isGodMode(9)).toBe(false);
    expect(isGodMode(10)).toBe(true);
  });
});

describe("isToday", () => {
  it("erkennt nur den aktuellen Dezembertag", () => {
    expect(isToday(5, new Date(2026, 11, 5))).toBe(true);
    expect(isToday(4, new Date(2026, 11, 5))).toBe(false);
    expect(isToday(5, new Date(2026, 10, 5))).toBe(false);
  });
});

describe("opened doors storage", () => {
  beforeEach(() => window.localStorage.clear());

  it("speichert und lädt geöffnete Türen", () => {
    saveOpenedDoors([3, 1], window.localStorage);
    expect(loadOpenedDoors(window.localStorage)).toEqual([3, 1]);
  });

  it("liefert ein leeres Array ohne oder bei kaputten Daten", () => {
    expect(loadOpenedDoors(window.localStorage)).toEqual([]);
    window.localStorage.setItem(OPENED_DOORS_STORAGE_KEY, "{kaputt");
    expect(loadOpenedDoors(window.localStorage)).toEqual([]);
    window.localStorage.setItem(OPENED_DOORS_STORAGE_KEY, '{"a":1}');
    expect(loadOpenedDoors(window.localStorage)).toEqual([]);
  });

  it("filtert ungültige Einträge heraus", () => {
    window.localStorage.setItem(
      OPENED_DOORS_STORAGE_KEY,
      JSON.stringify([1, "2", null, 3.5, 4])
    );
    expect(loadOpenedDoors(window.localStorage)).toEqual([1, 4]);
  });

  it("kommt ohne Storage klar", () => {
    expect(loadOpenedDoors(undefined)).toEqual([]);
    expect(() => saveOpenedDoors([1], undefined)).not.toThrow();
  });
});

describe("renderMarkdown", () => {
  it("rendert Fett, Kursiv und Links", () => {
    const html = renderMarkdown("**fett** und *kursiv* [Shop](https://x.de)");
    expect(html).toContain("<strong>fett</strong>");
    expect(html).toContain("<em>kursiv</em>");
    expect(html).toContain(
      '<a href="https://x.de" target="_blank" rel="noopener noreferrer">Shop</a>'
    );
  });

  it("erlaubt Leerzeichen zwischen Linktext und URL", () => {
    expect(renderMarkdown("[a] (https://x.de)")).toContain('href="https://x.de"');
  });

  it("rendert Überschriften und Listen", () => {
    const html = renderMarkdown("# H1\n## H2\n### H3\n- Punkt");
    expect(html).toContain("<h1>H1</h1>");
    expect(html).toContain("<h2>H2</h2>");
    expect(html).toContain("<h3>H3</h3>");
    expect(html).toContain("<li>Punkt</li>");
  });

  it("macht aus Leerzeilen Absätze und aus Zeilenumbrüchen <br>", () => {
    expect(renderMarkdown("a\n\nb\nc")).toBe("<p>a</p><p>b<br>c</p>");
  });
});
