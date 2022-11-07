"use strict";

import { fileURLToPath as fileUrlToPath } from "url";
import path from "path";
import { readFile } from "node:fs/promises";

import { createAndAddTestsFromTable } from "../../../../../test/utils/addingTestsFromTable.js";
import setupListenersOfRequestsFromUi from "../index.js";
import { selectorOfElements, getSourceTextFromElement } from "./utils/page/utils.js";

import {
  fakeTranslatingTextMessagerToBackgroundScript,
  translateStringToUpperCase
} from "./utils/fakeTranslatingTextMessagerToBackgroundScript.js";

import FactoryOfWindows from "./utils/FactoryOfWindows.js";

import checkTranslatingPage from "./checks/checkTranslatingPage.js";
import checkShowingSourceText from "./checks/checkShowingSourceText.js";
import checkShowingTranslatedText from "./checks/checkShowingTranslatedText.js";


const name = "тест установки обработчиков запросов от пользовательского интерфейса сценарием, переводящим страницу";
describe(name, () => {
  const factoryOfWindows = new FactoryOfWindows();

  before(async function loadHtmlFromFile() {
    const fullPathToFile = path.join(
      path.dirname(fileUrlToPath(import.meta.url)),
      "./utils/page/page.html"
    );
    const html = await readFile(fullPathToFile, { encoding: "utf8"});
    factoryOfWindows.setHtmlOfPage(html);
  });

  const options = {
    setupListenersOfRequestsFromUi,
    createWindowWithPage: factoryOfWindows.createWindow.bind(factoryOfWindows),
    senderOfMessageToBackgroundScript: fakeTranslatingTextMessagerToBackgroundScript,
    limitOfCharactersInTextOfRequestOnTranslation: 20,
    selectorOfElements,
    getSourceTextFromElement,
    translateText: translateStringToUpperCase
  };
  const createTest = (check) => (check.bind(null, options));

  createAndAddTestsFromTable(createTest, it, [
    ["перевод страницы", checkTranslatingPage],
    ["показ исходного текста", checkShowingSourceText],
    ["показ переведённого текста", checkShowingTranslatedText]
  ]);
});

