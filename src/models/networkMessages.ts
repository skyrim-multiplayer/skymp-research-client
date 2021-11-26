import { IOMap } from '../common/types';
import { nameOf } from '../common/utils';
import {
  WorldPositionModel,
  MovementModel,
  AnimationModel,
  AppearanceModel,
  InventoryModel,
  EquipmentModel,
  ActorValuesModel,
} from './types';

/* Messages with number type */

export enum NumberMessageType {
  CustomPacket = 1,
  UpdateMovement = 2,
  UpdateAnimation = 3,
  UpdateAppearance = 4,
  UpdateEquipment = 5,
  Activate = 6,
  UpdateProperty = 7,
  PutItem = 8,
  TakeItem = 9,
  FinishSpSnippet = 10,
  OnEquip = 11,
  ConsoleCommand = 12,
  CraftItem = 13,
  Host = 14,
  CustomEvent = 15,
  ChangeValues = 16,
  OnHit = 17,
  Respawn = 18,
}

export interface MessageWithNumberType {
  t: NumberMessageType;
}

export interface UpdateMovementMessage extends MessageWithNumberType {
  t: NumberMessageType.UpdateMovement;
  idx: number;
  data: MovementModel;
}

export interface UpdateAnimationMessage extends MessageWithNumberType {
  t: NumberMessageType.UpdateAnimation;
  idx: number;
  data: AnimationModel;
}

export interface UpdateAppearanceMessage extends MessageWithNumberType {
  t: NumberMessageType.UpdateAppearance;
  idx: number;
  data: AppearanceModel;
}

export interface UpdateEquipmentMessage extends MessageWithNumberType {
  t: NumberMessageType.UpdateEquipment;
  idx: number;
  data: EquipmentModel;
}

export interface UpdatePropertyMessage extends MessageWithNumberType {
  t: NumberMessageType.UpdateProperty;
  idx: number;
  data: unknown;
  propName: string;
}

export interface ChangeValuesMessage extends MessageWithNumberType {
  t: NumberMessageType.ChangeValues;
  data: ActorValuesModel;
}

export interface RespawnMessage extends MessageWithNumberType {
  t: NumberMessageType.Respawn;
  tTeleport: Teleport,
  tChangeValues: ChangeValuesMessage,
  tIsDead: UpdatePropertyMessage,
}

/* Messages with string type */

export enum StringMessageType {
  SetInventory = "setInventory",
  OpenContainer = "openContainer",
  Teleport = "teleport",
  CreateActor = "createActor",
  DestroyActor = "destroyActor",
  SetRaceMenuOpen = "setRaceMenuOpen",
  CustomPacket = "customPacket",
  HostStart = "hostStart",
  HostStop = "hostStop",
  UpdateGamemodeData = "updateGamemodeData",
}

export interface MessageWithStringType {
  type: StringMessageType;
}

export interface SetInventory extends MessageWithStringType {
  type: StringMessageType.SetInventory;
  inventory: InventoryModel;
}

export interface OpenContainer extends MessageWithStringType {
  type: StringMessageType.OpenContainer;
  target: number;
}

export interface Teleport extends MessageWithStringType {
  type: StringMessageType.Teleport;
  pos: number[];
  rot: number[];
  worldOrCell: number;
}

export interface CreateActorMessage extends MessageWithStringType {
  type: StringMessageType.CreateActor;
  idx: number;
  refrId?: number;
  transform: WorldPositionModel;
  isMe: boolean;
  appearance?: AppearanceModel;
  equipment?: EquipmentModel;
  inventory?: InventoryModel;
  baseId?: number;
  props?: Record<string, unknown>;
}

export interface DestroyActorMessage extends MessageWithStringType {
  type: StringMessageType.DestroyActor;
  idx: number;
}

export interface SetRaceMenuOpenMessage extends MessageWithStringType {
  type: StringMessageType.SetRaceMenuOpen;
  open: boolean;
}

