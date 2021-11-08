import * as sp from "skyrimPlatform";
import { BaseEventEmitter } from '../common/BaseEventEmitter';
import { EventEmitter } from '../common/types';
import { ConnectionState, MsgType, NetMessageType } from '../models/networkMessages';
import { SettingsService } from './SettingsService';
import { SkympClientService } from './types';

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
  private _onConnectionStateChangedEmitter = new BaseEventEmitter<"", ConnectionState>();
  private _onErrorEmitter = new BaseEventEmitter<"", Error>();
  private _onMessageReceiveEmitter = new BaseEventEmitter<MsgType | string, NetMessageType>();

  public ignoreIncomingMessages: boolean = false;

  public get onConnectionStateChanged(): EventEmitter<"", ConnectionState> {
    return this._onConnectionStateChangedEmitter;
  }

  public get onMessageReceived(): EventEmitter<string | MsgType, NetMessageType> {
    return this._onMessageReceiveEmitter;
  }

  public get onError(): EventEmitter<"", Error> {
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

  public update(dt: number): void { }

  private handlePacket(packetType: sp.PacketType, jsonContent: string, error: string) {
    switch (packetType) {
      case "connectionAccepted":
        this._onConnectionStateChangedEmitter.emit("", "connected");
        break;
      case "connectionDenied":
      case "connectionFailed":
        this._onErrorEmitter.emit("", new Error(packetType));
        break;
      case "disconnect":
        this._onConnectionStateChangedEmitter.emit("", "disconnected");
        break;
      case "message":
        if (this.ignoreIncomingMessages === true) return;
        // todo: parse packet and it's content for emit event
        //this._onMessageReceiveEmitter.emit()
        break;
      default:
        this._onErrorEmitter.emit("", new Error(`Received unknown packet type = "${packetType}"`))
    }
  }
}
