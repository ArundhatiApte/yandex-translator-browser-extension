"use strict";

import { JSDOM as JsDom } from "jsdom";


const createEmptyWindow = () => new JsDom("<html><head></head><body></body></html>").window;

export default createEmptyWindow;
