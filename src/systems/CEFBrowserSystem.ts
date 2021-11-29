import * as sp from "skyrimPlatform";
import * as tk from "tick-knock";
import { PeriodUpdater } from "./../common/PeriodUpdater";

/**
 * Ingame browser system (Chromium Embedded Framework)
 */
export class CEFBrowserSystem extends tk.System {
  private readonly _updater: PeriodUpdater = new PeriodUpdater(200, this.innerUpdate);
  private _visible: boolean = true;
  private _focused: boolean = false;
  private readonly _browser: sp.Browser = sp.browser;
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

  public get token(): string {
    return this._browser.getToken();
  }

  /**
   * Load browser content by url (html, css, js)
   * @param url 
   */
  public loadByUrl(url: string): void {
    this._browser.loadUrl(url);
  }

  public update(dt: number): void {
    this._updater.update(dt);
  }

  public innerUpdate(): void {
    const isBadMenuOpened = this._badMenuArray.some(menu => sp.Ui.isMenuOpen(menu));
    this._browser.setVisible(this._visible && isBadMenuOpened);
  }
}
