import * as sp from "skyrimPlatform";
import { SkympClientGameDataSettings, SkympClientSettings } from './../models/SkympClientSettings';

/**
 * Settings service. Now for snapshots only and without interface.
 */
export class SettingsService {
  /**
   * Gets skymp client settings snapshot if it exists
   */
  public get skympClientSettings(): SkympClientSettings | null {
    const settings = sp.settings["skymp5-client"];
    if (!settings) return null;
    return new SkympClientSettings(
      settings["server-ip"] as string,
      settings["server-port"] as number,
      settings["gameData"] as SkympClientGameDataSettings,
      settings["show-me"] as boolean,
      settings["show-clones"] as boolean,
    )
  }

  /**
   * Gets skymp ui url snapshot
   */
  public get skympUiUrl(): string | null {
    const settings = this.skympClientSettings;
    if (!settings?.serverIp || !settings?.serverPort) return null;
    const port = settings.serverPort === 7777 ? 3000 : settings.serverPort + 1;
    return `http://${settings.serverIp}:${port}/ui/index.html`;
  }
}
