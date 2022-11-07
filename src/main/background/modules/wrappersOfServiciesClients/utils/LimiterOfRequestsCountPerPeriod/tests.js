"use strict";

import { ok as expectTrue } from "assert/strict";

import bindFunction from "./../../../../../common/js/utils/bindFunction.js";

import LimiterOfRequestsCountPerPeriod from "./index.js";


const testDelayWhenReachingLimitAndNoDelayWhenLessThanLimit = async function() {
  const requestor = {
    requestSomething() {
      this._.push(getCurrentTimeInMs());
      return Promise.resolve();
    },
    getTimestampsOfRequests() {
      return this._;
    },
    _: []
  };
  const getCurrentTimeInMs = Date.now;
  const requestSomething = bindFunction(requestor, requestor.requestSomething);

  const performNRequests = (limiterOfRequestsCountPerPeriod, performRequest, countOfRequests) => {
    const limiter = limiterOfRequestsCountPerPeriod;
    const performingRequests = [];
    for (; countOfRequests; countOfRequests -= 1) {
      performingRequests.push(limiter.performRequestWhenCan(performRequest));
    }
    return Promise.all(performingRequests);
  };

  const checkTimestampsOfRequestsOnLimitingCountPerPeriod = (() => {
    const checkTimestampsOfRequestsOnLimitingCountPerPeriod = (
      timestampsOfRequests,
      maxCountOfRequestsPerPeriod,
      periodInMs,
      maxDelayInMsBetweenRequestsInOnePeriod
    ) => {
      let firstTimestampOfCurrentPeriod = 0;
      let timestampOfPrevRequestInPeriod = timestampsOfRequests[0];

      const length = timestampsOfRequests.length;
      for (let i = 0; i < length; i += 1) {
        const timestamp = timestampsOfRequests[i];

        if (isBorderOfPeriods(i, maxCountOfRequestsPerPeriod)) {
          const differenceBetweenStartsOfPeriods = timestamp - firstTimestampOfCurrentPeriod;
          expectTrue(differenceBetweenStartsOfPeriods >= periodInMs);
          firstTimestampOfCurrentPeriod = timestamp;
          timestampOfPrevRequestInPeriod = timestamp;
          continue;
        }
        const differenceBetweenRequestsInOnePeriod = timestamp - timestampOfPrevRequestInPeriod;
        expectTrue(differenceBetweenRequestsInOnePeriod <= maxDelayInMsBetweenRequestsInOnePeriod);
        timestampOfPrevRequestInPeriod = timestamp;
      }
    };

    const isBorderOfPeriods = (nOfRequest, countOfRequestsInPeriod) => {
      return nOfRequest % countOfRequestsInPeriod === 0;
    };

    return checkTimestampsOfRequestsOnLimitingCountPerPeriod;
  })();

  const maxCountOfRequestsPerPeriod = 4;
  const periodInMs = 500;
  const limiter = new LimiterOfRequestsCountPerPeriod(maxCountOfRequestsPerPeriod, periodInMs);

  const countOfRequest = 15;
  const timeForTesting = countOfRequest / maxCountOfRequestsPerPeriod * periodInMs + 100;

  this.timeout(timeForTesting);
  this.slow(timeForTesting);

  await performNRequests(limiter, requestSomething, countOfRequest);
  checkTimestampsOfRequestsOnLimitingCountPerPeriod(
    requestor.getTimestampsOfRequests(),
    maxCountOfRequestsPerPeriod,
    periodInMs,
    periodInMs / 10
  );
};

describe("тест ограничителя кол-ва запросов за отрезок времени", () => (
  it(
    "задержка при достижении ограничения, отсутствие задержки при его соблюдении",
    testDelayWhenReachingLimitAndNoDelayWhenLessThanLimit
  )
));
