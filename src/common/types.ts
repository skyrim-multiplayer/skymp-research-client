/* Commons */

export interface IOMap<I, O> {
  input: I,
  output: O,
}

export type CallIOMap<F extends IOMap<any, any>, I extends F["input"]> = (F & { input: I })["output"];

/* Events */

export type EventEmitterHandler<F extends IOMap<any, any>, T> = (value: CallIOMap<F, T>) => void;

export interface IOMapEventEmitter<F extends IOMap<any, any>> {
  addListener<T extends F["input"]>(eventName: T, handler: EventEmitterHandler<F, T>): this;
  removeListener<T extends F["input"]>(eventName: T, handler: EventEmitterHandler<F, T>): this;
}

export interface EventEmitter<TEvent, TValue> extends IOMapEventEmitter<IOMap<TEvent, TValue>> { };

/** Settings **/

export interface SkympClientGameDataSettings {
  profileId?: number;
}

export interface SkympClientSettings {
  clientVersion: string,
  skyrimPlatformVersion: string | null,
  debug: boolean,
  serverIp?: string,
  serverPort?: number,
  gameData?: SkympClientGameDataSettings,
  showMe?: boolean,
  showClones?: boolean,
}

/* Networking */

export type ConnectionState = "connected" | "disconnected";

/* Game */

/**
 * General interface for a game management
 */
export interface Game {
  /**
   * Prepares to start and then launches the game
   */
  start(): void;

  /**
   * Stops the game
   */
  stop(): void;
}

/* Logs */

export type logEventLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface Logger {
  write(level: logEventLevel, message: string): void;
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  fatal(message: string): void;
}
