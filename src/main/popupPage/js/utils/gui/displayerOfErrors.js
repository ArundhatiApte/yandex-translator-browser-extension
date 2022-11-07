"use strict";

import getI18natedMessageOrDefault from "./getI18natedMessageOrDefault.js";


const _addSectionWithMessage = (document, node, innerHtml) => {
  const section = document.createElement("section");
  section.innerHTML = innerHtml;
  node.appendChild(section);
  return section;
};

const _addSectionWithI18natedMessage = (document, node, i18n, nameOfMessage, defaultMessage) => {
  return _addSectionWithMessage(document, node, getI18natedMessageOrDefault(i18n, nameOfMessage, defaultMessage));
};

const displayerOfErrors = {
  addApiKeyWasNotSettedMessage(document, node, i18n) {
    return _addSectionWithI18natedMessage(
      document,
      node,
      i18n,
      "emptyApiKeyToTs",
      "API key to translation service is empty."
    );
  },
  addNetworkErrorMessage(document, node, i18n) {
    return _addSectionWithI18natedMessage(
      document,
      node,
      i18n,
      "networkErrorWithTs",
      "Unable to connect to translation service."
    );
  },
  addInvalidApiKeyMessage(document, node, i18n) {
    return _addSectionWithI18natedMessage(
      document,
      node,
      i18n,
      "invalidApiKeyToTs",
      "Invalid API key to translation service."
    );
  },
  addCustomMessage: _addSectionWithMessage
};

export default displayerOfErrors;
