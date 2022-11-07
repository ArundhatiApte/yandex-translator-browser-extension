"use strict";

import insertArrayBufferToAnotherUnsafe from "../insertArrayBufferToAnotherUnsafe/index.js";


const concatArrayBuffers = function() {
  const countOfArrayBuffers = arguments.length;
  const totalBytesInResult = calcTotalBytes(arguments, countOfArrayBuffers);
  const out = new ArrayBuffer(totalBytesInResult);
  const uint8sOfOut = new Uint8Array(out);

  let indexForInsertion = 0;
  let arrayBuffer;

  for (let i = 0; i < countOfArrayBuffers; i += 1) {
    arrayBuffer = arguments[i];
    insertArrayBufferToAnotherUnsafe(uint8sOfOut, indexForInsertion, arrayBuffer);
    indexForInsertion += arrayBuffer.byteLength;
  }
  return out;
};

const calcTotalBytes = (arrayBuffers, countOfArrayBuffers) => {
  let out = 0;
  let arrayBuffer;

  for (; countOfArrayBuffers; ) {
    countOfArrayBuffers -= 1;
    arrayBuffer = arrayBuffers[countOfArrayBuffers];
    out += arrayBuffer.byteLength;
  }
  return out;
};

export default concatArrayBuffers;
