"use strict";

const checkClickForTranslatingPage = (window, panelForTranslatingPage) => {
  return new Promise((resolve, reject) => {
    const document = window.document;
    const selectors = document.body.getElementsByTagName("select");
    const selectorOfSourceLanguage = selectors[0];
    const selectorOfTargetLanguage = selectors[1];

    selectorOfSourceLanguage.selectedIndex = 2;
    const codeOfSourceLanguage = selectorOfSourceLanguage.options[2].value;

    selectorOfTargetLanguage.selectedIndex = 3;
    const codeOfTargetLanguage = selectorOfTargetLanguage.options[3].value;

    panelForTranslatingPage.setRequestForTranslatingPageListener((csl, ctl) => {
      if (csl === codeOfSourceLanguage && ctl === codeOfTargetLanguage) resolve();
      else reject(new Error("Разные коды языков"));
    });
    document.getElementById("translation-button").click();
  });
};

export default checkClickForTranslatingPage;
