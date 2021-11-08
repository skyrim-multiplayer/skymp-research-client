import * as sp from "skyrimPlatform";
import { SkympClientSettings } from './../common/types';
import * as pckg from "./../../package.json";

/**
 * Settings service
 */
export class SettingsService {
  /**
   * Gets skymp client settings snapshot if it exists
   */
  public get skympClientSettings(): SkympClientSettings {
    const settings = sp.settings["skymp5-client"] ?? {};
    const gameDataSettings = settings["gameData"] as any ?? {};
    return {
      clientVersion: pckg.version,
      skyrimPlatformVersion: typeof sp.getPlatformVersion === "function" ? sp.getPlatformVersion() : null,
      debug: settings["debug"] as boolean ?? true,
      serverIp: settings["server-ip"] as string,
      serverPort: settings["server-port"] as number,
      gameData: {
        profileId: gameDataSettings["profileId"] as number,
      },
      showMe: settings["show-me"] as boolean,
      showClones: settings["show-clones"] as boolean,
    };
  }

  /**
   * Gets skymp ui url snapshot
   */
  public get skympUiUrl(): string | null {
    const settings = this.skympClientSettings;
    if (!settings.serverIp || !settings.serverPort) return null;
    const port = settings.serverPort === 7777 ? 3000 : settings.serverPort + 1;
    return `http://${settings.serverIp}:${port}/ui/index.html`;
  }
}
