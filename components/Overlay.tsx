import React from "react";
import { useAdventCalendar } from "../hooks/useAdventCalendar";

type CurrentText = {
  content: string;
  title: string;
};

export const Overlay = ({
  item,
  visible,
  setVisible,
}: {
  item: {
    number: string;
    title: string;
    text: string;
  };
  visible: boolean;
  setVisible: (value: boolean) => void;
}) => {
  const { getTextByNumber } = useAdventCalendar();

  const currentText = getTextByNumber(Number(item.number));
  if (!visible) {
    return null;
  }
  return (
    <div
      onClick={() => setVisible(false)}
      style={{
        backgroundColor: "rgba(0,0,0,0.8)",
        position: "absolute",
        top: 20,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "80%",
          height: "70%",
          maxHeight: 500,
          backgroundColor: "#828282cd",
          borderRadius: 12,
          padding: 24,
          overflowY: "scroll",
          borderColor: "white",
          borderWidth: 22,
        }}
      >
        <h2 style={{ color: "white" }}>{item.number}</h2>
        <h3 style={{ color: "white" }}>{currentText?.title}</h3>
        <div>
          <MarkdownRenderer content={currentText?.content} />
        </div>
      </div>
    </div>
  );
};

interface MarkdownRendererProps {
  content: string | null | undefined;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  if (!content) return <p style={{ color: "white" }}>Kein Inhalt verfügbar</p>;

  const renderMarkdown = (text: string): string => {
    let html = String(text || "");

    // Links (mit oder ohne Leerzeichen zwischen ] und ()
    html = html.replace(
      /\[([^\]]+)\]\s*\(([^)]+)\)/g,
      '<a href="$2" style="color: #60a5fa; text-decoration: underline;" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Überschriften
    html = html.replace(
      /^### (.*$)/gm,
      '<h3 style="font-size: 1.25rem; font-weight: 500; margin-bottom: 0.5rem; margin-top: 1rem; color: white;">$1</h3>'
    );
    html = html.replace(
      /^## (.*$)/gm,
      '<h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; margin-top: 1.5rem; color: white;">$1</h2>'
    );
    html = html.replace(
      /^# (.*$)/gm,
      '<h1 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 1rem; margin-top: 2rem; color: white;">$1</h1>'
    );

    // Fett und Kursiv
    html = html.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong style="font-weight: bold; color: white;">$1</strong>'
    );
    html = html.replace(
      /\*([^*]+)\*/g,
      '<em style="font-style: italic; color: white;">$1</em>'
    );

    // Listen
    html = html.replace(
      /^- (.*$)/gm,
      '<li style="margin-left: 1.5rem; margin-bottom: 0.25rem; color: white;">$1</li>'
    );

    // Zeilenumbrüche
    html = html.replace(
      /\n\n/g,
      '</p><p style="margin-bottom: 1rem; color: white;">'
    );
    html = html.replace(/\n/g, "<br>");

    return html;
  };

  return (
    <div
      style={{ color: "white" }}
      dangerouslySetInnerHTML={{
        __html: `<p style="margin-bottom: 1rem; color: white;">${renderMarkdown(
          content
        )}</p>`,
      }}
    />
  );
};
