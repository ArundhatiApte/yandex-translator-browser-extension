"use strict";

import { equal as expectEqual } from "assert/strict";


const emitIncomingRequestThenCheckStatusInResponse = async (
  fakeEventOfIncomingMessage,
  messageForRequest,
  expectedStatus
) => {
  const status = await fakeEventOfIncomingMessage._emit(messageForRequest);
  expectEqual(expectedStatus, status);
};

export default emitIncomingRequestThenCheckStatusInResponse;
