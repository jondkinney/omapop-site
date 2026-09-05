// This intentionally small web demo is not the desktop extension runtime.
// It never evaluates code, installs extensions, or sends entered text anywhere.
export const EXAMPLE_TEXT = "make it your own";

export function selectedText(value, start, end) {
  const from = Math.max(0, Math.min(value.length, start));
  const to = Math.max(from, Math.min(value.length, end));
  return to > from ? { text: value.slice(from, to), start: from, end: to } : { text: value, start: 0, end: value.length };
}

export function transformText(action, text) {
  switch (action) {
    case "uppercase": return text.toUpperCase();
    case "lowercase": return text.toLowerCase();
    case "underscore": return text.replace(/\s+/gu, "_");
    default: throw new Error("Unknown demo action");
  }
}

export function countText(text) {
  return { words: text.trim() ? text.trim().split(/\s+/u).length : 0, characters: Array.from(text).length };
}
