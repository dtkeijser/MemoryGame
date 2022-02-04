package com.ewa.team08.memory.models;

import com.ewa.team08.memory.repositories.Identifiable;
import com.ewa.team08.memory.views.JsonViews;
import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;
import java.io.Serializable;


@Entity
@Table(name="User")
public class User implements Serializable, Identifiable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "email")
    private String email;

    @Column(name = "username")
    @JsonView(JsonViews.Summary.class)
    private String username;

    public User( String email, String username) {

        this.email = email;
        this.username = username;
    }

    public User() {

    }

    @Override
    public long getId() {
        return this.id;
    }

    @Override
    public void setId(long id) {
        this.id = id;
    }
}
