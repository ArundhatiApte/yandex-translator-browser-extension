"use strict";

import statusesOfResponseOnTranslation from
  "../../../../../../../common/js/data/statusesOfResponse/translation.js";


const statusOfTranslation_succes = statusesOfResponseOnTranslation.ok;

const upperCasingStringFakeClientOfTranslatorService = {
  async requestTranslationOfTextFragments(codeOfSourceLanguage, codeOfTargetLanguage, textFragments) {
    return { s: statusOfTranslation_succes, r: createStringsInUpperCase(textFragments) };
  }
};

const createStringsInUpperCase = (strings) => (strings.map(createStringInUpperCase));
const createStringInUpperCase = (string) => (string.toUpperCase());

export {
  createStringsInUpperCase as translateTextFragmentsToUpperCase,
  createStringInUpperCase as translateTextFragmentToUpperCase,
  upperCasingStringFakeClientOfTranslatorService
};
