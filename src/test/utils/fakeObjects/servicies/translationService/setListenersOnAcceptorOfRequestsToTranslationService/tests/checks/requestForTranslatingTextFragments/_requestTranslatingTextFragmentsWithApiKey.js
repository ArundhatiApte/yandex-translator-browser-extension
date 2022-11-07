"use strict";

import fetch from "node-fetch";


const requestTranslatingTextFragmentsWithApiKey = (
  fullUrlToMethod,
  apiKey,
  codeOfSourceLanguage,
  codeOfTargetLanguage,
  textFragments
) => {
  return fetch(fullUrlToMethod, {
    method: "POST",
    headers: {
      "Authorization": "Api-Key " + apiKey,
      "Content-Type": "application/json"
    },
    body: createBodyOfRequest(codeOfSourceLanguage, codeOfTargetLanguage, textFragments)
  });
};

const createBodyOfRequest = (codeOfSourceLanguage, codeOfTargetLanguage, textFragments) => {
  return JSON.stringify({
    sourceLanguageCode: codeOfSourceLanguage,
    targetLanguageCode: codeOfTargetLanguage,
    texts: textFragments
  });
};

export default requestTranslatingTextFragmentsWithApiKey;
