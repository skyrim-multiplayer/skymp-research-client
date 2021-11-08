import * as sp from "skyrimPlatform";

/**
 * Player form id in the game
 */
export const playerId: number = 0x14;

/**
 * The type of weather you want
 */
export enum AuiType {
  Pleasant = 0,
  Cloudy = 1,
  Rainy = 2,
  Snow = 3,
}

/**
 * Global variable identifiers
 */
export enum GlobalVariableFormId {
  GameHourId = 0x38,
  GameMonthId = 0x36,
  GameDayId = 0x37,
  GameYearId = 0x35,
  TimeScaleId = 0x3a,
}

/**
 * Returns global variable by form id or null if it doesn't exist
 * @param id 
 * @returns 
 */
export const getGlobalVariable = (id: GlobalVariableFormId): sp.GlobalVariable | null => sp.GlobalVariable.from(sp.Game.getFormEx(id));
