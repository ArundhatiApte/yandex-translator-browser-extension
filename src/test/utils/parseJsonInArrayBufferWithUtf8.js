"use strict";

import { extractStringFromArrayBufferWithUtf8 } from "./encodingDecodingStringInUtf8.js";


export default function parseJsonInArrayBufferWithUtf8(arrayBuffer, startIndex) {
  return parseJson(extractStringFromArrayBufferWithUtf8(arrayBuffer, startIndex));
};

const parseJson = JSON.parse;
