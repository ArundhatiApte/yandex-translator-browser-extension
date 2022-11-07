"use strict";

import createCheckingRequestWithInvalidApiKeyFn from "../utils/createCheckingRequestWithInvalidApiKeyFn.js";
import requestGettingSupportedLanguagesWithApiKey from "./_requestGettingSupportedLanguagesWithApiKey.js";


export default createCheckingRequestWithInvalidApiKeyFn(requestGettingSupportedLanguagesWithApiKey);
