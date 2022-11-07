"use strict";

const reHavingOtherThanDigitsSpacesPunctuation =
/[^\x07\x1B\f\r\v\d\s\p{Mark}\p{Connector_Punctuation}\p{Join_Control}~`!@"#№$;%\^:&\?\*\(\)\-=\{\}\[\];\\"'|\\,<>./]/u;

const canStringContainWords = RegExp.prototype.test.bind(reHavingOtherThanDigitsSpacesPunctuation);

export default canStringContainWords;
