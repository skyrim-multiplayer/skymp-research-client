import * as sp from "skyrimPlatform";
import { logEventLevel, Logger } from './types';
import { NeverError } from './../errors/NeverError';

export class SimpleLogger implements Logger {
  write(level: logEventLevel, message: string): void {
    switch (level) {
      case "debug":
        this.debug(message);
        break;
      case "info":
        this.info(message);
        break;
      case "warn":
        this.warn(message);
        break;
      case "error":
        this.error(message);
        break;
      case "fatal":
        this.fatal(message);
        break;
      default:
        throw new NeverError(level);
    }
  }

  debug(message: string): void {
    this.printConsole(`[DBG] ${message}`);
  }

  info(message: string): void {
    this.printConsole(`[INF] ${message}`);
  }

  warn(message: string): void {
    this.printConsole(`[WRN] ${message}`);
  }

  error(message: string): void {
    this.printConsole(`[ERR] ${message}`);
  }

  fatal(message: string): void {
    this.printConsole(`[FTL] ${message}`);
  }

  private printConsole(message: string): void {
    const now = new Date();
    sp.once("tick", () => sp.printConsole(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()} ${message}`));
  }
}
