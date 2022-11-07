"use strict";

const WrapperOfElement = class {
  constructor(element) {
    this[_element] = element;
  }

  getElement() {
    return this[_element];
  }
};

const _element = "_";

WrapperOfElement._namesOfProtectedProperties = { _element };

export default WrapperOfElement;
