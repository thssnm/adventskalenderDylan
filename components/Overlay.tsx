import React from "react";
import type { AdventText } from "../hooks/useAdventCalendar";
import { renderMarkdown } from "../lib/calendar";
import styles from "../styles/Calendar.module.css";

export const Overlay = ({
  day,
  text,
  loading,
  onClose,
}: {
  day: number | null;
  text: AdventText | undefined;
  loading: boolean;
  onClose: () => void;
}) => {
  React.useEffect(() => {
    if (day === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [day, onClose]);

  if (day === null) {
    return null;
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="overlay-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Schließen"
        >
          ×
        </button>
        <span className={styles.modalDay}>{day}. Dezember</span>
        <h2 id="overlay-title" className={styles.modalTitle}>
          {text?.title ?? (loading ? "" : `Türchen ${day}`)}
        </h2>
        <div className={styles.modalContent}>
          <MarkdownRenderer content={text?.content} loading={loading} />
        </div>
      </div>
    </div>
  );
};

const MarkdownRenderer = ({
  content,
  loading,
}: {
  content: string | null | undefined;
  loading: boolean;
}) => {
  if (loading) return <p className={styles.muted}>Wird geladen …</p>;
  if (!content) return <p className={styles.muted}>Kein Inhalt verfügbar</p>;

  return (
    <div
      className={styles.markdown}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};
