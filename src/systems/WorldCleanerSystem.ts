import * as sp from "skyrimPlatform";
import * as tk from "tick-knock";

import { playerId } from './../skyrim.types';

export class WorldCleanerSystem extends tk.System {
  private _protectionList: Map<number, number> = new Map<number, number>();
  private _deletedAmount: number = 0;

  /**
   * Adds protection against deletion
   * @param actorId 
   */
  public addProtection(actorId: number): void {
    const protectionValue = this._protectionList.get(actorId);
    this._protectionList.set(actorId, (protectionValue ?? 0) + 1);
  }

  /**
   * Removes protection against deletion
   * @param actorId 
   */
  public removeProtection(actorId: number): void {
    const protectionValue = (this._protectionList.get(actorId) ?? 0) - 1;
    if (protectionValue > 0) {
      this._protectionList.set(actorId, protectionValue);
    } else {
      this._protectionList.delete(actorId);
    }
  }

  public update(dt: number): void {
    this.removeRandomActor();
  }

  private isInDialogue(actor: sp.Actor): boolean {
    return actor.isInDialogueWithPlayer() || !!actor.getDialogueTarget;
  }

  private removeRandomActor(): void {
    const playerActor = sp.Game.getPlayer()!;
    const randomActor = sp.Game.findRandomActor(
      playerActor.getPositionX(),
      playerActor.getPositionY(),
      playerActor.getPositionZ(),
      8192
    );
    if (!randomActor) return;

    const randomActorId = randomActor.getFormID();
    const isProtected = this._protectionList.get(randomActorId)! > 0;
    if (isProtected === true) return;

    if (randomActorId === playerId || randomActor.isDeleted()) return;
    if (this.isInDialogue(randomActor)) {
      // Deleting actor in dialogue crashes Skyrim
      // https://github.com/skyrim-multiplayer/issue-tracker/issues/13
      randomActor.setPosition(0, 0, 0);
      return;
    }

    randomActor.disable(false).then(() => {
      const actor = sp.Actor.from(sp.Game.getFormEx(randomActorId));
      if (!actor || this.isInDialogue(actor)) return;
      actor.delete();
      this._deletedAmount = this._deletedAmount + 1;
    });
  }
}
