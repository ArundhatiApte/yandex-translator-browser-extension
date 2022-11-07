"use strict";

import WrapperOfElement from "../_WrapperOfElement.js";


const PanelWithOneButton = class extends WrapperOfElement {
  constructor(document, textForButton) {
    super(document.createElement("section"));
    const button = document.createElement("input");
    button.setAttribute("type", "button");
    button.value = textForButton;
    this[_button] = button;
    this[_element].appendChild(button);
  }

  setClickOnButtonListener(listener) {
    return this[_button].onclick = listener;
  }
};

const { _element } = WrapperOfElement._namesOfProtectedProperties;
const _button = "_1";

export default PanelWithOneButton;
