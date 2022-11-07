"use strict";

import { equal as expectEqual } from "assert/strict";

import createCurringFnFactory from "./../../../../../../test/utils/createCurringFnFactory.js";

import createConnectionFromSettingsPage from
  "./../../../../../settingsPage/js/utils/createConnectionToBackgroundScript.js";
import createConnectionFromPopupPage from
  "./../../../../../popupPage/js/utils/createConnectionToBackgroundScript.js";
import statusesOfGettingSupportedLanguages from
  "./../../../../../common/js/data/statusesOfResponse/gettingSupportedLanguages.js";


const createCheckingRequestingGettingDataFn = createCurringFnFactory(
  async function checkRequestingGettingData(
    createConnectionToBackgroundScript,
    sendedData,
    setListenerOfRequest,
    sendRequestOnGettingData,
    fakeSenderOfMessages,
    acceptorOfRequests
  ) {
    setListenerOfRequest(acceptorOfRequests, (sendData) => (sendData(sendedData)));
    const connection = createConnectionToBackgroundScript(fakeSenderOfMessages);
    const receivedData = await sendRequestOnGettingData(connection);
    // без глубокого сравнения
    expectEqual(sendedData, receivedData);
  }
);

export const checkRequestingGettingNameOfCssClassForCurrentUiTheme = createCheckingRequestingGettingDataFn(
  createConnectionFromPopupPage,
  "dark",
  (acceptorOfRequests, listener) =>
    acceptorOfRequests.setRequestForGettingNameOfCssClassForCurrentUiTheme(listener),
  (connectionToBackgroundScript) =>
    connectionToBackgroundScript.requestGettingNameOfCssClassForCurrentUiTheme()
);

const requestGettingSettings = (connectionToBackgroundScript) =>
  connectionToBackgroundScript.requestGettingSettings();

export const checkRequestingGettingSettingsByPopupPage = createCheckingRequestingGettingDataFn(
  createConnectionFromPopupPage,
  [
    {
      s: statusesOfGettingSupportedLanguages.ok,
      r: [
        ["aa", "Afar"], // [код ISO, имя на языке текущей локали]
        ["ak", "Akan"],
        ["zh", "Chinese"]
      ]
    },
    "aa", // исходный язык
    "zh" // целевой язык
  ],
  (acceptorOfRequests, listener) => acceptorOfRequests.setRequestForGettingSettingsByPopupPageListener(listener),
  requestGettingSettings
);

export const checkRequestingGettingSettingsBySettingsPage = createCheckingRequestingGettingDataFn(
  createConnectionFromSettingsPage,
  { apiKeyToTranslatorService: "абвг", apiKetToDictionaryService: "деёж", idOfTheme: 1 },
  (acceptorOfRequests, listener) => acceptorOfRequests.setRequestForGettingSettingsBySettingsPageListener(listener),
  requestGettingSettings
);
