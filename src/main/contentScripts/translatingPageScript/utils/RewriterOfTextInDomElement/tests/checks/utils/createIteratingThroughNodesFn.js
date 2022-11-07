"use strict";

const createIteratingThroughNodesFn = (nodes) => (iterateThroughTextNodes.bind(null, nodes));

const iterateThroughTextNodes = (nodes, nonUsedStartNode, processNode) => (
  nodes.forEach(processNode)
);

export default createIteratingThroughNodesFn;
