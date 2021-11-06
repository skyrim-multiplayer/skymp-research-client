import * as sp from "skyrimPlatform";
import * as tk from "tick-knock";
import { PeriodUpdater } from "../common/PeriodUpdater";
import { AuiType } from "../common/types";

/**
 * Weather control system
 */
export class WeatherSystem extends tk.System {
  private _updater: PeriodUpdater = new PeriodUpdater(2000, this.innerUpdate);

  public update(dt: number): void {
    this._updater.update(dt);
  }

  private innerUpdate(): void {
    const weather = sp.Weather.findWeather(AuiType.Pleasant);
    if (weather) {
      weather.setActive(true, false);
    }
  }
}
