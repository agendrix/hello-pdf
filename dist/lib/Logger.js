"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const debug_1 = __importDefault(require("debug"));
var MessageLevel;
(function (MessageLevel) {
    MessageLevel["Info"] = "INFO";
    MessageLevel["Warning"] = "WARN";
    MessageLevel["Error"] = "ERROR";
})(MessageLevel || (MessageLevel = {}));
class Log {
    constructor(msg, ctx, lvl) {
        this.ts = new Date().toISOString();
        this.pid = process.pid;
        this.msg = msg;
        this.lvl = lvl || MessageLevel.Info;
        this.ctx = ctx;
    }
    toString() {
        return JSON.stringify(this);
    }
}
class Logger extends console_1.Console {
    constructor() {
        super({ stdout: process.stdout });
    }
    static getInstance() {
        if (!this._instance)
            this._instance = new Logger();
        return this._instance;
    }
    static log(msg, ctx) {
        this.getInstance().log(new Log(msg, ctx).toString());
    }
    static warn(msg, ctx) {
        this.getInstance().log(new Log(msg, ctx, MessageLevel.Warning).toString());
    }
    static error(msg, ctx) {
        this.getInstance().log(new Log(msg, ctx, MessageLevel.Error).toString());
    }
    static debug(namespace, msg) {
        (0, debug_1.default)(`hello-pdf:${namespace}`)(msg);
    }
}
exports.default = Logger;
