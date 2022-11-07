"use strict";

const bindFunction = (context, fn) => (fn.bind(context));
export default bindFunction;
