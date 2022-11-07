"use strict";

import wait from "./../../../../../common/js/utils/wait/wait.js";


const LimiterOfRequestsCountPerPeriod = class {
  constructor(maxCountOfRequestsPerPeriod, periodInMs) {
    if (_isNotPositiveNumber(maxCountOfRequestsPerPeriod)) {
      throw new Error("Наибольшее кол-во запросов в период.");
    }
    if (_isNotPositiveNumber(periodInMs)) {
      throw new Error("Период в миллисекундах.");
    }
    this[_maxCountOfRequestsPerPeriod] = maxCountOfRequestsPerPeriod;
    this[_periodInMs] = periodInMs;
    this[_blockingRequestsPromise] = null;
    this[_timeOfFirstRequestInCurrentPeriod] = 0;
    this[_countOfRequestsInCurrentPeriod] = 0;
  }

  performRequestWhenCan(performRequest) {
    const blockingRequestsPromise = this[_blockingRequestsPromise];
    if (blockingRequestsPromise) {
      return _performRequestAfterEndingBlock(this, blockingRequestsPromise, performRequest);
    }

    const now = getCurrentTimeInMs();
    const differenceToStartOfPeriod = now - this[_timeOfFirstRequestInCurrentPeriod];
    const period = this[_periodInMs];
    if (differenceToStartOfPeriod > period) {
      return _setNewPeriodAndPerfomRequest(this, now, performRequest);
    }

    const countOfRequestsInCurrentPeriod = this[_countOfRequestsInCurrentPeriod] += 1;
    if (countOfRequestsInCurrentPeriod <= this[_maxCountOfRequestsPerPeriod]) {
      return performRequest();
    }

    const timeToNewPeriod = period - differenceToStartOfPeriod;
    return _setBlockingRequestsPromiseAndWaitNewPeriodThenPerformRequest(this, timeToNewPeriod, performRequest);
  }
};

const _isNotPositiveNumber = (number) => (isNaN(number) || number <= 0);

const _maxCountOfRequestsPerPeriod = "_";
const _periodInMs = "_1";
const _blockingRequestsPromise = "_2";
const _timeOfFirstRequestInCurrentPeriod = "_3";
const _countOfRequestsInCurrentPeriod = "_4";

const _performRequestAfterEndingBlock = (limiter, blockingRequestsPromise, performRequest) => {
  return finallyOnPromise(blockingRequestsPromise, performRequestWhenCan.bind(limiter, performRequest));
};

const finallyOnPromise = (promise, fn) => (promise.then(fn, fn));
const performRequestWhenCan = LimiterOfRequestsCountPerPeriod.prototype.performRequestWhenCan;
const getCurrentTimeInMs = Date.now;

const _setNewPeriodAndPerfomRequest = (limiter, startTimeInMsOfPeriod, performRequest) => {
  limiter[_timeOfFirstRequestInCurrentPeriod] = startTimeInMsOfPeriod;
  limiter[_countOfRequestsInCurrentPeriod] = 1;
  return performRequest();
};

const _setBlockingRequestsPromiseAndWaitNewPeriodThenPerformRequest = (
  limiter,
  timeInMsToNewPeriod,
  performRequest
) => {
  const blockingPromise = _waitNewPeriodThenUpdateStatsAndPerformRequest(
    limiter,
    timeInMsToNewPeriod,
    performRequest
  );
  limiter[_blockingRequestsPromise] = blockingPromise;
  return blockingPromise;
};

const _waitNewPeriodThenUpdateStatsAndPerformRequest = async (limiter, timeInMsToNewPeriod, performRequest) => {
  await wait(timeInMsToNewPeriod);
  limiter[_blockingRequestsPromise] = null;
  return await _setNewPeriodAndPerfomRequest(limiter, getCurrentTimeInMs(), performRequest);
};

export default LimiterOfRequestsCountPerPeriod;
