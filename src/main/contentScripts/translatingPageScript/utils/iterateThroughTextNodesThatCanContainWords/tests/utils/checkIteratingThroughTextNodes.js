"use strict";

import { deepEqual as expectDeepEqual } from "assert/strict";


const checkIteratingThroughTextNodes = (iterateThroughTextNodes, startNode, expectedTextPartsFromNodes) => {
  const recordedTextPartsFromNodes = [];
  const callback = (textNode) => (recordedTextPartsFromNodes.push(textNode.nodeValue));
  iterateThroughTextNodes(startNode, callback);
  expectDeepEqual(expectedTextPartsFromNodes, recordedTextPartsFromNodes);
};

export default checkIteratingThroughTextNodes;
