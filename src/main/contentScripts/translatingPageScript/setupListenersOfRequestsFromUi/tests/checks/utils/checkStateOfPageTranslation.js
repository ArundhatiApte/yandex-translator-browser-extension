"use strict";

import {
  messageForGettingStateOfPage
} from "../../../../../../common/js/data/messaging/messagesToTranslatingPageScript.js";

import emitIncomingRequestThenCheckStatusInResponse from "./emitIncomingRequestThenCheckStatusInResponse.js";


const checkStateOfPageTranslation = (fakeEventOfIncomingMessage, expectedState) => {
  return emitIncomingRequestThenCheckStatusInResponse(
    fakeEventOfIncomingMessage,
    messageForGettingStateOfPage,
    expectedState
  );
};

export default checkStateOfPageTranslation;
