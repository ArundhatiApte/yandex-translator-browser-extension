"use strict";

const getFirstOtherUiTheme = (uiThemes, idOfAvoidedUiTheme) => {
  for (const uiTheme of uiThemes.getAllThemes()) {
    if (uiTheme.id !== idOfAvoidedUiTheme) {
      return uiTheme;
    }
  }
  throw new Error("Другие темы отсутствуют.");
};

export default getFirstOtherUiTheme;
