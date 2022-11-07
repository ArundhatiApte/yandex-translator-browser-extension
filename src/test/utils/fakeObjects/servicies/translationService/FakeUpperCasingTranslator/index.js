"use strict";

import createEnum from "createEnum";


const FakeUpperCasingTranslator = class {
  constructor(supportedLanguages) { // language - { code, name } name in eng
    this[_supportedLanguages] = supportedLanguages;
  }

  getSupportedLanguages() {
    return this[_supportedLanguages];
  }

  translateTextFragments(codeOfSourceLanguage, codeOfTargetLanguage, textFragments) {
    const supportedLanguages = this[_supportedLanguages];
    if (_haveNotLanguageByCode(supportedLanguages, codeOfSourceLanguage)) {
      return results_noSuchSourceLanguage;
    }
    if (_haveNotLanguageByCode(supportedLanguages, codeOfTargetLanguage)) {
      return results_noSuchTargetLanguage;
    }
    return [
      statusesOfTranslation_ok,
      translateStringsToUpperCase(textFragments)
    ];
  }
};

const _supportedLanguages = Symbol();

const _haveNotLanguageByCode = (languages, codeOfLanguage) => {
  for (const entry of languages) {
    if (entry.code === codeOfLanguage) {
      return false;
    }
  }
  return true;
};

const statusesOfTranslation = createEnum("ok", "noSuchSourceLanguage", "noSuchTargetLanguage");
FakeUpperCasingTranslator.statusesOfTranslation = statusesOfTranslation;

const createResultOfTranslationOnlyWithStatus = (status) => (Object.freeze([status]));

const results_noSuchSourceLanguage = createResultOfTranslationOnlyWithStatus(
  statusesOfTranslation.noSuchSourceLanguage
);
const results_noSuchTargetLanguage = createResultOfTranslationOnlyWithStatus(
  statusesOfTranslation.noSuchTargetLanguage
);

const Language = class {
  constructor(code, name) {
    this[_code] = code;
    this[_name] = name;
  }

  get code() {
    return this[_code];
  }

  get name() {
    return this[_name];
  }
};
FakeUpperCasingTranslator.Language = Language;

const _code = Symbol();
const _name = Symbol();

const statusesOfTranslation_ok = statusesOfTranslation.ok;

const translateStringsToUpperCase = (strings) => (strings.map(translateStringToUpperCase));
const translateStringToUpperCase = (string) => (string.toUpperCase());

export {
  FakeUpperCasingTranslator as default,
  FakeUpperCasingTranslator,
  statusesOfTranslation,
  Language
};
