"use strict";

export default {
  urlOfService: "https://translate.api.cloud.yandex.net/translate/v2",
  urlForGettingSupportedLanguages: "/languages",
  urlForTranslatingTextFragments: "/translate",
  limitOfRequestsCount: {
    periodInMs: 1000,
    maxCount: 20
  },
  limitOfCharactersInTextOfRequestOnTranslation: 10_000
};
