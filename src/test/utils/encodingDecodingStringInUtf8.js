"use strict";

const _decodeBinaryDataToString = TextDecoder.prototype.decode.bind(new TextDecoder("utf-8"));
const _encodeStringToUint8Array = TextEncoder.prototype.encode.bind(new TextEncoder("utf-8"));

export const createArrayBufferWithUtf8FromString = (string) => (
  _encodeStringToUint8Array(string).buffer
);

export const extractStringFromArrayBufferWithUtf8 = (arrayBuffer, startIndex) => (
  _decodeBinaryDataToString(new Uint8Array(arrayBuffer, startIndex))
);
