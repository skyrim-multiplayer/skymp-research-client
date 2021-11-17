import * as sp from "skyrimPlatform";
import * as tk from "tick-knock";
import { WorldCleanerSystem } from './systems/WorldCleanerSystem';
import { TimeSystem } from './systems/TimeSystem';
import { CEFBrowserSystem } from './systems/CEFBrowserSystem';
import { SettingsService } from "./services/SettingsService";
import { BaseSkympClientService } from './services/BaseSkympClientService';
import { SkympClientService } from "./services/types";
import { NumberMessageType, StringMessageType } from "./models/networkMessages";

let engine = new tk.Engine();
let settingsService = new SettingsService();
let skympClientService: SkympClientService = new BaseSkympClientService(settingsService);

/* Systems */
engine.addSystem(new TimeSystem(), 1);
engine.addSystem(new WorldCleanerSystem(), 2);
engine.addSystem(new CEFBrowserSystem(), 3);

/* Game update */
let engine_dt: number = Date.now();
sp.on("update", () => {
  engine.update(Date.now() - engine_dt);
  engine_dt = Date.now();
});

/* Tests */
skympClientService.onConnectionStateChanged.addListener("connectionStateChanged", (state) => sp.once("tick", () => {
  sp.printConsole(`Connection state changed to "${state}"`);
  skympClientService.disconnect();
}));
skympClientService.onError.addListener("error", (error) => sp.once("tick", () => sp.printConsole(`Error: ${error.message}`)));
skympClientService.onMessageReceived.addListener(StringMessageType.CreateActor, (msg) => sp.once("tick", () => sp.printConsole(`SERVER: ${msg.type} ${JSON.stringify(msg)}`)));
skympClientService.connect();
