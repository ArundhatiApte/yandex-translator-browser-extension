"use strict";

const config = {
  port: 20_000,
  supportedLanguages: [
    // isoCode, nameInThatLanguage
    ["aa", "Afaraf"],
    ["bh", "भोजपुरी"],
    ["ch", "Chamoru"],
    ["de", "Deutsch"]
  ],
  validApiKeys: [
    "d4bbd97f78c11bdb5cb9",
    "6ddf8fc02cc41d3153c4"
  ],
  urlForGettingSupportedLanguages: "/languages",
  urlForTranslatingTextFragments: "/translate",
  limitOfCharactersInText: 1000
};

export default config;
