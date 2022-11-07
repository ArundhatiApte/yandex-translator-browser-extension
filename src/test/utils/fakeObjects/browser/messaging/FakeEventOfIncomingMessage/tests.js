"use strict";

import {
  equal as expectEqual,
  rejects as expectThrowsAsync
} from "assert/strict";

import { addTestsFromTable } from "../../../../addingTestsFromTable.js";
import FakeEventOfIncomingMessage from "./index.js";


const testNoListenersError = () => {
  const event = new FakeEventOfIncomingMessage();
  const sender = null;

  return expectThrowsAsync(
    () => event._emit("message"),
    FakeEventOfIncomingMessage.NoListenersError
  );
};

const testTimeoutForReceivingResponseFromListenerError = () => {
  const event = new FakeEventOfIncomingMessage();
  const maxTimeInMsForWaitingResponse = 50;

  const listenerOfIncomingMessage = (data, sender, sendResponse) => (
    setTimeout(sendResponse, maxTimeInMsForWaitingResponse + 100, "response")
  );
  event.addListener(listenerOfIncomingMessage);

  const sender = null;
  return expectThrowsAsync(
    () => event._emit("message", sender, maxTimeInMsForWaitingResponse),
    FakeEventOfIncomingMessage.TimeoutForReceivingResponseFromListenerError
  );
};

const testEmittingEventAndGettingResponseFromFirstListener = async () => {
  const event = new FakeEventOfIncomingMessage();

  const message = "message";
  const responseFromListener1 = "L1";
  const responseFromListener2 = "L2";

  const checkIncomingMessageThenWaitAndSendResponse = (
    expectedIncomingMessage,
    timeInMs,
    response,
    incomingMessage,
    sender,
    sendResponse
  ) => {
    if (expectedIncomingMessage !== incomingMessage) {
      return reject(new Error("Разные сообщения."));
    }
    setTimeout(sendResponse, timeInMs, response);
  };

  const maxTimeInMsForWaitingResponse = 80;
  event.addListener(checkIncomingMessageThenWaitAndSendResponse.bind(
    null,
    message,
    maxTimeInMsForWaitingResponse - 20,
    responseFromListener1
  ));
  event.addListener(checkIncomingMessageThenWaitAndSendResponse.bind(
    null,
    message,
    maxTimeInMsForWaitingResponse - 40,
    responseFromListener2
  ));

  const sender = null;
  const receivedResponse = await event._emit(message, sender, maxTimeInMsForWaitingResponse);
  expectEqual(responseFromListener2, receivedResponse);
};

describe("тест поддельного события входящего сообщения из WebExtensions", () => (
  addTestsFromTable(it, [
    ["ошибка при отсутствии обработчиков", testNoListenersError],
    [
      "ошибка истечения времени ожидания ответа от какого-либо обработчика",
      testTimeoutForReceivingResponseFromListenerError
    ],
    [
      "генерация события и получение ответа от обработчика",
      testEmittingEventAndGettingResponseFromFirstListener
    ]
  ])
));
