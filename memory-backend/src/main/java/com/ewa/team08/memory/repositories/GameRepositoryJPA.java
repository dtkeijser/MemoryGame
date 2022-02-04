package com.ewa.team08.memory.repositories;

import com.ewa.team08.memory.models.Game;
import com.ewa.team08.memory.models.GameState;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.List;

@Repository("GAME.JPA")
@Primary
@Transactional
public class GameRepositoryJPA extends AbstractEntityRepositoryJpa<Game>{

    @PersistenceContext
    EntityManager em;

    public GameRepositoryJPA() {super(Game.class);}

    public List<Game> findGamesByUser(String username){
        TypedQuery<Game> query =  em.createQuery(
                "SELECT o from Game o, User  u, Player p where o= p.game and p.user = u and u.username = " + "'"+ username +"' order by o.gameState" , Game.class
        );
        return query.getResultList();
    }

    public List<Game> findGameByUserAndGameState(String username, GameState gameState){
        TypedQuery<Game> query = em.createQuery(
                "SELECT o from Game o, User  u , Player  p where o = p.game and p.user = u and u.username = " + "'"+ username + "' and  o.gameState = " + "'" + gameState +"'"  , Game.class
        );
        return query.getResultList();
    }

    public List<Game> findGamesByGameState(GameState gameState){
        TypedQuery<Game> query =em.createQuery(
                "select o from Game o where o.gameState = " + "'" + gameState + "'" , Game.class
        );
        System.out.println("select o from Game o where o.gameState = " + "'" + gameState + "'");
        return query.getResultList();
    }

    public List<Game> findGamesByGameStateNotUser(String username, GameState gameState){
        TypedQuery<Game> query = em.createQuery(
                "select o from Game o, User u, Player p where o = p.game and p.user = u and o.gameState = "+ "'" + gameState + "'" + "and not u.username = " + "'" + username +"'", Game.class
        );
        return query.getResultList();
    }

}
