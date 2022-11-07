"use strict";

const findCodeOfLanguage = (
  codesOfAvailableLanguagesWithoutRegion,
  codeOfDefaultLanguage,
  codeOfCurrentLocaleLanguage
) => {
  for (const codeOfAvailableLanguage of codesOfAvailableLanguagesWithoutRegion) {
    if (codeOfCurrentLocaleLanguage.startsWith(codeOfAvailableLanguage)) {
      return codeOfAvailableLanguage;
    }
  }
  return codeOfDefaultLanguage;
};

export default findCodeOfLanguage;
