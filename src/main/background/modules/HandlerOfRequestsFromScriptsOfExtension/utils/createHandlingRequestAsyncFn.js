"use strict";

const createHandlingRequestAsyncFn = (handleRequestAsync) =>
  function() {
    handleRequestAsync(this, arguments);
    return _willHandleRequestAsync;
  };

const _willHandleRequestAsync = true;

export default createHandlingRequestAsyncFn;
