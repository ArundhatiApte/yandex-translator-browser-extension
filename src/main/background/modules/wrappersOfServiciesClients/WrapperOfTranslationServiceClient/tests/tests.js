"use strict";

import { createAndAddTestsFromTable } from "../../../../../../test/utils/addingTestsFromTable.js";

import createWrapperOfTranslationServiceClient from "../index.js";

import {
  checkApiKeyWasNotSettedStatus as checkApiKeyWasNotSettedStatusGsl,
  checkRequestsWithValidAndInvalidApiKey as checkRequestsWithValidAndInvalidApiKeyGsl,
  checkResponseWithUnknownStatusAndErrorMessage as checkResponseWithUnknownStatusAndErrorMessageGsl,
  checkResponseWithNetworkErrorStatus as checkResponseWithNetworkErrorStatusGsl
} from "./checks/codesOfSupportedLanguages.js";
import {
  checkApiKeyWasNotSettedStatus as checkApiKeyWasNotSettedStatusTtf,
  checkRequestsWithValidAndInvalidApiKey as checkRequestsWithValidAndInvalidApiKeyTtf,
  checkResponseWithUnknownStatusAndErrorMessage as checkResponseWithUnknownStatusAndErrorMessageTtf,
  checkResponseWithNetworkErrorStatus as checkResponseWithNetworkErrorStatusTtf
} from "./checks/codesOfSupportedLanguages.js";


describe("тест обёртки клиента сервиса переводчика", () => {
  const createTest = (check) => check.bind(null, createWrapperOfTranslationServiceClient);

  describe("запрос на получение кодов поддерживаемых языков", () =>
    createAndAddTestsFromTable(createTest, it, [
      ["ответ со статусом отсутствия установленного API ключа", checkApiKeyWasNotSettedStatusGsl],
      [
        "смена API ключа и запросы на получение кодов поддерживаемых языков",
        checkRequestsWithValidAndInvalidApiKeyGsl
      ],
      ["oтвет с неизвестным статусом и сообщением об ошибке", checkResponseWithUnknownStatusAndErrorMessageGsl],
      ["oтвет cо статусом сетевой ошибки", checkResponseWithNetworkErrorStatusGsl]
    ])
  );
  describe("запрос на перевод частей текста", () =>
    createAndAddTestsFromTable(createTest, it, [
      ["ответ со статусом отсутствия установленного API ключа", checkApiKeyWasNotSettedStatusTtf],
      ["смена API ключа и запросы на перевод частей текста", checkRequestsWithValidAndInvalidApiKeyTtf],
      ["oтвет с неизвестным статусом и сообщением об ошибке", checkResponseWithUnknownStatusAndErrorMessageTtf],
      ["oтвет cо статусом сетевой ошибки", checkResponseWithNetworkErrorStatusTtf]
    ])
  );
});
