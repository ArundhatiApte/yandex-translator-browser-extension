"use strict";

const insertArrayBufferToAnotherUnsafe = (sourceUint8s, startIndexInSource, insertedArrayBuffer) => {
  const insertedUint8s = new Uint8Array(insertedArrayBuffer);
  const countOfInsertedBytes = insertedArrayBuffer.byteLength;

  let indexInSource = startIndexInSource;
  let indexInInserted = 0;

  for (; indexInInserted < countOfInsertedBytes;) {
    sourceUint8s[indexInSource] = insertedUint8s[indexInInserted];
    indexInSource += 1;
    indexInInserted += 1;
  }
};

export default insertArrayBufferToAnotherUnsafe;
