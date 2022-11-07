"use strict";

import SenderOfResponse from "./SenderOfResponse.js";


const SenderOfTranslation = class extends SenderOfResponse {
  sendTranslation(translation) {
    return this[_response].writeStatus("200 OK").end(stringifyToJson(translation));
  }
};

const _response = SenderOfResponse._namesOfProtectedProperties._response;
const stringifyToJson = JSON.stringify;

export default SenderOfTranslation;
