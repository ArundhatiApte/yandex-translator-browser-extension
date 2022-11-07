"use strict";

const uiThemes = Object.freeze({
  getAllThemes() {
    return this._;
  },
  getThemeById(id) {
    for (const theme of this._) {
      if (theme.id === id) { return theme; }
    }
    return null;
  },
  _: [
    { name: "light", id: 1, nameOfCssClass: "light" },
    { name: "dark", id: 2, nameOfCssClass: "dark" }
  ]
});

export default uiThemes;
