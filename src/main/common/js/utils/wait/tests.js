"use strict";

import { ok as expectTrue } from "assert";

import wait from "./wait.js";


const test = async () => {
  const unixTimeAtStart = Date.now();
  const delayInMs = 234;
  await wait(delayInMs);
  const unixTimeAtEnd = Date.now();
  expectTrue(unixTimeAtEnd - unixTimeAtStart >= delayInMs);
};

describe("тест функции ожидания", () => (
  it("т", test)
));
