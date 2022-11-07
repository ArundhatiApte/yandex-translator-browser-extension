"use strict";

import { headerForUpdatingSettings } from "../data/messaging/messagesToBackgroundScript.js";
import defaultSuccesStatus from "../data/messaging/defaultSuccesStatus.js";
import sendRequestToBackgroundScriptAsync from "./webExtensions/sendRequestToBackgroundScriptAsync/index.js";


const requestUpdatingSettingsToBackgroundScript = async (runtime, changes) => {
  const response = await sendRequestToBackgroundScriptAsync(runtime, [headerForUpdatingSettings, changes]);
  if (response !== defaultSuccesStatus)
    throw new Error("Ответ на запрос обновления настроек к фоновому скрипту не содержит статус OK.");
};

export default requestUpdatingSettingsToBackgroundScript;
