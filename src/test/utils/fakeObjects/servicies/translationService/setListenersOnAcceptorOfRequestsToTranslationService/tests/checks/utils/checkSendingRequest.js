"use strict";

const checkSendingRequest = async (sendRequest, checkJsonBodyOfResponse) => {
  const response = await sendRequest();
  checkJsonBodyOfResponse(await response.json());
};

export default checkSendingRequest;
