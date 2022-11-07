"use strict";

import { ok as expectTrue } from "assert";

import createCurringFnFactory from "../../createCurringFnFactory.js";
import areArrayBuffersEqual from "../areArrayBuffersEqual.js";
import createArrayBufferFromUint8s from "../createArrayBufferFromUint8s.js";
import insertArrayBufferToAnotherUnsafe from "./index.js";


const createCheckingInsertingtArrayBufferToAnotherFn = createCurringFnFactory(
  function checkInsertingArrayBufferToAnother(
    sourceUint8s,
    startIndexInSource,
    insertedArrayBuffer,
    resultArrayBuffer
  ) {
    insertArrayBufferToAnotherUnsafe(sourceUint8s, startIndexInSource, insertedArrayBuffer);
    expectTrue(areArrayBuffersEqual(sourceUint8s.buffer, resultArrayBuffer));
  }
);

describe("запись байт в массив", () => {
  const nameOfTestToDataForCase = [
    ["хвост", [1, 2, 3, 4, 0, 0, 0, 0, 0], 4, [5, 6], [1, 2, 3, 4, 5, 6, 0, 0, 0]],
    ["без хвоста", [1, 2, 3, 4, 0, 0, 0, 0], 4, [5, 6, 7, 8], [1, 2, 3, 4, 5, 6, 7, 8]]
  ];

  const createTest = (uint8sOfSource, startIndexInSource, uint8sOfInserted, uint8sOfResult) => {
    return createCheckingInsertingtArrayBufferToAnotherFn(
      new Uint8Array(uint8sOfSource),
      startIndexInSource,
      createArrayBufferFromUint8s(uint8sOfInserted),
      createArrayBufferFromUint8s(uint8sOfResult)
    );
  };

  for (const entry of nameOfTestToDataForCase) {
    const [nameOfTest, uint8sOfSource, startIndexInSource, uint8sOfInserted, uint8sOfResult] = entry;
    it(nameOfTest, createTest(uint8sOfSource, startIndexInSource, uint8sOfInserted, uint8sOfResult));
  }
});
