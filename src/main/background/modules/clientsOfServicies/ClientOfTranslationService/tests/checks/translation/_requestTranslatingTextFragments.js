"use strict";

const requestTranslatingTextFragments = (clientOfTranslationService) => (
  clientOfTranslationService.requestTranslatingTextFragments("cn", "kz", ["list", "of", "strings"])
);

export default requestTranslatingTextFragments;
