"use strict";

import uWebSockets from "uWebSockets.js";


const { us_listen_socket_close } = uWebSockets;

const StarterOfUWebSocketsServer = class {
  constructor(uWebSocketsServer) {
    this[_server] = uWebSocketsServer;
  }

  listen(port) {
    return new Promise((resolve, reject) => {
      return this[_server].listen(port, (token) => {
        if ((token !== undefined) && (token !== null)) {
          this[_socketOfServer] = token;
          resolve();
        } else {
          reject(new Error("Ошибка запуска сервера."));
        }
      });
    });
  }

  close() {
    return us_listen_socket_close(this[_socketOfServer]);
  }
};

const _server = Symbol();
const _socketOfServer = Symbol();

export default StarterOfUWebSocketsServer;
