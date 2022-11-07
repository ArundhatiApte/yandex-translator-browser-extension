"use strict";

import { equal as expectEqual } from "assert/strict";


const expectThatTextNodesContainStrings = (textNodes, parallelStrings) => {
  let i = textNodes.length;
  expectEqual(i, parallelStrings.length);

  i -= 1;
  for (; i; i-= 1) {
    const stringFromNode = textNodes[i].nodeValue;
    expectEqual(stringFromNode, parallelStrings[i]);
  }
};

export default expectThatTextNodesContainStrings;
