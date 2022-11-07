"use strict";

import { deepEqual as expectDeepEqual } from "assert/strict";

import uiThemes from "./index.js";


const test = function() {
  const theme = uiThemes.getAllThemes()[1];
  expectDeepEqual(theme, uiThemes.getThemeById(theme.id));
};

describe("тест таблицы цветовых тем", () =>
  it("получение всех тем и темы по id", test)
);
