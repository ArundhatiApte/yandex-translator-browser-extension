"use strict";

const areArrayBuffersEqualByIndex = (a, startIndexInA, b, startIndexInB) => {
  const aLength = a.byteLength;
  if ((aLength - startIndexInA) < (b.byteLength - startIndexInB)) {
    return false;
  }

  const aUint8s = new Uint8Array(a);
  const bUint8s = new Uint8Array(b);
  let aUint8;
  let bUint8;

  for ( ; startIndexInA < aLength; startIndexInA += 1, startIndexInB += 1) {
    aUint8 = aUint8s[startIndexInA];
    bUint8 = bUint8s[startIndexInB];
    if (aUint8 !== bUint8) {
      return false;
    }
  }
  return true;
};

export default areArrayBuffersEqualByIndex;
