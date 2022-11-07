"use strict";

import FakeSenderOfMessagesToTabs from "../FakeSenderOfMessagesToTabs/index.js";
import FakeEventOfIncomingMessage from "../FakeEventOfIncomingMessage/index.js";


const createElementsOfFakeConnectionFromRuntimeToTabs = () => {
  const fakeSenderOfMessages = new FakeSenderOfMessagesToTabs();
  const fakeEventOfIncomingMessage = new FakeEventOfIncomingMessage();
  _setGivingResponseListener(fakeEventOfIncomingMessage, fakeSenderOfMessages);
  return { fakeSenderOfMessages, fakeEventOfIncomingMessage };
};

const _setGivingResponseListener = (fakeEventOfIncomingMessage, fakeSenderOfMessagesToTabs) => (
  fakeSenderOfMessagesToTabs._setOnMessageSendedListener(
    _giveFirstResponseFromListeners.bind(null, fakeEventOfIncomingMessage)
  )
);

const _giveFirstResponseFromListeners = async (fakeEventOfIncomingMessage, tabId, message, giveResponse) => {
  const sender = { tab: { id: tabId} };
  const firstResponseFromListeners = await fakeEventOfIncomingMessage._emit(message, sender);
  giveResponse(firstResponseFromListeners);
};

export default createElementsOfFakeConnectionFromRuntimeToTabs;
