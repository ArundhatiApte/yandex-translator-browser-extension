"use strict";

const FakeSenderOfMessagesToBackgroundScript = class {
  constructor() {}

  _setOnMessageSendedListener(listener) {
    this[_onMessageSended] = listener;
  }

  sendMessage(message, onResponse) {
    const listener = this[_onMessageSended];

    if (!listener) {
      this[_lastError] = new ThereIsNoReceiverError("Отсутствует получатель ответа.");
      onResponse();
      return;
    }
    _callFunctionToAvoidRecursion(listener, message, onResponse);
  }

  get lastError() {
    return this[_lastError];
  }
};

const _onMessageSended = Symbol();
const _lastError = Symbol();

const ThereIsNoReceiverError = class extends Error {};
FakeSenderOfMessagesToBackgroundScript.ThereIsNoReceiverError = ThereIsNoReceiverError;

const _callFunctionToAvoidRecursion = (fn, param1, param2) => {
  return setTimeout(fn, 0, param1, param2);
};

export default FakeSenderOfMessagesToBackgroundScript;
