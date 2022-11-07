"use strict";

import createCheckingRequestWithInvalidApiKeyFn from "../utils/createCheckingRequestWithInvalidApiKeyFn.js";
import requestTranslatingTextFragmentsWithApiKey from "./_requestTranslatingTextFragmentsWithApiKey.js";


export default createCheckingRequestWithInvalidApiKeyFn((fullUrlToMethod, invalidApiKey) =>
  requestTranslatingTextFragmentsWithApiKey(fullUrlToMethod,  invalidApiKey, "cn", "kz", ["text", "fragments"])
);
