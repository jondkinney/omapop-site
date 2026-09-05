import test from "node:test";
import assert from "node:assert/strict";
import { EXAMPLE_TEXT, selectedText, transformText, countText } from "../assets/demo.mjs";

test("the example matches the product demonstration", () => assert.equal(EXAMPLE_TEXT, "make it your own"));
test("transforms preserve plain text, including HTML-like input", () => {
  assert.equal(transformText("uppercase", "<b>hello world</b>"), "<B>HELLO WORLD</B>");
  assert.equal(transformText("lowercase", "MAKE IT YOURS"), "make it yours");
  assert.equal(transformText("underscore", "make  it\nyours"), "make_it_yours");
});
test("only the selected range is returned when present", () => assert.deepEqual(selectedText("make it your own", 5, 7), { text: "it", start: 5, end: 7 }));
test("a collapsed selection acts on the whole value", () => assert.deepEqual(selectedText("hello", 3, 3), { text: "hello", start: 0, end: 5 }));
test("selection bounds are clamped", () => assert.deepEqual(selectedText("hello", -20, 100), { text: "hello", start: 0, end: 5 }));
test("blank strings have zero words", () => { assert.deepEqual(countText(""), { words: 0, characters: 0 }); assert.equal(countText(" \n\t").words, 0); });
test("word count handles whitespace and non-BMP characters", () => assert.deepEqual(countText("hi  👋"), { words: 2, characters: 5 }));
test("unknown actions cannot evaluate arbitrary code", () => assert.throws(() => transformText("eval", "alert(1)"), /Unknown/));
