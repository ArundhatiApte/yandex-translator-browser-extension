"use strict";

import bindFunction from "../../common/js/utils/bindFunction.js";
import createHandlerOfRequests from "../modules/HandlerOfRequestsFromScriptsOfExtension/index.js";


const setHandlerOfRequestsFromScriptsOfExtension = (acceptorOfRequestFromScriptsOfExtension, options) => {
  const handlerOfRequests = createHandlerOfRequests(options);
  _setListenersOfRequests(acceptorOfRequestFromScriptsOfExtension, handlerOfRequests);
};

const _setListenersOfRequests = (acceptorOfRequests, handlerOfRequests) => {
  const a = acceptorOfRequests;
  const h = handlerOfRequests;
  const bnF = bindFunction;

  a.setRequestForGettingNameOfCssClassForCurrentUiTheme(
    bnF(h, h.handleRequestForGettingNameOfCssClassForCurrentUiTheme)
  );
  a.setRequestForGettingSettingsByPopupPageListener(bnF(h, h.handleRequestForGettingSettingsByPopupPage));
  a.setRequestForGettingSettingsBySettingsPageListener(bnF(h, h.handleRequestForGettingSettingsBySettingsPage));
  a.setRequestForTranslatingTextFragmentsListener(bnF(h, h.handleRequestForTranslatingTextFragments));
  a.setRequestForUpdatingSettingsListener(bnF(h, h.handleRequestForUpdatingSettings));
};

export default setHandlerOfRequestsFromScriptsOfExtension;
