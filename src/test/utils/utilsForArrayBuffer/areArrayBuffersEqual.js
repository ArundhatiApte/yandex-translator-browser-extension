"use strict";

const areArrayBuffersEqual = (a, b) => {
  let aLength = a.byteLength;
  if (aLength !== b.byteLength) {
    return false;
  }
  const aUint8s = new Uint8Array(a);
  const bUint8s = new Uint8Array(b);
  let aUint8, bUint8;

  for (; aLength; ) {
    aLength -= 1;
    aUint8 = aUint8s[aLength];
    bUint8 = bUint8s[aLength];

    if (aUint8 !== bUint8) {
      return false;
    }
  }
  return true;
};

export default areArrayBuffersEqual;
