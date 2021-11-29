import * as sp from "skyrimPlatform";
import * as tk from "tick-knock";
import { PeriodUpdater } from "../common/PeriodUpdater";
import { SkympClientService } from '../services/types';
import { SettingsService } from "../services/SettingsService";
import { ConnectionState, SkympClientGameDataSettings } from '../common/types';
import { BrowserTokenCustomPacket, createNetMessageByIface, LoginWithSkympIOCustomPacket, NumberMessageType } from '../models/networkMessages';
import { CEFBrowserSystem } from "./CEFBrowserSystem";
import { nameOf } from "../common/utils";

export class AuthSystem extends tk.System {
  constructor(
    private readonly _settingsService: SettingsService,
    private readonly _skympClientService: SkympClientService,
  ) {
    super();
    this._skympClientService.onConnectionStateChanged.addListener("connectionStateChanged", (newState) => {
      if (newState === "connected") {
        this.sendAuthToServer();
      }
    });
  }

  private sendAuthToServer(): void {
    const gameData = this._settingsService.skympClientSettings.gameData;
    if (!gameData?.profileId) {
      logger.error(`Authentication failed bacause "${nameOf<SkympClientGameDataSettings>("profileId")}" is null`);
      this._skympClientService.disconnect();
      return;
    }

    this._skympClientService.send(
      createNetMessageByIface<LoginWithSkympIOCustomPacket>({
        t: NumberMessageType.CustomPacket,
        content: {
          customPacketType: "loginWithSkympIo",
          gameData: {
            profileId: gameData.profileId
          },
        }
      }),
      true
    );

    const browserToken = this.engine.getSystem(CEFBrowserSystem)?.token;
    if (browserToken) {
      this._skympClientService.send(
        createNetMessageByIface<BrowserTokenCustomPacket>({
          t: NumberMessageType.CustomPacket,
          content: {
            customPacketType: "browserToken",
            token: browserToken
          }
        }),
        true
      );
    }
  }
}
