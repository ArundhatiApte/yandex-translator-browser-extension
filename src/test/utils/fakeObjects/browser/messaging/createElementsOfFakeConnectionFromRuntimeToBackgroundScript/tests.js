"use strict";

import { equal as expectEqual } from "assert/strict";

import sendRequestToBackgroundScriptAsync from
  "../../../../../../main/common/js/utils/webExtensions/sendRequestToBackgroundScriptAsync/index.js";
import createElementsOfFakeConnectionFromRuntimeToBackgroundScript from "./index.js";


const testSendingMessageAndReceivingResponse = async () => {
  const {
    fakeSenderOfMessages,
    fakeEventOfIncomingMessage
  } = createElementsOfFakeConnectionFromRuntimeToBackgroundScript();

  const sendedMessage = 1;
  let isEventValid;
  const sendedResponse = 2;

  fakeEventOfIncomingMessage.addListener(function(message, sender, sendResponse) {
    isEventValid = message === sendedMessage;
    sendResponse(sendedResponse);
  });
  const receivedResponse = await sendRequestToBackgroundScriptAsync(fakeSenderOfMessages, sendedMessage);

  expectEqual(true, isEventValid);
  expectEqual(sendedResponse, receivedResponse);
};

describe("тест поддельного соединения между runtime и фоновым сценарием", () => {
  it("т", testSendingMessageAndReceivingResponse);
});

