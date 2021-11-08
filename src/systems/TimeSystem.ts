import * as sp from "skyrimPlatform";
import * as tk from "tick-knock";
import { PeriodUpdater } from "./../common/PeriodUpdater";
import { getGlobalVariable, GlobalVariableFormId } from "./../skyrim.types";

/**
 * Time control system
 */
export class TimeSystem extends tk.System {
  private _updater: PeriodUpdater = new PeriodUpdater(2000, this.innerUpdate);

  public update(dt: number): void {
    this._updater.update(dt);
  }

  private innerUpdate(): void {
    const nowDate = new Date();

    const gameHour = getGlobalVariable(GlobalVariableFormId.GameHourId);
    gameHour?.setValue(
      nowDate.getUTCHours() +
      nowDate.getUTCMinutes() / 60 +
      nowDate.getUTCSeconds() / 60 / 60 +
      nowDate.getUTCMilliseconds() / 60 / 60 / 1000
    );

    const gameDay = getGlobalVariable(GlobalVariableFormId.GameDayId);
    gameDay?.setValue(nowDate.getUTCDate());

    const gameMonth = getGlobalVariable(GlobalVariableFormId.GameMonthId);
    gameMonth?.setValue(nowDate.getUTCMonth());

    const gameYear = getGlobalVariable(GlobalVariableFormId.GameYearId);
    gameYear?.setValue(nowDate.getUTCFullYear() - 2020 + 199);

    const timeScale = getGlobalVariable(GlobalVariableFormId.TimeScaleId);
    timeScale?.setValue(1);
  }
}
