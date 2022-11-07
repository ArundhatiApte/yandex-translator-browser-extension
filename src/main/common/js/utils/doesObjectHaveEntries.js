"use strict";

const doesObjectHaveEntries = (object) => {
  for (const key in object) {
    return true;
  }
  return false;
};

export default doesObjectHaveEntries;
