"use strict";

const sendRequestToBackgroundScriptAsync = (runtime, message) => {
  return new Promise((resolve, reject) =>
    runtime.sendMessage(message, function(response) {
      // developer.chrome.com/docs/extensions/reference/runtime/#method-sendMessage
      if (arguments.length === 0) {
        reject(runtime.lastError);
        return;
      }
      resolve(response);
    })
  );
};

export default sendRequestToBackgroundScriptAsync;
