import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../../service/game.service";
import {Game} from "../../model/Game";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CardState} from "../../model/CardState";
import {Card} from "../../model/Card";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  animations: [
    trigger('cardFlipped', [
      state(CardState.DEFAULT.toString(), style({
        transform: 'none'
      })),
      state(CardState.DEFAULTTOFLIPPED.toString(), style({
        transform: 'perspective(600px) rotateY(180deg)'
      })),
      state(CardState.FLIPPED.toString(), style({
        transform: 'perspective(600px) rotateY(180deg)'
      })),
      state(CardState.FLIPPEDTODEFAULT.toString(), style({
        transform: 'none'
      })),
      state(CardState.MATCHED.toString(), style({
        visibility: 'false',
        transform: 'none',
        opacity: 0
      })),
      state(CardState.FLIPPEDTOMATCHED.toString(), style({
        visibility: 'false',
        transform: 'none',
        opacity: 0
      })),
      transition( "* =>" +  CardState.DEFAULTTOFLIPPED.toString() , [
        animate('400ms')
      ]),
      transition( "* =>" + CardState.FLIPPEDTODEFAULT.toString(), [
        animate('400ms')
      ]),
      transition("* =>"+ CardState.FLIPPEDTOMATCHED.toString(), [
        animate('1000ms 500ms')
      ]),
      transition("* =>"+ CardState.DEFAULT.toString(), [
        animate('400ms')
      ])
    ])
  ]
})

export class GameComponent implements OnInit, OnDestroy{
  public game: Game = undefined
  public gameId;
  public gameUpdaterInterval
  public lockRefresh = false
  public gameHistoryOld: Array<Card> = new Array<Card>();
 @Output() cardFlipped = new EventEmitter();

  constructor(public gameService: GameService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.gameId= this.activatedRoute.snapshot.params.id;
    this.gameService.findGameById(this.gameId).then((gameData) => {
      this.game = this.gameService.createGameFromGameData(gameData)
      this.gameHistoryOld = gameData.lastFlippedPairOfCards

    })

    this.gameUpdaterInterval = setInterval(() => {
      if (this.game.localPlayer.user.name != this.game.currentPlayer.user.name){
        if (!this.lockRefresh){
          this.refresh()
        }
      } else {
        console.log("currentPlayer is localPlayer")
      }
    }, 500)
  }

  public async onClickCard(cardLocation){
    await this.game.tryFlipCard(cardLocation)
    let gameDataPromise =  this.gameService.findGameById(this.gameId)
    let gameData = await gameDataPromise
    this.gameHistoryOld = gameData.lastFlippedPairOfCards
  }

  refresh(){
    this.lockRefresh = true
    this.gameService.findGameById(this.gameId).then(async (gameData) => {
      let gameHistoryNew = gameData.lastFlippedPairOfCards

      if (this.gameHistoryOld.length < gameHistoryNew.length){
        console.log('history old refresh' , this.gameHistoryOld)
        console.log('history new refresh', gameHistoryNew)
        console.log('localplayer name' , this.game.localPlayer.user.name)
        console.log('localplayer points' , this.game.localPlayer.points)
        let backendCard1 = gameData.lastFlippedPairOfCards[gameData.lastFlippedPairOfCards.length -1]
        let backendCard2 = gameData.lastFlippedPairOfCards[gameData.lastFlippedPairOfCards.length -2]
        let index1 =this.game.cardIndexFromId(backendCard1.id)
        let index2 = this.game.cardIndexFromId(backendCard2.id)

        await this.game.flipCard(index1)
        await this.game.flipCard(index2)
        this.gameHistoryOld = gameHistoryNew
        if (backendCard2.cardState == CardState.MATCHED && backendCard1.cardState == CardState.MATCHED){
          await this.game.matchCard(index1)
          await this.game.matchCard(index2)
        } else if (backendCard2.cardState == CardState.DEFAULT && backendCard1.cardState == CardState.DEFAULT){
          await this.game.flipBackCard(index1)
          await this.game.flipBackCard(index2)
        } else {
          throw Error
        }
      }
      this.game.playerOne.points = gameData.playerOne.points
      this.game.playerTwo.points = gameData.playerTwo.points
      if (gameData.currentPlayer.user.name == this.game.localPlayer.user.name){
        this.game.endTurn()
      }
      this.lockRefresh = false
    })
  }

  ngOnDestroy(): void {
    clearInterval(this.gameUpdaterInterval)
  }
}
