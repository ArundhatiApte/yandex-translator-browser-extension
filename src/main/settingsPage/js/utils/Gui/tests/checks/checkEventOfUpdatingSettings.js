"use strict";

import { deepEqual as expectDeepEqual } from "assert"; // без strict

import emptyApiKey from "../../../../../../common/js/data/emptyApiKey.js";
import getFirstOtherUiTheme from "./_getFirstOtherUiTheme.js";


const checkEventOfUpdatingSettings = async (window, uiThemes, idOfInitalUiTheme, gui) => {
  const document = window.document;
  const selectorOfUiTheme = document.getElementById("ui-theme-selector");
  const inputOfApiKeyForTs = document.getElementById("api-key-for-ts-input");
  const inputOfApiKeyForDs = document.getElementById("api-key-for-ds-input");
  const savingButton = document.getElementById("saving-button");

  {
    const idOfNewUiTheme = getFirstOtherUiTheme(uiThemes, idOfInitalUiTheme).id;
    const newApiKeyForTs = "translation-service";

    selectorOfUiTheme.value = idOfNewUiTheme;
    inputOfApiKeyForTs.value = newApiKeyForTs;
    setCurrentValue(inputOfApiKeyForDs);

    await checkChangesInEventOfUpdatingSettings(savingButton, gui, {
      idOfTheme: idOfNewUiTheme,
      apiKeyForTs: newApiKeyForTs
    });
  }
  {
    const newApiKeyForDs = "dictionary-service";
    setCurrentValue(selectorOfUiTheme);
    setCurrentValue(inputOfApiKeyForTs);
    inputOfApiKeyForDs.value = newApiKeyForDs;

    await checkChangesInEventOfUpdatingSettings(savingButton, gui, {
      apiKeyForDs: newApiKeyForDs
    });
  }
  {
    inputOfApiKeyForTs.value = inputOfApiKeyForDs.value = "";

    await checkChangesInEventOfUpdatingSettings(savingButton, gui, {
      apiKeyForTs: emptyApiKey,
      apiKeyForDs: emptyApiKey,
    });
  }
};

const setCurrentValue = (element) => element.value = element.value;

const checkChangesInEventOfUpdatingSettings = (savingButton, gui, expectedChanges) => {
  return new Promise((resolve, reject) => {
    gui.setRequestForUpdatingSettingsListener((changes) => {
      try {
        expectDeepEqual(expectedChanges, changes);
      } catch(error) {
        reject(error);
        return;
      }
      resolve();
    });
    savingButton.click();
  });
};

export default checkEventOfUpdatingSettings;
