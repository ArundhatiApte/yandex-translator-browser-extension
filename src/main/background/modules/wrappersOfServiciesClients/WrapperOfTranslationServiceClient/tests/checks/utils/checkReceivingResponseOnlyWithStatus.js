"use strict";

import { equal as expectEqual } from "assert/strict";


const checkReceivingResponseOnlyWithStatus = async (wrapper, performRequest, expectedStatus) => {
  const response = await performRequest(wrapper);
  expectEqual(expectedStatus, response.s);
};

export default checkReceivingResponseOnlyWithStatus;
