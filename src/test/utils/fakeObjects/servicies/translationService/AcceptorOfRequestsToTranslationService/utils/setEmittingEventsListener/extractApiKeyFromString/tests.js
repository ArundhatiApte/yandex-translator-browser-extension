"use strict";

import { strictEqual as expectEqual } from "assert";

import { addTestsFromTable } from "../../../../../../../addingTestsFromTable.js";
import createCurringFnFactory from "../../../../../../../createCurringFnFactory.js";
import extractApiKeyFromString from "./index.js";


const createCheckingExtractingApiKeyFromString = createCurringFnFactory(
  function checkExtractingApiKeyFromString(input, expectedResult) {
    return expectEqual(expectedResult, extractApiKeyFromString(input));
  }
);

describe("тест извлечения ключа к API сервиса переводчика из значения заголовка", () => {
  const cases = [
    ["пустая строка", "", null],
    ["ошибочный формат", "abcdef", null],
    ["короткая строка с верным форматом", "Api-Key ", null],
    ["верный формат", "Api-Key abcdef", "abcdef"]
  ];

  for (const [nameOfTest, inputString, expectedResult] of cases) {
    it(nameOfTest, createCheckingExtractingApiKeyFromString(inputString, expectedResult));
  }
});

