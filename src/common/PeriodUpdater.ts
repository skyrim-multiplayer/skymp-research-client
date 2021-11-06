/**
 * Represents class with the update period checker
 */
export class PeriodUpdater {
  constructor(
    public updatePeriodMs: number,
    public updateMethod: () => void,
  ) { }

  private _lastDt: number = 0;

  public update(dt: number): void {
    this._lastDt += dt;
    if (this._lastDt >= this.updatePeriodMs) {
      this.updateMethod();
      this._lastDt = 0;
    }
  }
}
