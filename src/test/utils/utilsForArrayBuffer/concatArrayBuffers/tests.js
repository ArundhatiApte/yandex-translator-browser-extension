"use strict";

import { ok as expectTrue} from "assert";

import { addTestsFromTable } from "../../addingTestsFromTable.js";
import createCurringFnFactory from "../../createCurringFnFactory.js";

import areArrayBuffersEqual from "../areArrayBuffersEqual.js";
import createArrayBufferFromUint8s from "../createArrayBufferFromUint8s.js";
import concatArrayBuffers from "./index.js";


const createFnToCheckConcatenatingArrayBuffers = createCurringFnFactory(
  function checkConcatenatingArrayBuffers(uint8sOfArrayBuffers, uint8sOfResultArrayBuffer) {
    const arrayBuffers = uint8sOfArrayBuffers.map(createArrayBufferFromUint8s);
    const result = concatArrayBuffers.apply(null, arrayBuffers);

    const expectedResult = createArrayBufferFromUint8s(uint8sOfResultArrayBuffer);
    expectTrue(areArrayBuffersEqual(expectedResult, result));
  }
);

describe("тест соединения массивов байт", () => (
  addTestsFromTable(it, [
    ["2", createFnToCheckConcatenatingArrayBuffers(
      [[1, 2, 3, 4], [5, 6, 7, 8, 9]],
      [1, 2, 3, 4, 5, 6, 7, 8, 9]
    )],
    ["3", createFnToCheckConcatenatingArrayBuffers(
      [[1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14, 15, 16]],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    )],
  ])
));
