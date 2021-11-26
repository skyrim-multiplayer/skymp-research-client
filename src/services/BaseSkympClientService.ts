import * as sp from "skyrimPlatform";
import { BaseEventEmitter } from '../common/BaseEventEmitter';
import { EventEmitter, ConnectionState, IOMapEventEmitter } from '../common/types';
import { NetMessageType, NetMessageTypeToIface, parseNetMessage } from '../models/networkMessages';
import { SettingsService } from './SettingsService';
import { SkympClientService } from './types';
import { NeverError } from './../errors/NeverError';

/**
 * Server communication service
 */
export class BaseSkympClientService implements SkympClientService {
  constructor(
    private readonly _settingsService: SettingsService,
  ) {
    sp.on("tick", () =>
      this._mpClientPlugin.tick((packetType: sp.PacketType, jsonContent: string, error: string) =>
        this.handlePacket(packetType, jsonContent, error)
      )
    );
  }

  private readonly _mpClientPlugin = sp.mpClientPlugin;
  private readonly _onConnectionStateChangedEmitter = new BaseEventEmitter<"connectionStateChanged", ConnectionState>();
  private readonly _onErrorEmitter = new BaseEventEmitter<"error", Error>();
  private readonly _onMessageReceiveEmitter = new BaseEventEmitter<NetMessageType, any>();

  public ignoreIncomingMessages: boolean = false;

  public get onConnectionStateChanged(): EventEmitter<"connectionStateChanged", ConnectionState> {
    return this._onConnectionStateChangedEmitter;
  }

  public get onMessageReceived(): IOMapEventEmitter<NetMessageTypeToIface> {
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
    const wasConnected = this._mpClientPlugin.isConnected();
    this._mpClientPlugin.destroyClient();
    // skyrim platform's "mpClientPlugin" does not call tickHandler with disconnect packet type if "destroyClient" function was called.
    if (wasConnected) {
      this._onConnectionStateChangedEmitter.emit("connectionStateChanged", "disconnected");
    }
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
        this._onErrorEmitter.emit("error", new Error(error));
        break;
      case "disconnect":
        this._onConnectionStateChangedEmitter.emit("connectionStateChanged", "disconnected");
        break;
      case "message":
        if (this.ignoreIncomingMessages === true) return;
        if (!jsonContent || jsonContent.length === 0) {
          this._onErrorEmitter.emit("error", error ? new Error(error) : new Error("Received empty message"));
          return;
        }

        try {
          var parsedMsg = parseNetMessage(jsonContent);
        } catch (e: any) {
          this._onErrorEmitter.emit("error", e instanceof Error ? e : new Error(e));
          return;
        }
        this._onMessageReceiveEmitter.emit(parsedMsg.msgType, parsedMsg.msg);
        break;
      default:
        this._onErrorEmitter.emit("error", new Error(`[${new NeverError(packetType).message}]: Received unknown packet type = "${packetType}"`))
    }
  }
}
