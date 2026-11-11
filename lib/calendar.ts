// Reine Hilfsfunktionen für den Adventskalender (ohne React, gut testbar)

export const GOD_MODE_THRESHOLD = 9;
export const OPENED_DOORS_STORAGE_KEY = "adventskalender-opened-doors";

export const isGodMode = (count: number): boolean => count > GOD_MODE_THRESHOLD;

// Letzter Monat (0-basiert), in dem nach Weihnachten noch alle Türen offen sind
export const LAST_OPEN_MONTH_AFTER_CHRISTMAS = 3; // April

// Eine Tür darf ab ihrem Tag im Dezember geöffnet werden, von Januar bis
// einschließlich April sind alle Türen offen (im God Mode immer)
export const isDoorUnlocked = (
  day: number,
  now: Date,
  godMode = false
): boolean => {
  if (godMode) return true;
  if (now.getMonth() <= LAST_OPEN_MONTH_AFTER_CHRISTMAS) return true;
  return now.getMonth() === 11 && day <= now.getDate();
};

export const isToday = (day: number, now: Date): boolean =>
  now.getMonth() === 11 && now.getDate() === day;

export const loadOpenedDoors = (storage?: Storage): number[] => {
  try {
    const raw = storage?.getItem(OPENED_DOORS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((n): n is number => Number.isInteger(n))
      : [];
  } catch {
    return [];
  }
};

export const saveOpenedDoors = (doors: number[], storage?: Storage): void => {
  try {
    storage?.setItem(OPENED_DOORS_STORAGE_KEY, JSON.stringify(doors));
  } catch {
    // z.B. Private Mode ohne Storage – dann eben ohne Persistenz
  }
};

export const renderMarkdown = (text: string): string => {
  let html = String(text || "");

  // Links (mit oder ohne Leerzeichen zwischen ] und ()
  html = html.replace(
    /\[([^\]]+)\]\s*\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Überschriften
  html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");

  // Fett und Kursiv
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Listen
  html = html.replace(/^- (.*$)/gm, "<li>$1</li>");

  // Zeilenumbrüche
  html = html.replace(/\n\n/g, "</p><p>");
  html = html.replace(/\n/g, "<br>");

  return `<p>${html}</p>`;
};
