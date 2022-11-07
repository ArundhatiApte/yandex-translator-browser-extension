"use strict";

import { isDeepStrictEqual as areDeepEqual } from "util";

import checkResponseOnSucces from "./../utils/checkResponseOnSucces.js";


const checkSendingSuccesRequest = async (
  clientOfTranslationService,
  apiKey,
  httpServerOfTranslationService
) => {
  httpServerOfTranslationService.setRequestForTranslatingTextFragmentsListener(
    (request, apiKey, dataAboutText, senderOfResponse) => {
      if (
        apiKey === sendedApiKey &&
        dataAboutText.codeOfSourceLanguage === sendedCodeOfSourceLanguage &&
        dataAboutText.codeOfTargetLanguage === sendedCodeOfTargetLanguage &&
        areDeepEqual(dataAboutText.textFragments, sendedTextFragments)
      ) {
        senderOfResponse.sendTranslation(sendedTranslation);
      }
      else {
        senderOfResponse.terminateConnection();
      }
    }
  );
  const sendedApiKey = apiKey;
  const sendedCodeOfSourceLanguage = "cn";
  const sendedCodeOfTargetLanguage = "kz";
  const sendedTextFragments = ["список частей", "исходного текста"];
  const translatedTextFragments = ["список частей", "переведённого текста"];
  const sendedTranslation = createSendedTranslation(translatedTextFragments);

  const response = await clientOfTranslationService.requestTranslatingTextFragments(
    sendedCodeOfSourceLanguage,
    sendedCodeOfTargetLanguage,
    sendedTextFragments
  );
  const expectedTextFragments = translatedTextFragments;
  checkResponseOnSucces(response, expectedTextFragments);
};

const createSendedTranslation = (transaltedTextFragments) => {
  return {
    translations: transaltedTextFragments.map(createEntry)
  };
};

const createEntry = (text) => ({ text });

export default checkSendingSuccesRequest;
