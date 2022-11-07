"use strict";

import createEmptyWindow from "../../../../../../test/utils/createEmptyWindow.js";

import PanelWithOneButton from "./index.js";


const testClick = () => {
  return new Promise((resolve) => {
    const window = createEmptyWindow();
    const panel = new PanelWithOneButton(window.document, "Show source text");
    panel.setClickOnButtonListener(resolve);
    panel.getElement().querySelector("input").click();
  });
};

describe("тест панели с одной кнопкой", () => {
  it("клик", testClick);
});
