"use strict";

const SenderOfResponse = class {
  constructor(uWebSocketsResponse) {
    this[_response] = uWebSocketsResponse;
  }

  terminateConnection() {
    return this[_response].close();
  }

  sendError(httpCode, status, message) {
    descriptionOfError.code = status;
    descriptionOfError.message = message;

    this[_response]
      .writeStatus(httpCode)
      .writeHeader("grpc-status", status.toString())
      .writeHeader("grpc-message", message)
      .end(stringifyToJson(descriptionOfError));
  }
};

const _response = Symbol();
const stringifyToJson = JSON.stringify;
const descriptionOfError = Object.create(null);

SenderOfResponse._namesOfProtectedProperties = { _response };

export default SenderOfResponse;
