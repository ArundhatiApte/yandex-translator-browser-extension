"use strict";

import url from "url";
import path from "path";

import { JSDOM as JsDom } from "jsdom";

import fakeI18n from "../../../../../../test/utils/fakeObjects/browser/fakeI18n.js";
import uiThemes from "../../../../../common/js/uiThemes/index.js";

import setupGui from "../index.js";
import checkEventOfUpdatingSettings from "./checks/checkEventOfUpdatingSettings.js";
import checkChangingUiTheme from "./checks/checkChangingUiTheme.js";


const factoryOfTests = (() => {
  const factoryOfTests = {
    setWindow(w) {
      window = w;
      selectorOfUiTheme = window.document.getElementById("ui-theme-selector");
      if (selectorOfUiTheme === null) {
        throw new Error("Отсутсвует список выбора тем.");
      }
    },
    setUiThemes(c) {
      uiThemes = c;
    },
    setIdOfInitalUiTheme(i) {
      idOfInitalUiTheme = i;
    },
    setGui(g) {
      gui = g;
    },
    doBeforeEachTest() {
      selectorOfUiTheme.value = idOfInitalUiTheme;
    },
    createTest(check) {
      return executeTest.bind(null, check);
    }
  };

  let window;
  let uiThemes;
  let idOfInitalUiTheme;
  let selectorOfUiTheme;
  let gui;

  const executeTest = (check) => check(window, uiThemes, idOfInitalUiTheme, gui);

  return factoryOfTests;
})();

describe("тест пользовательского интерфейса страницы настроек", () => {
  before(async () => {
    const absolutePathToPage = path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      "../../../../page.html"
    );
    const { window } = await JsDom.fromFile(absolutePathToPage);
    factoryOfTests.setWindow(window);
    factoryOfTests.setUiThemes(uiThemes);

    global.window = window;
    global.Element = window.Element;
    global.HTMLSelectElement = window.HTMLSelectElement;
    global.document = window.document;
    global.HTMLOptionElement = window.HTMLOptionElement;

    const idOfInitalUiTheme = uiThemes.getAllThemes()[0].id;
    factoryOfTests.setIdOfInitalUiTheme(idOfInitalUiTheme);

    const initalSettings = {
      idOfTheme: idOfInitalUiTheme,
      apiKeyForTs: "fi",
      apiKeyForDs: "se"
    };
    const gui = setupGui({
      document: window.document,
      uiThemes,
      initalSettings,
      i18n: fakeI18n,
      beautifySelectElement: (await import("easydropdown")).default.default // ok
    });
    factoryOfTests.setGui(gui);
  });

  describeTests(factoryOfTests);
});

function describeTests(factoryOfTests) {
  const { createTest, doBeforeEachTest } = factoryOfTests;
  const cases = [
    ["событие запроса на обновление настроек", checkEventOfUpdatingSettings],
    ["смена темы интерфейса", checkChangingUiTheme],
  ];

  const addTest = (name, check) => {
    before(doBeforeEachTest);
    it(name, createTest(check));
  };

  for (const [name, check] of cases) addTest(name, check);
}
