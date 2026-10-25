import { Fragment } from "react";

/** Renders `[word]` segments as accent-colored spans. */
export function Accent({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[") && part.endsWith("]") ? (
          <span key={i} className="accent">
            {part.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export const stripAccent = (text: string) => text.replace(/[[\]]/g, "");
