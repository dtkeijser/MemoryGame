package com.ewa.team08.memory.models;

import com.ewa.team08.memory.views.JsonViews;
import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;

@Entity
public class Card {
    @Id
    @GeneratedValue
    @JsonView(JsonViews.Summary.class)
    private Long id;

    @JsonView(JsonViews.Full.class)
    private String image;

    @Enumerated(value = EnumType.ORDINAL)
    @JsonView(JsonViews.Full.class)
    private CardState cardState;



    public Card() {

    }

    public Card(String image, CardState cardState) {
        this.image = image;
        this.cardState = cardState;

    }

    public CardState getCardState() {
        return cardState;
    }

    public void setCardState(CardState cardState) {
        this.cardState = cardState;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
