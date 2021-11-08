/** Events **/

export type EventEmitterHandler<T> = (value: T) => void;

export interface EventEmitter<TEvent, TValue> {
  addListener(eventName: TEvent, handler: EventEmitterHandler<TValue>): void;
  removeListener(eventName: TEvent, handler: EventEmitterHandler<TValue>): void
}

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
