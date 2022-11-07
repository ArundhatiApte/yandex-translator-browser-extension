"use strict";

import { equal as expectEqual } from "assert/strict";

import emptyApiKey from "../../../../../common/js/data/emptyApiKey.js";
import emptyCodeOfLanguage from "../../../../../common/js/data/emptyCodeOfLanguage.js";

import createConnectionFromPopupPage from "../../../../../popupPage/js/utils/createConnectionToBackgroundScript.js";


const checkRequestingNameOfCssClassForCurrentUiTheme = async (
  senderOfMessagesToBackgroundScript,
  storerOfSettings,
  uiThemes
) => {
  const expectedNameOfCssClass = uiThemes.getThemeById(storerOfSettings.getIdOfTheme()).nameOfCssClass;
  const connection = createConnectionFromPopupPage(senderOfMessagesToBackgroundScript);
  const nameOfCssClass = await connection.requestGettingNameOfCssClassForCurrentUiTheme();
  expectEqual(expectedNameOfCssClass, nameOfCssClass);
};

export default checkRequestingNameOfCssClassForCurrentUiTheme;
