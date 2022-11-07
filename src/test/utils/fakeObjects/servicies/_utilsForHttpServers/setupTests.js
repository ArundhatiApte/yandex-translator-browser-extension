"use strict";

import StarterOfUWebSocketsServer from "../utils/StarterOfUWebSocketsServer.js";


const setupTests = (options) => {
  const {
    name,
    uWebSocketsServer,
    port,
    describeTests
  } = options;

  describe(name, () => {
    const starter = new StarterOfUWebSocketsServer(uWebSocketsServer);
    before(starter.listen.bind(starter, port));
    describeTests();
    after(starter.close.bind(starter));
  });
};

export default setupTests;
