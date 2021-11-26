import * as sp from "skyrimPlatform";
import * as tk from "tick-knock";

import { Game } from '../common/types';
import { GameBuilder } from './types';

import { WorldCleanerSystem } from '../systems/WorldCleanerSystem';
import { TimeSystem } from '../systems/TimeSystem';
import { CEFBrowserSystem } from '../systems/CEFBrowserSystem';
import { SettingsService } from "../services/SettingsService";
import { BaseSkympClientService } from '../services/BaseSkympClientService';
import { SkympClientService } from "../services/types";
import { NumberMessageType, StringMessageType } from "../models/networkMessages";

export class SkympClientGameBuilder implements GameBuilder {
  Build(): Game {
    return {
      start: (): void => {
        Add_Connect_Disconnect_Test();
      },
      stop: (): void => { },
    }
  }
}

/* Services */
const settingsService = new SettingsService();
const skympClientService = new BaseSkympClientService(settingsService) as SkympClientService;

/* ECS engine */
const engine = new tk.Engine();

/* ECS Systems */
engine.addSystem(new TimeSystem(), 1);
engine.addSystem(new WorldCleanerSystem(), 2);
engine.addSystem(new CEFBrowserSystem(), 3);

/* Game update */
let engine_dt: number = Date.now();
sp.on("update", () => {
  engine.update(Date.now() - engine_dt);
  engine_dt = Date.now();
});

/* Game logic test implementations */
const Add_Connect_Disconnect_Test = (): void => {
  skympClientService.onConnectionStateChanged.addListener("connectionStateChanged", (newState) => sp.once("tick", () => {
    sp.printConsole(`Connection state changed to "${newState}"`);
    if (newState === "connected") {
      skympClientService.disconnect();
    }
  }));
  skympClientService.onError.addListener("error", (error) => sp.once("tick", () => sp.printConsole(`Error: ${error.message}`)));
  skympClientService.onMessageReceived.addListener(StringMessageType.CustomPacket, (msg) => sp.once("tick", () => sp.printConsole(`SERVER: ${msg.type} ${JSON.stringify(msg.content)}`)));
  skympClientService.onMessageReceived.addListener(StringMessageType.CreateActor, (msg) => sp.once("tick", () => sp.printConsole(`SERVER: ${msg.type} ${JSON.stringify(msg)}`)));
  skympClientService.onMessageReceived.addListener(StringMessageType.UpdateGamemodeData, (msg) => sp.once("tick", () => sp.printConsole(`SERVER: ${msg.type} ${JSON.stringify(msg)}`)))
  skympClientService.connect();
}

/* Game logic tests */
