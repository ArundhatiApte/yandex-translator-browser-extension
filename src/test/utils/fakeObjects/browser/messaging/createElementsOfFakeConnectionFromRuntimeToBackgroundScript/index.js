"use strict";

import FakeSenderOfMessagesToBackgroundScript from "../FakeSenderOfMessagesToBackgroundScript/index.js";
import FakeEventOfIncomingMessage from "../FakeEventOfIncomingMessage/index.js";


const createElementsOfFakeConnectionFromRuntimeToBackgroundScript = () => {
  const fakeSenderOfMessages = new FakeSenderOfMessagesToBackgroundScript();
  const fakeEventOfIncomingMessage = new FakeEventOfIncomingMessage();
  _setGivingResponseListener(fakeEventOfIncomingMessage, fakeSenderOfMessages);
  return { fakeSenderOfMessages, fakeEventOfIncomingMessage };
};

const _setGivingResponseListener = (fakeEventOfIncomingMessage, fakeSenderOfMessages) => (
  fakeSenderOfMessages._setOnMessageSendedListener(
    _giveFirstResponseFromListeners.bind(null, fakeEventOfIncomingMessage)
  )
);

const _giveFirstResponseFromListeners = async (fakeEventOfIncomingMessage, message, giveResponse) => {
  const firstResponseFromListeners = await fakeEventOfIncomingMessage._emit(message);
  giveResponse(firstResponseFromListeners);
};

export default createElementsOfFakeConnectionFromRuntimeToBackgroundScript;
