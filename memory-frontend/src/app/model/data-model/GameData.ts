import {Card} from "../Card";
import {GameState} from "../GameState";
import {Player} from "../Player";
import {CardTheme} from "../CardTheme";

export class GameData {
  id: number;
  cards: Array<Card> = new Array<Card>();
  gameState: GameState;
  playerOne: Player
  playerTwo: Player
  currentPlayer: Player
  numberOfPairs: number
  theme: CardTheme
  lastFlippedPairOfCards: Array<Card> = new Array<Card>()
}
