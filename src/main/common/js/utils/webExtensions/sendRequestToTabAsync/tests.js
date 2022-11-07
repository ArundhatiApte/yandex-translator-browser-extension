"use strict";

import { equal as expectEqual } from "assert/strict";

import FakeSenderOfMessagesToTabs from
  "../../../../../../test/utils/fakeObjects/browser/messaging/FakeSenderOfMessagesToTabs/index.js";

import sendRequestToTabAsync from "./index.js";


const testSendingMessageAndReceivingResponse = async () => {
  const fakeSenderOfMessagesToTabs = new FakeSenderOfMessagesToTabs();

  const tabIdOfSender = 0;
  const sendedMessage = 1;
  let isEventValid;
  const sendedResponse = 2;

  fakeSenderOfMessagesToTabs._setOnMessageSendedListener((tabId, message, giveResponse) => {
    isEventValid = tabId === tabIdOfSender && message === sendedMessage;
    giveResponse(sendedResponse);
  });

  const receivedResponse = await sendRequestToTabAsync(
    fakeSenderOfMessagesToTabs,
    tabIdOfSender,
    sendedMessage
  );
  expectEqual(true, isEventValid);
  expectEqual(receivedResponse, sendedResponse);
};

describe("тест отправки запроса вкладке с помощью Promise", () => {
  it("т", testSendingMessageAndReceivingResponse);
});
