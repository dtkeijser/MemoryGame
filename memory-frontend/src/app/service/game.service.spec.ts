import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {SessionService} from "./session.service";
import {GameService} from './game.service';
import {GameData} from "../model/data-model/GameData";
import {Player} from "../model/Player";
import {User} from "../model/User";
import {Card} from "../model/Card";
import {CardState} from "../model/CardState";
import {CardTheme} from "../model/CardTheme";

describe('GameService', () => {
  let service: GameService;
  let sessionService: SessionService;


  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        SessionService,
        GameService
      ]
    });
    service = TestBed.inject(GameService);
    sessionService = TestBed.inject(SessionService)
  });

  it('should be created', () => {

    expect(service).toBeTruthy();
  });

  it('from gameData create game ',  () =>{
    let testGameData = new GameData();
    let playerOne: Player = new Player()
    let playerOneUser: User = new User()
    let playerTwo: Player = new Player()
    let PlayerTwoUser: User = new User()



    sessionService.setUsernameForSession("Daniel")

    testGameData.id = 1
    playerOneUser.name = "Daniel"
    playerOne.user = playerOneUser
    testGameData.playerOne = playerOne
    PlayerTwoUser.name = "Boris"
    playerTwo.user = PlayerTwoUser
    testGameData.playerTwo = playerTwo
    testGameData.currentPlayer = playerTwo
    for (let i = 0; i < 4; i++) {
      let card = new Card()
      card.imageUrl = "000007.jpeg"
      card.cardState = CardState.DEFAULT
      testGameData.cards.push(card)
    }
    testGameData.theme = CardTheme.WINTER
    let testGame = service.createGameFromGameData(testGameData)
    expect(testGameData.id == testGame.id)
    expect(testGameData.playerTwo.user.name == testGame.playerTwo.user.name).toBeTruthy()
    expect(testGameData.theme == testGame.theme).toBeTruthy()
    expect(testGameData.playerOne.user.name == testGame.playerOne.user.name).toBeTruthy()

    expect(testGameData.cards[0].cardState == testGame.cards[0].cardState).toBeTruthy()
    expect(testGameData.cards[0].id == testGame.cards[0].id).toBeTruthy()
    expect(testGameData.cards[0].imageUrl == testGame.cards[0].imageUrl).toBeTruthy()

    expect(testGameData.cards[1].cardState == testGame.cards[1].cardState).toBeTruthy()
    expect(testGameData.cards[1].id == testGame.cards[1].id).toBeTruthy()
    expect(testGameData.cards[1].imageUrl == testGame.cards[1].imageUrl).toBeTruthy()

    expect(testGameData.cards[2].cardState == testGame.cards[2].cardState).toBeTruthy()
    expect(testGameData.cards[2].id == testGame.cards[2].id).toBeTruthy()
    expect(testGameData.cards[2].imageUrl == testGame.cards[2].imageUrl).toBeTruthy()

    expect(testGameData.cards[3].cardState == testGame.cards[3].cardState).toBeTruthy()
    expect(testGameData.cards[3].id == testGame.cards[3].id).toBeTruthy()
    expect(testGameData.cards[3].imageUrl == testGame.cards[3].imageUrl).toBeTruthy()

  });
});
