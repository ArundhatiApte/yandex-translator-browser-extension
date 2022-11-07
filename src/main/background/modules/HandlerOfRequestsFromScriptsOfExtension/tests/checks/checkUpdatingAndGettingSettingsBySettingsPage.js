"use strict";

import { deepEqual as expectDeepEqual } from "assert/strict";

import createConnectionFromSettingsPage from
  "../../../../../settingsPage/js/utils/createConnectionToBackgroundScript.js";


const checkUpdatingAndGettingSettingsBySettingsPage = async (senderOfMessagesToBackgroundScript) => {
  const connection = createConnectionFromSettingsPage(senderOfMessagesToBackgroundScript);
  const idOfTheme = 2;
  await checkUpdatingAndGettingSettings(connection, "api-key-for-translation-s", "dictionary-s", idOfTheme);
  await checkUpdatingAndGettingSettings(connection, "next", "other", 3);
};

const checkUpdatingAndGettingSettings = async (
  connectionToBackgroundScript,
  apiKeyForTs,
  apiKeyForDs,
  idOfTheme
) => {
  const savedSettings = {
    apiKeyForTs,
    apiKeyForDs,
    idOfTheme
  };
  await connectionToBackgroundScript.requestUpdatingSettings(savedSettings);
  const receivedSettings = await connectionToBackgroundScript.requestGettingSettings();
  expectDeepEqual(savedSettings, receivedSettings);
};

export default checkUpdatingAndGettingSettingsBySettingsPage;
