"use strict";

import config from "../../../../../test/utils/startServersOfFakeServices/configForTranslationService.js";

export default {
  urlOfService: "http://127.0.0.1:" + config.port,
  urlForGettingSupportedLanguages: config.urlForGettingSupportedLanguages,
  urlForTranslatingTextFragments: config.urlForTranslatingTextFragments,
  limitOfRequestsCount: {
    periodInMs: 1000,
    maxCount: 20
  },
  limitOfCharactersInTextOfRequestOnTranslation: 1000
};
