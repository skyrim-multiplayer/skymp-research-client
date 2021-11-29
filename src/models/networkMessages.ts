import { CallIOMap, IOMap } from '../common/types';
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

export interface NumberTypeMessage {
  t: NumberMessageType;
}

export interface CustomPacket extends NumberTypeMessage {
  t: NumberMessageType.CustomPacket;
  content: Record<string, unknown>;
}

export interface BrowserTokenCustomPacket extends CustomPacket {
  t: NumberMessageType.CustomPacket;
  content: {
    customPacketType: "browserToken";
    token: string;
  }
}

export interface LoginWithSkympIOCustomPacket extends CustomPacket {
  t: NumberMessageType.CustomPacket;
  content: {
    customPacketType: "loginWithSkympIo";
    gameData: {
      profileId: number;
    }
  }
}

export interface UpdateMovementMessage extends NumberTypeMessage {
  t: NumberMessageType.UpdateMovement;
  idx: number;
  data: MovementModel;
}

export interface UpdateAnimationMessage extends NumberTypeMessage {
  t: NumberMessageType.UpdateAnimation;
  idx: number;
  data: AnimationModel;
}

export interface UpdateAppearanceMessage extends NumberTypeMessage {
  t: NumberMessageType.UpdateAppearance;
  idx: number;
  data: AppearanceModel;
}

export interface UpdateEquipmentMessage extends NumberTypeMessage {
  t: NumberMessageType.UpdateEquipment;
  idx: number;
  data: EquipmentModel;
}

export interface UpdatePropertyMessage extends NumberTypeMessage {
  t: NumberMessageType.UpdateProperty;
  idx: number;
  data: unknown;
  propName: string;
}

export interface ChangeValuesMessage extends NumberTypeMessage {
  t: NumberMessageType.ChangeValues;
  data: ActorValuesModel;
}

