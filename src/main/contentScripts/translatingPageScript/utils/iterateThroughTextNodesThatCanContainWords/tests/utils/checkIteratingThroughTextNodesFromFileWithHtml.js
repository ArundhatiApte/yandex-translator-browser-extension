"use strict";

import { JSDOM as JsDom } from "jsdom";

import checkIteratingThroughTextNodes from "./checkIteratingThroughTextNodes.js";


const checkIteratingThroughTextNodesFromFileWithHtml = async (
  iterateThroughTextNodes,
  pathToFile,
  expectedTextPartsFromNodes
) => {
  const { document } = await createLoadedWindowWithResoursesFromFile(pathToFile);
  checkIteratingThroughTextNodes(iterateThroughTextNodes, document, expectedTextPartsFromNodes);
};

export default checkIteratingThroughTextNodesFromFileWithHtml;

const createLoadedWindowWithResoursesFromFile = (pathToPage) => {
  return new Promise(async (resolve, reject) => {
    const { window } = await JsDom.fromFile(pathToPage, options);
    window.onload = resolve.bind(null, window);
    window.onerror = reject;
  });
};

const options = { resources: "usable" };
