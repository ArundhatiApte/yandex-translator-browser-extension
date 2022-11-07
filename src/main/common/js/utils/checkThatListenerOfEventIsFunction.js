"use strict";

const checkThatListenerOfEventIsFunction = (listener) => {
  if (typeof listener !== typeOfFunction) {
    throw new Error("Обработчик события является нефункцией.");
  }
};

const typeOfFunction = typeof checkThatListenerOfEventIsFunction;

export default checkThatListenerOfEventIsFunction;
