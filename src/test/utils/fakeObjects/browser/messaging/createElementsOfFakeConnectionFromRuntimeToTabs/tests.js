"use strict";

import { equal as expectEqual } from "assert/strict";

import sendRequestToTabAsync from
  "../../../../../../main/common/js/utils/webExtensions/sendRequestToTabAsync/index.js";

import createElementsOfFakeConnectionFromRuntimeToTabs from "./index.js";


const testSendingMessageAndReceivingResponse = async () => {
  const {
    fakeSenderOfMessages,
    fakeEventOfIncomingMessage
  } = createElementsOfFakeConnectionFromRuntimeToTabs();

  const tabIdOfSender = 0;
  const sendedMessage = 1;
  let isEventValid;
  const sendedResponse = 2;

  fakeEventOfIncomingMessage.addListener(function(message, sender, sendResponse) {
    isEventValid = sender.tab.id === tabIdOfSender && message === sendedMessage;
    sendResponse(sendedResponse);
  });
  const receivedResponse = await sendRequestToTabAsync(
    fakeSenderOfMessages,
    tabIdOfSender,
    sendedMessage
  );

  expectEqual(true, isEventValid);
  expectEqual(sendedResponse, receivedResponse);
};

describe("тест поддельного соединения между runtime и вкладками", () => {
  it("т", testSendingMessageAndReceivingResponse);
});

