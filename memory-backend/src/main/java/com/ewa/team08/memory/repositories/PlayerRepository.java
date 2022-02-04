package com.ewa.team08.memory.repositories;

import com.ewa.team08.memory.models.Player;
import org.springframework.stereotype.Repository;


@Repository
public class PlayerRepository extends AbstractEntityRepositoryJpa<Player> {

    public PlayerRepository() {
        super(Player.class);
    }
}
