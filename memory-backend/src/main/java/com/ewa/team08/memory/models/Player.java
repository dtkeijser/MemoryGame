package com.ewa.team08.memory.models;

import com.ewa.team08.memory.repositories.Identifiable;
import com.ewa.team08.memory.views.JsonViews;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;
import java.util.*;

@Entity
public class Player  implements Identifiable {

    @Id
    @GeneratedValue
    @JsonView(JsonViews.Summary.class)
    long id;

    @ManyToOne
    @JsonView(JsonViews.Summary.class)
    private User user;
    @ManyToOne
    @JsonIgnore
    private Game game;

    @OneToMany
    private List<Card> matchedCards = new ArrayList<>();

    public Player(User user) {
        this.user = user;
    }

    public Player() {

    }

    public void flipCard(int cardPosition){

        if (game.getGameState().equals(GameState.ACTIVE)){
            if (game.getCurrentPlayer().equals(this)){
                game.flipCard(cardPosition);
                Optional<List<Card>>optionalMatchedCards = game.tryForCardMatch();
                if (optionalMatchedCards.isPresent()){
                    matchedCards.addAll(optionalMatchedCards.get());
                }
                game.checkEndGame();
            }
        }

    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    @Override
    public long getId() {
        return this.id;
    }

    @Override
    public void setId(long id) {
        this.id = id;
    }

    public List<Card> getMatchedCards() {
        return matchedCards;
    }

    @JsonView(JsonViews.Full.class)
    public int getPoints(){
        return matchedCards.size()/2;
    }
}