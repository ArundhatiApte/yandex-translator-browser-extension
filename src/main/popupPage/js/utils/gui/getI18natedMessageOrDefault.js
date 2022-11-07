"use strict";

const getI18natedMessageOrDefault = (i18n, nameOfMessage, defaultMessage) => {
  const message = i18n.getMessage(nameOfMessage);
  return message !== "" ? message : defaultMessage;
};

export default getI18natedMessageOrDefault;
