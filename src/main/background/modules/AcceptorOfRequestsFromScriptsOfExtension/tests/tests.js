"use strict";

import { createAndAddTestsFromTable } from "../../../../../test/utils/addingTestsFromTable.js";
import createElementsOfFakeConnectionFromRuntimeToBackgroundScript from
"../../../../../test/utils/fakeObjects/browser/messaging/createElementsOfFakeConnectionFromRuntimeToBackgroundScript/index.js";

import createAcceptorOfRequests from "../index.js";

import checkRequestingTranslatingTextFragments from "./checks/checkRequestingTranslatingTextFragments.js";
import {
  checkRequestingGettingNameOfCssClassForCurrentUiTheme,
  checkRequestingGettingSettingsBySettingsPage,
  checkRequestingGettingSettingsByPopupPage
} from "./checks/checkingRequestingGettingSettings.js";
import checkRequestingUpdatingSettings from "./checks/checkRequestingUpdatingSettings.js";


const factoryOfTests = {
  setFakeSenderOfMessages(fakeSenderOfMessages) {
    this._ = fakeSenderOfMessages;
  },
  setAcceptorOfRequests(acceptorOfRequests) {
    this._1 = acceptorOfRequests;
  },
  createTest(check) {
    return this._2.bind(this, check);
  },
  _2(check) {
    return check(this._, this._1);
  }
};

describe("тест обмена сообщениями между фоновым сценарием и другими частями расширения ", function() {
  before(() => {
    const {
      fakeSenderOfMessages,
      fakeEventOfIncomingMessage
    } = createElementsOfFakeConnectionFromRuntimeToBackgroundScript();

    factoryOfTests.setFakeSenderOfMessages(fakeSenderOfMessages);
    factoryOfTests.setAcceptorOfRequests(createAcceptorOfRequests(fakeEventOfIncomingMessage));
  });

  const createTest = factoryOfTests.createTest.bind(factoryOfTests);
  createAndAddTestsFromTable(createTest, it, [
    ["запрос на перевод частей текста", checkRequestingTranslatingTextFragments],
    [
      "запрос на получение имени класса CSS для темы интерфейса",
      checkRequestingGettingNameOfCssClassForCurrentUiTheme
    ],
    ["запрос на получение настроек от страницы настроек", checkRequestingGettingSettingsBySettingsPage],
    ["запрос на обновление настроек", checkRequestingUpdatingSettings],
    ["запрос на получение настроек от страницы popup", checkRequestingGettingSettingsByPopupPage]
  ]);
});
