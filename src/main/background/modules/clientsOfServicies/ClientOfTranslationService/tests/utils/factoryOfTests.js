"use strict";

const factoryOfTests = {
  setApiKey(apiKey) {
    this._ = apiKey;
  },
  setClientOfTranslationService(c) {
    this._1 = c;
  },
  setAcceptorOfRequestsToTranslationService(a) {
    this._2 = a;
  },
  createTest(check) {
    return _executeTest.bind(this, check);
  }
};

const _executeTest = function(check) {
  return check(this._1, this._, this._2);
};

export default factoryOfTests;
