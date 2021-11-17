export type NiPoint3 = [number, number, number]

export interface WorldPositionModel {
  worldOrCell: number;
  pos: NiPoint3;
  rot: NiPoint3;
}

export type RunMode = "Standing" | "Walking" | "Running" | "Sprinting";

export interface AnimationVariables {
  runMode: RunMode;
  direction: number;
  isInJumpState: boolean;
  isSneaking: boolean;
  isBlocking: boolean;
  isWeapDrawn: boolean;
  isDead: boolean;
  healthPercentage: number;
  lookAt?: NiPoint3;
}

export interface MovementModel extends WorldPositionModel, AnimationVariables { }

export interface AnimationModel {
  animEventName: string;
  numChanges: number;
}

export interface TintModel {
  texturePath: string;
  argb: number;
  type: number;
}

export interface AppearanceModel {
  isFemale: boolean;
  raceId: number;
  weight: number;
  skinColor: number;
  hairColor: number;
  headpartIds: number[];
  headTextureSetId: number;
  options: number[];
  presets: number[];
  tints: TintModel[];
  name: string;
}

export interface BasicEntry {
  baseId: number;
  count: number;
}

export interface ExtraEntry {
  health?: number;
  enchantmentId?: number;
  maxCharge?: number;
  removeEnchantmentOnUnequip?: boolean;
  chargePercent?: number;
  name?: string;
  soul?: 0 | 1 | 2 | 3 | 4 | 5;
  poisonId?: number;
  poisonCount?: number;
  worn?: boolean;
  wornLeft?: boolean;
}

export interface Entry extends BasicEntry, ExtraEntry { }

export interface InventoryModel {
  entries: Entry[];
}

export interface EquipmentModel {
  inv: InventoryModel;
  numChanges: number;
}

export interface ActorValuesModel {
  health: number;
  stamina: number;
  magicka: number;
}
