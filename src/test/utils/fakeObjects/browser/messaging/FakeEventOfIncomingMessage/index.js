"use strict";

const FakeEventOfIncomingMessage = class {
  constructor() {
    this[_listeners] = new Set();
  }

  addListener(listener) {
    return this[_listeners].add(listener);
  }

  removeListener(listener) {
    return this[_listeners].remove(listener);
  }

  hasListener(listener) {
    return this[_listeners].has(listener);
  }

  _emit(message, sender, maxTimeInMsForWaitingResponse = defaultMaxTimeInMsForWaitingResponse) {
    return new Promise((resolve, reject) => {
      const listeners = this[_listeners];
      if (listeners.size === 0) {
        return reject(new NoListenersError());
      }
      const timeout = _createTimeoutForPromise(reject, maxTimeInMsForWaitingResponse);
      const acceptResponseFromListener = _createResponseAcceptor(timeout, resolve);
      _callListeners(this, listeners, [message, sender, acceptResponseFromListener]);
    });
  }
};

const _listeners = Symbol();
const defaultMaxTimeInMsForWaitingResponse = 200;

const NoListenersError = class extends Error {
  constructor() {
    super("Отсутствуют обработчики события.");
  }
};
FakeEventOfIncomingMessage.NoListenersError = NoListenersError;

const _createTimeoutForPromise = (rejectPromise, maxTimeInMsForWaitingResponse) => (
  setTimeout(
    _rejectPromiseWithError,
    maxTimeInMsForWaitingResponse,
    rejectPromise,
    TimeoutForReceivingResponseFromListenerError
  )
);

const _rejectPromiseWithError = (rejectPromise, Error) => rejectPromise(new Error());

const TimeoutForReceivingResponseFromListenerError = class extends Error {
  constructor() {
    super("Время ожидания ответа от какого-либо обработчика истекло.");
  }
};
FakeEventOfIncomingMessage.TimeoutForReceivingResponseFromListenerError
  = TimeoutForReceivingResponseFromListenerError;

const _createResponseAcceptor = (timeout, resolvePromise) =>
  _clearTimoutAndResolvePromise.bind(null, timeout, resolvePromise)

const _clearTimoutAndResolvePromise = (timeout, resolvePromise, result) => {
  clearTimeout(timeout);
  resolvePromise(result);
};

const _callListeners = (context, listeners, args) => {
  for (const listener of listeners) {
    listener.apply(context, args);
  }
};

export default FakeEventOfIncomingMessage;
