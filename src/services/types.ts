import * as sp from "skyrimPlatform";
import { NetMessageType, NetMessageToIface, NetMessageTypeToIface } from '../models/networkMessages';
import { EventEmitter, ConnectionState, IOEventEmitter } from './../common/types';

/**
 * Represents a service interface
 */
export interface Service { }

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
  get onConnectionStateChanged(): EventEmitter<"connectionStateChanged", ConnectionState>;

  /**
   * Emits sorted message from the server
   */
  get onMessageReceived(): IOEventEmitter<NetMessageTypeToIface>;

  /**
   * Triggers when an error occures
   */
  get onError(): EventEmitter<"error", Error>;

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
