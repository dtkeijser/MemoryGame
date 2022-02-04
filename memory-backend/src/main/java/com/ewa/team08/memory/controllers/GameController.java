package com.ewa.team08.memory.controllers;

import com.ewa.team08.memory.models.*;
import com.ewa.team08.memory.repositories.GameRepositoryJPA;
import com.ewa.team08.memory.repositories.PlayerRepository;
import com.ewa.team08.memory.repositories.UserRepositoryJPA;
import com.ewa.team08.memory.views.JsonViews;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/games")
@CrossOrigin()
public class GameController {

    @Autowired
    GameRepositoryJPA gameRepo;

    @Autowired
    UserRepositoryJPA userRepo;

    @Autowired
    PlayerRepository playerRepo;

    @GetMapping()
    @JsonView(JsonViews.Summary.class)
    public List<Game> getAllGames(@RequestParam(required = false) String username,
                                  @RequestParam(required = false) String gameStateStr,
                                  @RequestParam(required = false) String  notUser) {

        GameState gameState = null;
        List<Game> games;
        if(gameStateStr != null){
             gameState = GameState.valueOf(gameStateStr.toUpperCase());
        }

        if (username == null && gameState == null){
            games = gameRepo.findAll();
        } else if( username !=null && gameState == null){
            games = gameRepo.findByQuery("findGamesByUser", username);
        } else if(username == null && gameState != null && notUser == null){
            games = gameRepo.findByQuery("findGamesByGameState", gameState);
        }else {
            games = gameRepo.findByQuery("Gamefindstatusnotuser", notUser,gameState);
        }
       return games;
    }

   @GetMapping("/{gameId}")
   @JsonView(JsonViews.Full.class)
    public Game findGame(@PathVariable Long gameId){
        Game game = new Game();
        game = gameRepo.findById(gameId);
        return game;
    }

    @PostMapping()
    @JsonView(JsonViews.Summary.class)
    public ResponseEntity<Game> createGame(@RequestBody ObjectNode gameData) {

        String username = gameData.get("username").asText();
        String  theme = gameData.get("theme").asText().toUpperCase();
        CardTheme cardTheme = CardTheme.valueOf(theme);
        int numberOfPairs = gameData.get("numberOfPairs").asInt();
        User user = userRepo.findByUsername(username);

        List<Player> players = new ArrayList<>();
        players.add(new Player(user));

        Game game = new Game();
        game.setPlayers(players);
        players.get(0).setGame(game);
        game.setGameState(GameState.PENDING);
        game.setTheme(cardTheme);

        game.init(numberOfPairs, cardTheme );

        var savedGame = gameRepo.save(game);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/1")
                .buildAndExpand(savedGame.getId()).toUri();
        return  ResponseEntity.created(location).body(savedGame);

    }


    @PutMapping("/{gameId}")
    @JsonView(JsonViews.Full.class)
    public  ResponseEntity<Game> commandGame(@RequestBody ObjectNode gameData,
                                             @PathVariable Long gameId,
                                             @RequestParam(required = false) String command) {
        Game game = gameRepo.findById(gameId);

        if (command.equals("join")){
            //moet naar token
            String username = gameData.get("username").asText();
            User user = userRepo.findByUsername(username);
            Player player = new Player(user);
            game.addPlayer(player);
            game.setGameState(GameState.ACTIVE);
            player.setGame(game);
            game.randomSelectFirstPlayer();
            playerRepo.save(player);

        }
        else if (command.equals("flip")){
            Player currentPlayer = game.getCurrentPlayer();
            int cardPosition = gameData.get("cardPosition").asInt();
            currentPlayer.flipCard(cardPosition);
        }

        var updateGame =  gameRepo.save(game);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/1")
                .buildAndExpand(updateGame.getId()).toUri();
        return  ResponseEntity.created(location).body(updateGame);
    }

}
