/* Events */

export interface IOMagic<I, O> {
  input: I,
  output: O,
}

export type CallIOMagic<F extends IOMagic<any, any>, I extends F["input"]> = (F & { input: I })["output"];

export type EventEmitterHandler<F extends IOMagic<any, any>, T> = (value: CallIOMagic<F, T>) => void;

export interface IOEventEmitter<F extends IOMagic<any, any>> {
  addListener<T extends F["input"]>(eventName: T, handler: EventEmitterHandler<F, T>): this;
  removeListener<T extends F["input"]>(eventName: T, handler: EventEmitterHandler<F, T>): this;
}

export interface EventEmitter<TEvent, TValue> extends IOEventEmitter<IOMagic<TEvent, TValue>> { };

// export interface EventEmitter<TEvent, TValue> {
//   addListener(eventName: TEvent, handler: EventEmitterHandler<TValue>): void;
//   removeListener(eventName: TEvent, handler: EventEmitterHandler<TValue>): void
// }

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
