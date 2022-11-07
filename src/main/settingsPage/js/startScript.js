"use strict";

import easyDropdownModule from "easydropdown";

import uiThemes from "../../common/js/uiThemes/index.js";
import i18nateElementIfHaveTranslation from "../../common/js/utils/i18nateElementIfHaveTranslation.js";
import createConnectionToBackgroundScript from "./utils/createConnectionToBackgroundScript.js";
import setupGui from "./utils/Gui/index.js";


const startScript = async (window, chrome) => {
  const { document } = window;
  const { runtime, i18n } = chrome;

  const connection = createConnectionToBackgroundScript(runtime);
  const settings = await connection.requestGettingSettings();

  i18nateElementIfHaveTranslation(document, "title", i18n, "settings");
  const gui = setupGui({
    document,
    uiThemes,
    initalSettings: settings,
    i18n,
    beautifySelectElement
  });
  const handler = createHandler(connection);

  gui.setRequestForUpdatingSettingsListener(handler.handleRequestForUpdatingSettings);
};

const beautifySelectElement = easyDropdownModule.default;

const createHandler = (connectionToBackgroundScript) => {
  return {
    handleRequestForUpdatingSettings(changes) {
      return connectionToBackgroundScript.requestUpdatingSettings(changes);
    }
  };
};

export default startScript;
