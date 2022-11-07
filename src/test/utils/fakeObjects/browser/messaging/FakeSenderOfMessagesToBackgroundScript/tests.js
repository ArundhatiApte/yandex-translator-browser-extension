"use strict";

import {
  equal as expectEqual,
  rejects as expectThrows
} from "assert/strict";

import { addTestsFromTable } from "../../../../addingTestsFromTable.js";
import FakeSenderOfMessagesToBackgroundScript from "./index.js";


const testSendingMessageAndReceivingResponse = () => {
  return new Promise(function(resolve, reject) {
    const message = "message";
    const response = "response";
    const senderOfMessage = new FakeSenderOfMessagesToBackgroundScript();

    senderOfMessage._setOnMessageSendedListener(function checkMessageAndGiveResponse(sendedMessage, giveResponse) {
      if (sendedMessage === message) {
        giveResponse(response);
      }
      else {
        reject(new Error("Разные сообщения."));
      }
    });

    senderOfMessage.sendMessage(message, function(receivedResponse) {
      if (receivedResponse === response) {
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
    const senderOfMessage = new FakeSenderOfMessagesToBackgroundScript();

    senderOfMessage.sendMessage("message", function() {
      // developer.chrome.com/docs/extensions/reference/runtime/#method-sendMessage
      if (
        arguments.length === 0 &&
        senderOfMessage.lastError instanceof FakeSenderOfMessagesToBackgroundScript.ThereIsNoReceiverError
      ) {
        resolve();
      }
      else {
        reject();
      }
    });
  });
};

describe("тест поддельного отправителя сообщений фоновому сценарию из WebExtensions", () => (
  addTestsFromTable(it, [
    ["отправка сообщения и получение ответа", testSendingMessageAndReceivingResponse],
    ["ошибка отправки сообщения при отсутствии получателя", testErrorWhenThereIsNoReceiver]
  ])
));
