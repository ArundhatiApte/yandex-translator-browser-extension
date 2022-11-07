"use strict";

import { FakeUpperCasingTranslator, Language }
  from "../fakeObjects/servicies/translationService/FakeUpperCasingTranslator/index.js";
import HttpServerOfTranslationService from
  "../fakeObjects/servicies/translationService/HttpServerOfTranslationService/index.js";


const main = async () => {
  const configForTranslationService = (await import("./configForTranslationService.js")).default;

  const serverOfTranslationService = createServerOfTranslationService(configForTranslationService);
  await serverOfTranslationService.listen(configForTranslationService.port);
};

const createServerOfTranslationService = (configForTranslationService) => {
  const {
    supportedLanguages,
    urlForGettingSupportedLanguages,
    urlForTranslatingTextFragments,
    validApiKeys,
    limitOfCharactersInText,
  } = configForTranslationService;

  const languages = supportedLanguages.map(
    ([isoCode, nameInThatLanguage]) => new Language(isoCode, nameInThatLanguage)
  );
  const fakeTranslator = new FakeUpperCasingTranslator(languages);
  return new HttpServerOfTranslationService({
    urlForGettingSupportedLanguages,
    urlForTranslatingTextFragments,
    translator: fakeTranslator,
    validApiKeys,
    limitOfCharactersInText
  });
};

main();
