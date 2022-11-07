"use strict";

import { ok as expectTrue } from "assert/strict";

import createConnectionToBackgroundScript from
  "./../../../../../settingsPage/js/utils/createConnectionToBackgroundScript.js";


const checkRequestingUpdatingSettings = async (fakeSenderOfMessages, acceptorOfRequests) => {
  const sendedChanges = { apiKetForDs: "абвг", idOfTheme: 2 };
  let isEventValid;

  acceptorOfRequests.setRequestForUpdatingSettingsListener((changes, sendOkStatus) => {
    isEventValid = changes === sendedChanges;
    sendOkStatus();
  });

  const connection = createConnectionToBackgroundScript(fakeSenderOfMessages);
  await connection.requestUpdatingSettings(sendedChanges);
  expectTrue(isEventValid);
};

export default checkRequestingUpdatingSettings;
