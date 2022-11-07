"use strict";

import uWs from "uWebSockets.js";

import setupTests from "../../../_utilsForHttpServers/setupTests.js";
import AcceptorOfRequestsToTranslationService from "../index.js";

import checkSendingValidRequestForGsl from "./checks/checkSendingValidRequestForGettingSupportedLanguages.js";
import checkSendingValidRequestForTtf from "./checks/checkSendingValidRequestForTranslatingTextFragments.js";

import {
  checkReceivingErrorForGsl,
  checkReceivingErrorForTtf
} from "./checks/checkingReceivingErrors.js";

import checkSendingRequestWithoutApiKey from "./checks/checkSendingRequestWithoutApiKey.js";


(() => {
  const uWebSocketsServer = new uWs.App({});
  const port = 2001;

  const urlForGettingSupportedLanguages = "/languages";
  const urlForTranslatingTextFragments = "/translate";

  const acceptor = new AcceptorOfRequestsToTranslationService({
    uWebSocketsServer,
    urlForGettingSupportedLanguages,
    urlForTranslatingTextFragments
  });

  const describeTests = () => {
    const urlToServer = "http://127.0.0.1:" + port;
    const createTestFromUrl = (check, url) => (check.bind(null, url, acceptor));

    describe("запрос на получение поддерживаемых языков", () => {
      const url = urlToServer + urlForGettingSupportedLanguages;
      it("верный запрос и ответ", createTestFromUrl(checkSendingValidRequestForGsl, url));
      it("запрос без ключа к API", createTestFromUrl(checkSendingRequestWithoutApiKey, url));
      it("ответ с описанием ошибки", createTestFromUrl(checkReceivingErrorForGsl, url));
    });

    describe("запрос на перевод частей текста", () => {
      const url = urlToServer + urlForTranslatingTextFragments;
      it("верный запрос и ответ", createTestFromUrl(checkSendingValidRequestForTtf, url));
      it("запрос без ключа к API", createTestFromUrl(checkSendingRequestWithoutApiKey, url));
      it("ответ с описанием ошибки", createTestFromUrl(checkReceivingErrorForTtf, url));
    });
  };

  setupTests({
    name: "тест принимателя запросов http сервера службы переводчика",
    port,
    uWebSocketsServer,
    describeTests
  });
})();
