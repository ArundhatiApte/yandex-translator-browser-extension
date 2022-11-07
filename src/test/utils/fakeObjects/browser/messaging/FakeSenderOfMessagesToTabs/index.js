"use strict";

const FakeSenderOfMessagesToTabs = class {
  constructor() {}

  _setOnMessageSendedListener(listener) {
    this[_onMessageSended] = listener;
  }

  sendMessage(tabId, message, onResponse) {
    const listener = this[_onMessageSended];

    if (!listener) {
      this[_lastError] = new ThereIsNoReceiverError("Отсутствует получатель ответа.");
      onResponse();
      return;
    }
    _callFunctionToAvoidRecursion(listener, tabId, message, onResponse);
  }

  get lastError() {
    return this[_lastError];
  }
};

const _onMessageSended = Symbol();
const _lastError = Symbol();

const ThereIsNoReceiverError = class extends Error {};
FakeSenderOfMessagesToTabs.ThereIsNoReceiverError = ThereIsNoReceiverError;

const _callFunctionToAvoidRecursion = (fn, param1, param2, param3) => {
  return setTimeout(fn, 0, param1, param2, param3);
};

export default FakeSenderOfMessagesToTabs;
