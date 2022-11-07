"use strict";

import uWebSockets from "uWebSockets.js";
import { default as fetch, FetchError } from "node-fetch";

import StarterOfUWebSocketsServer from
  "../../../../../../test/utils/fakeObjects/servicies/utils/StarterOfUWebSocketsServer.js";
import AcceptorOfRequestsToTranslationService from
"../../../../../../test/utils/fakeObjects/servicies/translationService/AcceptorOfRequestsToTranslationService/index.js";

import { create as createClientOfTranslationService } from "./../index.js";
import factoryOfTests from "./utils/factoryOfTests.js";

import checkSendingSuccesRequestForGsl from "./checks/supportedLanguages/checkSendingSuccesRequest.js";
import checkNetworkErrorForGsl from "./checks/supportedLanguages/checkNetworkError.js";
import checkReceivingResponseWithErrorStatusOnRequestForGsl from
  "./checks/supportedLanguages/checkReceivingResponseWithErrorStatus.js";
import checkReceivingResponseWithUnknowStatusAndMessageOnRequestForGsl from
  "./checks/supportedLanguages/checkReceivingResponseWithUnknowStatusAndMessage.js";

import checkSendingSuccesRequestForTtf from "./checks/translation/checkSendingSuccesRequest.js";
import checkNetworkErrorForTtf from "./checks/translation/checkNetworkError.js";
import checkReceivingResponseWithErrorStatusOnRequestForTtf from
  "./checks/translation/checkReceivingResponseWithErrorStatus.js";
import checkReceivingResponseWithUnknowStatusAndMessageOnRequestForTtf from
  "./checks/translation/checkReceivingResponseWithUnknowStatusAndMessage.js";

import checkChangingApiKey from "./checks/checkChangingApiKey.js";


describe("тест клиента сервиса переводчика", () => {
  const uWebSocketsServer = new uWebSockets.App({});
  const starterOfUWebSocketsServer = new StarterOfUWebSocketsServer(uWebSocketsServer);

  before(async function startServerAndCreateClient() {
    const urlForGettingSupportedLanguages = "/la";
    const urlForTranslatingTextFragments = "/tr";

    factoryOfTests.setAcceptorOfRequestsToTranslationService(new AcceptorOfRequestsToTranslationService({
      uWebSocketsServer,
      urlForGettingSupportedLanguages,
      urlForTranslatingTextFragments
    }));

    const port = 2002;
    await starterOfUWebSocketsServer.listen(port);

    const apiKey = "apiKey";
    factoryOfTests.setApiKey(apiKey);

    const isItNetworkError = (error) => error instanceof FetchError;

    factoryOfTests.setClientOfTranslationService(createClientOfTranslationService({
      fetch,
      isItNetworkError,
      apiKey,
      urlOfService: "http://127.0.0.1:" + port,
      urlForGettingSupportedLanguages,
      urlForTranslatingTextFragments
    }));
  });

  describeTests(factoryOfTests);
  after(starterOfUWebSocketsServer.close.bind(starterOfUWebSocketsServer));
});

function describeTests(factoryOfTests) {
  const describeTestsOfRequest = (
    name,
    factoryOfTests,
    checkSendingSuccesRequest,
    checkNetworkError,
    checkReceivingResponseWithError,
    checkReceivingResponseWithUnknowStatusAndMessage
  ) => {
    return describe(name, () => {
      it("успешный запрос", factoryOfTests.createTest(checkSendingSuccesRequest));
      it("сетевая ошибка", factoryOfTests.createTest(checkNetworkError)),
      it("ответ с известным кодом ошибки", factoryOfTests.createTest(checkReceivingResponseWithError));
      it(
        "ответ с неизвестным кодом ошибки и сообщением",
        factoryOfTests.createTest(checkReceivingResponseWithUnknowStatusAndMessage)
      );
    });
  };

  describeTestsOfRequest(
    "запрос на получение кодов поддерживаемых языков",
    factoryOfTests,
    checkSendingSuccesRequestForGsl,
    checkNetworkErrorForGsl,
    checkReceivingResponseWithErrorStatusOnRequestForGsl,
    checkReceivingResponseWithUnknowStatusAndMessageOnRequestForGsl
  );
  describeTestsOfRequest(
    "запрос на перевод частей текста",
    factoryOfTests,
    checkSendingSuccesRequestForTtf,
    checkNetworkErrorForTtf,
    checkReceivingResponseWithErrorStatusOnRequestForTtf,
    checkReceivingResponseWithUnknowStatusAndMessageOnRequestForTtf
  );
  it("смена ключа доступа к API сервиса", factoryOfTests.createTest(checkChangingApiKey));
};
