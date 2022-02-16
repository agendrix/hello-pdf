import { Console } from "console";
import debug from "debug";

enum MessageLevel {
  Info = "INFO",
  Warning = "WARN",
  Error = "ERROR",
}

class Log {
  private ts: string;
  private pid: number;
  private msg: string;
  private lvl: MessageLevel;
  private ctx?: Object;
  constructor(msg: string, ctx?: Object, lvl?: MessageLevel) {
    this.ts = new Date().toISOString();
    this.pid = process.pid;
    this.msg = msg;
    this.lvl = lvl || MessageLevel.Info;
    this.ctx = ctx;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}

class Logger extends Console {
  private static _instance: Logger;

  private constructor() {
    super({ stdout: process.stdout });
  }

  static getInstance() {
    if (!this._instance) this._instance = new Logger();
    return this._instance;
  }

  static log(msg: string, ctx?: Object) {
    this.getInstance().log(new Log(msg, ctx).toString());
  }

  static warn(msg: string, ctx?: Object) {
    this.getInstance().log(new Log(msg, ctx, MessageLevel.Warning).toString());
  }

  static error(msg: string, ctx?: Object) {
    this.getInstance().log(new Log(msg, ctx, MessageLevel.Error).toString());
  }
  static debug(namespace: string, msg: string) {
    debug(`hello-pdf:${namespace}`)(msg);
  }
}

export default Logger;
