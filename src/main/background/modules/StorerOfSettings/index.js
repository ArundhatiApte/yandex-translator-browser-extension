"use strict";

import {
  getAllFromStorageAsync,
  setToStorageAsync,
  removeFromStorageAsync
} from "./../../../common/js/utils/webExtensions/utilsForStorage.js";


const createStorerOfSettings = async (storage, defaults) => {
  const storedData = await getAllFromStorageAsync(storage);
  const {
    emptyApiKey,
    emptyCodeOfLanguage,
    idOfDefaultTheme
  } = defaults;

  const storerOfSettings = {
    [_storage]: storage,
    [_emptyApiKey]: emptyApiKey,
    [_emptyCodeOfLanguage]: emptyCodeOfLanguage,

    // ForDs = ForDictionaryService
    [_apiKeyForDs]: storedData[_storage_apiKeyForDs] || emptyApiKey,

    // ForTs = ForTranslationService
    [_apiKeyForTs]: storedData[_storage_apiKeyForTs] || emptyApiKey,
    [_codeOfSourceLanguageForTs]: storedData[_storage_codeOfSourceLanguageForTs] || emptyCodeOfLanguage,
    [_codeOfTargetLanguageForTs]: storedData[_storage_codeOfTargetLanguageForTs] || emptyCodeOfLanguage,

    [_idOfTheme]: storedData[_storage_idOfTheme] || idOfDefaultTheme,

    getApiKeyForDs() {
      return this[_apiKeyForDs];
    },

    getApiKeyForTs() {
      return this[_apiKeyForTs];
    },

    getCodeOfSourceLanguageForTs() {
      return this[_codeOfSourceLanguageForTs];
    },

    getCodeOfTargetLanguageForTs() {
      return this[_codeOfTargetLanguageForTs];
    },

    getIdOfTheme() {
      return this[_idOfTheme];
    },

    async updateSettings(changes) {
      const storage = this[_storage];
      const emptyApiKey = this[_emptyApiKey];
      const emptyCodeOfLanguage = this[_emptyCodeOfLanguage];

      let dataForSaving = null;
      const nameOfPropertyToConfig = {
        codeOfSourceLanguageForTs: [
          emptyCodeOfLanguage, _storage_codeOfSourceLanguageForTs, _codeOfSourceLanguageForTs
        ],
        codeOfTargetLanguageForTs: [
          emptyCodeOfLanguage, _storage_codeOfTargetLanguageForTs, _codeOfTargetLanguageForTs
        ],
        apiKeyForTs: [emptyApiKey, _storage_apiKeyForTs, _apiKeyForTs],

        apiKeyForDs: [emptyApiKey, _storage_apiKeyForDs, _apiKeyForDs]
      };

      for (const [key, value] of Object.entries(changes)) {
        const config = nameOfPropertyToConfig[key];
        if (config) {
          const [emptyValue, nameOfPropertyForStorage, nameOfPropertyForStorer] = config;

          if (value === emptyValue) {
            await removeFromStorageAsync(storage, nameOfPropertyForStorage);
            this[nameOfPropertyForStorer] = emptyValue;
          }
          else {
            if (dataForSaving) dataForSaving[nameOfPropertyForStorage] = value;
            else dataForSaving = { [nameOfPropertyForStorage]: value };
            this[nameOfPropertyForStorer] = value;
          }
          continue;
        }
        if (key === "idOfTheme") {
          if (dataForSaving) dataForSaving[_storage_idOfTheme] = value;
          else dataForSaving = { [_storage_idOfTheme]: value };
          this[_idOfTheme] = value;
          continue;
        }
        throw new Error("Свойство " + key + " отсутствует в списке параметров.");
      }
      if (dataForSaving) {
        await setToStorageAsync(storage, dataForSaving);
      }
    }
  };

  return storerOfSettings;
};

const _storage = "_";
const _emptyApiKey = "_1";
const _emptyCodeOfLanguage = "_2";

const _apiKeyForTs = "_3";
const _apiKeyForDs = "_4";
const _codeOfSourceLanguageForTs = "_5";
const _codeOfTargetLanguageForTs = "_6";
const _idOfTheme = "_7";

const _storage_apiKeyForTs = "a";
const _storage_apiKeyForDs = "b";
const _storage_codeOfSourceLanguageForTs = "c";
const _storage_codeOfTargetLanguageForTs = "d";
const _storage_idOfTheme = "e";

export default createStorerOfSettings;
