"use strict";

import statusesOfResponseOnTranslation from
  "../../../../../../../../common/js/data/statusesOfResponse/translation.js";


const statusOfTranslation_succes = statusesOfResponseOnTranslation.ok;

const LimitingLengthOfTextFakeClientOfTranslatorService = class {
  constructor(maxLengthOfTextInRequest, translateTextFragmentsSync, onLimit) {
    this[_maxLengthOfTextInRequest] = maxLengthOfTextInRequest;
    this[_translateTextFragments] = translateTextFragmentsSync;
    this[_onLimit] = onLimit;
  }

  async requestTranslationOfTextFragments(codeOFSourceLanguage, codeOfTargetLanguage, textFragments) {
    if (isTotalLengthOfStringsMoreThanLimit(textFragments, this[_maxLengthOfTextInRequest])) {
      this[_onLimit]();
      throw new Error("Ограничение символов в запросе на перевод.");
    }
    return { s: statusOfTranslation_succes, r: this[_translateTextFragments](textFragments) };
  }
};

const _maxLengthOfTextInRequest = Symbol();
const _translateTextFragments = Symbol();
const _onLimit = Symbol();

const isTotalLengthOfStringsMoreThanLimit = (strings, limit) => {
  let currentCount = 0;
  for (const string of strings) {
    currentCount += string.length;
    if (currentCount > limit) {
      return true;
    }
  }
  return false;
};

export default LimitingLengthOfTextFakeClientOfTranslatorService;