export interface CustomPacket extends MessageWithStringType {
  type: StringMessageType.CustomPacket;
  content: Record<string, unknown>;
}

export interface HostStartMessage extends MessageWithStringType {
  type: StringMessageType.HostStart;
  target: number;
}

export interface HostStopMessage extends MessageWithStringType {
  type: StringMessageType.HostStop;
  target: number;
}

export interface UpdateGamemodeDataMessage extends MessageWithStringType {
  type: StringMessageType.UpdateGamemodeData;
  eventSources: Record<string, string>;
  updateOwnerFunctions: Record<string, string>;
  updateNeighborFunctions: Record<string, string>;
}

/* Network messages */

export type NetMessageType = NumberMessageType | StringMessageType;

export type NetMessageIface =
  // Type 1
  UpdateMovementMessage |
  UpdateAnimationMessage |
  UpdateAppearanceMessage |
  UpdateEquipmentMessage |
  UpdatePropertyMessage |
  ChangeValuesMessage |
  RespawnMessage |
  // Type 2
  SetInventory |
  OpenContainer |
  Teleport |
  CreateActorMessage |
  DestroyActorMessage |
  SetRaceMenuOpenMessage |
  CustomPacket |
  HostStartMessage |
  HostStopMessage |
  UpdateGamemodeDataMessage;

/**
 * Converts {@link NumberMessageType} OR {@link StringMessageType} to it's interface
 */
export type NetMessageToIface<T extends NetMessageType> =
  // Type 1
  T extends NumberMessageType.CustomPacket ? never :
  T extends NumberMessageType.UpdateMovement ? UpdateMovementMessage :
  T extends NumberMessageType.UpdateAnimation ? UpdateAnimationMessage :
  T extends NumberMessageType.UpdateAppearance ? UpdateAppearanceMessage :
  T extends NumberMessageType.UpdateEquipment ? UpdateEquipmentMessage :
  T extends NumberMessageType.Activate ? never :
  T extends NumberMessageType.UpdateProperty ? UpdatePropertyMessage :
  T extends NumberMessageType.PutItem ? never :
  T extends NumberMessageType.TakeItem ? never :
  T extends NumberMessageType.FinishSpSnippet ? never :
  T extends NumberMessageType.OnEquip ? never :
  T extends NumberMessageType.ConsoleCommand ? never :
  T extends NumberMessageType.CraftItem ? never :
  T extends NumberMessageType.Host ? never :
  T extends NumberMessageType.CustomEvent ? never :
  T extends NumberMessageType.ChangeValues ? ChangeValuesMessage :
  T extends NumberMessageType.OnHit ? never :
  T extends NumberMessageType.Respawn ? RespawnMessage :
  // Type 2
  T extends StringMessageType.SetInventory ? SetInventory :
  T extends StringMessageType.OpenContainer ? OpenContainer :
  T extends StringMessageType.Teleport ? Teleport :
  T extends StringMessageType.CreateActor ? CreateActorMessage :
  T extends StringMessageType.DestroyActor ? DestroyActorMessage :
  T extends StringMessageType.SetRaceMenuOpen ? SetRaceMenuOpenMessage :
  T extends StringMessageType.CustomPacket ? CustomPacket :
  T extends StringMessageType.HostStart ? HostStartMessage :
  T extends StringMessageType.HostStop ? HostStopMessage :
  T extends StringMessageType.UpdateGamemodeData ? UpdateGamemodeDataMessage :
  // Restrict usage if can't convert
  never;

export interface NetMessageTypeToIface extends IOMap<NetMessageType, NetMessageIface> {
  output: NetMessageToIface<this["input"]>
}

export const parseNetMessage = <T extends NetMessageType>(jsonMesssage: string): { msgType: T, msg: NetMessageToIface<T> } => {
  const msg = JSON.parse(jsonMesssage);
  return {
    msgType: (msg[nameOf<MessageWithNumberType>("t")] || msg[nameOf<MessageWithStringType>("type")]) as T,
    msg: msg,
  };
}
