 "use strict";

const createFakeTextNodesFromStrings = (strings) => (strings.map(createFakeTextNode));
const createFakeTextNode = (textContent) => (new FakeTextNode(textContent));

const FakeTextNode = class {
  constructor(textContent) {
    this[_textContent] = textContent;
  }

  get nodeValue() {
    return this[_textContent];
  }

  set nodeValue(textContent) {
    this[_textContent] = textContent;
  }
};

const _textContent = Symbol();

export default createFakeTextNodesFromStrings;
