"use strict";

import { JSDOM as JsDom } from "jsdom";

import checkIteratingThroughTextNodes from "./checkIteratingThroughTextNodes.js";


const checkIteratingThroughTextNodesFromStringHtml = (
  iterateThroughTextNodes,
  htmlOfPage,
  expectedTextPartsFromNodes
) => {
  const { document } = new JsDom(htmlOfPage).window;
  checkIteratingThroughTextNodes(iterateThroughTextNodes, document, expectedTextPartsFromNodes);
};

export default checkIteratingThroughTextNodesFromStringHtml;
