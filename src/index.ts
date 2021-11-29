import { SkympClientGameBuilder } from './builders/SkympClientGameBuilder';
import { GameBuilder } from './builders/types';
import { SimpleLogger } from './common/SimpleLogger';
import { Logger } from './common/types';

declare global {
  var logger: Logger;
}

globalThis.logger = new SimpleLogger();

const game = new SkympClientGameBuilder().Build();
game.start();
