"use strict";

import { strictEqual as expectEqual } from "assert";

import { addTestsFromTable } from "../../addingTestsFromTable.js";
import createCurringFnFactory from "../../createCurringFnFactory.js";
import creatArrayBufferFromUint8s from "../createArrayBufferFromUint8s.js";
import areArrayBuffersEqualByIndex from "./index.js";


const createFnToCheckComparingArrayBuffersByIndex = createCurringFnFactory(
  function checkComparingArrayBuffersByIndex(
    aUint8s,
    startIndexInA,
    bUint8s,
    startIndexInB,
    areEqual
  ) {
    const result = areArrayBuffersEqualByIndex(
      creatArrayBufferFromUint8s(aUint8s),
      startIndexInA,
      creatArrayBufferFromUint8s(bUint8s),
      startIndexInB
    );
    expectEqual(areEqual, result);
  }
);

describe("тест сравнения массивов байт по индексам", () => (
  addTestsFromTable(it, [
    ["равенство", createFnToCheckComparingArrayBuffersByIndex(
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      2,
      [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      4,
      true
    )],
    ["различие (содержимое)", createFnToCheckComparingArrayBuffersByIndex(
      [1, 2, 3, 4],
      1,
      [0, 1, 2, 3, 5],
      2,
      false
    )],
    ["различие (длина)", createFnToCheckComparingArrayBuffersByIndex(
      [1, 2, 3, 4],
      1,
      [0, 1, 2, 3, 4, 5],
      2,
      false
    )],
  ])
));
