"use strict";

import fetch from "node-fetch";


const requestGettingSupportedLanguagesWithApiKey = (fullUrlToMethod, apiKey) => {
  return fetch(fullUrlToMethod, {
    method: "POST",
    headers: {
      "Authorization": "Api-Key " + apiKey
    }
  });
};

export default requestGettingSupportedLanguagesWithApiKey;
