"use strict";

import concatArrayBuffers from "../../../utilsForArrayBuffer/concatArrayBuffers/index.js";


const AcceptorOfRequestBodyChunks = class {
  constructor(request, response) {
    this[_request] = request;
    this[_response] = response;

    this[_sizeOfBody] = 0;
    this[_chunksOfBody] = [];
  }

  onChunkOfRequestBodyReceived(chunkInArrayBuffer, isLast) {
    const newSize = this[_sizeOfBody] += chunkInArrayBuffer.byteLength;
    const chunks = this[_chunksOfBody];

    if (isLast) {
      let fullBody;
      if (chunks.length === 0) {
        fullBody = chunkInArrayBuffer;
      }
      else {
        chunks.push(chunkInArrayBuffer);
        fullBody = concatArrayBuffers.apply(null, chunks)
      }
      this[_onFullBodyOfRequestReceived](fullBody);
    }
    else {
      chunks.push(chunkInArrayBuffer);
    }
  }
};

const _request = Symbol();
const _response = Symbol();

const _sizeOfBody = Symbol();
const _chunksOfBody = Symbol();

AcceptorOfRequestBodyChunks._namesOfProtectedProperties = {
  _request,
  _response,
  _sizeOfBody,
  _chunksOfBody
};

const _onFullBodyOfRequestReceived = Symbol();

AcceptorOfRequestBodyChunks._namesOfProtectedMethods = {
  _onFullBodyOfRequestReceived
};

AcceptorOfRequestBodyChunks.setDataListener = (response, acceptorOfRequestBodyChunks) => {
  return response.onData(onChunkOfRequestBodyReceived.bind(acceptorOfRequestBodyChunks));
};

const onChunkOfRequestBodyReceived = AcceptorOfRequestBodyChunks.prototype.onChunkOfRequestBodyReceived;

export default AcceptorOfRequestBodyChunks;
