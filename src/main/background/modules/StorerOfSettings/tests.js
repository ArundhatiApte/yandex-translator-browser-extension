"use strict";

import { equal as expectEqual, rejects as expectRejects } from "assert/strict";

import { addTestsFromTable } from "./../../../../test/utils/addingTestsFromTable.js";
import FakeStorage from "./../../../../test/utils/fakeObjects/browser/FakeStorage/index.js";
import createStorerOfSettings from "./index.js";


const testGettingAddingUpdating = async () => {
  const fakeStorage = new FakeStorage();
  const settings = await createStorerOfSettings(fakeStorage, defaults);

  checkValuesInSettings(
    settings,
    emptyApiKey,
    emptyApiKey,
    emptyCodeOfLanguage,
    emptyCodeOfLanguage,
    idOfDefaultTheme
  );

  // ForTs = ForTranslatorService, ForDs = ForDictionaryService
  let apiKeyForDs = "деёж";
  let apiKeyForTs = "абвг";
  let codeOfSourceLanguageForTs = "fr";
  let codeOfTargetLanguageForTs = "de";
  let idOfTheme = 2;

  await settings.updateSettings({
    apiKeyForDs,
    apiKeyForTs,
    codeOfSourceLanguageForTs,
    codeOfTargetLanguageForTs,
    idOfTheme
  });
  checkValuesInSettings(
    settings,
    apiKeyForDs,
    apiKeyForTs,
    codeOfSourceLanguageForTs,
    codeOfTargetLanguageForTs,
    idOfTheme
  );

  apiKeyForDs = "ийклмн";
  codeOfTargetLanguageForTs = "kz";
  await settings.updateSettings({
    apiKeyForDs,
    codeOfTargetLanguageForTs
  });
  checkValuesInSettings(
    settings,
    apiKeyForDs,
    apiKeyForTs,
    codeOfSourceLanguageForTs,
    codeOfTargetLanguageForTs,
    idOfTheme
  );

  apiKeyForTs = "опрс";
  codeOfSourceLanguageForTs = "cn";
  idOfTheme = 3;
  await settings.updateSettings({
    apiKeyForTs,
    codeOfSourceLanguageForTs,
    idOfTheme
  });
  checkValuesInSettings(
    settings,
    apiKeyForDs,
    apiKeyForTs,
    codeOfSourceLanguageForTs,
    codeOfTargetLanguageForTs,
    idOfTheme
  );
};

const emptyApiKey = null;
const emptyCodeOfLanguage = null;
const idOfDefaultTheme = 1;

const defaults = Object.freeze({
  emptyApiKey,
  emptyCodeOfLanguage,
  idOfDefaultTheme
});

const checkValuesInSettings = (
  storerOfSettings,
  apiKeyForDs,
  apiKeyForTs,
  codeOfSourceLanguageForTs,
  codeOfTargetLanguageForTs,
  idOfTheme
) => {
  expectEqual(apiKeyForDs, storerOfSettings.getApiKeyForDs());

  expectEqual(apiKeyForTs, storerOfSettings.getApiKeyForTs());
  expectEqual(codeOfSourceLanguageForTs, storerOfSettings.getCodeOfSourceLanguageForTs());
  expectEqual(codeOfTargetLanguageForTs, storerOfSettings.getCodeOfTargetLanguageForTs());

  expectEqual(idOfTheme, storerOfSettings.getIdOfTheme());
};

const testCreatingWithSavedEntries = async () => {
  const fakeStorage = new FakeStorage();
  let settings = await createStorerOfSettings(fakeStorage, defaults);

  let apiKeyForDs = "деёж";
  let apiKeyForTs = "абвг";
  let codeOfSourceLanguageForTs = "fr";
  let codeOfTargetLanguageForTs = "de";
  let idOfTheme = 4;

  await settings.updateSettings({
    apiKeyForTs,
    apiKeyForDs,
    codeOfSourceLanguageForTs,
    codeOfTargetLanguageForTs,
    idOfTheme
  });
  settings = await createStorerOfSettings(fakeStorage, defaults);
  checkValuesInSettings(
    settings,
    apiKeyForDs,
    apiKeyForTs,
    codeOfSourceLanguageForTs,
    codeOfTargetLanguageForTs,
    idOfTheme
  );
};

const testThrowingErrorAtAttempToSaveAbsentingEntries = async () => {
  const settings = await createStorerOfSettings(new FakeStorage(), defaults);

  await expectRejects(() => (
    settings.updateSettings({
      apiKeyForTs: "abcd",
      codeOfTargetLanguageForTs: "kz",
      foo: "ab"
    })
  ));
};

describe("тест хранилища настроек", () => (
  addTestsFromTable(it, [
    ["получение, сохранение, обновление", testGettingAddingUpdating],
    ["создание при наличии сохранённых записей", testCreatingWithSavedEntries],
    ["выброс ошибки при сохранении отсутствующих полей", testThrowingErrorAtAttempToSaveAbsentingEntries]
  ])
));
