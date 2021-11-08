import * as sp from "skyrimPlatform";
import { ConnectionState, MsgType, NetMessageType } from '../models/networkMessages';
import { EventEmitter } from './../common/types';

/**
 * Represents a service interface
 */
export interface Service {
  update(dt: number): void;
}

/**
 * Ingame browser interface
 */
export interface BrowserService extends Service {
  /**
   * Gets or sets browser visibility
   */
  visible: boolean;

  /**
   * Gets or sets browser focused state
   */
  focused: boolean;

  /**
   * Load browser content by url (html, css, js)
   * @param url 
   */
  loadByUrl(url: string): void;
}

/**
 * Server-client communication service
 */
export interface SkympClientService extends Service {
  /**
  * Tells the service not to emit received messages.
  * If true then {@link onMessageReceived} will not emit messages
  */
  ignoreIncomingMessages: boolean;

  /**
   * Emits connection state changing
   */
  get onConnectionStateChanged(): EventEmitter<"", ConnectionState>;

  /**
   * Emits sorted message from the server
   */
  get onMessageReceived(): EventEmitter<MsgType | string, NetMessageType>;

  /**
   * Triggers when an error occures
   */
  get onError(): EventEmitter<"", Error>;

  /**
   * Tries to connect to the server
   */
  connect: () => void;

  /**
   * Disconnect from the server
   */
  disconnect: () => void;

  /**
   * Sends message to the server
   */
  send: (message: Record<string, unknown>, reliable: boolean) => void;
}
