"use strict";

import { equal as expectEqual } from "assert/strict";

import createCurringFnFactory from "../../../../../../createCurringFnFactory.js";
import isTotalLengthOfStringsMoreThanN from "./index.js";


const createTest = createCurringFnFactory(
  function checkDetectingLimit(strings, maxTotalLength, expectedResult) {
    return expectEqual(expectedResult, isTotalLengthOfStringsMoreThanN(strings, maxTotalLength));
  }
);

describe("тест проверки ограничения кол-ва символов в строках", () => {
  const strings = ["a", "bc", "def", "ghij"];
  const cases = [
    ["меньше", 11, false],
    ["равно", 10, false],
    ["больше", 9, true]
  ];

  for (const [nameOfTest, maxLength, expectedResult] of cases) {
    it(nameOfTest, createTest(strings, maxLength, expectedResult));
  }
});
