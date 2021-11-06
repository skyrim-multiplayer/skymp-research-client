import * as sp from "skyrimPlatform";
import { BrowserService } from "./types";

export class DefaultBrowserService implements BrowserService {
  private _visible: boolean = true;
  private _focused: boolean = false;
  private readonly _browser: sp.Browser = sp.browser;
  private readonly _badMenuUpdatePeriodMs: number = 200;
  private _badMenuUpdateLastDt: number = 0;
  private readonly _badMenuArray: sp.Menu[] = [
    sp.Menu.Barter,
    sp.Menu.Book,
    sp.Menu.Container,
    sp.Menu.Crafting,
    sp.Menu.Gift,
    sp.Menu.Inventory,
    sp.Menu.Journal,
    sp.Menu.Lockpicking,
    sp.Menu.Loading,
    sp.Menu.Map,
    sp.Menu.RaceSex,
    sp.Menu.Stats,
    sp.Menu.Tween,
    sp.Menu.Console,
    sp.Menu.Main
  ];

  public get visible(): boolean {
    return this._visible;
  }
  public set visible(value: boolean) {
    this._visible = value;
    this._browser.setVisible(value);
  }

  public get focused(): boolean {
    return this._focused;
  }
  public set focused(value: boolean) {
    this._focused = value;
    this._browser.setFocused(value);
  }

  public loadByUrl(url: string): void {
    this._browser.loadUrl(url);
  }

  public update(dt: number): void {
    this._badMenuUpdateLastDt += dt;
    if (this._badMenuUpdateLastDt > this._badMenuUpdatePeriodMs) {
      const isBadMenuOpened = this._badMenuArray.some(menu => sp.Ui.isMenuOpen(menu));
      this._browser.setVisible(this._visible && isBadMenuOpened);
      this._badMenuUpdateLastDt = 0;
    }
  }
}
