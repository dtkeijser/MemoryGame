import {GameState} from "./GameState";
import {CardTheme} from "./CardTheme";

export class GameSummary{
  id: number;
  gameState: GameState;
  numberOfPairs: number
  theme: CardTheme
  gameCreator: string
}
