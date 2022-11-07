"use strict";

import statusesOfResponseOnTranslation from "../../../../../common/js/data/statusesOfResponse/translation.js";
import FakeSenderOfMessagesToBackgroundScript from
  "../../../../../../test/utils/fakeObjects/browser/messaging/FakeSenderOfMessagesToBackgroundScript/index.js";


const statusesOfResponseOnTranslation_ok = statusesOfResponseOnTranslation.ok;

const fakeTranslatingTextMessagerToBackgroundScript = new FakeSenderOfMessagesToBackgroundScript();
fakeTranslatingTextMessagerToBackgroundScript._setOnMessageSendedListener((message, giveResponse) => {
  const textFragments = message[3];
  giveResponse({
    s: statusesOfResponseOnTranslation_ok,
    r: translateStringsToUpperCase(textFragments)
  });
});

const translateStringsToUpperCase = (strings) => (strings.map(translateStringToUpperCase));
const translateStringToUpperCase = (string) => (string.toUpperCase());

export {
  fakeTranslatingTextMessagerToBackgroundScript,
  translateStringToUpperCase
};
