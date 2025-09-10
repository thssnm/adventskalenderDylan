import { useState, useEffect } from "react";

// Supabase Konfiguration (ersetze mit deinen Werten)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Types
export interface AdventText {
  id: number;
  text_number: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AdventCalendarStats {
  total: number;
  available: number[];
  missing: number[];
}

export interface UseAdventCalendarReturn {
  texts: AdventText[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  getTextByNumber: (textNumber: number) => AdventText | undefined;
  getAvailableTextNumbers: () => number[];
  hasText: (textNumber: number) => boolean;
  getStats: () => AdventCalendarStats;
}

export interface UseAdventTextReturn {
  text: AdventText | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

// API Response Types
type SupabaseResponse<T> = T[];

// API Hilfsfunktion mit generischem Type
const supabaseRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string
): Promise<T> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Supabase request error:", error);
    throw error;
  }
};

export const useAdventCalendar = (): UseAdventCalendarReturn => {
  const [texts, setTexts] = useState<AdventText[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("⚠️ Supabase Environment Variables fehlen in Viewer App!");
  }

  // Alle Texte laden
  const loadTexts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const data = await supabaseRequest<SupabaseResponse<AdventText>>(
        "GET",
        "/adventcalendar?select=*&order=text_number"
      );
      setTexts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Einzelnen Text nach Nummer laden
  const getTextByNumber = (textNumber: number): AdventText | undefined => {
    console.log("texts:", texts);
    return texts.find((text) => text.text_number === textNumber);
  };

  // Alle verfügbaren Text-Nummern
  const getAvailableTextNumbers = (): number[] => {
    return texts.map((text) => text.text_number).sort((a, b) => a - b);
  };

  // Prüfen ob Text existiert
  const hasText = (textNumber: number): boolean => {
    return texts.some((text) => text.text_number === textNumber);
  };

  // Statistiken
  const getStats = (): AdventCalendarStats => {
    const available = getAvailableTextNumbers();
    const missing = Array.from({ length: 24 }, (_, i) => i + 1).filter(
      (num) => !hasText(num)
    );

    return {
      total: texts.length,
      available,
      missing,
    };
  };

  // Initial laden
  useEffect(() => {
    loadTexts();
  }, []);

  return {
    texts,
    loading,
    error,
    reload: loadTexts,
    getTextByNumber,
    getAvailableTextNumbers,
    hasText,
    getStats,
  };
};

// Zusätzlicher Hook für einzelne Texte (falls du nur einen Text laden willst)
export const useAdventText = (
  textNumber: number | null
): UseAdventTextReturn => {
  const [text, setText] = useState<AdventText | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadText = async (): Promise<void> => {
    if (!textNumber) {
      setText(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await supabaseRequest<SupabaseResponse<AdventText>>(
        "GET",
        `/adventcalendar?text_number=eq.${textNumber}&select=*`
      );
      setText(data[0] || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadText();
  }, [textNumber]);

  return {
    text,
    loading,
    error,
    reload: loadText,
  };
};
