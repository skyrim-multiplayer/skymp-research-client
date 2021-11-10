import * as sp from "skyrimPlatform";
import { BaseEventEmitter } from '../common/BaseEventEmitter';
import { EventEmitter, ConnectionState, IOEventEmitter } from '../common/types';
import { NetMessageToIface, NetMessageType, NetMessageTypeToIface } from '../models/networkMessages';
import { SettingsService } from './SettingsService';
import { SkympClientService } from './types';
import { NeverError } from './../errors/NeverError';

/**
 * Server communication service
 */
export class BaseSkympClientService implements SkympClientService {
  constructor(
    private _settingsService: SettingsService,
  ) {
    sp.on("tick", () => this._mpClientPlugin.tick(this.handlePacket));
  }

  private _mpClientPlugin = sp.mpClientPlugin;
  private _onConnectionStateChangedEmitter = new BaseEventEmitter<"connectionStateChanged", ConnectionState>();
  private _onErrorEmitter = new BaseEventEmitter<"error", Error>();
  private _onMessageReceiveEmitter = new BaseEventEmitter<NetMessageType, any>();

  public ignoreIncomingMessages: boolean = false;

  public get onConnectionStateChanged(): EventEmitter<"connectionStateChanged", ConnectionState> {
    return this._onConnectionStateChangedEmitter;
  }

  public get onMessageReceived(): IOEventEmitter<NetMessageTypeToIface> {
    return this._onMessageReceiveEmitter;
  }

  public get onError(): EventEmitter<"error", Error> {
    return this._onErrorEmitter;
  }

  public connect(): void {
    if (this._mpClientPlugin.isConnected() === true) return;

    const settings = this._settingsService.skympClientSettings;
    if (!settings.serverIp || !settings.serverPort) return;

    this._mpClientPlugin.createClient(settings.serverIp, settings.serverPort);
  }

  public disconnect(): void {
    if (this._mpClientPlugin.isConnected() === false) return;
    this._mpClientPlugin.destroyClient();
  }

  public send(message: Record<string, unknown>, reliable: boolean): void {
    if (this._mpClientPlugin.isConnected() === false) return;
    this._mpClientPlugin.send(JSON.stringify(message), reliable);
  }

  private handlePacket(packetType: sp.PacketType, jsonContent: string, error: string) {
    switch (packetType) {
      case "connectionAccepted":
        this._onConnectionStateChangedEmitter.emit("connectionStateChanged", "connected");
        break;
      case "connectionDenied":
      case "connectionFailed":
        this._onErrorEmitter.emit("error", new Error(packetType));
        break;
      case "disconnect":
        this._onConnectionStateChangedEmitter.emit("connectionStateChanged", "disconnected");
        break;
      case "message":
        if (this.ignoreIncomingMessages === true) return;
        // todo: parse packet and it's content for emit event
        //this._onMessageReceiveEmitter.emit()
        break;
      default:
        this._onErrorEmitter.emit("error", new Error(`[${new NeverError(packetType).message}]: Received unknown packet type = "${packetType}"`))
    }
  }
}
