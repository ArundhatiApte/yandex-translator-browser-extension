"use strict";

import { equal as expectEqual, deepEqual as expectDeepEqual } from "assert/strict";

import { addTestsFromTable } from "../../../../../../test/utils/addingTestsFromTable.js";
import FakeStorage from "../../../../../../test/utils/fakeObjects/browser/FakeStorage/index.js";

import statusesOfResponse from
  "../../../../modules/wrappersOfServiciesClients/WrapperOfTranslationServiceClient/statusesOfResponse.js";
import createStorerOfSettings from "../../../../modules/StorerOfSettings/index.js";
import codeOfLanguageToNameInEnglish from "../../../../modules/codeOfLanguageToName/en.js";

import createHandlerOfRequestForGettingSettingsByPopupPage from "./index.js";


const testWhenSupportedLanguagesWasReceivedSuccesfully = async () => {
  const fakeWrapperOfTsc = {
    async requestGettingCodesOfSupportedLanguages() {
      this._ += 1;
      return { s: statusesOfResponse_ok, r: ["aa", "ae", "am", "as"] };
    },
    _: 0,
    getCountOfRequests() { return this._; }
  };
  const statusesOfResponse_ok = statusesOfResponse.ok;

  const fakeStorerOfSettings = await createStorerOfSettings(new FakeStorage(), {
    emptyApiKey: null,
    emptyCodeOfLanguage: null,
    idOfDefaultTheme: 1
  });

  const handler = createHandlerOfRequestForGettingSettingsByPopupPage(
    fakeWrapperOfTsc,
    fakeStorerOfSettings,
    codeOfLanguageToNameInEnglish
  );
  const expectedSettings = [
    { s: statusesOfResponse_ok, r: [
      ["aa", "Afar"],
      ["ae", "Avestan"],
      ["am", "Amharic"],
      ["as", "Assamese"]
    ]},
    "aa",
    "ae"
  ];
  await checkReceivingSettings(handler, expectedSettings);
  await checkReceivingSettings(handler, expectedSettings);
  expectEqual(1, fakeWrapperOfTsc.getCountOfRequests());

  expectEqual("aa", fakeStorerOfSettings.getCodeOfSourceLanguageForTs());
  expectEqual("ae", fakeStorerOfSettings.getCodeOfTargetLanguageForTs());
};

const checkReceivingSettings = async (handlerOfRequest, expectedSettings) => {
  const receivedSettings = await receiveSettings(handlerOfRequest);
  expectDeepEqual(expectedSettings, receivedSettings);
};

const receiveSettings = (handlerOfRequest) => {
  return new Promise(async (resolve, reject) => {
    try {
      await handlerOfRequest.handleRequest(resolve);
    } catch(error) {
      reject(error);
    }
  });
};

const testFailOfGettingSupportedLanguages = async () => {
  const fakeWrapperOfTsc = {
    async requestGettingCodesOfSupportedLanguages() { return { s: statusesOfResponse_invalidApiKey }; }
  };
  const statusesOfResponse_invalidApiKey = statusesOfResponse.invalidApiKey;

  const handler = createHandlerOfRequestForGettingSettingsByPopupPage(
    fakeWrapperOfTsc,
    {},
    codeOfLanguageToNameInEnglish
  );
  const expectedSettings = [ { s: statusesOfResponse_invalidApiKey } ];
  await checkReceivingSettings(handler, expectedSettings);
};

describe("тест обработчика запроса настроек страницей popup", () =>
  addTestsFromTable(it, [
    ["при успешном получении поддерживаемых языков", testWhenSupportedLanguagesWasReceivedSuccesfully],
    ["при ошибке получения поддерживаемых языков", testFailOfGettingSupportedLanguages]
  ])
);
