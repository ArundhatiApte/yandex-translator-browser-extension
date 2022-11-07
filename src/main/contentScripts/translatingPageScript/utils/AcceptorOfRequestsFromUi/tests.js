"use strict";

import { equal as expectEqual, deepEqual as expectDeepEqual } from "assert/strict";

import { addTestsFromTable } from "../../../../../test/utils/addingTestsFromTable.js";
import createCurringFnFactory from "../../../../../test/utils/createCurringFnFactory.js";

import FakeEventOfIncomingMessage from
  "../../../../../test/utils/fakeObjects/browser/messaging/FakeEventOfIncomingMessage/index.js";

import {
  notTranslated as statesOfPageTranslation_notTranslated,
  translated as statesOfPageTranslation_translated,
  translatedAndSourceTextShown as statesOfPageTranslation_translatedAndSourceTextShown
} from "../../../../common/js/data/statesOfPageTranslation.js";

import statusesOfResponseOnTranslation from "../../../../common/js/data/statusesOfResponse/translation.js";
import defaultSuccesStatus from "../../../../common/js/data/messaging/defaultSuccesStatus.js";

import {
  messageForGettingStateOfPage,
  headerForTranslatingPage,
  messageForShowingSourceText,
  messageForShowingTranslatedText
} from "../../../../common/js/data/messaging/messagesToTranslatingPageScript.js";

import createAcceptorOfRequestsFromUi from "./index.js";


const testRequestOnGettingStateOfPageTranslation = async () => {
  const fakeEventOfIncomingMessage = new FakeEventOfIncomingMessage();
  const acceptorOfRequests = createAcceptorOfRequestsFromUi(fakeEventOfIncomingMessage);

  const checkGettingStateOfPage = async (
    fakeEventOfIncomingMessage,
    acceptorOfRequests,
    stateOfPage
  ) => {
    acceptorOfRequests.setRequestOnGettingStateOfPageTranslationListener((sendState) => (
      sendState(stateOfPage)
    ));
    const receivedState = await fakeEventOfIncomingMessage._emit(messageForGettingStateOfPage);
    expectEqual(stateOfPage, receivedState);
  };

  const statesOfPage = [
    statesOfPageTranslation_notTranslated,
    statesOfPageTranslation_translated,
    statesOfPageTranslation_translatedAndSourceTextShown
  ];
  for (const state of statesOfPage) {
    await checkGettingStateOfPage(
      fakeEventOfIncomingMessage,
      acceptorOfRequests,
      state
    );
  }
};

const testRequestOnTranslation = async () => {
  const fakeEventOfIncomingMessage = new FakeEventOfIncomingMessage();
  const acceptorOfRequests = createAcceptorOfRequestsFromUi(fakeEventOfIncomingMessage);

  const checkSendingRequestAndReceivingStatus = async (
    fakeEventOfIncomingMessage,
    acceptorOfRequests,
    codeOfSourceLanguage,
    codeOfTargetLanguage,
    result
  ) => {
    acceptorOfRequests.setRequestOnTranslatingPageListener((
      iCodeOfSourceLanguage,
      iCodeOfTargetLanguage,
      sendResult
    ) => {
      if (
        iCodeOfSourceLanguage === codeOfSourceLanguage &&
        iCodeOfTargetLanguage === codeOfTargetLanguage
      ) {
        sendResult(result);
      }
    });

    const receivedResult = await fakeEventOfIncomingMessage._emit([
      headerForTranslatingPage,
      codeOfSourceLanguage,
      codeOfTargetLanguage
    ]);
    expectDeepEqual(result, receivedResult);
  };

  const codeOfSourceLanguage = "sl";
  const codeOfTargetLanguage = "tl";

  for (const status of Object.values(statusesOfResponseOnTranslation)) {
    await checkSendingRequestAndReceivingStatus(
      fakeEventOfIncomingMessage,
      acceptorOfRequests,
      codeOfSourceLanguage,
      codeOfTargetLanguage,
      { s: status }
    );
  }
};

const createCheckingSendingRequestOnShowingSourceOfTranslatedTextInPage = createCurringFnFactory(
  async function checkSendingRequestOnShowingSourceOfTranslatedTextInPage(messageOfRequest, setListenerOfRequest) {
    const fakeEventOfIncomingMessage = new FakeEventOfIncomingMessage();
    const acceptorOfRequests = createAcceptorOfRequestsFromUi(fakeEventOfIncomingMessage);

    setListenerOfRequest(acceptorOfRequests, (sendOkStatus) => (sendOkStatus()));
    const response = await fakeEventOfIncomingMessage._emit(messageOfRequest);
    expectEqual(defaultSuccesStatus, response);
  }
);

const testRequestOnShowingSourceTextInPage = createCheckingSendingRequestOnShowingSourceOfTranslatedTextInPage(
  messageForShowingSourceText,
  (acceptorOfRequests, listener) => (
    acceptorOfRequests.setRequestOnShowingSourceTextInPageListener(listener)
  )
);

const testRequestOnShowingTranslatedTextInPage = createCheckingSendingRequestOnShowingSourceOfTranslatedTextInPage(
  messageForShowingTranslatedText,
  (acceptorOfRequests, listener) => (
    acceptorOfRequests.setRequestOnShowingTranslatedTextInPageListener(listener)
  )
);

const nameOfTest =
  "тест объекта, принимающего запросы от пользовательского интерфейса, для переводящего страницу сценария";

describe(nameOfTest, () => (
  addTestsFromTable(it, [
    ["запрос на получение состояния страницы", testRequestOnGettingStateOfPageTranslation],
    ["запрос на перевод страницы", testRequestOnTranslation],
    ["запрос на показ исходного текста", testRequestOnShowingTranslatedTextInPage],
    ["запрос на показ переведённого текста ", testRequestOnShowingTranslatedTextInPage]
  ])
));
