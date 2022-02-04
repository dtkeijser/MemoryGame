import {TestBed} from '@angular/core/testing';
import {GameService} from "../service/game.service"
import {Game} from './Game';
import {SessionService} from "../service/session.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {Card} from "./Card";
import {CardState} from "./CardState";
import {User} from "./User";
import {Player} from "./Player";

describe('Game', () => {
  let gamedefault: Game
  let gameflipped: Game
  let gameFlippedToDefault: Game
  let gameTryMatchToFlip: Game
  let gameTryFLIPPEDTOMATCHED : Game
  let gametryDEFAULTTOFLIPPED : Game
  let gameTryCurrentuserIsNotLocalUser: Game
  let gameTryLocaluserIsnotCurrentUSer: Game
  let gameTryShouldntFLipWithTwoCardsFLipped: Game
  let gameTryShouldntFLipWithTwoCardsflippedToDefault: Game
  let service: GameService;

  function  createGame(){
    let game = new Game(service)
    let currentPlayer: Player = new Player()
    let currentUser: User = new User()
    let localPlayer: Player = new Player()
    let localUser: User = new User()
    game.cards = new Array<Card>()

    currentUser.name = "Daniel"
    currentPlayer.user = currentUser
    game.currentPlayer = currentPlayer
    localUser.name = "Daniel"
    localPlayer.user = localUser
    game.localPlayer = localPlayer

    for (let i = 0; i < 4; i++) {
      let card = new Card()
      card.imageUrl = "000007.jpeg"
      card.cardState = CardState.DEFAULT
      game.cards.push(card)
    }
    return game
  }
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

    gamedefault = createGame()
    gameflipped = createGame()
    gameflipped.cards[0].cardState =CardState.FLIPPED
    gameFlippedToDefault = createGame()
    gameFlippedToDefault.cards[0].cardState = CardState.FLIPPEDTODEFAULT
    gametryDEFAULTTOFLIPPED = createGame()
    gametryDEFAULTTOFLIPPED.cards[0].cardState = CardState.DEFAULTTOFLIPPED
    gameTryMatchToFlip = createGame()
    gameTryMatchToFlip.cards[0].cardState = CardState.MATCHED
    gameTryFLIPPEDTOMATCHED = createGame()
    gameTryFLIPPEDTOMATCHED.cards[0].cardState = CardState.FLIPPEDTOMATCHED

    gameTryCurrentuserIsNotLocalUser = createGame()
    // currentUserAlt.name = "Tom"
    // currentPlayerAlt.user = currentUserAlt
    // gameTryCurrentuserIsNotLocalUser.currentPlayer = currentPlayerAlt
    gameTryCurrentuserIsNotLocalUser.currentPlayer.user.name = "Boris"

    gameTryLocaluserIsnotCurrentUSer = createGame()
    gameTryLocaluserIsnotCurrentUSer.localPlayer.user.name = "Boris"

    gameTryShouldntFLipWithTwoCardsFLipped = createGame()
    gameTryShouldntFLipWithTwoCardsFLipped.cards[0].cardState = CardState.FLIPPED
    gameTryShouldntFLipWithTwoCardsFLipped.cards[1].cardState = CardState.FLIPPED

    gameTryShouldntFLipWithTwoCardsflippedToDefault = createGame()
    gameTryShouldntFLipWithTwoCardsflippedToDefault.cards[0].cardState = CardState.FLIPPEDTODEFAULT
    gameTryShouldntFLipWithTwoCardsflippedToDefault.cards[1].cardState = CardState.FLIPPEDTODEFAULT
  });

  it('should  flip when cardState is default', () => {
    expect(gamedefault.canFlipCard(0)).toBeTruthy()
    expect(gamedefault.canFlipCard(1)).toBeTruthy()
    expect(gamedefault.canFlipCard(2)).toBeTruthy()
    expect(gamedefault.canFlipCard(3)).toBeTruthy()
  });

  it('should  not flip when cardState is flipped', () => {
    expect(gameflipped.canFlipCard(0)).toBeFalse()
    expect(gameflipped.canFlipCard(1)).toBeTruthy()
    expect(gameflipped.canFlipCard(2)).toBeTruthy()
    expect(gameflipped.canFlipCard(3)).toBeTruthy()
  });

  it('should  not flip when cardState is flippedToDefault', () => {
    expect(gameFlippedToDefault.canFlipCard(0)).toBeFalse()
    expect(gameFlippedToDefault.canFlipCard(1)).toBeTruthy()
    expect(gameFlippedToDefault.canFlipCard(2)).toBeTruthy()
    expect(gameFlippedToDefault.canFlipCard(3)).toBeTruthy()
  });

  it('should  not flip when cardState is defaultToFlipped', () => {
    expect(gameFlippedToDefault.canFlipCard(0)).toBeFalse()
    expect(gameFlippedToDefault.canFlipCard(1)).toBeTruthy()
    expect(gameFlippedToDefault.canFlipCard(2)).toBeTruthy()
    expect(gameFlippedToDefault.canFlipCard(3)).toBeTruthy()
  });

  it('should  not flip when cardState is Match', () => {
    expect(gameTryMatchToFlip.canFlipCard(0)).toBeFalse()
    expect(gameTryMatchToFlip.canFlipCard(1)).toBeTruthy()
    expect(gameTryMatchToFlip.canFlipCard(2)).toBeTruthy()
    expect(gameTryMatchToFlip.canFlipCard(3)).toBeTruthy()
  });
  it('should  not flip when cardState is FlippedToMatch', () => {
    expect(gameTryFLIPPEDTOMATCHED.canFlipCard(0)).toBeFalse()
    expect(gameTryFLIPPEDTOMATCHED.canFlipCard(1)).toBeTruthy()
    expect(gameTryFLIPPEDTOMATCHED.canFlipCard(2)).toBeTruthy()
    expect(gameTryFLIPPEDTOMATCHED.canFlipCard(3)).toBeTruthy()
  });

  it('should not flip when currentPlayer is  not Localplayer', () => {
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(0)).toBeFalse()
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(1)).toBeFalse()
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(2)).toBeFalse()
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(3)).toBeFalse()
  });

  it('should not flip when localPlayer is  not currentPlayer', () => {
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(0)).toBeFalse()
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(1)).toBeFalse()
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(2)).toBeFalse()
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(3)).toBeFalse()
  });

  it('should not flip when two cards are flipped', () => {
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(0)).toBeFalse()
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(1)).toBeFalse()
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(2)).toBeFalse()
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(3)).toBeFalse()
  });

  it('should not flip when two cards are DEFAULTTOFLIPPED', () => {
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(0)).toBeFalse()
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(1)).toBeFalse()
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(2)).toBeFalse()
    expect(gameTryCurrentuserIsNotLocalUser.canFlipCard(3)).toBeFalse()
  });

});
