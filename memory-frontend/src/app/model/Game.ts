import {Card} from "./Card";
import {Player} from "./Player";
import {GameState} from "./GameState"
import {CardTheme} from "./CardTheme";
import {CardState} from "./CardState";
import {GameService} from "../service/game.service";

export class Game {
  id: number;
  cards: Array<Card> = new Array<Card>();
  gameState: GameState;
  playerOne: Player
  playerTwo: Player
  currentPlayer: Player
  numberOfPairs: number
  theme: CardTheme
  localPlayer: Player
  lastFlippedPairOfCards: Array<Card> = new Array<Card>()

  constructor(private gameService: GameService){}


  getCardStateCount(cardState){
    let numberOfCardsWithState = 0;
    this.cards.forEach(card =>{
      if(card.cardState == cardState){
        numberOfCardsWithState++
      }
    })
    return numberOfCardsWithState;
  }
  async tryFlipCard(index){
    if ( this.canFlipCard(index)) {
      await this.flipCard(index)
      await this.gameService.flipGameCard(this.id, index).then( async gameDataBackend => {
        await this.timeOut(400)
        let defaultCards = this.findCardsChangedToDefault(gameDataBackend)
        let matchedCards = this.findCardsChangedToMatched(gameDataBackend)
        if (defaultCards.length >2|| matchedCards.length >2){
          throw Error
        }
        if (defaultCards.length == 2 || matchedCards.length ==2){
          let promisesOfCards = []
          let isNotMatch = matchedCards.length == 0 && defaultCards.length == 2

          for (let i = 0; i < defaultCards.length; i++) {
            let cardIndex = defaultCards[i]
            promisesOfCards.push(this.flipBackCard(cardIndex))
          }
          for (let i = 0; i < matchedCards.length; i++) {
            let cardIndex = matchedCards[i]
            promisesOfCards.push(this.matchCard(cardIndex))
          }
          await Promise.all(promisesOfCards)
          if (isNotMatch) {
            this.endTurn()
          } else {this.localPlayer.points += 1}
        }
      })
    }
  }

  findCardsChangedToFlipped(gameData){
    return this.findCardsChangedToState(gameData, [CardState.FLIPPED, CardState.DEFAULTTOFLIPPED])
  }
  findCardsChangedToMatched(gameData){
    return this.findCardsChangedToState(gameData, [CardState.MATCHED, CardState.FLIPPEDTOMATCHED])
  }
  findCardsChangedToDefault(gameData){
    return this.findCardsChangedToState(gameData, [CardState.DEFAULT, CardState.FLIPPEDTODEFAULT])
  }

  findCardsChangedToState(gameData, targetCardStates){
    let changedCards = []
    this.cards.forEach((card, i, ) => {
      if (targetCardStates.includes(gameData.cards[i].cardState)){
        if (!targetCardStates.includes(card.cardState)){
          changedCards.push(i)
        }
      }
    })
    return changedCards
  }

  private timeOut(ms){
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  canFlipCard(index) {
    return (
     ( this.getCardStateCount(CardState.FLIPPED)
      + this.getCardStateCount(CardState.DEFAULTTOFLIPPED)
      + this.getCardStateCount(CardState.FLIPPEDTODEFAULT)
      + this.getCardStateCount(CardState.FLIPPEDTOMATCHED) ) <2
      && this.cards[index].cardState == CardState.DEFAULT
      && this.localPlayer.user.name == this.currentPlayer.user.name
    )
  }

  async flipCard(index){
    this.cards[index].cardState = CardState.DEFAULTTOFLIPPED
    await this.timeOut(400)
    this.cards[index].cardState = CardState.FLIPPED
  }

  async flipBackCard(index){
    this.cards[index].cardState = CardState.FLIPPEDTODEFAULT
    await this.timeOut(400)
    this.cards[index].cardState = CardState.DEFAULT
  }
  async matchCard(index){
    this.cards[index].cardState = CardState.FLIPPEDTOMATCHED
    await this.timeOut(400)
    this.cards[index].cardState = CardState.MATCHED
  }

  cardIndexFromId(id){
    let index = undefined
    this.cards.forEach((c , i ) =>{
      if (c.id == id ){
         index = i
      }
    })
    if (index == undefined){
      throw Error
    } else {
      return index
    }
  }

  endTurn(){
    if (this.currentPlayer == this.playerOne){
      this.currentPlayer = this.playerTwo
    } else if (this.currentPlayer == this.playerTwo) {
      this.currentPlayer = this.playerOne
    } else {
      throw Error
    }
  }

  getOpponent(){
    if (this.playerOne == this.localPlayer){
            return this.playerTwo
    } else if (this.playerTwo == this.localPlayer){
      return this.playerOne
    } else throw Error
  }

 }
