"use strict";

import {
  equal as expectEqual,
  rejects as expectThrows
} from "assert/strict";

import { addTestsFromTable } from "../../../../addingTestsFromTable.js";
import FakeSenderOfMessagesToTabs from "./index.js";


const testSendingMessageAndReceivingResponse = function() {
  return new Promise(function(resolve, reject) {
    const tabIdOfSender = 4;
    const sendedMessage = "message";
    const sendedResponse = "response";
    const senderOfMessage = new FakeSenderOfMessagesToTabs();

    senderOfMessage._setOnMessageSendedListener((tabId, message, giveResponse) => {
      if (tabId === tabIdOfSender && message === sendedMessage) {
        giveResponse(sendedResponse);
      }
      else {
        reject(new Error("Разные сообщения."));
      }
    });

    senderOfMessage.sendMessage(tabIdOfSender, sendedMessage, (response) => {
      if (response === sendedResponse) {
        resolve();
      }
      else {
        reject(new Error("Разные ответы."));
      }
    });
  });
};

const testErrorWhenThereIsNoReceiver = () => {
  return new Promise(function(resolve, reject) {
    const senderOfMessage = new FakeSenderOfMessagesToTabs();

    senderOfMessage.sendMessage(4, "message", function() {
      // developer.chrome.com/docs/extensions/reference/runtime/#method-sendMessage
      if (
        arguments.length === 0 &&
        senderOfMessage.lastError instanceof FakeSenderOfMessagesToTabs.ThereIsNoReceiverError
      ) {
        resolve();
      }
      else {
        reject();
      }
    });
  });
};

describe("тест поддельного отправителя сообщений вкладкам из WebExtensions", () => (
  addTestsFromTable(it, [
    ["отправка сообщения и получение ответа", testSendingMessageAndReceivingResponse],
    ["ошибка отправки сообщения при отсутствии получателя", testErrorWhenThereIsNoReceiver]
  ])
));
