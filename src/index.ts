import { BaseEventEmitter } from './common/BaseEventEmitter';
import * as sp from "skyrimPlatform";
import * as tk from "tick-knock";
import { WorldCleanerSystem } from './systems/WorldCleanerSystem';
import { TimeSystem } from './systems/TimeSystem';
import { SettingsService } from "./services/SettingsService";
import { BaseSkympClientService } from './services/BaseSkympClientService';
import { SkympClientService } from "./services/types";
import { NetMessageToIface, NetMessageType, NumberMessageType, StringMessageType } from "./models/networkMessages";
import { EventEmitter } from "./common/types";

let engine = new tk.Engine();
let settingsService = new SettingsService();
let skympClientService: SkympClientService = new BaseSkympClientService(settingsService);
skympClientService
  .onMessageReceived
  .addListener(StringMessageType.CreateActor, msg => msg.idx);


/* Systems */
engine.addSystem(new TimeSystem(), 1);
engine.addSystem(new WorldCleanerSystem(), 2);

/* Game update */
let engine_dt: number = Date.now();
sp.on("update", () => {
  engine.update(Date.now() - engine_dt);
  engine_dt = Date.now();
});


// Let's say for example we develop an event emitter or networking system with different kinds of message types.
// There are "types":
type BaseType = "type1" | "type2";

// And there are corresponding object types:
interface Type1 { type1: number };
interface Type2 { type2: number };

// A generic type to automatically decide what interface we need based on BaseType passed
type WhatIfType<T extends BaseType> =
  T extends "type1" ? Type1 :
  T extends "type2" ? Type2 :
  never;



interface Hkt<I, O> {
  input: I,
  output: O,
}

type CallHkt<F extends Hkt<any, any>, I extends F["input"]> =
  (F & { input: I })["output"]

interface WhatIfTypeHkt extends Hkt<BaseType, Type1 | Type2> {
  output: WhatIfType<this["input"]>
}

// Just a generic type with two parameters. Required for our example function myFunc
// Note that here T1 is one of "types" (BaseType)
// T2 is one of interfaces (Type1, Type2)
interface superObject<F extends Hkt<any, any>> {
  add<T extends F["input"]>(value1: T, callback: (value2: CallHkt<F, T>) => void): this;
}

let myFunc = (): superObject<WhatIfTypeHkt> => {
  throw new Error();
};

myFunc().add("type1", (val) => val.type1);
myFunc().add("type2", (val) => val.type2);


class SuperObj<TEvent, TValue> implements superObject<Hkt<TEvent, TValue>> {
  add<T extends TEvent>(value1: T, callback: (value2: TValue) => void): this {
    throw new Error('Method not implemented.');
  }

}
