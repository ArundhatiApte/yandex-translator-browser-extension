"use strict";

import uWebSockets from "uWebSockets.js";

import StarterOfUWebSocketsServer from "../../../utils/StarterOfUWebSocketsServer.js";
import AcceptorOfRequestsToTranslationService from "../../AcceptorOfRequestsToTranslationService/index.js";
import FakeUpperCasingTranslator from "../../FakeUpperCasingTranslator/index.js";

import setListenersOnAcceptorOfRequestsToTranslationService from "../index.js";

import checkSuccesRequestForGsl from "./checks/requestForGettingSupportedLanguages/checkSuccesRequest.js";
import checkRequestWithInvalidApiKeyForGsl from
  "./checks/requestForGettingSupportedLanguages/checkRequestWithInvalidApiKey.js";
import checkSuccesRequestForTtf from "./checks/requestForTranslatingTextFragments/checkSuccesRequest.js";
import checkRequestWithInvalidApiKeyForTtf from
  "./checks/requestForTranslatingTextFragments/checkRequestWithInvalidApiKey.js";
import checkRequestWithOverflowingLimitOfCharactersTextForTtf from
  "./checks/requestForTranslatingTextFragments/checkRequestWithOverflowingLimitOfCharactersText.js";


describe("тест установки обработчиков на сервер сервиса переводчика", () => {
  const uWebSocketsServer = new uWebSockets.App({});
  const starter = new StarterOfUWebSocketsServer(uWebSocketsServer);
  const port = 2003;

  const urlForGettingSupportedLanguages = "/languages";
  const urlForTranslatingTextFragments = "/translate";
  const validApiKeys = ["first", "second"];
  const invalidApiKey = "third";
  const limitOfCharactersInText = 40;

  const Language = FakeUpperCasingTranslator.Language;
  const fakeTranslator = new FakeUpperCasingTranslator([
    new Language("cn", "Chin"),
    new Language("kz", "Kaza"),
    new Language("by", "Bela"),
    new Language("am", "Arme")
  ]);

  before(async function startAndSetupServer() {
    const acceptorOfRequests = new AcceptorOfRequestsToTranslationService({
      uWebSocketsServer,
      urlForGettingSupportedLanguages,
      urlForTranslatingTextFragments
    });
    setListenersOnAcceptorOfRequestsToTranslationService(acceptorOfRequests, {
      translator: fakeTranslator,
      validApiKeys,
      limitOfCharactersInText
    });
    await starter.listen(port);
  });

  describeTests({
    urlOfService: "http://127.0.0.1:" + port,
    urlForGettingSupportedLanguages,
    urlForTranslatingTextFragments,
    validApiKeys,
    invalidApiKey,
    limitOfCharactersInText,
    fakeTranslator
  });

  after(starter.close.bind(starter));
});

function describeTests(options) {
  const {
    urlOfService,
    urlForGettingSupportedLanguages,
    urlForTranslatingTextFragments,
    validApiKeys,
    invalidApiKey,
    limitOfCharactersInText,
    fakeTranslator
  } = options;

  const createTest = (check, argsForCheck) => check.bind(null, ...argsForCheck);

  const addTests = (cases) => {
    for (const [nameOfCase, check, argsForCheck] of cases) {
      it(nameOfCase, createTest(check, argsForCheck));
    }
  };

  describe("запрос на получение поддерживаемых языков", () => {
    const fullUrl = urlOfService + urlForGettingSupportedLanguages;
    addTests([
      ["верный запрос", checkSuccesRequestForGsl, [fullUrl, validApiKeys[0], fakeTranslator]],
      ["запрос с ошибочным ключом", checkRequestWithInvalidApiKeyForGsl, [fullUrl, invalidApiKey]]
    ]);
  });
  describe("запрос на перевод частей текста", () => {
    const fullUrl = urlOfService + urlForTranslatingTextFragments;
    addTests([
      ["верный запрос", checkSuccesRequestForTtf, [fullUrl, validApiKeys[1], fakeTranslator]],
      ["запрос с ошибочным ключом", checkRequestWithInvalidApiKeyForTtf, [fullUrl, invalidApiKey]],
      [
        "запрос с превышение ограничения кол-ва символов в тексте",
        checkRequestWithOverflowingLimitOfCharactersTextForTtf,
        [fullUrl, validApiKeys[1], limitOfCharactersInText]
      ]
    ]);
  });
}
