"use strict";

const createArrayBufferFromUint8s = (uint8s) => (new Uint8Array(uint8s).buffer);

export default createArrayBufferFromUint8s;
