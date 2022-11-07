"use strict";

import { JSDOM as JsDom } from "jsdom";


const FactoryOfWindows = class {
  constructor() {}

  setHtmlOfPage(html) {
    this[_htmlOfPage] = html;
  }

  createWindow() {
    return new JsDom(this[_htmlOfPage]).window;
  }
};

const _htmlOfPage = Symbol();

export default FactoryOfWindows;
