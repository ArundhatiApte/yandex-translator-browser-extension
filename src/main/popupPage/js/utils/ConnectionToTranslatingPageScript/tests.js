"use strict";

import { equal as expectEqual, deepEqual as expectDeepEqual } from "assert/strict";

import { createAndAddTestsFromTable } from "../../../../../test/utils/addingTestsFromTable.js";
import createCurringFnFactory from "../../../../../test/utils/createCurringFnFactory.js";
import createElementsOfFakeConnectionFromRuntimeToTabs from
  "../../../../../test/utils/fakeObjects/browser/messaging/createElementsOfFakeConnectionFromRuntimeToTabs/index.js";

import {
  translated as statesOfPageTranslation_translated
} from "../../../../common/js/data/statesOfPageTranslation.js";
import statusesOfResponseOnTranslation from "../../../../common/js/data/statusesOfResponse/translation.js";
import bindFunction from "../../../../common/js/utils/bindFunction.js"

import createAcceptorOfRequestsFromUi from
  "../../../../contentScripts/translatingPageScript/utils/AcceptorOfRequestsFromUi/index.js";

import createConnectionToTranslatingPageScript from "./index.js";


const checkRequestingGettingStateOfPageTranslation = async (
  acceptorOfRequestsFromUi,
  connectionToTranslatingPageScript
) => {
  const sendedState = statesOfPageTranslation_translated;

  acceptorOfRequestsFromUi.setRequestOnGettingStateOfPageTranslationListener(
    (sendState) => (sendState(sendedState))
  );
  const receivedState = await connectionToTranslatingPageScript.requestGettingStateOfPageTranslation();
  expectEqual(sendedState, receivedState);
};

const checkRequestingTranslatingPage = async (
  acceptorOfRequestsFromUi,
  connectionToTranslatingPageScript
) => {
  const sendedCodeOfSourceLanguage = "aa";
  const sendedCodeOfTargetLanguage = "bb";
  let isRequestValid;
  const sendedResponse = { s: statusesOfResponseOnTranslation.ok };

  const listener = (codeOfSourceLanguage, codeOfTargetLanguage, sendResponse) => {
    isRequestValid =
      codeOfSourceLanguage === sendedCodeOfSourceLanguage &&
      codeOfTargetLanguage === sendedCodeOfTargetLanguage;
    sendResponse(sendedResponse);
  };
  acceptorOfRequestsFromUi.setRequestOnTranslatingPageListener(listener);

  const receivedResponse = await connectionToTranslatingPageScript.requestTranslatingPage(
    sendedCodeOfSourceLanguage,
    sendedCodeOfTargetLanguage
  );
  expectEqual(true, isRequestValid);
  expectDeepEqual(sendedResponse, receivedResponse);
};

const createCheckingRequestingShowingTextInPageFn = (() => {
  const checkRequestingShowingTextInPage = async (
    setListenerOfRequestOnShowingTextInPage,
    sendRequestOnShowingTextInPage,
    acceptorOfRequestsFromUi,
    connectionToTranslatingPageScript
  ) => {
    setListenerOfRequestOnShowingTextInPage(acceptorOfRequestsFromUi, _sendingOkStatusListener);
    await sendRequestOnShowingTextInPage(connectionToTranslatingPageScript);
  };

  const _sendingOkStatusListener = (sendOkStatus) => (sendOkStatus());

  return createCurringFnFactory(checkRequestingShowingTextInPage);
})();

const checkRequestingShowingSourceTextInPage = createCheckingRequestingShowingTextInPageFn(
  (acceptorOfRequestsFromUi, listener) => (
    acceptorOfRequestsFromUi.setRequestOnShowingSourceTextInPageListener(listener)
  ),
  (connectionToTranslatingPageScript) => (connectionToTranslatingPageScript.requestShowingSourceTextInPage())
);

const checkRequestingShowingTranslatedTextInPage = createCheckingRequestingShowingTextInPageFn(
  (acceptorOfRequestsFromUi, listener) => (
    acceptorOfRequestsFromUi.setRequestOnShowingTranslatedTextInPageListener(listener)
  ),
  (connectionToTranslatingPageScript) => (connectionToTranslatingPageScript.requestShowingTranslatedTextInPage())
);

describe("тест отправителя запросов сценарию, переводящему страницу во вкладке", function() {
  const factoryOfTests = {
    setAcceptorOfRequestsFromUi(acceptorOfRequestsFromUi) {
      this._ = acceptorOfRequestsFromUi;
    },
    setConnectionToTranslatingPageScript(connectionToTranslatingPageScript) {
      this._1 = connectionToTranslatingPageScript;
    },
    createTest(check) {
      return this._2.bind(this, check);
    },
    _2(check) {
      return check(this._, this._1);
    }
  };

  before(() => {
    const {
      fakeSenderOfMessages,
      fakeEventOfIncomingMessage
    } = createElementsOfFakeConnectionFromRuntimeToTabs();

    factoryOfTests.setAcceptorOfRequestsFromUi(
      createAcceptorOfRequestsFromUi(fakeEventOfIncomingMessage)
    );
    const idOfTab = 2;
    factoryOfTests.setConnectionToTranslatingPageScript(
      createConnectionToTranslatingPageScript(fakeSenderOfMessages, idOfTab)
    );
  });

  const createTest = bindFunction(factoryOfTests, factoryOfTests.createTest);
  createAndAddTestsFromTable(createTest, it, [
    ["запрос на получение состояния страницы", checkRequestingGettingStateOfPageTranslation],
    ["запрос на перевод страницы", checkRequestingTranslatingPage],
    ["запрос на показ исходного текста", checkRequestingShowingSourceTextInPage],
    ["запрос на показ переведённого текста", checkRequestingShowingTranslatedTextInPage]
  ]);
});
