import * as sp from "skyrimPlatform";
import * as tk from "tick-knock";
import { WorldCleanerSystem } from './systems/WorldCleanerSystem';

let engine = new tk.Engine();

/* Systems */
engine.addSystem(new WorldCleanerSystem(), 1);

/* Game update */
let engine_dt: number = Date.now();
sp.on("update", () => {
  engine.update(Date.now() - engine_dt);
  engine_dt = Date.now();
});
