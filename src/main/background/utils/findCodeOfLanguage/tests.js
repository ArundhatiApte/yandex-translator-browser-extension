"use strict";

import { equal as expectEqual } from "assert/strict";

import createCurringFnFactory from "../../../../test/utils/createCurringFnFactory.js";
import findCodeOfLanguage from "./index.js";


const createCheckingFindingCodeOfLanguageFn = createCurringFnFactory(
  function checkFindingCodeOfLanguage(
    codesOfAvailableLanguagesWithoutRegion,
    codeOfDefaultLanguage,
    codeOfCurrentLocaleLanguage,
    expectedResult
  ) {
    return expectEqual(expectedResult, findCodeOfLanguage(
      codesOfAvailableLanguagesWithoutRegion,
      codeOfDefaultLanguage,
      codeOfCurrentLocaleLanguage
    ));
  }
);

describe("тест получения кода подходщего языка для целевой локали", () => {
  const codesOfAvailableLanguagesWithoutRegion = ["aa", "bb", "cc", "dd"];
  const codeOfDefaultLanguage = "aa";
  const cases = [
    ["по умолчанию", "ee", codeOfDefaultLanguage],
    ["полностью совпавший, без региона", "cc", "cc"],
    ["совпавший по языку, различный по региону", "cc-vv", "cc"]
  ];
  for (const [name, codeOfCurrentLocaleLanguage, expectedResult] of cases)
    it(name, createCheckingFindingCodeOfLanguageFn(
      codesOfAvailableLanguagesWithoutRegion,
      codeOfDefaultLanguage,
      codeOfCurrentLocaleLanguage,
      expectedResult
    ));
});