export interface RespawnMessage extends NumberTypeMessage {
  t: NumberMessageType.Respawn;
  tTeleport: TeleportMessage,
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

export interface StringTypeMessage {
  type: StringMessageType;
}

export interface SetInventoryMessage extends StringTypeMessage {
  type: StringMessageType.SetInventory;
  inventory: InventoryModel;
}

export interface OpenContainerMessage extends StringTypeMessage {
  type: StringMessageType.OpenContainer;
  target: number;
}

export interface TeleportMessage extends StringTypeMessage {
  type: StringMessageType.Teleport;
  pos: number[];
  rot: number[];
  worldOrCell: number;
}

export interface CreateActorMessage extends StringTypeMessage {
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

export interface DestroyActorMessage extends StringTypeMessage {
  type: StringMessageType.DestroyActor;
  idx: number;
}

export interface SetRaceMenuOpenMessage extends StringTypeMessage {
  type: StringMessageType.SetRaceMenuOpen;
  open: boolean;
}

export interface HostStartMessage extends StringTypeMessage {
  type: StringMessageType.HostStart;
  target: number;
}

export interface HostStopMessage extends StringTypeMessage {
  type: StringMessageType.HostStop;
  target: number;
}

export interface UpdateGamemodeDataMessage extends StringTypeMessage {
  type: StringMessageType.UpdateGamemodeData;
  eventSources: Record<string, string>;
  updateOwnerFunctions: Record<string, string>;
  updateNeighborFunctions: Record<string, string>;
}

/* Network messages */

export type NetMessageType = NumberMessageType | StringMessageType;

export type NetMessageIface =
  // Type 1
  CustomPacket |
  BrowserTokenCustomPacket |
  LoginWithSkympIOCustomPacket |
  UpdateMovementMessage |
  UpdateAnimationMessage |
  UpdateAppearanceMessage |
  UpdateEquipmentMessage |
  UpdatePropertyMessage |
  ChangeValuesMessage |
  RespawnMessage |
  // Type 2
  SetInventoryMessage |
  OpenContainerMessage |
  TeleportMessage |
  CreateActorMessage |
  DestroyActorMessage |
  SetRaceMenuOpenMessage |
  HostStartMessage |
  HostStopMessage |
  UpdateGamemodeDataMessage;

/**
 * Converts {@link NumberMessageType} OR {@link StringMessageType} to it's interface
 */
export type NetMessageTypeToIface<T extends NetMessageType> =
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
  T extends StringMessageType.SetInventory ? SetInventoryMessage :
  T extends StringMessageType.OpenContainer ? OpenContainerMessage :
  T extends StringMessageType.Teleport ? TeleportMessage :
  T extends StringMessageType.CreateActor ? CreateActorMessage :
  T extends StringMessageType.DestroyActor ? DestroyActorMessage :
  T extends StringMessageType.SetRaceMenuOpen ? SetRaceMenuOpenMessage :
  T extends StringMessageType.CustomPacket ? CustomPacket :
  T extends StringMessageType.HostStart ? HostStartMessage :
  T extends StringMessageType.HostStop ? HostStopMessage :
  T extends StringMessageType.UpdateGamemodeData ? UpdateGamemodeDataMessage :
  // Restrict usage if can't convert
  never;

export interface IONetMessageTypeToIface extends IOMap<NetMessageType, NetMessageIface> {
  output: NetMessageTypeToIface<this["input"]>
}

export type AnyTypeMessage = NumberTypeMessage | StringTypeMessage;

export type AnyTypeMessageToInnerType<C extends AnyTypeMessage> =
  C extends NumberTypeMessage ? C["t"] :
  C extends StringTypeMessage ? C["type"] :
  never;

/**
 * Create a network message
 * 
 * Need to rework to auto detect message type which depends on @param msg content
 *  
 * @param msg 
 * @returns 
 */
export const createNetMessageWithCheck = <
  T extends AnyTypeMessage,
  C extends AnyTypeMessageToInnerType<T>,
  P extends IOMap<T, NetMessageTypeToIface<C>>
>(msg: CallIOMap<P, T>): NetMessageIface => {
  return msg;
}

/**
 * Create a network message with the specified type
 * @param msg 
 * @returns 
 */
export const createNetMessage = <T extends NetMessageType>(msg: NetMessageTypeToIface<T>): NetMessageIface => {
  return msg;
}

/**
 * Create a network message with the specified interface
 * @param msg 
 * @returns 
 */
export const createNetMessageByIface = <T extends NetMessageIface>(msg: T): NetMessageIface => {
  return msg;
}

const stringMessageTypeValues = Object.values(StringMessageType);
/**
 * Parse network message with check for unknown message
 * 
 * If message type NOT in {@link NetMessageType} then return null message type
 * 
 * @param jsonMesssage 
 * @returns 
 */
export const parseNetMessageStrict = <T extends NetMessageType>(jsonMesssage: string): { msgType: T | null, msg: NetMessageTypeToIface<T> } => {
  const msg = JSON.parse(jsonMesssage);

  let messagePropName: string = nameOf<NumberTypeMessage>("t");
  if (msg[messagePropName] && msg[messagePropName] in NumberMessageType) {
    return {
      msgType: msg[messagePropName] as T,
      msg: msg,
    }
  }

  messagePropName = nameOf<StringTypeMessage>("type");
  if (msg[messagePropName] && stringMessageTypeValues.includes(msg[messagePropName])) {
    return {
      msgType: msg[messagePropName] as T,
      msg: msg,
    }
  }

  return {
    msgType: null,
    msg: msg,
  }
}

/**
 * Parse network message with no check for unknown message. Use if you are sure that you will not receive an unknown message. This version is faster then {@link parseNetMessageStrict} 
 * @example You can receive "{ t: 100500, ... }" message which type are unknown, but the function returns { msgType: 100500, ... }
 * @param jsonMesssage 
 * @returns 
 */
export const parseNetMessage = <T extends NetMessageType>(jsonMesssage: string): { msgType: T, msg: NetMessageTypeToIface<T> } => {
  const msg = JSON.parse(jsonMesssage);
  return {
    msgType: (msg[nameOf<NumberTypeMessage>("t")] || msg[nameOf<StringTypeMessage>("type")]) as T,
    msg: msg,
  };
}
