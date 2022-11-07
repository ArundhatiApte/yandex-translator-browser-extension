"use strict";

import emptyApiKey from "../../../../common/js/data/emptyApiKey.js";
import { statusesOfResponse as statusesOfClientResponse } from
  "../../clientsOfServicies/ClientOfTranslationService/index.js";
import LimiterOfRequestsCountPerPeriod from "../utils/LimiterOfRequestsCountPerPeriod/index.js";
import statusesOfWrapperResponse from "./statusesOfResponse.js";


const createWrapperOfTranslationServiceClient = (options) => {
  const {
    fetch,
    translationService: {
      apiKey,
      urlOfService,
      urlForGettingSupportedLanguages,
      urlForTranslatingTextFragments,
      limitOfRequestsCount: {
        periodInMs,
        maxCount
      }
    },
    createClientOfTranslationService
  } = options;

  const client = createClientOfTranslationService({
    fetch,
    apiKey,
    urlOfService,
    urlForGettingSupportedLanguages,
    urlForTranslatingTextFragments
  });

  return {
    [_hasApiKey]: apiKey !== emptyApiKey && apiKey !== undefined,
    [_clientOfTranslationService]: client,
    [_limiterOfRequestsCountPerPeriod]: new LimiterOfRequestsCountPerPeriod(maxCount, periodInMs),
    [_requestTranslatingTextFragments]: client.requestTranslatingTextFragments,

    setApiKey(apiKey) {
      if (apiKey === emptyApiKey) {
        this[_hasApiKey] = false;
        return;
      }
      this[_hasApiKey] = true;
      this[_clientOfTranslationService].setApiKey(apiKey);
    },

    requestGettingCodesOfSupportedLanguages() {
      if (this[_hasApiKey]) {
        const performRequest = _requestGettingCodesOfSupportedLanguages.bind(this);
        return _performRequestWhenCanThenMapStatusOfResponse(this, performRequest);
      }
      return Promise.resolve(_resultWithApiKeyWasNotSettedStatus);
    },

    requestTranslatingTextFragments(codeOfSourceLangauge, codeOfTargetLanguage, textFragments) {
      if (this[_hasApiKey]) {
        const performRequest = this[_requestTranslatingTextFragments].bind(
          this[_clientOfTranslationService],
          codeOfSourceLangauge,
          codeOfTargetLanguage,
          textFragments
        );
        return _performRequestWhenCanThenMapStatusOfResponse(this, performRequest);
      }
      return Promise.resolve(_resultWithApiKeyWasNotSettedStatus);
    }
  };
};

const _hasApiKey = "_";
const _clientOfTranslationService = "_1";
const _limiterOfRequestsCountPerPeriod = "_2";
const _requestTranslatingTextFragments = "_3";

const _requestGettingCodesOfSupportedLanguages = function() {
  return this[_clientOfTranslationService].requestGettingCodesOfSupportedLanguages();
};

const _createResultOnlyWithStatus = (status) => {
  const out = Object.create(null);
  out.s = status;
  return Object.freeze(out);
};

const _resultWithApiKeyWasNotSettedStatus = _createResultOnlyWithStatus(
  statusesOfWrapperResponse.apiKeyWasNotSetted
);
const _resultWithNetworkErrorStatus = _createResultOnlyWithStatus(statusesOfWrapperResponse.networkError);
const _resultWithInvalidApiKeyStatus = _createResultOnlyWithStatus(statusesOfWrapperResponse.invalidApiKey)

const _performRequestWhenCanThenMapStatusOfResponse = async (wrapperOfTranslationServiceClient, performRequest) => {
  const limiter = wrapperOfTranslationServiceClient[_limiterOfRequestsCountPerPeriod];
  const response = await limiter.performRequestWhenCan(performRequest);
  return _mapStatusOfResponse(response);
};

const _mapStatusOfResponse = (response) => {
  const status = response.s;
  let newStatus;

  switch (status) {
    case statusesOfClientResponse_ok:
      newStatus = statusesOfWrapperResponse_ok;
      break;
    case statusesOfClientResponse_networkError:
      return _resultWithNetworkErrorStatus;
    case statusesOfClientResponse_invalidApiKey:
      return _resultWithInvalidApiKeyStatus;
    case statusesOfClientResponse_unknown:
      newStatus = statusesOfWrapperResponse_unknown;
      break;
    default:
      throw new Error("Неизвестный код ответа");
  }
  response.s = newStatus;
  return response;
};

const {
  ok: statusesOfClientResponse_ok,
  networkError: statusesOfClientResponse_networkError,
  invalidApiKey: statusesOfClientResponse_invalidApiKey,
  unknown: statusesOfClientResponse_unknown
} = statusesOfClientResponse;

const {
  ok: statusesOfWrapperResponse_ok,
  unknown: statusesOfWrapperResponse_unknown
} = statusesOfWrapperResponse;

export default createWrapperOfTranslationServiceClient;
