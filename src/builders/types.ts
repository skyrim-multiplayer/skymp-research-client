import { Game } from './../common/types';

export interface GameBuilder {
  Build(): Game;
}
