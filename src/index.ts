import { SkympClientGameBuilder } from './builders/SkympClientGameBuilder';
import { GameBuilder } from './builders/types';

const game = new SkympClientGameBuilder().Build();
game.start();
