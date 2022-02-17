"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@bull-board/api");
const bullAdapter_1 = require("@bull-board/api/bullAdapter");
const express_1 = require("@bull-board/express");
const lib_1 = require("../../lib");
const serverAdapter = new express_1.ExpressAdapter();
serverAdapter.setBasePath("/monitor");
(0, api_1.createBullBoard)({
    queues: [new bullAdapter_1.BullAdapter(lib_1.Queue, { readOnlyMode: true })],
    serverAdapter: serverAdapter,
});
exports.default = serverAdapter.getRouter();
