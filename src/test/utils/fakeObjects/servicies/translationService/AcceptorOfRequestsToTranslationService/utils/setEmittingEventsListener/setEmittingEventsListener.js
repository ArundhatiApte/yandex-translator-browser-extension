"use strict";

import bindFunction from "../../../../../../../../main/common/js/utils/bindFunction.js";
import concatArrayBuffers from "../../../../../../utilsForArrayBuffer/concatArrayBuffers/index.js";

import parseJsonInArrayBufferWithUtf8 from "../../../../../../parseJsonInArrayBufferWithUtf8.js";
import ProtoAcceptorOfRequestBodyChunks from "../../../../_utilsForHttpServers/AcceptorOfRequestBodyChunks.js";

import {
 _onMalformedRequest,
 _onRequestForGettingSupportedLanguages,
 _onRequestForTranslatingTextFragments
} from "./../namesOfPrivateProperties.js";

import extractApiKeyFromString from "./extractApiKeyFromString/index.js";
import SenderOfSupportedLanguages from "./SenderOfSupportedLanguages.js";
import SenderOfTranslation from "./SenderOfTranslation.js";


const setEmittingEventsListener = (
  acceptorOfRequestsToServer,
  uWebSocketsServer,
  urlForGettingSupportedLanguages,
  urlForTranslatingTextFragments
) => {
  uWebSocketsServer.post(
    urlForGettingSupportedLanguages,
    bindFunction(acceptorOfRequestsToServer, acceptRequestForGettingSupportedLanguages)
  );
  uWebSocketsServer.post(
    urlForTranslatingTextFragments,
    bindFunction(acceptorOfRequestsToServer, acceptRequestForTranslatingTextFragments)
  );
};

const acceptRequestForGettingSupportedLanguages = function(response, request) {
  const valueOfHeaderWithApiKey = request.getHeader(lowerCaseHeaderForAuthorization);
  if (valueOfHeaderWithApiKey === emptyString) {
    emitMalformedRequest(this, request, response);
    return;
  }

  const apiKey = extractApiKeyFromString(valueOfHeaderWithApiKey);
  if (apiKey === null) {
    emitMalformedRequest(this, request, response);
    return;
  }
  this[_onRequestForGettingSupportedLanguages](request, apiKey, new SenderOfSupportedLanguages(response));
};

const lowerCaseHeaderForAuthorization = "authorization";
const emptyString = "";

const emitMalformedRequest = (acceptorOfRequestsToServer, request, response) => (
  acceptorOfRequestsToServer[_onMalformedRequest](request, response)
);

const acceptRequestForTranslatingTextFragments = (() => {
  const acceptRequestForTranslatingTextFragments = function(response, request) {
    const valueOfHeaderWithApiKey = request.getHeader(lowerCaseHeaderForAuthorization);
    if (valueOfHeaderWithApiKey === emptyString) {
      emitMalformedRequest(this, request, response);
      return;
    }

    const apiKey = extractApiKeyFromString(valueOfHeaderWithApiKey);
    if (apiKey === null) {
      emitMalformedRequest(this, request, response);
      return;
    }

    response.onAborted(emptyFunction);
    const acceptorOfRequestBodyChunks = new AcceptorOfRequestBodyChunks(this, request, response, apiKey);
    ProtoAcceptorOfRequestBodyChunks.setDataListener(response, acceptorOfRequestBodyChunks);
  };

  const emptyFunction = () => {};

  const AcceptorOfRequestBodyChunks = class extends ProtoAcceptorOfRequestBodyChunks {
    constructor(acceptorOfRequestsToServer, request, response, apiKey) {
      super(request, response);
      this[_acceptorOfRequestsToServer] = acceptorOfRequestsToServer;
      this[_apiKey] = apiKey;
    }
  };

  const {
    _request,
    _response
  } = AcceptorOfRequestBodyChunks._namesOfProtectedProperties;

  const {
    _onFullBodyOfRequestReceived
  } = AcceptorOfRequestBodyChunks._namesOfProtectedMethods;

  AcceptorOfRequestBodyChunks.prototype[_onFullBodyOfRequestReceived] = function _onFullBodyOfRequestReceived(fullBody) {
    let object;
    try {
      object = parseJsonInArrayBufferWithUtf8(fullBody);
    } catch(error) {
      emitMalformedRequest(this[_acceptorOfRequestsToServer], this[_request], this[_response]);
      return;
    }
    this[_acceptorOfRequestsToServer][_onRequestForTranslatingTextFragments](
      this[_request],
      this[_apiKey],
      new DataAboutText(object.sourceLanguageCode, object.targetLanguageCode, object.texts),
      new SenderOfTranslation(this[_response])
    );
  };

  const _acceptorOfRequestsToServer = Symbol();
  const _apiKey = Symbol();

  const DataAboutText = class {
    constructor(codeOfSourceLanguage, codeOfTargetLanguage, textFragments) {
      this[_codeOfSourceLanguage] = codeOfSourceLanguage;
      this[_codeOfTargetLanguage] = codeOfTargetLanguage;
      this[_textFragments] = textFragments;
    }

    get codeOfSourceLanguage() { return this[_codeOfSourceLanguage]; }
    get codeOfTargetLanguage() { return this[_codeOfTargetLanguage]; }
    get textFragments() { return this[_textFragments]; }
  };

  const _codeOfSourceLanguage = Symbol();
  const _codeOfTargetLanguage = Symbol();
  const _textFragments = Symbol();

  return acceptRequestForTranslatingTextFragments;
})();

export default setEmittingEventsListener;
