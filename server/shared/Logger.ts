import { Console } from "console";

enum Colors {
  Blue = "\x1b[34m%s\x1b[0m",
  Red = "\x1b[31m%s\x1b[0m",
  Yellow = "\x1b[33m%s\x1b[0m"
}

class Logger extends Console {
  private static _instance: Logger;

  private constructor() {
    super({ stdout: process.stdout });
  }

  static getInstance () {
    if (!this._instance) this._instance = new Logger();
    return this._instance
  }

  static log(text: string) {
    this.getInstance().info(text);
  }

  static info(text: string) {
    this.getInstance().info(Colors.Blue, text);
  }

  static warn(text: string) {
    this.getInstance().warn(Colors.Yellow, text);
  }

  static error(text: string) {
    this.getInstance().error(Colors.Red, text);
  }
}

export default Logger
