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
