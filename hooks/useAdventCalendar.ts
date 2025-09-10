import { useState, useEffect } from "react";

// Supabase Konfiguration (ersetze mit deinen Werten)
const SUPABASE_URL = "https://ccxkyyvevkwsozvsuxry.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjeGt5eXZldmt3c296dnN1eHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTA2NzUsImV4cCI6MjA3MjQ2NjY3NX0.eaMKMzgc5oqrEHyrRP6w8Ed0cfqAH_z4a2ytj_Fx-ao";

export const useAdventCalendar = () => {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Hilfsfunktion
  const supabaseRequest = async (method, endpoint) => {
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

  // Alle Texte laden
  const loadTexts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await supabaseRequest(
        "GET",
        "/adventcalendar?select=*&order=text_number"
      );
      setTexts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Einzelnen Text nach Nummer laden
  const getTextByNumber = (textNumber) => {
    console.log("number:", typeof textNumber, "text:", texts[0]);
    return texts.find((text) => text.text_number.toString() === textNumber);
  };

  // Alle verfügbaren Text-Nummern
  const getAvailableTextNumbers = () => {
    return texts.map((text) => text.text_number).sort((a, b) => a - b);
  };

  // Prüfen ob Text existiert
  const hasText = (textNumber) => {
    return texts.some((text) => text.text_number === textNumber);
  };

  // Statistiken
  const getStats = () => {
    return {
      total: texts.length,
      available: getAvailableTextNumbers(),
      missing: Array.from({ length: 24 }, (_, i) => i + 1).filter(
        (num) => !hasText(num)
      ),
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
export const useAdventText = (textNumber) => {
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const supabaseRequest = async (method, endpoint) => {
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

  const loadText = async () => {
    if (!textNumber) return;

    try {
      setLoading(true);
      setError(null);

      const data = await supabaseRequest(
        "GET",
        `/adventcalendar?text_number=eq.${textNumber}&select=*`
      );
      setText(data[0] || null);
    } catch (err) {
      setError(err.message);
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
