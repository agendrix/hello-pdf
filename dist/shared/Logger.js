"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
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
}
exports.default = Logger;
