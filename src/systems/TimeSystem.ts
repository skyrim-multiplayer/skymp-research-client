import * as sp from "skyrimPlatform";
import * as tk from "tick-knock";
import { PeriodUpdater } from "../common/PeriodUpdater";
import { getGlobalVariable, GlobalVariableFormId } from "../common/types";

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

    // const gameHour = getGlobalVariable(GlobalVariableFormId.GameHourId);
    // gameHour.setValue(
    //   nowDate.getUTCHours() +
    //   nowDate.getUTCMinutes() / 60 +
    //   nowDate.getUTCSeconds() / 60 / 60 +
    //   nowDate.getUTCMilliseconds() / 60 / 60 / 1000
    // );

    // const gameDay = sp.GlobalVariable.from(sp.Game.getFormEx(gameDayId)) as sp.GlobalVariable;
    // gameDay.setValue(nowDate.getUTCDate());

    // const gameMonth = sp.GlobalVariable.from(sp.Game.getFormEx(gameMonthId)) as sp.GlobalVariable;
    // gameMonth.setValue(nowDate.getUTCMonth());

    // const gameYear = sp.GlobalVariable.from(sp.Game.getFormEx(gameYearId)) as sp.GlobalVariable;
    // gameYear.setValue(nowDate.getUTCFullYear() - 2020 + 199);

    // const timeScale = sp.GlobalVariable.from(sp.Game.getFormEx(timeScaleId)) as sp.GlobalVariable;
    // timeScale.setValue(1);
  }
}
