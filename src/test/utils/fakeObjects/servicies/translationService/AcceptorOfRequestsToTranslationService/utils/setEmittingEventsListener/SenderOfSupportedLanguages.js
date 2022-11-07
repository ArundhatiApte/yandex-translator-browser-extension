"use strict";

import SenderOfResponse from "./SenderOfResponse.js";


const SenderOfSupportedLanguages = class extends SenderOfResponse {
  sendSupportedLanguages(supportedLanguagesInArrayBufferWithJsonUtf8String) {
    return this[_response].writeStatus("200 OK").end(supportedLanguagesInArrayBufferWithJsonUtf8String);
  }
};

const _response = SenderOfResponse._namesOfProtectedProperties._response;

export default SenderOfSupportedLanguages;
