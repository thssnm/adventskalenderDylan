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

    console.log("=== MARKDOWN DEBUG ===");
    console.log("Input:", html);

    // Test ob der Regex matcht
    const linkMatches = html.match(/\[([^\]]+)\]\s*\(([^)]+)\)/g);
    console.log("Found links:", linkMatches);

    // Links ersetzen
    html = html.replace(
      /\[([^\]]+)\]\s*\(([^)]+)\)/g,
      (match, linkText, url) => {
        console.log("Replacing:", { match, linkText, url });
        return `<a href="${url}" style="color: #60a5fa; text-decoration: underline;" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      }
    );

    console.log("Output HTML:", html);

    return html;
  };

  return (
    <div
      style={{ color: "white" }}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};
