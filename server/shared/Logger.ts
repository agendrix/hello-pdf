import { Console } from "console";

enum MessageLevel {
  info = "INFO",
  warning = "WARN",
  error = "ERROR",
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
    this.lvl = lvl || MessageLevel.info;
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
    this.getInstance().log(new Log(msg, ctx, MessageLevel.warning).toString());
  }

  static error(msg: string, ctx?: Object) {
    this.getInstance().log(new Log(msg, ctx, MessageLevel.error).toString());
  }
}

export default Logger;
