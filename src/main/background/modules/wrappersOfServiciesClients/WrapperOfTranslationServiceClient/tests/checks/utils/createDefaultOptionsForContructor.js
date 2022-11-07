"use strict";

const createDefaultOptionsForContructor = () => {
  return {
    fetch: emptyFunction,
    translationService: {
      urlOfService: "https://abcd.ef",
      urlForGettingSupportedLanguages: "/l",
      urlForTranslatingTextFragments: "/t",
      limitOfRequestsCount: {
        periodInMs: 1000,
        maxCount: 10
      }
    },
    createClientOfTranslationService() {
      return {};
    }
  };
};

const emptyFunction = () => {};

export default createDefaultOptionsForContructor;
