"use strict";

import fetch from "node-fetch";

import checkSendingMalformedRequest from "./utils/checkSendingMalformedRequest.js";


const checkSendingRequestWithoutApiKey = (url, acceptor) => {
  return checkSendingMalformedRequest(sendPostRequest.bind(null, url), url, acceptor);
};

const sendPostRequest = (url) => (fetch(url, { method: "POST" }));

export default checkSendingRequestWithoutApiKey;
