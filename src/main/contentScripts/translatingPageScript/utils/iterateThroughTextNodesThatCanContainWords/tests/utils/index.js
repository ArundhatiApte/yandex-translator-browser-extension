"use strict";

import createCurringFnFactory from "../../../../../../../test/utils/createCurringFnFactory.js";

import checkIteratingThroughTextNodesFromFileWithHtml from "./checkIteratingThroughTextNodesFromFileWithHtml.js";
import checkIteratingThroughTextNodesFromStringHtml from "./checkIteratingThroughTextNodesFromStringHtml.js";


export { default as checkIteratingThroughTextNodes } from "./checkIteratingThroughTextNodes.js";

export const createCheckingIteratingThroughTextNodesFromFileWithHtmlFn =
  createCurringFnFactory(checkIteratingThroughTextNodesFromFileWithHtml);

export const createCheckingIteratingThroughTextNodesFromStringHtmlFn =
  createCurringFnFactory(checkIteratingThroughTextNodesFromStringHtml);
