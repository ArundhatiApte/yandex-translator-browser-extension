"use strict";

import { equal as expectEqual, deepEqual as expectDeepEqual } from "assert/strict";

import createCurringFnFactory from "../../../../createCurringFnFactory.js";
import { addTestsFromTable } from "../../../../addingTestsFromTable.js";
import FakeUpperCasingTranslator from "./index.js";


describe("тест поддельного переводчика", () => {
  const {
    statusesOfTranslation,
    Language
  } = FakeUpperCasingTranslator;

  const testTranslatingTextFragmentsToUpperCase = () => {
    const fakeTranslator = new FakeUpperCasingTranslator([
      cnLanguage,
      kzLanguage,
      frLanguage,
      ruLanguage
    ]);

    const checkTranslatingTextFragments = (
      translator,
      codeOfSourceLanguage,
      codeOfTargetLanguage,
      textFragments,
      translatedTextFragments
    ) => {
      const [status, resultTextFragments] = translator.translateTextFragments(
        codeOfSourceLanguage,
        codeOfTargetLanguage,
        textFragments
      );
      expectEqual(status, statusesOfTranslation_ok);
      expectDeepEqual(translatedTextFragments, resultTextFragments);
    };

    const statusesOfTranslation_ok = statusesOfTranslation.ok;

    const cases = [
      ["cn", "fr", ["a", "bc", "def"], ["A", "BC", "DEF"]],
      ["kz", "ru", ["а", "бв", "где"], ["А", "БВ", "ГДЕ"]]
    ];

    for (const [sl, tl, tf, ttf] of cases) {
      checkTranslatingTextFragments(fakeTranslator, sl, tl, tf, ttf);
    }
  };

  const cnLanguage = new Language("cn", "Chin");
  const kzLanguage = new Language("kz", "Kaza");
  const frLanguage = new Language("fr", "Fren");
  const ruLanguage = new Language("ru", "Rusi");

  const createCheckingTranslatingOnlyWithStatusFn = createCurringFnFactory(
    function checkTranslatingOnlyWithStatus(
      supportedLanguages,
      codeOfSourceLanguage,
      codeOfTargetLanguage,
      textFragments,
      expectedStatus
    ) {
      const fakeTranslator = new FakeUpperCasingTranslator(supportedLanguages);
      const result = fakeTranslator.translateTextFragments(
        codeOfSourceLanguage,
        codeOfTargetLanguage,
        textFragments,
      );
      expectEqual(1, result.length);
      expectEqual(expectedStatus, result[0]);
    }
  );

  const testNoSuchSourceLanguageResponse = createCheckingTranslatingOnlyWithStatusFn(
    [cnLanguage, kzLanguage],
    "by",
    "kz",
    ["abcd", "e"],
    statusesOfTranslation.noSuchSourceLanguage
  );

  const testNoSuchTargetLanguageResponse = createCheckingTranslatingOnlyWithStatusFn(
    [cnLanguage, frLanguage],
    "cn",
    "by",
    ["text", "fragments"],
    statusesOfTranslation.noSuchTargetLanguage
  );

  addTestsFromTable(it, [
    ["перевод частей текста в верхний регистр", testTranslatingTextFragmentsToUpperCase],
    ["отсутствие исходного языка", testNoSuchSourceLanguageResponse],
    ["отсутствие целевого языка", testNoSuchTargetLanguageResponse]
  ]);
});
