"use strict";

import { ok as expectTrue } from "assert/strict";

import getFirstOtherUiTheme from "./_getFirstOtherUiTheme.js";


const checkChangingUiTheme = (window, uiThemes, idOfInitalUiTheme, gui) => {
  const uiThemeA = uiThemes.getThemeById(idOfInitalUiTheme);
  const uiThemeB = getFirstOtherUiTheme(uiThemes, idOfInitalUiTheme);
  const bodysClassList = window.document.body.classList;

  expectContainingClass(bodysClassList, uiThemeA.nameOfCssClass);
  expectNotContainingClass(bodysClassList, uiThemeB.nameOfCssClass);

  const selectorOfUiTheme = window.document.getElementById("ui-theme-selector");
  const Event = window.Event;
  selectUiTheme(selectorOfUiTheme, Event, uiThemeB);
  expectNotContainingClass(bodysClassList, uiThemeA.nameOfCssClass);
  expectContainingClass(bodysClassList, uiThemeB.nameOfCssClass);

  selectUiTheme(selectorOfUiTheme, Event, uiThemeA);
  expectContainingClass(bodysClassList, uiThemeA.nameOfCssClass);
  expectNotContainingClass(bodysClassList, uiThemeB.nameOfCssClass);
};

const expectContainingClass = (classList, className) => {
  if (!className) return;
  expectTrue(classList.contains(className));
};

const expectNotContainingClass = (classList, className) => {
  if (!className) return;
  expectTrue(!classList.contains(className));
};

const selectUiTheme = (selectorOfUiTheme, Event, uiTheme) => {
  selectorOfUiTheme.value = uiTheme.id;
  selectorOfUiTheme.dispatchEvent(new Event("change"));
};

export default checkChangingUiTheme;
