import { EventEmitter, EventEmitterHandler, IOMagic } from './types';

export class BaseEventEmitter<TEvent, TValue> implements EventEmitter<TEvent, TValue> {
  private _eventHandlers = new Map<TEvent, Set<EventEmitterHandler<IOMagic<TEvent, TValue>, TValue>>>();

  public addListener<T extends TEvent>(eventName: T, handler: EventEmitterHandler<IOMagic<TEvent, TValue>, T>): this {
    if (!this._eventHandlers.has(eventName)) {
      const handlers = new Set<EventEmitterHandler<IOMagic<TEvent, TValue>, TValue>>().add(handler);
      this._eventHandlers.set(eventName, handlers);
    } else {
      this._eventHandlers.get(eventName)?.add(handler);
    }
    return this;
  }

  public removeListener<T extends TEvent>(eventName: T, handler: EventEmitterHandler<IOMagic<TEvent, TValue>, T>): this {
    if (!this._eventHandlers.has(eventName)) return this;
    this._eventHandlers.get(eventName)?.delete(handler);
    return this;
  }

  public removeListeners(eventName: TEvent): void {
    this._eventHandlers.delete(eventName);
  }

  public clearAll(): void {
    this._eventHandlers.clear();
  }

  public emit(eventName: TEvent, value: TValue): void {
    const handlers = this._eventHandlers.get(eventName);
    if (handlers) {
      handlers.forEach(handler => handler(value));
    }
  }
}
