"use strict";

export const addTestsFromTable = (addTest, nameOfTestToCheckingFn) => {
  for (const [nameOfTest, checkingFn] of nameOfTestToCheckingFn) {
    addTest(nameOfTest, checkingFn);
  }
};

export const createAndAddTestsFromTable = (createTest, addTest, nameOfTestToCheckingFn) => {
  for (const [nameOfTest, checkingFn] of nameOfTestToCheckingFn) {
    addTest(nameOfTest, createTest(checkingFn));
  }
};
