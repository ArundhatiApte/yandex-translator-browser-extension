"use strict";

const sendRequestToTabAsync = (tabs, tabId, message) => {
  return new Promise((resolve, reject) =>
    tabs.sendMessage(tabId, message, function(response) {
      if (arguments.length === 0) {
        reject(tabs.lastError);
        return;
      }
      resolve(response);
    })
  );
};

export default sendRequestToTabAsync;
