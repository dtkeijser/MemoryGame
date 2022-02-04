package com.ewa.team08.memory.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class GameTest {

    private Game testGame;

    @BeforeEach
    private void createGame(){
        //game is active has 4 cards and a theme of winter
        User user1 = new User("greenacres@death.com", "JohnDoe");
        User user2 = new User("titans@olympus,com", "Zeus");
        List<Player> players = new ArrayList<>();
        players.add(new Player(user1));
        players.add(new Player(user2));
        Game game = new Game();
        game.setPlayers(players);
        players.get(0).setGame(game);
        game.setGameState(GameState.ACTIVE);
        game.setTheme(CardTheme.WINTER);
        game.setCurrentPlayer(players.get(0));
//        game.init(2, CardTheme.WINTER );

        // the cards for the game are:
        // 000001.jpeg
        // 000001.jpeg
        // 000002.jpeg
        // 000002.jpeg
        List<Card> cards = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            cards.add(new Card(CardImage.getCardImages().get(i), CardState.DEFAULT));
            cards.add(new Card(CardImage.getCardImages().get(i), CardState.DEFAULT));
        }
        game.setCards(cards);

        this.testGame = game;
    }

    @Test
    void initTestCardsArraySize(){
        //arrange
        //clear cards array
        this.testGame.getCards().clear();
        //act
        this.testGame.init(3, CardTheme.NATURE);
        //assert
        //expected size 6
        assert this.testGame.getCards().size() == 6;
    }

    @Test
    void initTestCardArrayDuplicateCards(){
        //arrange
        //clear cards array
        //make a set to get unique values for card images from the array
        this.testGame.getCards().clear();
        Set<String> cardsImages = new HashSet<>();
        //act
        this.testGame.init(3, CardTheme.NATURE);
        for (Card card: this.testGame.getCards()
             ) {
            cardsImages.add(card.getImage());
        }
        //assert
        //expected cardImages size is 3
        assert cardsImages.size() == 3;
    }

    @Test
    void initTestCardsState(){
        //arrange
        //clear cards array
        this.testGame.getCards().clear();
        //act
        this.testGame.init(3, CardTheme.NATURE);
        //assert
        //expected cardState is default
        for (Card card: this.testGame.getCards()
             ) {
            assert card.getCardState() == CardState.DEFAULT;
        }
    }

    @Test
    void flipCardTestDefaultToFlipped() {
        //arrange
        //see before each
        //act
        this.testGame.flipCard(1);
        //assert
        List<Card> cards = this.testGame.getCards();
        Card testCard = cards.get(1);
        assert testCard.getCardState() == CardState.FLIPPED;
    }

    @Test
    void flipCardTestFlippedToFLipped() {
        //arrange
        //first set 1 cartState to flipped
        Card testCard = this.testGame.getCards().get(2);
        testCard.setCardState(CardState.FLIPPED);
        //act
        this.testGame.flipCard(2);
        //assert
       assert testCard.getCardState() == CardState.FLIPPED;
    }

    @Test
    void flipCardTestMatchedToFLipped() {
        //arrange
        //first set 1 cartState to matched
        Card testCard = this.testGame.getCards().get(2);
        testCard.setCardState(CardState.MATCHED);
        //act
        this.testGame.flipCard(2);
        //assert
        assert testCard.getCardState() == CardState.MATCHED;
    }


    @Test
    void tryForCardMatchWithoutMatch() {
        //arrange
        //set  both cards to flipped but without a match
        //card image 000001.jpeg
        this.testGame.getCards().get(1).setCardState(CardState.FLIPPED);
        //card image 000002.jpeg
        this.testGame.getCards().get(3).setCardState(CardState.FLIPPED);
        //act
        this.testGame.tryForCardMatch();
        //assert
        assert this.testGame.getCards().get(1).getCardState() == CardState.DEFAULT;
        assert this.testGame.getCards().get(3).getCardState() == CardState.DEFAULT;
    }

    @Test
    void tryForCardMatchWithAMatch() {
        //arrange
        //set on both cards to flipped but with a match
        //card image 000001.jpeg
        this.testGame.getCards().get(1).setCardState(CardState.FLIPPED);
        //card image 000001.jpeg
        this.testGame.getCards().get(0).setCardState(CardState.FLIPPED);
        //act
        this.testGame.tryForCardMatch();
        //assert
        assert this.testGame.getCards().get(1).getCardState() == CardState.MATCHED;
        assert this.testGame.getCards().get(0).getCardState() == CardState.MATCHED;
    }

    @Test
    void tryForCardMatchWithOneCardFlipped(){
        //arrange
        //set one card to flipped
        //card image 000001.jpeg
        //expected the cards array stay the same
        List<Card> copyCards = List.copyOf(this.testGame.getCards());
        this.testGame.getCards().get(1).setCardState(CardState.FLIPPED);
        //act
        this.testGame.tryForCardMatch();
        //assert
        assert this.testGame.getCards().equals(copyCards);
    }

    @Test
    void tryForCardMatchChangePlayerTurn(){
        //arrange
        //set a non matching pair of cards to flipped
        this.testGame.getCards().get(1).setCardState(CardState.FLIPPED);
        //card image 000002.jpeg
        this.testGame.getCards().get(3).setCardState(CardState.FLIPPED);

        //act
        this.testGame.tryForCardMatch();
        // assert
        // expected player player 2
        assert this.testGame.getCurrentPlayer() == this.testGame.getPlayers().get(1);
    }

    @Test
    void checkEndGame() {
        //arrange
        // set all cards states in the card array to matched
        for (Card card: this.testGame.getCards()
        ) {
            card.setCardState(CardState.MATCHED);
        }
        //act
        this.testGame.checkEndGame();
        //assert
        assert  this.testGame.getGameState() == GameState.DONE;
    }

    @Test
    void checkDoesntEndGame() {
        //arrange
        // set a few cards to match the rest to default
        this.testGame.getCards().get(0).setCardState(CardState.MATCHED);
        this.testGame.getCards().get(1).setCardState(CardState.MATCHED);
        //act
        this.testGame.checkEndGame();
        //assert
        assert  this.testGame.getGameState() == GameState.ACTIVE;
    }
}