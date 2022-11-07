"use strict";

import { ok as expectTrue, rejects as expectRejects } from "assert/strict";


const checkSendingMalformedRequest = async (
  sendRequest,
  url,
  acceptorOfRequestsToTranslationService
) => {
  let wasRequestReceived;
  acceptorOfRequestsToTranslationService.setMalformedRequestListener((request, response) => {
    wasRequestReceived = true;
    response.close();
  });

  await expectRejects(sendRequest.bind(null, url));
  expectTrue(wasRequestReceived);
};

export default checkSendingMalformedRequest;
