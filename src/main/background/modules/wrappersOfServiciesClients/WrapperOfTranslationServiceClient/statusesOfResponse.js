"use strict";

import createEnum from "createEnum";


const statusesOfResponse = createEnum(
  "ok",
  "apiKeyWasNotSetted",
  "networkError",
  "invalidApiKey",
  "unknown"
);

export default statusesOfResponse;
