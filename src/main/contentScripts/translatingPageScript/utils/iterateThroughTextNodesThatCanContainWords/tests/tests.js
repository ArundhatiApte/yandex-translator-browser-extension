"use strict";

import { fileURLToPath as fileUrlToPath } from "url";
import path from "path";

import { JSDOM as JsDom } from "jsdom";

import { addTestsFromTable } from "../../../../../../test/utils/addingTestsFromTable.js";
import iterateThroughTextNodesThatCanContainWords from "../index.js";
import {
  checkIteratingThroughTextNodes,
  createCheckingIteratingThroughTextNodesFromFileWithHtmlFn,
  createCheckingIteratingThroughTextNodesFromStringHtmlFn
} from "./utils/index.js";


const testEmptyDocument = createCheckingIteratingThroughTextNodesFromStringHtmlFn(
  iterateThroughTextNodesThatCanContainWords,
  "<html><head></head><body></body></html>",
  []
);

const partsInFrame = [
  "первый в frame.",
  "\n      второй в frame\n      ",
  "3-ий в frame ",
  "четвёртый в frame ",
  "пятый в frame"
];

const nameOfCurrentDir = path.dirname(fileUrlToPath(import.meta.url));
const createPathFromCurrentDir = path.join.bind(path, nameOfCurrentDir);

const testDocumentWithCommentsAttributesNestedElementsAndIframeAndNonWordsText =
  createCheckingIteratingThroughTextNodesFromFileWithHtmlFn(
    iterateThroughTextNodesThatCanContainWords,
    createPathFromCurrentDir("html/page-with-iframe.html"),
    [
      "первый.",
      "\n      второй\n      ",
      "3-ий ",
      "четвёртый(4) ",
      "пятый 5",
      "шестой:"
    ].concat(partsInFrame)
  );

const testDocumentWith2Frame = createCheckingIteratingThroughTextNodesFromFileWithHtmlFn(
  iterateThroughTextNodesThatCanContainWords,
  createPathFromCurrentDir("html/page-with-2-frames.html"),
  partsInFrame.concat(partsInFrame)
);

const testDocumentWithScriptAndStyleTags = createCheckingIteratingThroughTextNodesFromStringHtmlFn(
  iterateThroughTextNodesThatCanContainWords,
  `<html>
    <head></head>
    <body>
      <script>console.log(new Date());</script>
      <style>body{background: blue;}</style>
      <p>первый<em>второй</em></p>
    </body>
  </html>`,
  ["первый", "второй"]
);

const testDocumentWithDocumentFragment = () => {
  const window = new JsDom("<html><head></head><body>abcd</body></html>").window;
  const document = window.document;

  const documentFragment = new window.DocumentFragment();
  const paragraph = document.createElement("p");
  paragraph.innerHTML = "<ul><li>текст</li><li><em>курсив</em></li></ul>";
  documentFragment.appendChild(paragraph);

  document.body.appendChild(documentFragment);

  checkIteratingThroughTextNodes(
    iterateThroughTextNodesThatCanContainWords,
    document,
    ["abcd", "текст", "курсив"]
  );
};

describe("тест обхода текстовых узлов, имеющих слова", () => (
  addTestsFromTable(it, [
    ["пустой документ", testEmptyDocument],
    [
      "документ с коментариями, атрибутами, вложенными элементами, iframe, несловами",
      testDocumentWithCommentsAttributesNestedElementsAndIframeAndNonWordsText
    ],
    ["документ с 2-мя frame", testDocumentWith2Frame],
    ["пропуск встроенного стиля и сценария", testDocumentWithScriptAndStyleTags],
    ["документ с DocumentFragment", testDocumentWithDocumentFragment]
  ])
));
