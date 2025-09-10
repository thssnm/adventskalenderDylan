import React from "react";
import { useAdventCalendar } from "../hooks/useAdventCalendar";

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

  const currentText = getTextByNumber(item.number);
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

const MarkdownRenderer = ({ content }) => {
  if (!content) return <p className="text-gray-500">Kein Inhalt verfügbar</p>;

  // Einfache Markdown-zu-HTML Konvertierung
  const renderMarkdown = (text) => {
    // Sicherstellen, dass text ein String ist
    const textString = String(text || "");

    return textString
      .replace(
        /^# (.*$)/gm,
        '<h1 class="text-3xl font-bold mb-4 text-black">$1</h1>'
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-2xl font-semibold mb-3 text-black">$1</h2>'
      )
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-xl font-medium mb-2 text-black">$1</h3>'
      )
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-600 hover:underline">$1</a>'
      )
      .replace(/\n\n/g, '</p><p class="mb-4 text-black">')
      .replace(/\n/g, "<br>");
  };

  return (
    <div
      className="prose max-w-none text-black"
      dangerouslySetInnerHTML={{
        __html: `<p class="mb-4 text-black">${renderMarkdown(content)}</p>`,
      }}
    />
  );
};
