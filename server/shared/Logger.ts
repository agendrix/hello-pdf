import { createWriteStream } from "fs";
import { Console } from "console";

const BLUE_TEXT = "\x1b[34m%s\x1b[0m";
const RED_TEXT = "\x1b[31m%s\x1b[0m";
const YELLOW_TEXT = "\x1b[33m%s\x1b[0m";

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
    this.getInstance().info(BLUE_TEXT, text);
  }

  static warn(text: string) {
    this.getInstance().warn(YELLOW_TEXT, text);
  }

  static error(text: string) {
    this.getInstance().error(RED_TEXT, text);
  }
}

export default Logger
