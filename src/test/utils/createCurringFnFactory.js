"use strict";

const createCurringFnFactory = (fn) => {
  return bindArgsToFn.bind(null, fn);
};

const bindArgsToFn = (fn, ...args) => {
  return fn.bind(null, ...args);
};

export default createCurringFnFactory;
