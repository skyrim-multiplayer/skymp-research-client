import { EventEmitter, EventEmitterHandler } from './types';

export class BaseEventEmitter<TEvent, TValue> implements EventEmitter<TEvent, TValue> {
  private _eventHandlers = new Map<TEvent, Set<EventEmitterHandler<TValue>>>();

  public addListener(eventName: TEvent, handler: EventEmitterHandler<TValue>): void {
    if (!this._eventHandlers.has(eventName)) {
      const handlers = new Set<EventEmitterHandler<TValue>>().add(handler);
      this._eventHandlers.set(eventName, handlers);
    } else {
      this._eventHandlers.get(eventName)?.add(handler);
    }
  }

  public removeListener(eventName: TEvent, handler: EventEmitterHandler<TValue>): void {
    if (!this._eventHandlers.has(eventName)) return;
    this._eventHandlers.get(eventName)?.delete(handler);
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
