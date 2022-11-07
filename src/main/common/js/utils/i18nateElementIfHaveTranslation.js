"use strict";

const i18nateElementIfHaveTranslation = (element, nameOfProperty, i18n, nameOfMessage) => {
  const translation = i18n.getMessage(nameOfMessage);
  if (translation) {
    element[nameOfProperty] = translation;
  }
};

export default i18nateElementIfHaveTranslation;
