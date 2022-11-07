"use strict";

import { equal as expectEqual } from "assert/strict";

import createCurringFnFactory from "../../../../../../test/utils/createCurringFnFactory.js";
import canStringContainWords from "./index.js";


const createCheckingDetectingAbilityToHaveWordsFn = createCurringFnFactory(
  function checkDetectingAbilityToHaveWords(inputString, expectedResult) {
    return expectEqual(expectedResult, canStringContainWords(inputString));
  }
);

describe("тест определения возможности наличия слов в строек", function() {
  const  nameOfTestToInputStringAndExpectedResult = [
    ["пустая строка", "", false],
    ["буквы ASCII и Unicode", "abcdабвгд", true],
    ["цифры, пунктуация, пробелы", "0123456789 ~\`!@\"#№$;%^:&?*()-={}[]:;'|\\,<>./ \n\t", false],
    ["буквы ASCII и Unicode, цифры, пунктуация, пробелы", "abcd абвгд; 1234 ,.!?-", true]
  ];

  for (const [nameOfTest, inputString, expectedResult] of nameOfTestToInputStringAndExpectedResult) {
    it(nameOfTest, createCheckingDetectingAbilityToHaveWordsFn(inputString, expectedResult));
  }
});
