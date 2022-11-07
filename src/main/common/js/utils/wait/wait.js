"use strict";

const wait = (timeInMs) => (
  new Promise((resolve) => (
    setTimeout(resolve, timeInMs)
  ))
);

export default wait;
