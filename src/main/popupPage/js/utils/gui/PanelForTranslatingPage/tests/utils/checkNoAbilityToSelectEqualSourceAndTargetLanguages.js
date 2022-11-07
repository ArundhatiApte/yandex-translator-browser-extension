"use strict";

import { ok as expectTrue, equal as expectEqual } from "assert/strict";


const checkNoAbilityToSelectEqualSourceAndTargetLanguages = (window, languages, panelForTranslatingPage) => {
  expectTrue(languages.length >= 5);
  const Event = window.Event;
  const selectors = window.document.body.getElementsByTagName("select");
  const selectorOfSourceLanguage = selectors[0];
  const selectorOfTargetLanguage = selectors[1];

  checkNoAbilityToSelectEqualLanguageInOtherSelector(
    selectorOfSourceLanguage,
    codeOfLanguage(languages[1]),
    Event,
    selectorOfTargetLanguage,
    codeOfLanguage(languages[2])
  );
  checkNoAbilityToSelectEqualLanguageInOtherSelector(
    selectorOfTargetLanguage,
    codeOfLanguage(languages[3]),
    Event,
    selectorOfSourceLanguage,
    codeOfLanguage(languages[4])
  );
};

const codeOfLanguage = (language) => language[0];

const checkNoAbilityToSelectEqualLanguageInOtherSelector = (
  sourceSelector,
  codeOfSelectedLanguage,
  Event,
  otherSelector,
  codeOfLastSelectedLanguage
) => {
  const option = getOptionByValue(otherSelector.options, codeOfSelectedLanguage);
  const style = option.style;

  changeOption(sourceSelector, Event, codeOfSelectedLanguage);
  expectElementHidden(style);
  changeOption(sourceSelector, Event, codeOfLastSelectedLanguage);
  expectElementVisible(style);
};

const getOptionByValue = (options, value) => {
  for (const option of options) {
    if (option.value === value) return option;
  }
  throw new Error("Отсутствие.");
};

const changeOption = (selector, Event, newValue) => {
  selector.value = newValue;
  selector.dispatchEvent(new Event("change"));
};

const expectElementHidden = (style) => expectEqual("none", style.display);
const expectElementVisible = (style) => expectEqual("block", style.display);

export default checkNoAbilityToSelectEqualSourceAndTargetLanguages;
