 "use strict";

import { equal as expectEqual, deepEqual as expectDeepEqual } from "assert/strict";

import { statusesOfResponse } from "../../../index.js";


const checkResponseOnSucces = (response, expectedData) => {
  expectEqual(response.s, statusesOfResponse_ok);
  expectDeepEqual(response.r, expectedData);
};

const statusesOfResponse_ok = statusesOfResponse.ok;

export default checkResponseOnSucces;
