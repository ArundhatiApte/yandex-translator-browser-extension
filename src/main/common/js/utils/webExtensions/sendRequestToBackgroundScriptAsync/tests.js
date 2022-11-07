"use strict";

import { equal as expectEqual } from "assert/strict";

import FakeSenderOfMessagesToBackgroundScript from
  "../../../../../../test/utils/fakeObjects/browser/messaging/FakeSenderOfMessagesToBackgroundScript/index.js";

import sendRequestToBackgroundScriptAsync from "./index.js";


const testSendingMessageAndReceivingResponse = async () => {
  const fakeSenderOfMessages = new FakeSenderOfMessagesToBackgroundScript();

  const sendedMessage = 1;
  let isEventValid;
  const sendedResponse = 2;

  fakeSenderOfMessages._setOnMessageSendedListener((message, giveResponse) => {
    isEventValid = message === sendedMessage;
    giveResponse(sendedResponse);
  });

  const receivedResponse = await sendRequestToBackgroundScriptAsync(fakeSenderOfMessages, sendedMessage);
  expectEqual(true, isEventValid);
  expectEqual(receivedResponse, sendedResponse);
};

describe("тест отправки запроса фоновому сценарию с помощью Promise", () => {
  it("т", testSendingMessageAndReceivingResponse);
});
