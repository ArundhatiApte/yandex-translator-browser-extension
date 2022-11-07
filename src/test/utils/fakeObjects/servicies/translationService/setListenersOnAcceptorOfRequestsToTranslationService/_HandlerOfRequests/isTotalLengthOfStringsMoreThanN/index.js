"use strict";

const isTotalLengthOfStringsMoreThanN = (strings, maxLength) => {
  let currentTotalLength = 0;
  for (const string of strings) {
    currentTotalLength += string.length;
    if (currentTotalLength > maxLength) {
      return true;
    }
  }
  return false;
};

export default isTotalLengthOfStringsMoreThanN;
