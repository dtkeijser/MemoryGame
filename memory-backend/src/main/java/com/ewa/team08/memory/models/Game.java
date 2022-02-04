package com.ewa.team08.memory.models;

import com.ewa.team08.memory.repositories.Identifiable;
import com.ewa.team08.memory.views.JsonViews;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;
import java.util.*;

@NamedQueries(
        {
                @NamedQuery(name = "Gamefindstatusnotuser",
                        query = "select o from Game o, User u, Player p where o = p.game and p.user = u  and not u.username = ?1 and o.gameState =  ?2"
                ),
                @NamedQuery(name = "findGamesByGameState",
                        query = "select o from Game o where o.gameState = ?1 "),

                @NamedQuery(name = "findGameByUserAndGameState",
                        query = "SELECT o from Game o, User  u , Player  p where o = p.game and p.user = u and u.username = ?1 and  o.gameState = ?2 " ),

                @NamedQuery(name = "findGamesByUser",
                        query = "SELECT o from Game o, User  u, Player p where o= p.game and p.user = u and u.username = ?1 order by o.gameState" )
        }

)

@Entity
public class Game implements Identifiable {

    @Id
    @GeneratedValue
    @JsonView(JsonViews.Summary.class)
    private long id;

    @OneToMany(cascade = CascadeType.PERSIST)
    @JsonView(JsonViews.Summary.class)
    @OrderColumn(name = "ordinal_position")
    private List<Player> players = new ArrayList<>();

    @OneToMany(cascade = CascadeType.PERSIST)
    @JsonView(JsonViews.Full.class)
    @OrderColumn(name = "ordinal_position")
    private List<Card> cards;

    @OneToOne
    @JsonView(JsonViews.Summary.class)
    private Player currentPlayer;

    @Enumerated(EnumType.STRING)
    @JsonView(JsonViews.Summary.class)
    private GameState gameState;

    @JsonView(JsonViews.Summary.class)
    private CardTheme theme;

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JsonView(JsonViews.Full.class)
    @OrderColumn(name = "ordinal_position")
    private List<Card> lastFlippedPairOfCards = new ArrayList<>();

    public Game(List<Player> players, GameState gameState) {
        this.players = players;
        this.gameState = gameState;
    }


    public Game() {
    }

    public void init(int numberOfPairs, CardTheme theme) {
        var cardImages = getRandomCardImages(numberOfPairs);
        List<Card> cards = new ArrayList<>();
        for (int i = 0; i < numberOfPairs; i++) {
            cards.add(new Card(cardImages.get(i), CardState.DEFAULT));
            cards.add(new Card(cardImages.get(i), CardState.DEFAULT));
        }
        Collections.shuffle(cards);
        this.cards = cards;
    }

    //create cardLocations arrayList with number of pairs
    private List<String> getRandomCardImages(int amount) {
        ArrayList<String> shuffledCardLocations = CardImage.getCardImages();
        Collections.shuffle(shuffledCardLocations);
        return shuffledCardLocations.subList(0, amount);
    }

    //Check flip cards matched
    public void flipCard(int cardPosition){
        Card card = cards.get(cardPosition);
        if (card.getCardState() != CardState.MATCHED){
            card.setCardState(CardState.FLIPPED);
        }
    }

    public Optional<List<Card>> tryForCardMatch(){
        List<Card> flippedCards = getCardsByState(CardState.FLIPPED);
        Optional<List<Card>> optionalMatchedCards = Optional.empty();
        if (flippedCards.size() == 2){
            Card cardOne = flippedCards.get(0);
            Card cardTwo = flippedCards.get(1);
            this.lastFlippedPairOfCards.add(cardOne);
            this.lastFlippedPairOfCards.add(cardTwo);
            if (cardOne.getImage().equals(cardTwo.getImage())){
                cardOne.setCardState(CardState.MATCHED);
                cardTwo.setCardState(CardState.MATCHED);
                optionalMatchedCards = Optional.of(flippedCards);
            } else {
                cardOne.setCardState(CardState.DEFAULT);
                cardTwo.setCardState(CardState.DEFAULT);
                changePlayerTurn();
            }
        }
        return optionalMatchedCards;
    }

    //turn order
    private void changePlayerTurn(){
        int indexCurrentPlayer = players.indexOf(currentPlayer);
        indexCurrentPlayer += 1;
        if (indexCurrentPlayer >= players.size()){
            indexCurrentPlayer = 0;
        }
        currentPlayer = players.get(indexCurrentPlayer);
    }
    // check end of game
    public void checkEndGame(){
        List<Card> matchedCards =getCardsByState(CardState.MATCHED);
        if (cards.size() == matchedCards.size()){
            setGameState(GameState.DONE);
        }
    }

    public void setTheme(CardTheme theme) {
        this.theme = theme;
    }

    private List<Card> getCardsByState(CardState state){
        List<Card> filteredCards = new ArrayList<>();
        for (int i = 0; i < cards.size(); i++) {
            Card card = cards.get(i);
            if (card.getCardState()== state){
                filteredCards.add(card);
            }
        }
        return filteredCards;
    }

    public void randomSelectFirstPlayer(){
        if (Math.random()< 0.5){
            currentPlayer = players.get(0);
        } else {
            currentPlayer = players.get(1);
        }
    }

    public List<Card> getLastFlippedPairOfCards(){
        return this.lastFlippedPairOfCards;
    }

    public void addLastFlippedCards(Card card){
        this.lastFlippedPairOfCards.add(card);
    }

    public void setLastFlippedPairOfCards(List<Card> lastFlippedCards) {
        this.lastFlippedPairOfCards = lastFlippedCards;
    }

    @JsonProperty
    @JsonView(JsonViews.Summary.class)
    public int numberOfPairs(){
        return cards.size()/2;
    }

    public Player getCurrentPlayer(){
        return this.currentPlayer;
    }

    public void setCurrentPlayer(Player currentPlayer) {
        this.currentPlayer = currentPlayer;
    }

    public void addPlayer(Player player) {
        this.players.add(player);
    }

    @Override
    public long getId() {
        return this.id;
    }

    @Override
    public void setId(long id) {
        this.id = id;
    }

    public GameState getGameState() {
        return gameState;
    }

    public void setGameState(GameState gameState) {
        this.gameState = gameState;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public List<Card> getCards() {
        return cards;
    }

    public void setCards(List<Card> cards) {
        this.cards = cards;
    }

    public List<Player> getPlayers() {
        return players;
    }
}
