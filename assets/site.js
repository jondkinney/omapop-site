import { EXAMPLE_TEXT, selectedText, transformText, countText } from "./demo.mjs";

const root = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");
const systemTheme = window.matchMedia("(prefers-color-scheme: light)");
let savedTheme = null;
try { savedTheme = localStorage.getItem("omapop-theme"); } catch { /* Storage may be disabled. */ }
function setTheme(theme) {
  root.dataset.theme = theme;
  const next = theme === "dark" ? "light" : "dark";
  themeButton.setAttribute("aria-label", `Switch to ${next} theme`);
  themeButton.title = `Switch to ${next} theme`;
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#202630" : "#f5f5ef";
}
setTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : systemTheme.matches ? "light" : "dark");
themeButton.hidden = false;
themeButton.addEventListener("click", () => {
  savedTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(savedTheme);
  try { localStorage.setItem("omapop-theme", savedTheme); } catch { /* The toggle still works without storage. */ }
});
systemTheme.addEventListener("change", () => {
  if (savedTheme !== "light" && savedTheme !== "dark") setTheme(systemTheme.matches ? "light" : "dark");
});

const editor = document.querySelector("#demo-text");
const controls = document.querySelector("#demo-controls");
const status = document.querySelector("#demo-status");
const reset = document.querySelector("#demo-reset");
let demoRevision = 0;
controls.disabled = false;
reset.hidden = false;
controls.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const revision = ++demoRevision;
  const action = button.dataset.action;
  const selection = selectedText(editor.value, editor.selectionStart, editor.selectionEnd);
  if (!selection.text) { status.textContent = "Add some text first, then try an action."; return; }
  if (action === "copy") {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(selection.text);
      if (revision === demoRevision) status.textContent = "Copied. Your next move is up to you.";
    } catch {
      if (revision === demoRevision) status.textContent = "Clipboard unavailable here. Select the text and use your usual Copy shortcut.";
    }
  } else if (action === "count") {
    const { words, characters } = countText(selection.text);
    status.textContent = `${words} ${words === 1 ? "word" : "words"} · ${characters} ${characters === 1 ? "character" : "characters"}. Every little bit counts.`;
  } else {
    const result = transformText(action, selection.text);
    editor.value = editor.value.slice(0, selection.start) + result + editor.value.slice(selection.end);
    editor.focus({ preventScroll: true });
    editor.setSelectionRange(selection.start, selection.start + result.length);
    status.textContent = ({ uppercase: "A little louder. UPPERCASE, just like that.", lowercase: "A little quieter. lowercase, just like that.", underscore: "All joined up. Spaces → underscores." })[action];
  }
});
editor.addEventListener("input", () => { ++demoRevision; status.textContent = "Select part of your text, or apply an action to all of it."; });
reset.addEventListener("click", () => {
  ++demoRevision;
  editor.value = EXAMPLE_TEXT;
  editor.focus({ preventScroll: true });
  editor.setSelectionRange(0, EXAMPLE_TEXT.length);
  status.textContent = "Fresh start. Try another action.";
});

const installCopy = document.querySelector("#copy-install");
const installStatus = document.querySelector("#install-status");
installCopy.hidden = false;
installCopy.addEventListener("click", async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(document.querySelector("#install-commands").textContent.trim());
    installStatus.textContent = "Commands copied. Paste them into your Omarchy terminal.";
    installCopy.textContent = "Copied ✓";
  } catch {
    installStatus.textContent = "Clipboard unavailable here. Select and copy the two commands above.";
  }
});
