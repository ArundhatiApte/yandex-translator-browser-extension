"use strict";

const extractApiKeyFromString = (valueOfHeader) => {
  return valueOfHeader.startsWith(prefix) && valueOfHeader.length > lengthOfPrefix
    ? valueOfHeader.substring(lengthOfPrefix)
    : null;
};

const prefix = "Api-Key ";
const lengthOfPrefix = prefix.length;

export default extractApiKeyFromString;
