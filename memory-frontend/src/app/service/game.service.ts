import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Game} from "../model/Game";
import {GameSummary} from "../model/GameSummary";
import {map} from "rxjs/operators";
import {Card} from "../model/Card";
import {Player} from "../model/Player";
import {User} from "../model/User";
import {CardState} from "../model/CardState";
import {GameData} from "../model/data-model/GameData";
import {SessionService} from "./session.service";



@Injectable({
  providedIn: 'root'
})
export class GameService {
  private APIURL = "http://localhost:8080/games";
  constructor(private http: HttpClient,
              private session: SessionService) {
  }

  createGame(theme, numberOfPairs){
    return this.http.post(this.APIURL,{
      "username": this.session.getSessionUsername(),
      "theme": theme,
      "numberOfPairs": numberOfPairs
    }).toPromise().then(response => {
      console.log(response)
      return response["id"]
    })
  }

  private getGameSummary(response){
    let games: Array<GameSummary> = new Array<GameSummary>()
    for (let i = 0; i < response['length']; i++) {
      let gameSummary: GameSummary = new GameSummary()
      gameSummary.id = response[i]['id']
      gameSummary.gameState = response[i]['gameState']
      gameSummary.numberOfPairs = response[i]['numberOfPairs']
      gameSummary.theme = response[i]['theme']
      gameSummary.gameCreator = response[i]['players'][0]['user']['username']
      games.push(gameSummary)

    }
    return games
  }

  private getGameData(response){

    let game: GameData = new GameData()
    let cards: Card[] = []
    let playerOne: Player = new Player()
    let userOne: User = new User()
    let playerTwo: Player = new Player()
    let userTwo: User = new User()
    let currentPlayer: Player = new Player()
    let currentUser: User = new User()

    //info Player One
    let playerOneData = response['players'][0]
    userOne.name = playerOneData["user"]["username"]
    playerOne.id= playerOneData["id"]
    playerOne.user = userOne
    playerOne.points = playerOneData['points']

    //info Player Two
    let playerTwoData = response['players'][1]
    userTwo.name = playerTwoData["user"]["username"]
    playerTwo.id= playerTwoData["id"]
    playerTwo.user = userTwo
    playerTwo.points = playerTwoData['points']

    //info Current Player
    currentUser.name = response["currentPlayer"]["user"]["username"]
    currentPlayer.id= response["currentPlayer"]["id"]
    currentPlayer.user = currentUser

    //info Cards
    for (let cardData of response["cards"]){
      let card = new Card()
      card.id = cardData["id"],
      card.imageUrl = cardData["image"],
      card.cardState = CardState[cardData["cardState"]]
      cards.push(card)
    }

    game.id = response['id']
    game.theme = response['theme']
    game.cards = cards
    game.playerOne = playerOne
    game.playerTwo = playerTwo
    game.currentPlayer = currentPlayer
    game.lastFlippedPairOfCards = response['lastFlippedPairOfCards']
    return game
  }


  findPendingGameSummariesFromOtherUsers(){
    let notUser = this.session.getSessionUsername()
    let observable = this.http.get(this.APIURL+"?notUser=" + notUser + "&gameStateStr=PENDING")
      .pipe(map(this.getGameSummary))
    return observable
  }

  findOwnGameSummaries(){
    let user = this.session.getSessionUsername()
    let observable = this.http.get(this.APIURL+"?User=" + user + "&gameStateStr=ACTIVE")
      .pipe(map(this.getGameSummary))
    return observable
  }

  joinGame(id){
    return this.http.put(this.APIURL+"/"+ id + "?command=join",{
      "username": this.session.getSessionUsername()
    }).toPromise()
  }


  flipGameCard(id , cardLocation){
      let promise = this.http.put(this.APIURL + "/"  + id + "?command=flip", {
        "username": this.session.getSessionUsername(),
        "cardPosition": cardLocation
      }).toPromise().then(response => {
        let data = this.getGameData(response)
        return data
      })
    return promise
  }

  findGameById(id){
    return this.http.get(this.APIURL+"/" +id)
      .pipe(map(this.getGameData)).toPromise()
  }

  createGameFromGameData(gameData: GameData) : Game{
    const game = new Game(this)
    game.id = gameData.id
    game.cards = Array.from(gameData.cards)
    game.playerOne = gameData.playerOne
    game.playerTwo = gameData.playerTwo
    game.gameState = gameData.gameState
    game.theme = gameData.theme
    game.numberOfPairs = gameData.numberOfPairs

    if(gameData.playerOne.user.name == gameData.currentPlayer.user.name){
      game.currentPlayer = gameData.playerOne
    } else if(gameData.playerTwo.user.name == gameData.currentPlayer.user.name){
      game.currentPlayer = gameData.playerTwo
    } else {
      throw Error
    }

    if(gameData.playerOne.user.name == this.session.getSessionUsername()){
      game.localPlayer = gameData.playerOne
    } else if(gameData.playerTwo.user.name == this.session.getSessionUsername()){
      game.localPlayer = gameData.playerTwo
    } else {
      throw Error
    }

    return game
  }
}
